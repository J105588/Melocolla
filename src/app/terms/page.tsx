import { Metadata } from 'next'
import ScrollReveal from '@/components/animation/ScrollReveal'
import { getPageVisibility, isAdmin } from '@/lib/page-visibility'
import PrivatePageMessage from '@/components/layout/PrivatePageMessage'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Melocollaサークル規約およびサイト利用規定。',
}

export default async function TermsPage() {
  const visibility = await getPageVisibility('terms')
  const admin = await isAdmin()
  const isPrivate = visibility && !visibility.is_public && !admin

  return (
    <div className="container mx-auto px-6 py-24 max-w-3xl">
      <ScrollReveal direction="up" distance={40}>
        <div className="text-center mb-20">
          <h1 className="font-serif text-4xl md:text-5xl tracking-[0.2em] text-brand mb-6">
            Terms<span className="text-accent-gold">.</span>
          </h1>
          <div className="w-12 h-px bg-gradient-to-r from-transparent via-accent-gold to-transparent mx-auto" />
        </div>
      </ScrollReveal>

      <div className="flex flex-col gap-16">
        {isPrivate ? (
          <PrivatePageMessage />
        ) : (
          <ScrollReveal direction="up" distance={30} stagger={0.15}>
            {/* 第1条（総則） */}
            <section className="flex flex-col gap-6">
              <h2 className="font-serif text-xl tracking-[0.15em] text-brand flex items-center gap-4">
                <span className="w-6 h-px bg-accent-gold/30" />
                第1条（総則）
              </h2>
              <div className="text-sm text-brand/60 leading-loose tracking-wide pl-10">
                <p>1. 当サークルは、音楽制作を中心とした創作活動、およびそれに付随するイベント参加・作品頒布を行う組織です。</p>
                <p className="mt-2">2. 本規約は、当サークルの活動、制作物の利用、および当サイトを利用する全ての者（以下「利用者」）に適用されます。</p>
              </div>
            </section>

            {/* 第2条（知的財産権の帰属と保護） */}
            <section className="flex flex-col gap-6">
              <h2 className="font-serif text-xl tracking-[0.15em] text-brand flex items-center gap-4">
                <span className="w-6 h-px bg-accent-gold/30" />
                第2条（知的財産権の帰属と保護）
              </h2>
              <div className="text-sm text-brand/60 leading-loose tracking-wide pl-10">
                <p><strong>1. 権利の帰属</strong>：当サークルが発行する作品および当サイトに掲載されている全てのコンテンツ（音源、歌詞、画像、映像、テキスト、デザイン、ロゴ等）の著作権は、当サークルまたは各コンテンツの制作者に帰属します。</p>
                <p className="mt-4"><strong>2. 禁止事項</strong>：権利者の事前の承諾なく、以下の行為を行うことを固く禁じます。</p>
                <ul className="list-disc pl-5 mt-2 flex flex-col gap-1">
                  <li>コンテンツの無断転載、複製、改変、再配布、および販売。</li>
                  <li>法律で認められる「引用」の範囲を超えた利用。</li>
                  <li>自作発言または誤解を招く形での公開。</li>
                </ul>
                <p className="mt-4"><strong>3. 利用許諾</strong>：引用の範囲を超える利用や、二次利用を希望する場合は、必ず当サークルへ問い合わせ、書面または電磁的方法による承諾を得るものとします。</p>
              </div>
            </section>

            {/* 第3条（免責事項） */}
            <section className="flex flex-col gap-6">
              <h2 className="font-serif text-xl tracking-[0.15em] text-brand flex items-center gap-4">
                <span className="w-6 h-px bg-accent-gold/30" />
                第3条（免責事項）
              </h2>
              <div className="text-sm text-brand/60 leading-loose tracking-wide pl-10">
                <p><strong>1. 情報の正確性</strong>：当サークルは、当サイトおよび活動を通じて提供する情報の正確性に万全を期しておりますが、その complete 性や有用性を保証するものではありません。</p>
                <p className="mt-4"><strong>2. 損害賠償の免責</strong>：当サイトの利用、または当サークルの活動への参加により生じた直接的・間接的な損害（データの損失、PCの故障、人間関係のトラブル等）について、当サークルは一切の責任を負いません。</p>
                <p className="mt-4"><strong>3. 外部リンク</strong>：当サイトからリンクされた外部サイトの内容および、それらを利用したことにより生じた損害について、当サークルは関与せず、一切の責任を負いません。</p>
              </div>
            </section>

            {/* 第4条（活動および運営） */}
            <section className="flex flex-col gap-6">
              <h2 className="font-serif text-xl tracking-[0.15em] text-brand flex items-center gap-4">
                <span className="w-6 h-px bg-accent-gold/30" />
                第4条（活動および運営）
              </h2>
              <div className="text-sm text-brand/60 leading-loose tracking-wide pl-10">
                <p><strong>1. 運営体制</strong>：当サークルは管理メンバーによって運営され、サークルの方針決定および公式な意思表明を行います。</p>
                <p className="mt-4"><strong>2. 遵守事項</strong>：サークルメンバーおよび関係者は、活動にあたり公序良俗を遵守し、当サークルの名誉を毀損する行為を行わないものとします。</p>
                <p className="mt-4"><strong>3. イベント・頒布</strong>：イベント参加や作品の頒布に関する細則は、その都度当サイトまたは公式SNS等で告知するものとします。</p>
              </div>
            </section>

            {/* 第5条（リンクおよび紹介） */}
            <section className="flex flex-col gap-6">
              <h2 className="font-serif text-xl tracking-[0.15em] text-brand flex items-center gap-4">
                <span className="w-6 h-px bg-accent-gold/30" />
                第5条（リンクおよび紹介）
              </h2>
              <div className="text-sm text-brand/60 leading-loose tracking-wide pl-10">
                <p>1. 当サイトへのリンクは、原則として自由です。</p>
                <p className="mt-2">2. ただし、インラインフレーム等の技術を用いて、当サイトのコンテンツが当サークル以外の著作物であるかのように誤認させる表示形式は禁止いたします。</p>
              </div>
            </section>

            {/* 第6条（プライバシーポリシー） */}
            <section className="flex flex-col gap-6">
              <h2 className="font-serif text-xl tracking-[0.15em] text-brand flex items-center gap-4">
                <span className="w-6 h-px bg-accent-gold/30" />
                第6条（プライバシーポリシー）
              </h2>
              <div className="text-sm text-brand/60 leading-loose tracking-wide pl-10">
                <p><strong>1. Cookieの利用</strong>：当サイトでは、アクセス解析および利便性向上のためCookieを使用する場合があります。</p>
                <p className="mt-4"><strong>2. データの利用</strong>：収集された情報は、サイトの改善および活動の統計分析にのみ使用し、個人を特定する情報の取得や第三者への提供は行いません。</p>
              </div>
            </section>

            {/* 第7条（規約の変更） */}
            <section className="flex flex-col gap-6">
              <h2 className="font-serif text-xl tracking-[0.15em] text-brand flex items-center gap-4">
                <span className="w-6 h-px bg-accent-gold/30" />
                第7条（規約の変更）
              </h2>
              <div className="text-sm text-brand/60 leading-loose tracking-wide pl-10">
                <p>1. 当サークルは、社会情勢の適応や運営上の必要に応じて、本規約を予告なく変更することがあります。</p>
                <p className="mt-2">2. 変更後の規約は、当サイトに掲載された時点より効力を生じるものとし、利用者が継続して当サイトまたは当サークルのサービスを利用した場合、変更に同意したものとみなします。</p>
              </div>
            </section>

            {/* お問い合わせ */}
            <section className="flex flex-col gap-6 mt-8 p-8 bg-brand/[0.02] border border-brand/5 rounded-3xl">
              <h2 className="font-serif text-lg tracking-[0.2em] text-brand uppercase">
                お問い合わせ窓口
              </h2>
              <div className="text-sm text-brand/60 leading-loose tracking-wide">
                <p>当サークルへのご質問、作品の利用申請等は、当サイト内のお問い合わせフォームよりご連絡ください。</p>
              </div>
            </section>
          </ScrollReveal>
        )}
      </div>

      {/* Bottom */}
      <div className="mt-24 pt-12 border-t border-brand/5 text-center">
        <p className="text-[10px] text-brand/30 tracking-[0.3em] uppercase">
          附則: 本規約は 2026年5月4日より施行します。
        </p>
      </div>
    </div>
  )
}
