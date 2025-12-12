import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import BookList from '@/components/BookList'
import styles from '@/styles/dashboard.module.css'

export const dynamic = 'force-dynamic'

export default async function DashboardPage({ searchParams }) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/auth/signin')
  }

  const where = {
    userId: session.user.id
  }

  const status = searchParams?.status
  const search = searchParams?.search

  if (status && status !== 'all') {
    where.status = status
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { author: { contains: search, mode: 'insensitive' } }
    ]
  }

  const books = await prisma.book.findMany({
    where,
    orderBy: {
      createdAt: 'desc'
    }
  })

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>My Reading List</h1>
        <p className={styles.subtitle}>
          {books.length} {books.length === 1 ? 'book' : 'books'} in your collection
        </p>
      </div>
      
      <BookList books={books} />
    </div>
  )
}
