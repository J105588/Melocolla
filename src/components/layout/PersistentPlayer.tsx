'use client'

import { useAudio } from '@/context/AudioContext'
import { Play, Pause, SkipBack, SkipForward, Music } from 'lucide-react'

export default function PersistentPlayer() {
  const { activeTrack, isPlaying, togglePlay } = useAudio()

  if (!activeTrack) return null

  return (
    <div className="fixed bottom-4 md:bottom-6 right-6 left-6 md:left-auto md:w-96 bg-white/80 backdrop-blur-md border border-brand/10 shadow-2xl rounded-2xl p-4 z-50 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center gap-4">
        <div className="relative w-16 h-16 rounded-xl bg-brand/5 overflow-hidden flex-shrink-0">
          {activeTrack.jacket ? (
            <img src={activeTrack.jacket} alt={activeTrack.title} className="w-full h-auto object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-brand/20">
              <Music size={24} />
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold truncate text-brand">{activeTrack.title}</h3>
          <p className="text-xs text-brand-muted truncate">Now Playing</p>
          
          <div className="flex items-center gap-3 mt-2">
            <button className="text-brand-muted hover:text-brand transition-colors">
              <SkipBack size={16} fill="currentColor" />
            </button>
            <button 
              onClick={togglePlay}
              className="w-8 h-8 bg-brand text-white rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
            >
              {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} className="ml-0.5" fill="currentColor" />}
            </button>
            <button className="text-brand-muted hover:text-brand transition-colors">
              <SkipForward size={16} fill="currentColor" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
