import { Metadata } from 'next'
import ScrollReveal from '@/components/animation/ScrollReveal'
import ApplyForm from './ApplyForm'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Apply to Melocolla',
  description: 'Melocollaへのメンバー登録申請。',
}

export default function ApplyPage() {
  return (
    <div className="container mx-auto px-6 py-24 max-w-3xl">
      <ScrollReveal direction="up" distance={40}>
        <div className="mb-12">
          <Link href="/members" className="inline-flex items-center gap-2 text-[10px] tracking-[0.2em] text-brand/40 hover:text-brand transition-colors uppercase mb-8 group">
            <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
            Back to Members
          </Link>
          <h1 className="font-serif text-4xl md:text-5xl tracking-[0.2em] text-brand mb-6 uppercase">
            Apply<span className="text-accent-gold">.</span>
          </h1>
          <div className="w-12 h-px bg-gradient-to-r from-transparent via-accent-gold to-transparent mb-8" />
          <p className="text-sm text-brand/50 tracking-widest leading-relaxed max-w-xl">
            本フォームでは公式サイトに掲載するメンバー情報の収集をしています。<br />
            以下のフォームに必要事項を記入し、登録を行ってください。
          </p>
        </div>
      </ScrollReveal>

      <ScrollReveal direction="up" distance={30} delay={0.2}>
        <ApplyForm />
      </ScrollReveal>
    </div>
  )
}
