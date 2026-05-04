'use server'

import { supabase } from '@/lib/supabase'

export async function submitApplication(formData: FormData) {
  const name = formData.get('name') as string
  const furigana = formData.get('furigana') as string
  // emailは空文字("")になる可能性があるため、存在しない場合は null または "未入力" として扱う
  const email = (formData.get('email') as string) || null 
  const role = formData.get('role') as string
  const bio = formData.get('bio') as string
  const slug = formData.get('slug') as string
  const termsAccepted = formData.get('terms') === 'on'

  if (!termsAccepted) {
    return { success: false, error: '利用規約への同意が必要です。' }
  }

  // Parse SNS links
  const snsEntries = []
  for (let i = 0; i < 5; i++) {
    const platform = formData.get(`sns_platform_${i}`) as string
    const url = formData.get(`sns_url_${i}`) as string
    if (platform && url) {
      snsEntries.push({ platform, url })
    }
  }
  
  const { error } = await supabase.from('member_applications').insert({
    name,
    furigana,
    email, // ここで null を許可するように DB 側の制約（Nullable）も確認してください
    role,
    bio,
    slug,
    sns_links: snsEntries,
    status: 'pending'
  })

  if (error) {
    console.error('Submission error:', error)
    return { success: false, error: '申請の送信に失敗しました。' }
  }

  // Discord 通知
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL
  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          embeds: [{
            title: '【新規メンバー申請】',
            color: 0x3498db,
            fields: [
              { name: 'お名前', value: `${name} (${furigana})`, inline: true },
              // メールが空の場合の表示を「未入力」にする
              { name: 'メール', value: email || '未入力', inline: true },
              { name: 'ロール', value: role || '未設定' },
              { name: '希望URL', value: slug ? `/members/${slug}` : 'なし' },
            ],
            timestamp: new Date().toISOString()
          }]
        })
      })
    } catch (e) {
      console.error('Discord notification failed:', e)
    }
  }

  return { success: true }
}
