'use client'

import React from 'react'
import { Lock } from 'lucide-react'
import ScrollReveal from '@/components/animation/ScrollReveal'

export default function PrivatePageMessage() {
  return (
    <ScrollReveal direction="up" distance={20} delay={0.2}>
      <div className="flex flex-col items-center justify-center py-32 md:py-48 px-6 text-center">
        <div className="relative mb-12">
          <div className="absolute inset-0 bg-accent-gold/10 blur-[40px] rounded-full" />
          <div className="relative w-20 h-20 rounded-[2rem] bg-brand/5 border border-brand/10 flex items-center justify-center text-brand/40 shadow-xl">
            <Lock size={32} strokeWidth={1.5} />
          </div>
        </div>

        <div className="max-w-md">
          <h2 className="font-serif text-2xl md:text-3xl tracking-[0.2em] text-brand mb-6 uppercase">
            Private <span className="text-accent-gold">Access</span>
          </h2>
          <div className="w-12 h-[0.5px] bg-accent-gold/30 mx-auto mb-8" />
          <p className="text-sm md:text-base text-brand/50 leading-loose tracking-[0.1em] font-light">
            このページは現在、管理者により非公開に設定されています。<br />
            公開まで今しばらくお待ちください。
          </p>
        </div>

        <p className="mt-16 text-[9px] text-brand/20 tracking-[0.5em] uppercase font-bold">
          Melocolla Circle System
        </p>
      </div>
    </ScrollReveal>
  )
}
