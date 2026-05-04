'use client'

import { useState } from 'react'
import { submitApplication } from './action'
import { Send, CheckCircle2, AlertCircle, Loader2, Plus, X } from 'lucide-react'
import Link from 'next/link'

export default function ApplyForm() {
  const [pending, setPending] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)
  const [snsLinks, setSnsLinks] = useState([{ platform: '', url: '' }])

  const addSns = () => {
    if (snsLinks.length < 5) setSnsLinks([...snsLinks, { platform: '', url: '' }])
  }

  const removeSns = (index: number) => {
    setSnsLinks(snsLinks.filter((_, i) => i !== index))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPending(true)
    setResult(null)

    const formData = new FormData(e.currentTarget)
    const response = await submitApplication(formData)

    if (response.success) {
      setResult({ success: true, message: '申請を受け付けました。管理者が内容を確認後、登録が完了しましたらご連絡いたします。' })
        ; (e.target as HTMLFormElement).reset()
      setSnsLinks([{ platform: '', url: '' }])
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      setResult({ success: false, message: response.error || 'エラーが発生しました。' })
    }
    setPending(false)
  }

  return (
    <div className="bg-white/40 backdrop-blur-xl border border-brand/5 p-8 md:p-12 rounded-[2.5rem] shadow-xl relative overflow-hidden">
      {result && (
        <div className={`mb-10 p-6 rounded-2xl flex items-start gap-4 animate-in fade-in slide-in-from-top-2 duration-500 ${result.success ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
          }`}>
          {result.success ? <CheckCircle2 size={20} className="mt-1 flex-shrink-0" /> : <AlertCircle size={20} className="mt-1 flex-shrink-0" />}
          <p className="text-sm font-medium leading-relaxed">{result.message}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-10">
        {/* 基本情報 */}
        <div className="space-y-8">
          <h3 className="text-[10px] font-bold tracking-[0.4em] text-accent-gold uppercase border-b border-brand/5 pb-4">Basic Information / 基本情報</h3>

          <div className="grid sm:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-bold tracking-widest text-brand/40 uppercase px-1">Name / 活動名 <span className="text-accent-gold">*</span></label>
              <input name="name" type="text" placeholder="例: Melocolla Taro" className="w-full px-6 py-4 rounded-2xl bg-brand/5 border border-transparent focus:border-accent-gold outline-none transition-all text-sm" required />
              <p className="text-[9px] text-brand/30 px-1 leading-relaxed">サイト上に表示されるメインの名前です。</p>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-bold tracking-widest text-brand/40 uppercase px-1">Furigana / フリガナ <span className="text-accent-gold">*</span></label>
              <input name="furigana" type="text" placeholder="例: メロコラ タロウ" className="w-full px-6 py-4 rounded-2xl bg-brand/5 border border-transparent focus:border-accent-gold outline-none transition-all text-sm" required />
              <p className="text-[9px] text-brand/30 px-1 leading-relaxed">ソート（順序）の基準となります。カタカナで入力してください。</p>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-bold tracking-widest text-brand/40 uppercase px-1">Email / 連絡先メールアドレス <span className="text-accent-gold">*</span></label>
            <input name="email" type="email" placeholder="your@email.com" className="w-full px-6 py-4 rounded-2xl bg-brand/5 border border-transparent focus:border-accent-gold outline-none transition-all text-sm" required />
            <p className="text-[9px] text-brand/30 px-1 leading-relaxed">管理者からの連絡に使用します。公開はされません。</p>
          </div>
        </div>

        {/* プロフィール詳細 */}
        <div className="space-y-8">
          <h3 className="text-[10px] font-bold tracking-[0.4em] text-accent-gold uppercase border-b border-brand/5 pb-4">Profile Details / プロフィール</h3>

          <div className="space-y-3">
            <label className="text-[10px] font-bold tracking-widest text-brand/40 uppercase px-1">Role / ロール・担当 <span className="text-accent-gold">*</span></label>
            <input name="role" type="text" placeholder="例: ボカロP, 歌い手, 絵師" className="w-full px-6 py-4 rounded-2xl bg-brand/5 border border-transparent focus:border-accent-gold outline-none transition-all text-sm" required />
            <p className="text-[9px] text-brand/30 px-1 leading-relaxed">あなたの主な活動内容を簡潔に記載してください。</p>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-bold tracking-widest text-brand/40 uppercase px-1">Bio / 自己紹介</label>
            <textarea name="bio" placeholder="あなたの活動内容や実績、メッセージなど。" rows={5} className="w-full px-6 py-5 rounded-2xl bg-brand/5 border border-transparent focus:border-accent-gold outline-none transition-all text-sm resize-none" />
            <p className="text-[9px] text-brand/30 px-1 leading-relaxed">個別ページに掲載される紹介文です。100〜300文字程度を推奨します。</p>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-bold tracking-widest text-brand/40 uppercase px-1">Requested URL Slug / 希望URL識別子</label>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-brand/30 font-mono">melocolla.vercel.app/members/</span>
              <input name="slug" type="text" placeholder="example-name" className="flex-1 px-6 py-4 rounded-2xl bg-brand/5 border border-transparent focus:border-accent-gold outline-none transition-all text-sm font-mono" />
            </div>
            <p className="text-[9px] text-brand/30 px-1 leading-relaxed">個別ページのURLに使用されます。半角英数字とハイフンのみ使用可能です。</p>
          </div>
        </div>

        {/* SNSリンク */}
        <div className="space-y-8">
          <div className="flex items-center justify-between border-b border-brand/5 pb-4">
            <h3 className="text-[10px] font-bold tracking-[0.4em] text-accent-gold uppercase">SNS Links / 関連リンク</h3>
            <button type="button" onClick={addSns} disabled={snsLinks.length >= 5} className="text-[10px] text-brand/50 hover:text-brand flex items-center gap-1 transition-colors disabled:opacity-0">
              <Plus size={12} /> ADD LINK
            </button>
          </div>

          <div className="space-y-4">
            {snsLinks.map((link, index) => (
              <div key={index} className="flex gap-4 items-start animate-in fade-in slide-in-from-left-2 duration-300">
                <div className="w-1/3 space-y-2">
                  <input
                    name={`sns_platform_${index}`}
                    type="text"
                    placeholder="Platform (X, YouTube...)"
                    className="w-full px-4 py-3 rounded-xl bg-brand/5 border border-transparent focus:border-accent-gold outline-none text-xs"
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <input
                    name={`sns_url_${index}`}
                    type="url"
                    placeholder="https://..."
                    className="w-full px-4 py-3 rounded-xl bg-brand/5 border border-transparent focus:border-accent-gold outline-none text-xs"
                  />
                </div>
                {index > 0 && (
                  <button type="button" onClick={() => removeSns(index)} className="mt-3 text-brand/20 hover:text-red-400 transition-colors">
                    <X size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 同意事項 */}
        <div className="mt-6 pt-10 border-t border-brand/5 space-y-6">
          <label className="flex items-start gap-4 cursor-pointer group">
            <div className="relative mt-1">
              <input name="terms" type="checkbox" className="peer sr-only" required />
              <div className="w-5 h-5 border border-brand/20 rounded bg-white peer-checked:bg-brand peer-checked:border-brand transition-all" />
              <CheckCircle2 size={12} className="absolute inset-0 m-auto text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-brand/70 leading-relaxed group-hover:text-brand transition-colors">
                <Link href="/terms" target="_blank" className="text-accent-gold hover:underline underline-offset-4">利用規約</Link> に同意します。 <span className="text-accent-gold">*</span>
              </p>
              <p className="text-[9px] text-brand/30 mt-1">申請内容に虚偽がないこと、サークルの名誉を毀損する行為を行わないことを約束します。</p>
            </div>
          </label>

          <button
            type="submit"
            disabled={pending}
            className="w-full py-5 bg-brand text-white rounded-2xl font-bold tracking-[0.3em] text-[11px] hover:bg-brand-muted hover:shadow-[0_15px_35px_rgba(96,62,68,0.2)] transition-all flex items-center justify-center gap-4 group disabled:opacity-50 disabled:hover:scale-100 active:scale-95"
          >
            {pending ? <Loader2 size={16} className="animate-spin" /> : (
              <>
                SUBMIT APPLICATION
                <Send size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
