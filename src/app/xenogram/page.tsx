import { Metadata } from 'next'
import ScrollReveal from '@/components/animation/ScrollReveal'
import { ExternalLink } from 'lucide-react'

export const metadata: Metadata = {
  title: 'XENOGRAM',
  description: 'ボカロP',
}

const LINKS = [
  {
    url: 'https://x.com/jxeno_8',
    platform: 'X',
    description: 'SNS',
  },
  {
    url: 'https://www.nicovideo.jp/user/143305795',
    platform: 'ニコニコ',
    description: 'Music & Videos',
  }
]

export default function XenogramPage() {
  const iconUrl = 'https://bpontndpvmssoizjyikb.supabase.co/storage/v1/object/public/melocolla-assets/584cx0gpfbj.jpg'

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
                <img
                  src={iconUrl}
                  alt="XENOGRAM"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <h1 className="font-serif text-3xl tracking-[0.2em] text-brand mb-2">
              XENOGRAM<span className="text-accent-gold">.</span>
            </h1>
            <p className="text-[10px] uppercase tracking-[0.3em] text-brand/50 font-bold mb-8">
              ボカロP
            </p>

            <div className="w-8 h-px bg-accent-gold/30 mb-8" />

            <div className="text-sm text-brand/70 leading-relaxed tracking-wider">
              <p className="mb-4">DTMやってます | (自称)ボカロP</p>
              <p className="mb-4">ピアノ歴10年 | ギター初心者</p>
              <p className="mb-4">プログラミング歴1年 | 写真たまに撮ります📷</p>
              <p className="mb-4">仲良くしてください！</p>
              <p className="text-xs text-brand/50">ニコニコ音楽カテゴリーランキング最高57位到達</p>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal stagger={0.1}>
          <div className="flex flex-col gap-4 mb-16">
            {LINKS.map((link) => (
              <a
                key={link.platform}
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
                    <p className="text-[10px] tracking-wider text-brand/40 uppercase">{link.description}</p>
                  </div>
                </div>
                <ExternalLink size={16} className="text-brand/20 group-hover:text-accent-gold transition-colors duration-500" />
              </a>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.5}>
          <div className="flex flex-col items-center">
            <p className="text-[10px] tracking-[0.3em] text-brand/30 uppercase">
              &copy; 2026 XENOGRAM & Melocolla. All Rights Reserved.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </div>
  )
}

function PlatformIcon({ platform }: { platform: string }) {
  if (platform === 'X') {
    return (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    )
  }
  if (platform === 'ニコニコ') {
    return (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
        <path d="M.4787 7.534v12.1279A2.0213 2.0213 0 0 0 2.5 21.6832h2.3888l1.323 2.0948a.4778.4778 0 0 0 .4043.2205.4778.4778 0 0 0 .441-.2205l1.323-2.0948h6.9828l1.323 2.0948a.4778.4778 0 0 0 .441.2205c.1838 0 .3308-.0735.4043-.2205l1.323-2.0948h2.6462a2.0213 2.0213 0 0 0 2.0213-2.0213V7.5339a2.0213 2.0213 0 0 0-2.0213-1.9845h-7.681l4.4468-4.4469L17.1637 0l-5.1452 5.1452L6.8 0 5.6973 1.1025l4.4102 4.4102H2.5367a2.0213 2.0213 0 0 0-2.058 2.058z" />
      </svg>
    )
  }
  return <ExternalLink size={20} />
}
