import { Inter, Noto_Serif_JP } from 'next/font/google'
import './globals.css'
import RootClientLayout from '@/components/layout/RootClientLayout'
import { Metadata } from 'next'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })
const notoSerif = Noto_Serif_JP({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-serif'
})

export const metadata: Metadata = {
  title: {
    default: 'Melocolla 公式サイト',
    template: '%s | Melocolla'
  },
  description: '奏で、語り、共に創る。創作で繋がる共鳴の場所。',
  openGraph: {
    title: 'Melocolla 公式サイト',
    description: '奏で、語り、共に創る。創作で繋がる共鳴の場所。',
    url: 'https://melocolla.vercel.app',
    siteName: 'Melocolla',
    locale: 'ja_JP',
    type: 'website',
  },
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja" className={`${inter.variable} ${notoSerif.variable}`} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Melocolla",
              "url": "https://melocolla.vercel.app"
            })
          }}
        />
      </head>
      <body className="antialiased min-h-screen bg-white text-foreground selection:bg-brand/10 selection:text-brand relative overflow-x-hidden" suppressHydrationWarning>
        <RootClientLayout>
          {children}
        </RootClientLayout>
      </body>
    </html>
  )
}
