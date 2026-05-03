'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { AudioProvider } from '@/context/AudioContext'
import Header from '@/components/layout/Header'
import PersistentPlayer from '@/components/layout/PersistentPlayer'
import CinematicBackground from '@/components/layout/CinematicBackground'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const OpeningAnimation = dynamic(() => import('@/components/animation/OpeningAnimation'), {
  ssr: false,
})

export default function RootClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isReady, setIsReady] = useState(false)
  const [showOpening, setShowOpening] = useState(false)

  const pathname = usePathname()
  const isMemberProfile = pathname.startsWith('/members/') && pathname !== '/members'

  useEffect(() => {
    if (isMemberProfile) {
      setShowOpening(false)
      setIsReady(true)
      return
    }
    const openingSeen = sessionStorage.getItem('melocolla_opening_seen')
    if (!openingSeen) {
      setShowOpening(true)
    }
    setIsReady(true)
  }, [isMemberProfile])

  const handleOpeningComplete = () => {
    setShowOpening(false)
    sessionStorage.setItem('melocolla_opening_seen', 'true')
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  if (!isReady) {
    return null
  }

  return (
    <AudioProvider>
      <CinematicBackground />
      {showOpening && <OpeningAnimation onComplete={handleOpeningComplete} />}

      <div className={`transition-opacity duration-[2000ms] ease-in-out ${showOpening ? 'opacity-0' : 'opacity-100'}`}>
        <Header />
        <main className={`${!isMemberProfile ? 'pt-24' : ''} min-h-screen`}>
          {children}
        </main>
        {!isMemberProfile && <PersistentPlayer />}

        <footer className="relative z-10 pt-24 pb-12 bg-[#f6f3f0]">
          <div className="container mx-auto px-6 flex flex-col items-center">
            {/* Divider */}
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-accent-gold/30 to-transparent mb-16" />

            {/* Large Brand Mark */}
            <h2 className="font-serif text-4xl md:text-5xl tracking-[0.3em] text-brand/80 mb-4 mr-[-0.3em]">
              Melocolla<span className="text-accent-gold">.</span>
            </h2>
            <p className="text-xs text-brand/60 tracking-[0.25em] italic mb-12">
              奏で、語り、共に創る。創作で繋がる共鳴の場所。
            </p>

            <nav className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 md:gap-12 mb-12 max-w-sm md:max-w-none">
              {['Home', 'Activity', 'Discography', 'Members', 'Events', 'Terms'].map(item => (
                <Link
                  key={item}
                  href={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                  className="text-[10px] md:text-[11px] tracking-[0.3em] text-brand/70 hover:text-brand transition-colors duration-500 uppercase whitespace-nowrap"
                >
                  {item}
                </Link>
              ))}
            </nav>

            {/* Social Icons */}
            <div className="flex items-center gap-4 mb-16">
              <a href="https://discord.gg/qvnm4b9ACw" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full border border-brand/15 text-brand/50 hover:text-brand hover:border-brand/40 transition-all duration-500 flex items-center justify-center" title="Discord">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.36-.698.772-1.362 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.12-.094.246-.194.372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772-1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42.01 1.333-.946 2.418-2.157 2.418z" /></svg>
              </a>
              <a href="https://x.com/melocolla" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full border border-brand/15 text-brand/50 hover:text-brand hover:border-brand/40 transition-all duration-500 flex items-center justify-center" title="X (Twitter)">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
              </a>
              <a href="https://www.youtube.com/@Melocolla" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full border border-brand/15 text-brand/50 hover:text-brand hover:border-brand/40 transition-all duration-500 flex items-center justify-center" title="YouTube">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
              </a>
              <a href="https://www.nicovideo.jp/user/143664015" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full border border-brand/15 text-brand/50 hover:text-brand hover:border-brand/40 transition-all duration-500 flex items-center justify-center overflow-hidden" title="niconico">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M.4787 7.534v12.1279A2.0213 2.0213 0 0 0 2.5 21.6832h2.3888l1.323 2.0948a.4778.4778 0 0 0 .4043.2205.4778.4778 0 0 0 .441-.2205l1.323-2.0948h6.9828l1.323 2.0948a.4778.4778 0 0 0 .441.2205c.1838 0 .3308-.0735.4043-.2205l1.323-2.0948h2.6462a2.0213 2.0213 0 0 0 2.0213-2.0213V7.5339a2.0213 2.0213 0 0 0-2.0213-1.9845h-7.681l4.4468-4.4469L17.1637 0l-5.1452 5.1452L6.8 0 5.6973 1.1025l4.4102 4.4102H2.5367a2.0213 2.0213 0 0 0-2.058 2.058z"/>
                </svg>
              </a>
            </div>

            {/* Bottom line */}
            <div className="w-8 h-px bg-brand/10 mb-6" />
            <p className="text-[10px] text-brand/50 tracking-[0.3em] uppercase">
              &copy; 2026 Melocolla. All Rights Reserved.
            </p>
          </div>
        </footer>
      </div>
    </AudioProvider>
  )
}
