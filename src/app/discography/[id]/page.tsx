import { supabase, Discography } from '@/lib/supabase'
import { Music, Play, ArrowLeft, Clock } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ScrollReveal from '@/components/animation/ScrollReveal'

export const revalidate = 3600

async function getAlbum(id: string) {
  const { data, error } = await supabase
    .from('discography')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) return null
  return data as Discography
}

export default async function AlbumDetailPage({ params }: { params: { id: string } }) {
  const album = await getAlbum(params.id)

  if (!album) notFound()

  return (
    <div className="container mx-auto px-6 py-24">
      <ScrollReveal direction="up" distance={20}>
        <Link 
          href="/discography" 
          className="inline-flex items-center gap-2 text-sm text-brand-muted hover:text-brand transition-colors mb-16 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          BACK TO LIST
        </Link>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-32">
        <ScrollReveal direction="right" distance={40} delay={0.2}>
          {/* Left: Jacket Art */}
          <div className="relative group self-start">
            <div className="absolute inset-0 bg-brand/5 rounded-3xl -rotate-2 -z-10 group-hover:rotate-0 transition-transform duration-700" />
            <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl">
              {album.jacket_url ? (
                <img src={album.jacket_url} alt={album.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-brand/5 flex items-center justify-center text-brand/20">
                  <Music size={128} strokeWidth={0.5} />
                </div>
              )}
            </div>
          </div>
        </ScrollReveal>

        {/* Right: Info & Tracklist */}
        <ScrollReveal direction="left" distance={40} delay={0.4}>
          <div className="flex flex-col gap-12">
          <header>
            <p className="text-xs font-bold tracking-widest text-brand-muted uppercase mb-4">
              RELEASED AT {new Date(album.release_date).toLocaleDateString('ja-JP')}
            </p>
            <h1 className="font-serif text-4xl md:text-6xl tracking-widest text-brand mb-8 leading-tight">
              {album.title}
            </h1>
            <p className="text-brand/60 leading-relaxed tracking-wider font-light italic">
              {album.description}
            </p>
          </header>

          <div className="flex flex-col gap-6">
            <h3 className="font-serif text-xl tracking-widest text-brand border-b border-brand/10 pb-4">TRACKLIST</h3>
            <div className="flex flex-col gap-px">
              {album.tracklist?.map((track, i) => (
                <div 
                  key={i}
                  className="group flex items-center justify-between py-4 px-4 -mx-4 rounded-xl hover:bg-brand/5 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-6">
                    <span className="text-xs font-mono text-brand/20 font-bold group-hover:text-brand transition-colors">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="text-brand text-sm tracking-widest font-medium">{track.title}</span>
                  </div>
                  <div className="flex items-center gap-4 text-brand-muted text-xs font-mono">
                    <Clock size={12} />
                    {track.length}
                    <button className="w-8 h-8 rounded-full border border-brand/10 flex items-center justify-center group-hover:bg-brand group-hover:text-white transition-all transform scale-90 group-hover:scale-100">
                      <Play size={12} fill="currentColor" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  )
}
