'use client'

import Link from 'next/link'
import { useEffect, useState, useRef } from 'react'
import gsap from 'gsap'

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'Activity', path: '/activity' },
  { name: 'Discography', path: '/discography' },
  { name: 'Members', path: '/members' },
  { name: 'Events', path: '/events' },
]

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)
  const linksRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // GSAP-driven menu open/close
  useEffect(() => {
    if (!overlayRef.current || !linksRef.current) return

    const html = document.documentElement
    if (isMenuOpen) {
      html.classList.add('menu-open')
      
      gsap.set(overlayRef.current, { display: 'flex' })
      gsap.fromTo(overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.4, ease: 'expo.out' }
      )
      const links = linksRef.current.children
      gsap.fromTo(links,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: 'power4.out', delay: 0.1 }
      )
    } else {
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.inOut',
        onComplete: () => {
          html.classList.remove('menu-open')
          if (overlayRef.current) gsap.set(overlayRef.current, { display: 'none' })
        }
      })
    }
  }, [isMenuOpen])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
        isScrolled
          ? 'bg-[#f6f3f0]/90 backdrop-blur-lg py-3 shadow-[0_1px_8px_rgba(96,62,68,0.04)]'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="group relative z-[103]">
          <span className="font-serif text-lg tracking-widest text-brand font-bold">Melocolla</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-10">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.path}
              className="text-[13px] font-medium tracking-[0.2em] text-brand/75 hover:text-brand transition-colors duration-500 relative group uppercase"
            >
              {item.name}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-accent-gold transition-all duration-500 ease-out group-hover:w-full" />
            </Link>
          ))}
        </nav>

        {/* Mobile Hamburger — absolute positioned lines for perfect X centering */}
        <button
          className="md:hidden w-10 h-10 flex items-center justify-center relative z-[103]"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle Menu"
        >
          <div className="relative w-6 h-4">
            {/* Top line → rotates to form top-left to bottom-right diagonal */}
            <span
              className="absolute left-0 h-[1.5px] bg-brand transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
              style={{
                width: '100%',
                top: isMenuOpen ? '50%' : '0',
                transform: isMenuOpen ? 'translateY(-50%) rotate(45deg)' : 'none',
              }}
            />
            {/* Middle line → fades out */}
            <span
              className="absolute left-0 h-[1.5px] bg-brand transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
              style={{
                width: isMenuOpen ? '0%' : '60%',
                top: '50%',
                transform: 'translateY(-50%)',
                opacity: isMenuOpen ? 0 : 1,
              }}
            />
            {/* Bottom line → rotates to form bottom-left to top-right diagonal */}
            <span
              className="absolute left-0 h-[1.5px] bg-brand transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
              style={{
                width: '100%',
                top: isMenuOpen ? '50%' : '100%',
                transform: isMenuOpen ? 'translateY(-50%) rotate(-45deg)' : 'translateY(-100%)',
              }}
            />
          </div>
        </button>
      </div>

      {/* Mobile Overlay — controlled entirely by GSAP */}
      <div
        ref={overlayRef}
        className="fixed inset-0 h-[100dvh] bg-white z-[102] flex-col items-center justify-center overscroll-none"
        style={{ display: 'none', opacity: 0 }}
      >
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent-gold/20 to-transparent" />

        <div ref={linksRef} className="flex flex-col items-center gap-10">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.path}
              onClick={() => setIsMenuOpen(false)}
              className="font-serif text-2xl tracking-[0.25em] text-brand hover:text-accent-gold transition-colors duration-500"
            >
              {item.name}
            </Link>
          ))}
        </div>

        <p className="absolute bottom-8 text-[8px] tracking-[0.5em] text-brand/15 uppercase font-bold">
          Melocolla
        </p>
      </div>
    </header>
  )
}
