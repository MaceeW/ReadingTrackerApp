'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Filters from './Filters'
import styles from '@/styles/BookList.module.css'

export default function BookList({ books: initialBooks }) {
  const [books] = useState(initialBooks)

  const statusColors = {
    'To Read': '#6c757d',
    'Reading': '#ffc107',
    'Finished': '#28a745'
  }

  return (
    <>
      <Filters />
      
      {books.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📚</div>
          <h2 className={styles.emptyTitle}>No books found</h2>
          <p className={styles.emptyText}>
            Try adjusting your filters or search terms, or add a new book to your library.
          </p>
          <Link href="/add-book" className={styles.addButton}>
            Add a Book
          </Link>
        </div>
      ) : (
        <div className={styles.grid}>
          {books.map((book) => (
          <Link href={`/book/${book.id}`} key={book.id} className={styles.card}>
            {book.cover_url ? (
              <div className={styles.coverContainer}>
                <Image 
                  src={book.cover_url} 
                  alt={`${book.title} cover`}
                  width={200}
                  height={300}
                  className={styles.cover}
                  style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                  priority={books.indexOf(book) < 4}
                />
              </div>
            ) : (
              <div className={styles.coverPlaceholder}>
                <span className={styles.placeholderIcon}>📖</span>
              </div>
            )}
            <div className={styles.content}>
              <h3 className={styles.title}>{book.title}</h3>
              <p className={styles.author}>by {book.author}</p>
              <div className={styles.footer}>
                <span 
                  className={styles.status}
                  style={{ backgroundColor: statusColors[book.status] }}
                >
                  {book.status}
                </span>
              </div>
            </div>
          </Link>
          ))}
        </div>
      )}
    </>
  )
}
