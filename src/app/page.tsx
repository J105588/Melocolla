import Link from 'next/link'
import { ArrowRight, Music, Calendar, Users } from 'lucide-react'
import ScrollReveal from '@/components/animation/ScrollReveal'

export default function Home() {
  return (
    <div className="flex flex-col gap-16 md:gap-24 pb-16 md:pb-24 relative">


      {/* ─── Hero Section ─── */}
      <section className="relative min-h-[85vh] md:min-h-[90vh] flex flex-col items-center justify-center text-center px-6">
        <ScrollReveal direction="up" delay={0.2}>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-[9rem] tracking-[0.15em] text-brand mb-10 md:mb-14 relative leading-tight md:leading-none select-none">
            Melocolla<span className="text-accent-gold">.</span>
            <div className="absolute -bottom-4 md:-bottom-6 left-1/2 -translate-x-1/2 w-24 md:w-36 h-px bg-gradient-to-r from-transparent via-accent-gold/50 to-transparent" />
          </h1>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.5} duration={2.2}>
          <div className="max-w-4xl flex flex-col gap-8">
            <p className="text-lg md:text-xl lg:text-2xl leading-relaxed tracking-[0.3em] font-serif italic font-light text-brand/70 whitespace-nowrap md:whitespace-normal lg:whitespace-nowrap">
              奏で、語り、共に創る。創作で繋がる共鳴の場所。
            </p>
            <div className="w-10 h-[0.5px] bg-accent-gold/30 mx-auto" />
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.8}>
          <div className="flex flex-col md:flex-row items-center gap-6 mt-16">
            <Link
              href="/discography"
              className="group px-12 py-5 bg-brand text-white rounded-full flex items-center gap-3 hover:shadow-[0_20px_50px_rgba(96,62,68,0.2)] hover:scale-[1.02] transition-all duration-500 ease-out border border-accent-gold/10 tracking-[0.3em] font-bold text-xs"
            >
              DISCOGRAPHY
              <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform duration-500 ease-out text-accent-gold" />
            </Link>
            <Link
              href="/members"
              className="group px-12 py-5 border border-brand/10 text-brand rounded-full hover:bg-brand/5 hover:border-brand/30 transition-all duration-500 ease-out tracking-[0.3em] font-bold text-xs backdrop-blur-sm"
            >
              MEMBERS
            </Link>
          </div>
        </ScrollReveal>

        <ScrollReveal
          direction="up"
          delay={1.2}
          className="absolute bottom-2 md:bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-50 hover:opacity-100 transition-opacity duration-700"
        >
          <span className="text-[10px] tracking-[0.5em] uppercase font-bold text-brand">SCROLL</span>
          <div className="w-px h-16 md:h-24 bg-gradient-to-b from-brand/50 to-transparent relative overflow-hidden">
            <div className="absolute inset-0 bg-accent-gold animate-[scroll-line_2.5s_infinite_ease-in-out]" />
          </div>
        </ScrollReveal>
      </section>

      {/* ─── About Community ─── */}
      <section className="container mx-auto px-6 max-w-4xl">
        <ScrollReveal direction="up" distance={60}>
          <div className="relative group">
            <div className="absolute -inset-3 bg-gradient-to-br from-accent-gold/8 via-transparent to-accent-rose/10 rounded-[3rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

            <div className="glass-card relative p-12 md:p-20 lg:p-24 rounded-[3rem] text-center subtle-shine-hover">
              {/* Corner accents */}
              <div className="absolute top-8 left-8 w-6 h-6 border-t border-l border-accent-gold/15" />
              <div className="absolute bottom-8 right-8 w-6 h-6 border-b border-r border-accent-gold/15" />

              <div className="relative z-10 flex flex-col items-center">
                <div className="flex flex-col items-center mb-14">
                  <div className="w-10 h-[0.3px] bg-accent-gold/30 mb-8" />
                  <h2 className="font-serif text-xl md:text-2xl lg:text-3xl tracking-[0.5em] text-brand/85 font-extralight uppercase mr-[-0.5em]">
                    ABOUT COMMUNITY
                  </h2>
                  <div className="w-10 h-[0.3px] bg-accent-gold/30 mt-10" />
                </div>

                <div className="flex flex-col gap-10 text-brand/55 max-w-xl mx-auto">
                  <p className="text-base md:text-lg lg:text-xl leading-relaxed tracking-[0.15em] font-medium text-brand/80">
                    奏でる、支える、高め合う。創作で結びつくクリエイターの広場。
                  </p>

                  <div className="w-8 h-[0.5px] bg-brand/8 mx-auto" />

                  <p className="text-sm md:text-base leading-loose tracking-[0.1em] font-light text-brand/75">
                    Discordを拠点に、作品の宣伝から技術的な相互サポートまで、音楽制作を志すすべての人のための交流を広げています。共同アルバム制作や連動イベントを通じ、新しい響きを共に。経歴を問わず、自らの「芸術」を追求するすべての創作者を歓迎します。
                  </p>

                  <div className="mt-6">
                    <Link
                      href="https://discord.gg/your-link"
                      target="_blank"
                      className="inline-flex items-center gap-6 px-14 py-4 border border-brand/8 text-brand/75 rounded-full hover:bg-brand hover:text-white hover:border-brand transition-all duration-700 tracking-[0.3em] font-bold text-[11px] group/btn"
                    >
                      JOIN THE RESONANCE
                      <ArrowRight size={12} className="text-accent-gold group-hover/btn:translate-x-1.5 group-hover/btn:text-white transition-all duration-500" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ─── Feature Cards ─── */}
      <section className="container mx-auto px-6 max-w-5xl">
        <ScrollReveal direction="up" stagger={0.1} className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          <Card
            icon={<Music size={18} />}
            title="LATEST RELEASE"
            desc="共創から生まれた、深みのある音像を。最新のリリース情報はこちらから。"
            link="/discography"
          />
          <Card
            icon={<Calendar size={18} />}
            title="UPCOMING EVENTS"
            desc="投稿祭や合同制作など、共鳴の瞬間を刻むスケジュール。最新の動向をチェック。"
            link="/events"
          />
          <Card
            icon={<Users size={18} />}
            title="CREATORS"
            desc="音と向き合う独自の感性。交差するクリエイターたちのポートフォリオ。"
            link="/members"
          />
        </ScrollReveal>
      </section>
    </div>
  )
}

function Card({ icon, title, desc, link }: { icon: React.ReactNode, title: string, desc: string, link: string }) {
  return (
    <Link href={link} className="group glass-card p-10 rounded-[2rem] hover:shadow-[0_20px_60px_rgba(96,62,68,0.06)] transition-all duration-700 subtle-shine-hover flex flex-col items-center text-center relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-[0.5px] bg-gradient-to-r from-transparent via-accent-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="w-12 h-12 rounded-xl bg-brand/5 flex items-center justify-center text-brand mb-8 transition-all duration-700 group-hover:scale-110 group-hover:bg-brand group-hover:text-white group-hover:shadow-[0_8px_24px_rgba(96,62,68,0.15)] animate-soft-float">
        {icon}
      </div>

      <h3 className="font-serif text-xl tracking-[0.15em] text-brand mb-4 group-hover:text-accent-gold transition-colors">{title}</h3>
      <p className="text-sm text-brand/70 leading-relaxed tracking-[0.08em] mb-8 font-light">{desc}</p>

      <div className="text-[10px] font-bold tracking-[0.3em] text-brand/40 inline-flex items-center gap-2 group-hover:gap-4 group-hover:text-brand transition-all uppercase">
        EXPLORE <ArrowRight size={10} />
      </div>
    </Link>
  )
}

