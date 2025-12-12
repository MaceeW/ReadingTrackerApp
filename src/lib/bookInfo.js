// Fetch book information from Open Library API using ISBN
async function fetchOpenLibraryByISBN(isbn) {
  try {
    const res = await fetch(
      `https://openlibrary.org/api/books?bibkeys=ISBN:${encodeURIComponent(isbn)}&format=json&jscmd=data`
    );
    if (!res.ok) return null;
    const data = await res.json();
    const key = `ISBN:${isbn}`;
    const book = data[key];
    if (!book) return null;
    // Extract cover image URL - try to get largest available
    const cover = book.cover?.large || book.cover?.medium || book.cover?.small || null;
    let description = null;
    if (book.excerpts && book.excerpts.length) {
      description = book.excerpts[0].text || null;
    }
    if (!description) {
      if (typeof book.description === 'string') description = book.description;
      else if (book.description && book.description.value) description = book.description.value;
      else if (book.notes) description = book.notes;
    }
    return {
      source: 'openlibrary:isbn',
      title: book.title || null,
      authors: book.authors?.map((a) => a.name) || [],
      coverUrl: cover,
      description,
      raw: book,
    };
  } catch (err) {
    return null;
  }
}

// Search Open Library by title and author when ISBN not available
async function fetchOpenLibraryBySearch(title, author) {
  try {
    const q = [];
    if (title) q.push(`title=${encodeURIComponent(title)}`);
    if (author) q.push(`author=${encodeURIComponent(author)}`);
    const url = `https://openlibrary.org/search.json?${q.join('&')}&limit=1`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    const doc = data.docs && data.docs[0];
    if (!doc) return null;
    // Build cover URL from cover ID
    const coverId = doc.cover_i;
    const coverUrl = coverId ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg` : null;
    let description = null;
    if (doc.key) {
      try {
        const workRes = await fetch(`https://openlibrary.org${doc.key}.json`);
        if (workRes.ok) {
          const work = await workRes.json();
          if (typeof work.description === 'string') description = work.description;
          else if (work.description && work.description.value) description = work.description.value;
        }
      } catch (e) {
      }
    }
    return {
      source: 'openlibrary:search',
      title: doc.title || title || null,
      authors: doc.author_name || (author ? [author] : []),
      coverUrl,
      description,
      raw: doc,
    };
  } catch (err) {
    return null;
  }
}

async function fetchGoogleBooks(q) {
  try {
    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(q)}&maxResults=1`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    const item = data.items && data.items[0];
    if (!item) return null;
    const info = item.volumeInfo || {};
    const thumbnail = info.imageLinks?.thumbnail || info.imageLinks?.smallThumbnail || null;
    const coverUrl = thumbnail ? thumbnail.replace('http://', 'https://') : null;
    return {
      source: 'google_books',
      title: info.title || null,
      authors: info.authors || [],
      coverUrl,
      description: info.description || null,
      raw: info,
    };
  } catch (err) {
    return null;
  }
}

export async function fetchBookInfo({ isbn, title, author } = {}) {
  if (isbn) {
    const ol = await fetchOpenLibraryByISBN(isbn);
    if (ol) return ol;
    const gb = await fetchGoogleBooks(`isbn:${isbn}`);
    if (gb) return gb;
  }

  if (title || author) {
    const olSearch = await fetchOpenLibraryBySearch(title, author);
    if (olSearch && (olSearch.description || olSearch.coverUrl)) return olSearch;
    const qParts = [];
    if (title) qParts.push(`intitle:${title}`);
    if (author) qParts.push(`inauthor:${author}`);
    const q = qParts.length ? qParts.join('+') : title || author || '';
    if (q) {
      const gb = await fetchGoogleBooks(q);
      if (gb) return gb;
    }
  }

  return {
    source: 'none',
    title: title || null,
    authors: author ? [author] : [],
    coverUrl: null,
    description: null,
  };
}

export default fetchBookInfo;
