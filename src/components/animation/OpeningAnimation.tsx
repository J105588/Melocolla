'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { PC_LOGO_DATA, MOBILE_LOGO_DATA } from './logoData'

export default function OpeningAnimation({ onComplete }: { onComplete: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 1.5,
          ease: 'power3.inOut',
          onComplete: onComplete,
        })
      },
    })

    const paths = containerRef.current?.querySelectorAll('path')
    if (!paths || paths.length === 0) return

    // Initial state: outline drawing mode
    gsap.set(paths, {
      strokeDasharray: 2000,
      strokeDashoffset: 2000,
      opacity: 0,
      fill: 'transparent',
      stroke: '#603E44',
      strokeWidth: 0.5,
    })

    // 1. Draw paths
    tl.to(paths, {
      strokeDashoffset: 0,
      opacity: 1,
      duration: 3,
      stagger: 0.15,
      ease: 'expo.inOut',
    })

    // 2. Fill brand color
    tl.to(paths, {
      fill: '#603E44',
      strokeWidth: 0,
      duration: 2,
      stagger: 0.1,
      ease: 'expo.inOut',
    }, '-=1.5')

    // 3. Subtle scale up for cinematic effect
    const svgElement = containerRef.current?.querySelector('svg')
    if (svgElement) {
      tl.to(svgElement, {
        scale: 1.05,
        opacity: 0.8,
        duration: 4,
        ease: 'sine.inOut',
      }, 0)
    }

  }, [mounted, onComplete])

  if (!mounted) return null

  return (
    <div ref={containerRef} className="fixed inset-0 bg-white z-[9999] flex items-center justify-center pointer-events-none">
      <div className="w-full max-w-4xl px-8 md:px-12">
        {isMobile ? (
          /* Mobile SVG: 1000x1000 */
          <svg viewBox="0 0 1000 1000" className="w-full h-auto overflow-visible">
            {MOBILE_LOGO_DATA.map((item, i) => (
              <path
                key={`mobile-${i}`}
                d={item.d}
                transform={item.transform}
                style={{ opacity: 0 }}
              />
            ))}
          </svg>
        ) : (
          /* Desktop SVG: 1920x1080 */
          <svg viewBox="0 0 1920 1080" className="w-full h-auto overflow-visible">
            {PC_LOGO_DATA.map((item, i) => (
              <path
                key={`pc-${i}`}
                d={item.d}
                transform={item.transform}
                style={{ opacity: 0 }}
              />
            ))}
          </svg>
        )}
      </div>
    </div>
  )
}
