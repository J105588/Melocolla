import { supabase, Member } from '@/lib/supabase'
import { Users, ExternalLink } from 'lucide-react'
import { Metadata } from 'next'
import ScrollReveal from '@/components/animation/ScrollReveal'
import { getPageVisibility, isAdmin } from '@/lib/page-visibility'
import PrivatePageMessage from '@/components/layout/PrivatePageMessage'

export const metadata: Metadata = {
  title: 'Members | Melocolla',
  description: 'Melocollaに参加するクリエイターたちのポートフォリオ。',
}

async function getMembers() {
  const { data, error } = await supabase
    .from('members')
    .select('*')
    .eq('is_public', true)
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching members:', error)
    return []
  }
  return data as Member[]
}

export default async function MembersPage() {
  const visibility = await getPageVisibility('members')
  const admin = await isAdmin()
  const isPrivate = visibility && !visibility.is_public && !admin
  const members = isPrivate ? [] : await getMembers()


  return (
    <div className="container mx-auto px-6 py-24">
      <ScrollReveal direction="up" distance={40}>
        <div className="max-w-4xl mx-auto mb-20 text-center">
          <h1 className="font-serif text-5xl tracking-widest text-brand mb-8">
            MEMBERS<span className="text-accent-gold ml-2">.</span>
          </h1>
          <div className="w-12 h-px bg-gradient-to-r from-transparent via-accent-gold to-transparent mx-auto" />
        </div>
      </ScrollReveal>

      {isPrivate ? (
        <PrivatePageMessage />
      ) : members.length > 0 ? (
        <ScrollReveal stagger={0.15}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
            {members.map((member, i) => (
              <MemberCard key={member.id} member={member} index={i} />
            ))}
          </div>
        </ScrollReveal>
      ) : (
        <div className="flex flex-col items-center justify-center py-32 opacity-20">
          <Users size={64} strokeWidth={1} className="mb-6" />
          <p className="font-serif tracking-widest text-brand">NO MEMBERS FOUND</p>
        </div>
      )}
    </div>
  )
}

function MemberCard({ member, index }: { member: Member, index: number }) {
  return (
    <div
      className="group flex flex-col items-center text-center"
    >
      <div className="relative w-40 h-40 mb-8">
        <div className="absolute inset-0 rounded-full border border-brand/10 group-hover:scale-110 transition-transform duration-700" />
        <div className="absolute inset-2 rounded-full overflow-hidden bg-brand/5 shadow-inner">
          {member.avatar_url ? (
            <img
              src={member.avatar_url}
              alt={member.name}
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-brand/20">
              <Users size={48} strokeWidth={1} />
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="font-serif text-2xl tracking-widest text-brand">{member.name}</h3>
        <p className="text-xs uppercase tracking-widest text-brand-muted font-bold">{member.role}</p>
        <p className="mt-4 text-sm text-brand/60 leading-relaxed max-w-xs whitespace-pre-wrap">{member.bio}</p>

        <div className="flex items-center justify-center gap-2 mt-8">
          {member.sns_links?.map((link, i) => {
            const platform = link.platform.toLowerCase()
            return (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full border border-brand/5 text-brand/40 hover:text-brand hover:border-brand/20 hover:bg-brand/5 transition-all group/sns relative"
                title={link.platform}
              >
                <SNSIcon platform={platform} />
                <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-brand text-white text-[8px] px-2 py-1 rounded opacity-0 group-hover/sns:opacity-100 transition-opacity font-bold tracking-widest pointer-events-none">
                  {link.platform.toUpperCase()}
                </span>
              </a>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function SNSIcon({ platform }: { platform: string }) {
  if (platform.includes('twitter') || platform.includes('x')) {
    return (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    )
  }
  if (platform.includes('discord')) {
    return (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.23 10.23 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42.01 1.333-.946 2.418-2.157 2.418z" />
      </svg>
    )
  }
  if (platform.includes('youtube')) {
    return (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
        <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
      </svg>
    )
  }
  if (platform.includes('niconico')) {
    return (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
        <path d="M.4787 7.534v12.1279A2.0213 2.0213 0 0 0 2.5 21.6832h2.3888l1.323 2.0948a.4778.4778 0 0 0 .4043.2205.4778.4778 0 0 0 .441-.2205l1.323-2.0948h6.9828l1.323 2.0948a.4778.4778 0 0 0 .441.2205c.1838 0 .3308-.0735.4043-.2205l1.323-2.0948h2.6462a2.0213 2.0213 0 0 0 2.0213-2.0213V7.5339a2.0213 2.0213 0 0 0-2.0213-1.9845h-7.681l4.4468-4.4469L17.1637 0l-5.1452 5.1452L6.8 0 5.6973 1.1025l4.4102 4.4102H2.5367a2.0213 2.0213 0 0 0-2.058 2.058z"/>
      </svg>
    )
  }
  return <ExternalLink size={16} />
}
