import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import { Providers } from '@/components/Providers'
import { Header } from '@/components/Header'
import './globals.css'

const geist = Geist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Crucible — Pressure Test Your Idea',
  description: 'Before you waste 6 months, pressure test it in 60 seconds.',
  openGraph: {
    title: 'Crucible — Pressure Test Your Idea',
    description: 'Before you waste 6 months, pressure test it in 60 seconds.',
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${geist.className} text-foreground antialiased`}>
        <Providers>
          <div className="app-bg">
            <Header />
            {children}
          </div>
        </Providers>
      </body>
    </html>
  )
}
