'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

export default function CinematicBackground() {
  const meshRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(raf)
  }, [])

  useEffect(() => {
    if (!mounted || !meshRef.current) return

    gsap.to(meshRef.current, {
      opacity: 1,
      duration: 4,
      delay: 0.8,
      ease: 'power2.out',
    })

    // Mouse parallax (very gentle)
    const handleMouseMove = (e: MouseEvent) => {
      const xP = (e.clientX / window.innerWidth - 0.5) * 2
      const yP = (e.clientY / window.innerHeight - 0.5) * 2
      gsap.to(meshRef.current, {
        x: xP * 12,
        y: yP * 8,
        duration: 6,
        ease: 'power2.out',
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mounted])

  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden">
      {/* Base: warm off-white */}
      <div className="absolute inset-0 bg-[#faf9f7]" />

      {/* SVG Noise Texture (organic grain — rendered once, static) */}
      <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.35 }} aria-hidden="true">
        <filter id="bg-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#bg-noise)" opacity="0.06" />
      </svg>

      {/* Gradient Mesh: barely visible warm-cool interplay */}
      <div
        ref={meshRef}
        className="absolute will-change-transform"
        style={{
          opacity: 0,
          inset: '-15%',
          background: `
            radial-gradient(ellipse 80% 60% at 20% 30%, rgba(96,62,68,0.02) 0%, transparent 60%),
            radial-gradient(ellipse 70% 50% at 75% 70%, rgba(201,169,110,0.015) 0%, transparent 55%),
            radial-gradient(ellipse 90% 70% at 50% 50%, rgba(253,240,240,0.035) 0%, transparent 70%)
          `,
        }}
      />

      {/* Fine horizontal ruling lines (architectural feel) */}
      <div
        className="absolute inset-0"
        style={{
          opacity: 0.02,
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 79px, rgba(96,62,68,0.35) 79px, rgba(96,62,68,0.35) 80px)',
        }}
      />
    </div>
  )
}
