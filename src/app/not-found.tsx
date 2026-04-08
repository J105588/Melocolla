'use client'

import Link from 'next/link'
import { ArrowLeft, Music2 } from 'lucide-react'
import CinematicBackground from '@/components/layout/CinematicBackground'

export default function NotFound() {
  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden">
      <CinematicBackground />

      <div className="relative z-10 w-full max-w-2xl">
        <div className="glass-card p-12 md:p-20 rounded-[3rem] text-center shadow-2xl relative overflow-hidden group border border-white/20">
          {/* Decorative grain/background elements */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-accent-gold/5 blur-3xl rounded-full" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-brand/5 blur-3xl rounded-full" />

          <div className="relative z-10 flex flex-col items-center">
            {/* Animated Icon */}
            <div className="w-20 h-20 bg-brand/5 rounded-2xl flex items-center justify-center text-brand/40 mb-12 animate-soft-float relative">
              <Music2 size={32} strokeWidth={1} />
              <div className="absolute inset-0 rounded-2xl border border-brand/10 animate-ping opacity-20" />
            </div>

            <h1 className="font-serif text-6xl md:text-8xl tracking-[0.2em] text-brand/20 mb-8 select-none">
              404
            </h1>

            <h2 className="font-serif text-2xl md:text-3xl tracking-[0.3em] text-brand mb-6 uppercase">
              Not Found
            </h2>

            <div className="w-8 h-px bg-accent-gold/30 mb-8" />

            <p className="text-brand/60 text-sm md:text-base leading-loose tracking-[0.15em] mb-12 max-w-md mx-auto font-light">
              お探しのページは見つかりませんでした。<br />
              静寂の向こう側、共鳴の原点へ戻りましょう。
            </p>

            <Link
              href="/"
              className="inline-flex items-center gap-4 px-10 py-4 bg-brand text-white rounded-full hover:shadow-[0_20px_40px_rgba(96,62,68,0.2)] hover:scale-105 active:scale-95 transition-all duration-500 tracking-[0.3em] font-bold text-[11px] group"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1.5 transition-transform duration-500" />
              BACK TO HOME
            </Link>
          </div>
        </div>

        {/* Subtle Brand Mark */}
        <p className="mt-12 text-center text-[10px] tracking-[0.6em] text-brand/20 uppercase font-bold select-none">
          Melocolla Circle System
        </p>
      </div>
    </div>
  )
}
