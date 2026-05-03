import { Metadata } from 'next'
import ScrollReveal from '@/components/animation/ScrollReveal'
import ContactForm from '@/app/contact/ContactForm'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Melocollaサークルへのお問い合わせ窓口。',
}

export default function ContactPage() {
  return (
    <div className="container mx-auto px-6 py-24 max-w-2xl">
      <ScrollReveal direction="up" distance={40}>
        <div className="text-center mb-16">
          <h1 className="font-serif text-4xl md:text-5xl tracking-[0.2em] text-brand mb-6 uppercase">
            Contact<span className="text-accent-gold">.</span>
          </h1>
          <div className="w-12 h-px bg-gradient-to-r from-transparent via-accent-gold to-transparent mx-auto mb-8" />
          <p className="text-sm text-brand/50 tracking-widest leading-relaxed">
            サークルへのご質問、作品の利用申請、コラボレーション等の<br className="hidden sm:block" />
            お問い合わせはこちらのフォームより受け付けております。
          </p>
        </div>
      </ScrollReveal>

      <ScrollReveal direction="up" distance={30} delay={0.2}>
        <ContactForm />
      </ScrollReveal>

      <div className="mt-16 text-center">
        <p className="text-[9px] text-brand/30 tracking-[0.4em] uppercase font-bold">
          Melocolla Relations System
        </p>
      </div>
    </div>
  )
}
