'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import styles from '@/styles/Navbar.module.css'

export default function Navbar() {
  const { data: session, status } = useSession()

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link href={session ? "/dashboard" : "/"} className={styles.logo}>
          📖 Reading Tracker
        </Link>

        <div className={styles.navLinks}>
          {status === 'loading' ? (
            <span className={styles.email}>Loading...</span>
          ) : session ? (
            <>
              <Link href="/dashboard" className={styles.link}>
                My Books
              </Link>
              <Link href="/add-book" className={styles.link}>
                Add Book
              </Link>
              <span className={styles.email}>{session.user?.email}</span>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className={styles.signOutButton}
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/signin" className={styles.link}>
                Sign In
              </Link>
              <Link href="/auth/signup" className={styles.linkButton}>
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
