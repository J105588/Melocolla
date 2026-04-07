import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Melocollaの利用規約、著作権、プライバシーポリシーについて。',
}

export default function TermsPage() {
  return (
    <div className="container mx-auto px-6 py-24 max-w-3xl">
      <div className="text-center mb-20">
        <h1 className="font-serif text-4xl md:text-5xl tracking-[0.2em] text-brand mb-6">
          Terms<span className="text-accent-gold">.</span>
        </h1>
        <div className="w-12 h-px bg-gradient-to-r from-transparent via-accent-gold to-transparent mx-auto" />
      </div>

      <div className="flex flex-col gap-16">
        {/* 著作権 */}
        <section className="flex flex-col gap-6">
          <h2 className="font-serif text-xl tracking-[0.15em] text-brand flex items-center gap-4">
            <span className="w-6 h-px bg-accent-gold/30" />
            著作権について
          </h2>
          <div className="text-sm text-brand/60 leading-loose tracking-wide pl-10">
            <p>
              当サイト「Melocolla」（以下「当サイト」）に掲載されている全てのコンテンツ
              （テキスト、画像、音源、映像、ロゴ、デザイン等）の著作権は、
              Melocolla および各コンテンツの制作者に帰属します。
            </p>
            <p className="mt-4">
              これらのコンテンツの無断転載、複製、再配布、販売等は固くお断りいたします。
              引用の範囲を超える利用をご希望の場合は、お問い合わせください。
            </p>
          </div>
        </section>

        {/* 免責事項 */}
        <section className="flex flex-col gap-6">
          <h2 className="font-serif text-xl tracking-[0.15em] text-brand flex items-center gap-4">
            <span className="w-6 h-px bg-accent-gold/30" />
            免責事項
          </h2>
          <div className="text-sm text-brand/60 leading-loose tracking-wide pl-10">
            <p>
              当サイトに掲載される情報の正確性には万全を期しておりますが、
              その内容を保証するものではありません。
              当サイトの利用により生じた損害等について、
              Melocolla は一切の責任を負いません。
            </p>
          </div>
        </section>

        {/* リンク */}
        <section className="flex flex-col gap-6">
          <h2 className="font-serif text-xl tracking-[0.15em] text-brand flex items-center gap-4">
            <span className="w-6 h-px bg-accent-gold/30" />
            リンクについて
          </h2>
          <div className="text-sm text-brand/60 leading-loose tracking-wide pl-10">
            <p>
              当サイトへのリンクは、基本的に自由です。
              ただし、フレーム内表示等、当サイトのコンテンツであるかのような
              表示は禁止いたします。
            </p>
            <p className="mt-4">
              当サイトからのリンク先の外部サイトについて、
              Melocolla はその内容に関して一切の責任を負いません。
            </p>
          </div>
        </section>

        {/* プライバシー */}
        <section className="flex flex-col gap-6">
          <h2 className="font-serif text-xl tracking-[0.15em] text-brand flex items-center gap-4">
            <span className="w-6 h-px bg-accent-gold/30" />
            プライバシーポリシー
          </h2>
          <div className="text-sm text-brand/60 leading-loose tracking-wide pl-10">
            <p>
              当サイトでは、アクセス解析のためにCookieを使用する場合があります。
              Cookieにより収集した情報は、サイト改善の目的にのみ使用し、
              個人を特定する情報として利用することはありません。
            </p>
          </div>
        </section>

        {/* 規約変更 */}
        <section className="flex flex-col gap-6">
          <h2 className="font-serif text-xl tracking-[0.15em] text-brand flex items-center gap-4">
            <span className="w-6 h-px bg-accent-gold/30" />
            規約の変更
          </h2>
          <div className="text-sm text-brand/60 leading-loose tracking-wide pl-10">
            <p>
              当サイトは、必要に応じて本規約を予告なく変更することがあります。
              変更後の規約は、当サイトに掲載した時点で効力を生じるものとします。
            </p>
          </div>
        </section>
      </div>

      {/* Bottom */}
      <div className="mt-24 pt-12 border-t border-brand/5 text-center">
        <p className="text-[10px] text-brand/30 tracking-[0.3em]">
          最終更新日: 2026年4月
        </p>
      </div>
    </div>
  )
}
