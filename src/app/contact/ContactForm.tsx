'use client'

import { useState } from 'react'
import { sendToDiscord } from './action'
import { Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'

export default function ContactForm() {
  const [pending, setPending] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPending(true)
    setResult(null)

    const formData = new FormData(e.currentTarget)
    const response = await sendToDiscord(formData)

    if (response.success) {
      setResult({ success: true, message: 'メッセージを送信しました。内容を確認し、順次返信させていただきます。' })
      ;(e.target as HTMLFormElement).reset()
    } else {
      setResult({ success: false, message: response.error || 'エラーが発生しました。時間をおいて再度お試しください。' })
    }
    setPending(false)
  }

  return (
    <div className="bg-white/40 backdrop-blur-xl border border-brand/5 p-8 md:p-12 rounded-[2.5rem] shadow-xl relative overflow-hidden">
      {/* Success/Error Message */}
      {result && (
        <div className={`mb-10 p-6 rounded-2xl flex items-start gap-4 animate-in fade-in slide-in-from-top-2 duration-500 ${
          result.success ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
        }`}>
          {result.success ? <CheckCircle2 size={20} className="mt-1 flex-shrink-0" /> : <AlertCircle size={20} className="mt-1 flex-shrink-0" />}
          <p className="text-sm font-medium leading-relaxed">{result.message}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        <div className="grid sm:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] font-bold tracking-widest text-brand/40 uppercase px-1">Name / 氏名</label>
            <input 
              name="name" 
              type="text" 
              placeholder="山田 太郎" 
              className="w-full px-6 py-4 rounded-2xl bg-brand/5 border border-transparent focus:border-accent-gold outline-none transition-all tracking-wider text-sm" 
              required 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold tracking-widest text-brand/40 uppercase px-1">Furigana / フリガナ</label>
            <input 
              name="furigana" 
              type="text" 
              placeholder="ヤマダ タロウ" 
              className="w-full px-6 py-4 rounded-2xl bg-brand/5 border border-transparent focus:border-accent-gold outline-none transition-all tracking-wider text-sm" 
              required 
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold tracking-widest text-brand/40 uppercase px-1">Email / メールアドレス</label>
          <input 
            name="email" 
            type="email" 
            placeholder="your@email.com" 
            className="w-full px-6 py-4 rounded-2xl bg-brand/5 border border-transparent focus:border-accent-gold outline-none transition-all tracking-wider text-sm" 
            required 
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold tracking-widest text-brand/40 uppercase px-1">Subject / 件名</label>
          <input 
            name="subject" 
            type="text" 
            placeholder="Inquiry Subject" 
            className="w-full px-6 py-4 rounded-2xl bg-brand/5 border border-transparent focus:border-accent-gold outline-none transition-all tracking-wider text-sm" 
            required 
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold tracking-widest text-brand/40 uppercase px-1">Message / 内容</label>
          <textarea 
            name="message" 
            placeholder="Your Message..." 
            rows={6}
            className="w-full px-6 py-5 rounded-2xl bg-brand/5 border border-transparent focus:border-accent-gold outline-none transition-all tracking-wider text-sm resize-none" 
            required 
          />
        </div>

        <button 
          type="submit" 
          disabled={pending}
          className="mt-4 py-5 bg-brand text-white rounded-2xl font-bold tracking-[0.3em] text-[11px] hover:bg-brand-muted hover:shadow-[0_15px_35px_rgba(96,62,68,0.2)] transition-all flex items-center justify-center gap-4 group disabled:opacity-50 disabled:hover:scale-100 active:scale-95"
        >
          {pending ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <>
              SEND MESSAGE
              <Send size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </>
          )}
        </button>
      </form>
    </div>
  )
}
