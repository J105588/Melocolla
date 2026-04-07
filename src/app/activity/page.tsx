'use client'

import { useEffect, useState, useRef } from 'react'
import { supabase, Activity } from '@/lib/supabase'
import Header from '@/components/layout/Header'
import { Newspaper, Calendar, ChevronRight, ChevronDown, Loader2 } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function ActivityPage() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchActivities()
  }, [])

  const fetchActivities = async () => {
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .eq('is_public', true)
      .order('created_at', { ascending: false })

    if (error) console.error(error)
    else setActivities(data || [])
    setLoading(false)
  }

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  useEffect(() => {
    if (!loading && activities.length > 0) {
      gsap.registerPlugin(ScrollTrigger)
      const items = gsap.utils.toArray('.activity-card')
      items.forEach((item: any) => {
        gsap.fromTo(item,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 90%',
            }
          }
        )
      })
    }
  }, [loading, activities])

  return (
    <div className="min-h-screen bg-[#fcfaf8] selection:bg-accent-gold/20">
      <Header />

      <main className="pt-32 pb-24" ref={containerRef}>
        <div className="container mx-auto px-6">
          {/* Hero Section */}
          <section className="mb-20 text-center">
            <h1 className="font-serif text-5xl lg:text-7xl tracking-[0.2em] text-brand mb-8 uppercase">
              ACTIVITY <span className="text-accent-gold">FEED</span>
            </h1>
            <div className="w-16 h-px bg-accent-gold mx-auto" />
          </section>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-40 text-brand/20">
              <Loader2 className="animate-spin mb-4" size={32} />
              <p className="font-serif tracking-[0.3em] uppercase text-xs">Synchronizing Archive...</p>
            </div>
          ) : activities.length === 0 ? (
            <div className="text-center py-40 border border-brand/5 rounded-[3rem] bg-white/50 backdrop-blur-sm">
              <p className="font-serif tracking-[0.2em] text-brand/30 uppercase">No Activity Recorded Yet</p>
            </div>
          ) : (
            <div className="grid gap-12 max-w-5xl mx-auto">
              {activities.map((activity) => (
                <article key={activity.id} className="activity-card group bg-white border border-brand/5 rounded-[2.5rem] overflow-hidden shadow-[0_10px_40px_rgba(96,62,68,0.02)] transition-all hover:shadow-[0_20px_60px_rgba(96,62,68,0.06)] hover:border-accent-gold/20">
                  <div className="flex flex-col lg:flex-row">
                    {/* Image */}
                    {activity.image_url && (
                      <div className="lg:w-2/5 h-64 lg:h-auto overflow-hidden relative">
                        <img
                          src={activity.image_url}
                          alt={activity.title}
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-brand/10 group-hover:bg-transparent transition-colors duration-500" />
                      </div>
                    )}

                    {/* Content */}
                    <div className={`p-8 lg:p-12 flex-1 flex flex-col ${!activity.image_url ? 'lg:w-full' : ''}`}>
                      <div className="flex items-center gap-4 mb-6">
                        <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-brand/40 uppercase">
                          <Calendar size={12} />
                          {new Date(activity.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                        <div className="h-px flex-1 bg-brand/5" />
                      </div>

                      <h2 className="font-serif text-2xl lg:text-3xl tracking-[0.1em] text-brand mb-6 group-hover:text-accent-gold transition-colors leading-tight">
                        {activity.title}
                      </h2>

                      <div 
                        className={`rich-text-content markdown-content text-brand/60 leading-relaxed mb-8 text-sm lg:text-base whitespace-pre-wrap transition-all duration-500 overflow-hidden ${expandedIds.has(activity.id) ? 'max-h-full opacity-100' : 'max-h-32 opacity-80'}`}
                        dangerouslySetInnerHTML={{ __html: activity.content }}
                      />

                      <div className="mt-auto pt-6 border-t border-brand/5 flex justify-between items-center">
                        <button 
                          onClick={() => toggleExpand(activity.id)}
                          className="flex items-center gap-3 text-[10px] font-bold tracking-[0.3em] text-brand uppercase group/btn"
                        >
                          {expandedIds.has(activity.id) ? 'Close Report' : 'Read Full Report'}
                          {expandedIds.has(activity.id) ? (
                            <ChevronDown size={14} className="transition-transform text-accent-gold" />
                          ) : (
                            <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform text-accent-gold" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>


    </div>
  )
}
