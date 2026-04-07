import { supabase, Event } from '@/lib/supabase'
import { Calendar, ExternalLink, Clock, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { Metadata } from 'next'
import ScrollReveal from '@/components/animation/ScrollReveal'

export const metadata: Metadata = {
  title: 'Events | Melocolla',
  description: 'Melocollaの最新イベント・投稿祭のスケジュール。',
}

async function getEvents() {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('is_public', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching events:', error)
    return []
  }
  return data as Event[]
}

export default async function EventsPage() {
  const events = await getEvents()

  return (
    <div className="container mx-auto px-6 py-24">
      <ScrollReveal direction="up" distance={40}>
        <div className="max-w-4xl mx-auto mb-20 text-center">
          <h1 className="font-serif text-5xl md:text-6xl tracking-widest text-brand mb-8 uppercase">
            EVENTS<span className="text-accent-gold ml-2">.</span>
          </h1>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-accent-gold/40 to-transparent mx-auto mb-8" />
        </div>
      </ScrollReveal>

      {events.length > 0 ? (
        <ScrollReveal stagger={0.15}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {events.map((event, i) => (
              <EventCard key={event.id} event={event} index={i} />
            ))}
          </div>
        </ScrollReveal>
      ) : (
        <div className="flex flex-col items-center justify-center py-40 opacity-20">
          <Calendar size={64} strokeWidth={1} className="mb-6 text-brand" />
          <p className="font-serif tracking-[0.5em] text-brand uppercase">STAY TUNED</p>
        </div>
      )}
    </div>
  )
}

function EventCard({ event, index }: { event: Event, index: number }) {
  const statusConfig = {
    upcoming: { icon: <Calendar size={14} />, label: 'UPCOMING', color: 'bg-accent-gold text-white' },
    ongoing: { icon: <Clock size={14} />, label: 'ONGOING', color: 'bg-brand text-white' },
    completed: { icon: <CheckCircle2 size={14} />, label: 'COMPLETED', color: 'bg-brand/10 text-brand/40' },
  }

  const config = statusConfig[event.status] || statusConfig.upcoming

  return (
    <div
      className="group glass-card overflow-hidden rounded-[2.5rem] flex flex-col h-full"
    >
      {/* Thumbnail */}
      <div className="relative aspect-[16/9] overflow-hidden bg-brand/5">
        {event.thumbnail_url ? (
          <img
            src={event.thumbnail_url}
            alt={event.event_name}
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-brand/10">
            <Calendar size={48} strokeWidth={0.5} />
          </div>
        )}

        {/* Status Badge */}
        <div className={`absolute top-6 left-6 flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] font-bold tracking-[0.2em] shadow-lg ${config.color}`}>
          {config.icon}
          {config.label}
        </div>
      </div>

      {/* Content */}
      <div className="p-8 md:p-10 flex flex-col flex-grow">
        <h3 className="font-serif text-xl tracking-widest text-brand mb-6 leading-tight min-h-[2.5rem]">
          {event.event_name}
        </h3>

        <div className="mt-auto pt-8 border-t border-brand/5 flex items-center justify-between">
          {event.link_url ? (
            <Link
              href={event.link_url}
              target="_blank"
              className="inline-flex items-center gap-3 text-[10px] font-bold tracking-[0.3em] text-brand/60 hover:text-brand transition-all uppercase group/link"
            >
              DETAILS
              <ExternalLink size={12} className="text-accent-gold group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform" />
            </Link>
          ) : (
            <span className="text-[10px] font-bold tracking-[0.3em] text-brand/20 uppercase cursor-default">
              COMING SOON
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
