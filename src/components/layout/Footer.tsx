'use client'

import React from 'react'
import Link from 'next/link'
import { Music, ExternalLink, Globe } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="bg-brand text-white/80 py-24 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
          {/* Brand */}
          <div className="md:col-span-2">
            <h2 className="font-serif text-3xl tracking-[0.3em] font-bold text-white mb-8 uppercase">Melocolla</h2>
            <p className="max-w-md text-sm leading-relaxed tracking-wider text-white/40 mb-10">
              A high-end sound production collective pushing the boundaries of digital resonance and melodic architecture.
            </p>
            <div className="flex gap-6">
              <SocialIcon icon={<XIcon />} href="https://x.com" />
              <SocialIcon icon={<YoutubeIcon />} href="https://youtube.com" />
              <SocialIcon icon={<Music size={18} />} href="/" />
              <SocialIcon icon={<Globe size={18} />} href="/" />
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-[10px] font-bold tracking-[0.4em] text-accent-gold uppercase mb-8">Navigation</h4>
            <div className="flex flex-col gap-4">
              <FooterLink href="/">Home</FooterLink>
              <FooterLink href="/activity">Activity</FooterLink>
              <FooterLink href="/discography">Discography</FooterLink>
              <FooterLink href="/members">Members</FooterLink>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[10px] font-bold tracking-[0.4em] text-accent-gold uppercase mb-8">Contact</h4>
            <address className="not-italic flex flex-col gap-4 text-[10px] tracking-widest leading-loose uppercase">
              <span className="text-white/30 truncate">inquiry@melocolla.jp</span>
              <span className="text-white/30 truncate">Tokyo, Shinjuku District</span>
              <Link href="/terms" className="text-accent-gold hover:text-white transition-colors">Legal Terms</Link>
            </address>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[9px] tracking-[0.5em] uppercase font-bold text-white/20">
            &copy; {currentYear} Melocolla Collective. All rights reserved.
          </p>
          <div className="w-12 h-px bg-accent-gold hidden md:block" />
          <p className="text-[9px] tracking-[0.5em] uppercase font-bold text-white/20">
            Resonance in Motion
          </p>
        </div>
      </div>

      {/* Aesthetic Accents */}
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-accent-gold/5 blur-[120px] rounded-full" />
    </footer>
  )
}

function XIcon() {
  return (
    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  )
}

function YoutubeIcon() {
  return (
    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
      <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
    </svg>
  )
}

function SocialIcon({ icon, href }: { icon: React.ReactNode, href: string }) {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:border-accent-gold hover:text-accent-gold transition-all duration-500 hover:-translate-y-1"
    >
      {icon}
    </a>
  )
}

function FooterLink({ href, children }: { href: string, children: React.ReactNode }) {
  return (
    <Link 
      href={href} 
      className="text-[10px] tracking-[0.3em] uppercase hover:text-accent-gold transition-colors duration-500 font-medium"
    >
      {children}
    </Link>
  )
}
