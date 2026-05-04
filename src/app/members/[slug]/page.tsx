import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { supabase, Member } from '@/lib/supabase'
import ScrollReveal from '@/components/animation/ScrollReveal'
import { ExternalLink } from 'lucide-react'
import { isAdmin } from '@/lib/page-visibility'
import PrivatePageMessage from '@/components/layout/PrivatePageMessage'

type Props = {
  params: Promise<{ slug: string }>
}

async function getMemberBySlug(slug: string) {
  const { data, error } = await supabase
    .from('members')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !data) {
    return null
  }
  return data as Member
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const member = await getMemberBySlug(slug)

  if (!member) {
    return {
      title: 'Member Not Found',
    }
  }

  return {
    title: `${member.name} | Members`,
    description: member.bio?.substring(0, 160) || `Profile of ${member.name}`,
  }
}

export default async function MemberProfilePage({ params }: Props) {
  const { slug } = await params
  const admin = await isAdmin()
  const member = await getMemberBySlug(slug)

  if (!member) {
    notFound()
  }

  // 個別の is_public 設定に基づいてアクセス制限
  if (!member.is_public && !admin) {
    return (
      <div className="container mx-auto px-6 py-32">
        <PrivatePageMessage />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-20 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent-gold/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-[440px] z-10">
        <ScrollReveal direction="up" distance={30}>
          <div className="flex flex-col items-center text-center mb-12">
            {/* Profile Image */}
            <div className="relative w-28 h-28 mb-6">
              <div className="absolute inset-0 rounded-full border border-brand/10 scale-110" />
              <div className="absolute inset-0 rounded-full overflow-hidden bg-brand/5 shadow-inner">
                {member.avatar_url ? (
                  <img
                    src={member.avatar_url}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-brand/10 bg-brand/5">
                    <span className="font-serif text-4xl">{member.name.charAt(0)}</span>
                  </div>
                )}
              </div>
            </div>

            <h1 className="font-serif text-3xl tracking-[0.2em] text-brand mb-2">
              {member.name.toUpperCase()}<span className="text-accent-gold">.</span>
            </h1>
            <p className="text-[10px] uppercase tracking-[0.3em] text-brand/50 font-bold mb-8">
              {member.role || 'Member'}
            </p>

            <div className="w-8 h-px bg-accent-gold/30 mb-8" />

            <div className="text-sm text-brand/70 leading-relaxed tracking-wider">
              {member.bio?.split('\n').map((line, i) => (
                <p key={i} className="mb-4">{line}</p>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {member.sns_links && member.sns_links.length > 0 && (
          <ScrollReveal stagger={0.1}>
            <div className="flex flex-col gap-4 mb-16">
              {member.sns_links.map((link, i) => (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between p-5 bg-white/40 backdrop-blur-sm border border-brand/5 rounded-2xl hover:border-accent-gold/30 hover:bg-white/60 transition-all duration-500 shadow-sm hover:shadow-md"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-brand/5 flex items-center justify-center text-brand/60 group-hover:bg-accent-gold/10 group-hover:text-accent-gold transition-colors duration-500">
                      <PlatformIcon platform={link.platform} />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold tracking-widest text-brand">{link.platform}</p>
                    </div>
                  </div>
                  <ExternalLink size={16} className="text-brand/20 group-hover:text-accent-gold transition-colors duration-500" />
                </a>
              ))}
            </div>
          </ScrollReveal>
        )}

        <ScrollReveal direction="up" delay={0.5}>
          <div className="flex flex-col items-center">
            <p className="text-[10px] tracking-[0.3em] text-brand/30 uppercase">
              &copy; {new Date().getFullYear()} Melocolla. All Rights Reserved.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </div>
  )
}

function PlatformIcon({ platform }: { platform: string }) {
  const p = platform.toLowerCase()
  if (p.includes('x') || p.includes('twitter')) {
    return (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    )
  }
  if (p.includes('ニコニコ') || p.includes('niconico')) {
    return (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
        <path d="M.4787 7.534v12.1279A2.0213 2.0213 0 0 0 2.5 21.6832h2.3888l1.323 2.0948a.4778.4778 0 0 0 .4043.2205.4778.4778 0 0 0 .441-.2205l1.323-2.0948h6.9828l1.323 2.0948a.4778.4778 0 0 0 .441.2205c.1838 0 .3308-.0735.4043-.2205l1.323-2.0948h2.6462a2.0213 2.0213 0 0 0 2.0213-2.0213V7.5339a2.0213 2.0213 0 0 0-2.0213-1.9845h-7.681l4.4468-4.4469L17.1637 0l-5.1452 5.1452L6.8 0 5.6973 1.1025l4.4102 4.4102H2.5367a2.0213 2.0213 0 0 0-2.058 2.058z" />
      </svg>
    )
  }
  if (p.includes('youtube')) {
    return (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
        <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
      </svg>
    )
  }
  if (p.includes('discord')) {
    return (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.23 10.23 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42.01 1.333-.946 2.418-2.157 2.418z" />
      </svg>
    )
  }
  return <ExternalLink size={20} />
}
