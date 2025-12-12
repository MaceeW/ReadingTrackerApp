import { NextResponse } from 'next/server'
import { fetchBookInfo } from '@/lib/bookInfo'

// API endpoint to fetch book information from ISBN or title/author
export async function POST(req) {
  try {
    const body = await req.json();
    const { isbn, title, author } = body || {};
    if (!isbn && !title && !author) {
      return NextResponse.json({ success: false, error: 'Provide isbn or title/author' }, { status: 400 });
    }
    // Call external book APIs (Open Library) to get book details and cover
    const info = await fetchBookInfo({ isbn, title, author });
    return NextResponse.json({ success: true, data: info });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message || String(err) }, { status: 500 });
  }
}
