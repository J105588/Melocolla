import { supabase, Discography } from '@/lib/supabase'
import { Music, Play } from 'lucide-react'
import Link from 'next/link'
import { Metadata } from 'next'
import ScrollReveal from '@/components/animation/ScrollReveal'

export const metadata: Metadata = {
  title: 'Discography | Melocolla',
  description: 'Melocollaの音楽作品一覧。共鳴する感性が紡ぎ出す、最新のリリース情報。',
}

export const revalidate = 3600 // revalidate every hour

async function getDiscography() {
  const { data, error } = await supabase
    .from('discography')
    .select('*')
    .eq('is_public', true)
    .order('release_date', { ascending: false })

  if (error) {
    console.error('Error fetching discography:', error)
    return []
  }
  return data as Discography[]
}

export default async function DiscographyPage() {
  const discography = await getDiscography()

  return (
    <div className="container mx-auto px-6 py-24">
      <ScrollReveal direction="up" distance={40}>
        <div className="max-w-4xl mx-auto mb-20 text-center">
          <h1 className="font-serif text-5xl tracking-widest text-brand mb-8">
            DISCOGRAPHY<span className="text-accent-gold ml-2">.</span>
          </h1>
          <div className="w-12 h-px bg-gradient-to-r from-transparent via-accent-gold to-transparent mx-auto" />
        </div>
      </ScrollReveal>

      {discography.length > 0 ? (
        <ScrollReveal stagger={0.1}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {discography.map((album, i) => (
              <AlbumCard key={album.id} album={album} index={i} />
            ))}
          </div>
        </ScrollReveal>
      ) : (
        <div className="flex flex-col items-center justify-center py-32 opacity-20">
          <Music size={64} strokeWidth={1} className="mb-6" />
          <p className="font-serif tracking-widest">NO RELEASES FOUND</p>
        </div>
      )}
    </div>
  )
}

function AlbumCard({ album, index }: { album: Discography, index: number }) {
  return (
    <Link
      href={`/discography/${album.id}`}
      className="group flex flex-col gap-6"
    >
      <div className="relative aspect-square rounded-3xl overflow-hidden shadow-sm group-hover:shadow-2xl transition-all duration-700">
        {album.jacket_url ? (
          <img
            src={album.jacket_url}
            alt={album.title}
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-brand/5 flex items-center justify-center text-brand/20">
            <Music size={48} strokeWidth={1} />
          </div>
        )}
        <div className="absolute inset-0 bg-brand/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-brand shadow-xl scale-90 group-hover:scale-100 transition-transform duration-500">
            <Play size={24} fill="currentColor" className="ml-1" />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1 px-2">
        <h3 className="font-serif text-lg tracking-widest text-brand group-hover:text-brand-muted transition-colors truncate">
          {album.title}
        </h3>
        <p className="text-xs text-brand/40 font-mono tracking-tighter">
          {new Date(album.release_date).toLocaleDateString('ja-JP')}
        </p>
      </div>
    </Link>
  )
}
