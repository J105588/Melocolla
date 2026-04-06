'use client'

import React, { createContext, useContext, useState, useRef, useEffect } from 'react'

type Track = {
  title: string
  url: string
  jacket: string
}

type AudioContextType = {
  activeTrack: Track | null
  isPlaying: boolean
  playTrack: (track: Track) => void
  togglePlay: () => void
  volume: number
  setVolume: (v: number) => void
}

const AudioContext = createContext<AudioContextType | undefined>(undefined)

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [activeTrack, setActiveTrack] = useState<Track | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.8)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio()
      audioRef.current.volume = volume
    }
  }, [])

  useEffect(() => {
    if (!audioRef.current || !activeTrack) return
    
    audioRef.current.src = activeTrack.url
    if (isPlaying) {
      audioRef.current.play().catch(e => console.error(e))
    }
  }, [activeTrack])

  useEffect(() => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.play().catch(e => console.error(e))
    } else {
      audioRef.current.pause()
    }
  }, [isPlaying])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  const playTrack = (track: Track) => {
    setActiveTrack(track)
    setIsPlaying(true)
  }

  const togglePlay = () => setIsPlaying(!isPlaying)

  return (
    <AudioContext.Provider value={{ activeTrack, isPlaying, playTrack, togglePlay, volume, setVolume }}>
      {children}
    </AudioContext.Provider>
  )
}

export function useAudio() {
  const context = useContext(AudioContext)
  if (!context) throw new Error('useAudio must be used within an AudioProvider')
  return context
}
