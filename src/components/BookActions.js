'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'
import styles from '@/styles/BookActions.module.css'

export default function BookActions({ bookId }) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this book?')) {
      return
    }

    setDeleting(true)

    try {
      const response = await fetch(`/api/books/${bookId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete book')
      }

      router.push('/dashboard')
      router.refresh()
    } catch (error) {
      alert('Failed to delete book. Please try again.')
      setDeleting(false)
    }
  }

  return (
    <div className={styles.actions}>
      <Link href={`/book/${bookId}/edit`} className={styles.editButton}>
        Edit
      </Link>
      <button
        onClick={handleDelete}
        disabled={deleting}
        className={styles.deleteButton}
      >
        {deleting ? 'Deleting...' : 'Delete'}
      </button>
    </div>
  )
}
