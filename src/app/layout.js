import '@/styles/globals.css'
import Navbar from '@/components/Navbar'
import SessionProvider from '@/components/SessionProvider'

export const metadata = {
  title: 'Reading Tracker App',
  description: 'Track your reading list and manage your books',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <SessionProvider>
          <Navbar />
          <main>{children}</main>
        </SessionProvider>
      </body>
    </html>
  )
}
