import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: "UyBor.uz — O'zbekiston Ko'chmas Mulk Platformasi",
  description:
    "O'zbekistonda uy sotib olish, sotish va ijaraga berish. Eng yaxshi ko'chmas mulk e'lonlari UyBor.uz'da.",
  keywords: "uy sotish, kvartira ijaraga, ko'chmas mulk, uy ijaraga, Toshkent kvartira",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="uz">
      <body>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
