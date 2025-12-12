import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'
import { prisma } from '@/lib/prisma'

// GET endpoint - fetches all books for the authenticated user
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const books = await prisma.book.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(books)
  } catch (error) {
    console.error('Error fetching books:', error)
    return NextResponse.json(
      { error: 'Failed to fetch books' },
      { status: 500 }
    )
  }
}

// POST endpoint - creates a new book
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { title, author, status, notes, cover_url } = body

    if (!title || !author) {
      return NextResponse.json(
        { error: 'Title and author are required' },
        { status: 400 }
      )
    }

    const validStatuses = ['To Read', 'Reading', 'Finished']
    const bookStatus = status || 'To Read'
    
    if (!validStatuses.includes(bookStatus)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be: To Read, Reading, or Finished' },
        { status: 400 }
      )
    }

    const book = await prisma.book.create({
      data: {
        title: title.trim(),
        author: author.trim(),
        status: bookStatus,
        notes: notes?.trim() || null,
        cover_url: cover_url?.trim() || null,
        userId: session.user.id
      }
    })

    return NextResponse.json(book, { status: 201 })
  } catch (error) {
    console.error('Error creating book:', error)
    return NextResponse.json(
      { error: 'Failed to create book' },
      { status: 500 }
    )
  }
}
