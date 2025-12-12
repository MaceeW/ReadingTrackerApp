import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'
import { prisma } from '@/lib/prisma'
import { notFound, redirect } from 'next/navigation'
import Image from 'next/image'
import BookActions from '@/components/BookActions'
import styles from '@/styles/Book.module.css'

export default async function BookPage({ params }) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/auth/signin')
  }

  const bookId = parseInt(params.id)
  
  if (isNaN(bookId)) {
    notFound()
  }

  const book = await prisma.book.findUnique({
    where: {
      id: bookId
    }
  })

  if (!book) {
    notFound()
  }

  if (book.userId !== session.user.id) {
    redirect('/')
  }

  const statusColors = {
    'To Read': '#6c757d',
    'Reading': '#ffc107',
    'Finished': '#28a745'
  }

  return (
    <div className={styles.container}>
      <div className={styles.bookCard}>
        {book.cover_url ? (
          <div className={styles.coverContainer}>
            <Image 
              src={book.cover_url} 
              alt={`${book.title} cover`}
              width={300}
              height={450}
              className={styles.cover}
              style={{ objectFit: 'cover' }}
              priority
            />
          </div>
        ) : (
          <div className={styles.coverPlaceholder}>
            <span className={styles.placeholderIcon}>📖</span>
          </div>
        )}
        
        <div className={styles.content}>
          <div className={styles.header}>
            <h1 className={styles.title}>{book.title}</h1>
            <BookActions bookId={book.id} />
          </div>
          
          <p className={styles.author}>by {book.author}</p>
          
          <div className={styles.statusContainer}>
            <span 
              className={styles.status}
              style={{ backgroundColor: statusColors[book.status] }}
            >
              {book.status}
            </span>
          </div>

          {book.notes && (
            <div className={styles.notesSection}>
              <h2 className={styles.notesTitle}>Notes</h2>
              <p className={styles.notes}>{book.notes}</p>
            </div>
          )}

          <div className={styles.metadata}>
            <p className={styles.date}>
              Added: {new Date(book.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
            {book.updatedAt !== book.createdAt && (
              <p className={styles.date}>
                Updated: {new Date(book.updatedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
