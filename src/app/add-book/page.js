"use client"

import { useState, useEffect, useRef } from 'react'
import { isValidIsbn, normalizeIsbn } from '@/lib/isbn'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import styles from '@/styles/AddBook.module.css'

export default function AddBookPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    status: 'To Read',
    notes: '',
    cover_url: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB')
      return
    }

    setUploading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload image')
      }

      setFormData(prev => ({
        ...prev,
        cover_url: data.url
      }))
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }

  const [fetchingInfo, setFetchingInfo] = useState(false)
  const isbnTimerRef = useRef(null)

  const fetchBookInfo = async () => {
    const { isbn, title, author } = formData
    if (!isbn && !title && !author) {
      setError('Provide ISBN or title/author to fetch info')
      return
    }

    if (isbn) {
      const norm = normalizeIsbn(isbn)
      if (!(isValidIsbn(norm))) {
        setError('ISBN appears invalid — check digits')
        return
      }
    }

    setFetchingInfo(true)
    setError('')

    try {
      const res = await fetch('/api/book-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isbn: isbn || undefined, title: title || undefined, author: author || undefined })
      })
      const payload = await res.json()
      if (!res.ok || !payload.success) {
        throw new Error(payload.error || 'Failed to fetch book info')
      }
      const info = payload.data || {}
      setFormData(prev => ({
        ...prev,
        title: info.title || prev.title,
        author: (info.authors && info.authors[0]) || prev.author,
        cover_url: info.coverUrl || prev.cover_url,
        notes: prev.notes || (info.description || '')
      }))
    } catch (err) {
      setError(err.message)
    } finally {
      setFetchingInfo(false)
    }
  }

  useEffect(() => {
    const raw = formData.isbn || ''
    const digits = raw.replace(/[^0-9Xx]/g, '')
    if (digits.length === 10 || digits.length === 13) {
      if (isbnTimerRef.current) clearTimeout(isbnTimerRef.current)
      isbnTimerRef.current = setTimeout(() => {
        fetchBookInfo()
      }, 600)
    } else {
      if (isbnTimerRef.current) {
        clearTimeout(isbnTimerRef.current)
        isbnTimerRef.current = null
      }
    }

    return () => {
      if (isbnTimerRef.current) {
        clearTimeout(isbnTimerRef.current)
        isbnTimerRef.current = null
      }
    }
  }, [formData.isbn])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add book')
      }

      router.push('/dashboard')
      router.refresh()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h1 className={styles.title}>Add a New Book</h1>
        
        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="title" className={styles.label}>
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={styles.input}
              required
              placeholder="Enter book title"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="isbn" className={styles.label}>
              ISBN
            </label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="text"
                id="isbn"
                name="isbn"
                value={formData.isbn}
                onChange={handleChange}
                className={styles.input}
                placeholder="Enter ISBN (optional)"
              />
              <button
                type="button"
                onClick={fetchBookInfo}
                disabled={fetchingInfo}
                className={styles.submitButton}
                style={{ padding: '8px 12px', height: '40px' }}
              >
                {fetchingInfo ? 'Fetching...' : 'Auto-fill'}
              </button>
            </div>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="author" className={styles.label}>
              Author *
            </label>
            <input
              type="text"
              id="author"
              name="author"
              value={formData.author}
              onChange={handleChange}
              className={styles.input}
              required
              placeholder="Enter author name"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="status" className={styles.label}>
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={styles.select}
            >
              <option value="To Read">To Read</option>
              <option value="Reading">Reading</option>
              <option value="Finished">Finished</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="cover_image" className={styles.label}>
              Cover Image (Optional)
            </label>
            <input
              type="file"
              id="cover_image"
              accept="image/*"
              onChange={handleImageUpload}
              className={styles.input}
              disabled={uploading}
            />
            {uploading && <p className={styles.uploadingText}>Uploading image...</p>}
            {formData.cover_url && (
              <div className={styles.imagePreview}>
                <Image
                  src={formData.cover_url}
                  alt="Book cover preview"
                  width={120}
                  height={180}
                  style={{ objectFit: 'cover' }}
                />
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, cover_url: '' }))}
                  className={styles.removeImageButton}
                >
                  Remove Image
                </button>
              </div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="notes" className={styles.label}>
              Notes (Optional)
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className={styles.textarea}
              rows="5"
              placeholder="Add your thoughts, review, or notes about this book..."
            />
          </div>

          <div className={styles.buttonGroup}>
            <button
              type="submit"
              disabled={loading}
              className={styles.submitButton}
            >
              {loading ? 'Adding Book...' : 'Add Book'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className={styles.cancelButton}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
