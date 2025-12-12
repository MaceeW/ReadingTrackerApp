'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect, useTransition, useCallback } from 'react'
import styles from '@/styles/Filters.module.css'

export default function Filters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [search, setSearch] = useState(searchParams?.get('search') || '')
  const [status, setStatus] = useState(searchParams?.get('status') || 'all')

  const updateURL = (searchValue, statusValue) => {
    const params = new URLSearchParams()
    
    if (searchValue) {
      params.set('search', searchValue)
    }
    
    if (statusValue && statusValue !== 'all') {
      params.set('status', statusValue)
    }

    const queryString = params.toString()
    const newUrl = queryString ? `/dashboard?${queryString}` : '/dashboard'
    
    window.location.href = newUrl
  }

  const handleSearchChange = (e) => {
    setSearch(e.target.value)
  }

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      updateURL(search, status)
    }
  }

  const handleStatusChange = (e) => {
    const newStatus = e.target.value
    setStatus(newStatus)
    updateURL(search, newStatus)
  }

  return (
    <div className={styles.filters}>
      <div className={styles.filterGroup}>
        <label htmlFor="search" className={styles.label}>
          Search
        </label>
        <input
          type="text"
          id="search"
          value={search}
          onChange={handleSearchChange}
          onKeyPress={handleSearchKeyPress}
          placeholder="Search by title or author..."
          className={styles.searchInput}
        />
      </div>

      <div className={styles.filterGroup}>
        <label htmlFor="status" className={styles.label}>
          Status
        </label>
        <select
          id="status"
          value={status}
          onChange={handleStatusChange}
          className={styles.select}
        >
          <option value="all">All Books</option>
          <option value="To Read">To Read</option>
          <option value="Reading">Reading</option>
          <option value="Finished">Finished</option>
        </select>
      </div>
    </div>
  )
}
