import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import styles from '@/styles/page.module.css'

export default async function Home() {
  const session = await getServerSession(authOptions)
  
  if (session) {
    redirect('/dashboard')
  }

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            📖 Track Your Reading 
          </h1>
          <p className={styles.heroSubtitle}>
            Organize your books and track your reading progress
          </p>
          <div className={styles.ctaButtons}>
            <Link href="/auth/signup" className={styles.primaryButton}>
              Get Started Free
            </Link>
            <Link href="/auth/signin" className={styles.secondaryButton}>
              Sign In
            </Link>
          </div>
        </div>
      </div>

      <div className={styles.features}>
        <h2 className={styles.featuresTitle}>Everything You Need to Track Your Reading</h2>
        
        <div className={styles.featureGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>📖</div>
            <h3 className={styles.featureTitle}>Organize Your Library</h3>
            <p className={styles.featureDescription}>
              Add books with cover images, author details, and personal notes. Keep all your reading in one place.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>✅</div>
            <h3 className={styles.featureTitle}>Track Reading Status</h3>
            <p className={styles.featureDescription}>
              Mark books as "To Read", "Reading", or "Finished". Always know what's next on your list.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🔍</div>
            <h3 className={styles.featureTitle}>Search & Filter</h3>
            <p className={styles.featureDescription}>
              Quickly find any book by title or author. Filter by reading status to focus on what matters.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>📝</div>
            <h3 className={styles.featureTitle}>Add Personal Notes</h3>
            <p className={styles.featureDescription}>
              Write reviews, thoughts, and reflections. Remember why each book was meaningful to you.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🖼️</div>
            <h3 className={styles.featureTitle}>Beautiful Cover Images</h3>
            <p className={styles.featureDescription}>
              Upload cover images to make your library visually appealing and easy to browse.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🔒</div>
            <h3 className={styles.featureTitle}>Private & Secure</h3>
            <p className={styles.featureDescription}>
              Your reading list is completely private. Only you can see and manage your books.
            </p>
          </div>
        </div>
      </div>

      <div className={styles.howItWorks}>
        <h2 className={styles.sectionTitle}>How It Works</h2>
        <div className={styles.steps}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <h3 className={styles.stepTitle}>Create Your Account</h3>
            <p className={styles.stepDescription}>
              Sign up for free in seconds. No credit card required.
            </p>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <h3 className={styles.stepTitle}>Add Your Books</h3>
            <p className={styles.stepDescription}>
              Start adding books with titles, authors, cover images, and notes.
            </p>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <h3 className={styles.stepTitle}>Track Your Progress</h3>
            <p className={styles.stepDescription}>
              Update reading status as you go and build your personal library.
            </p>
          </div>
        </div>
      </div>

      <div className={styles.cta}>
        <h2 className={styles.ctaTitle}>Ready to Start Tracking?</h2>
        <p className={styles.ctaText}>
          Join readers who are organizing their reading journey with Reading Tracker.
        </p>
        <Link href="/auth/signup" className={styles.ctaButton}>
          Create Your Free Account
        </Link>
      </div>
    </div>
  )
}
