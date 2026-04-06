'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface ScrollRevealProps {
  children: React.ReactNode
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  delay?: number
  duration?: number
  distance?: number
  className?: string
  stagger?: number
}

export default function ScrollReveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 1.2,
  distance = 50,
  className = '',
  stagger = 0
}: ScrollRevealProps) {
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = elementRef.current
    if (!el) return

    const x = direction === 'left' ? -distance : direction === 'right' ? distance : 0
    const y = direction === 'up' ? distance : direction === 'down' ? -distance : 0

    const anim = gsap.fromTo(el.children, 
      { 
        opacity: 0, 
        x, 
        y, 
        scale: direction === 'none' ? 0.95 : 1 
      },
      {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        duration,
        delay,
        stagger: stagger || 0,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 92%',
          toggleActions: 'play none none none'
        }
      }
    )

    return () => {
      anim.scrollTrigger?.kill()
      anim.kill()
    }
  }, [direction, delay, duration, distance, stagger])

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  )
}
