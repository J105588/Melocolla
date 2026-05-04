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
  
  // Handle icon upload
  const icon = formData.get('icon') as File
  if (!icon || icon.size === 0) {
    return { success: false, error: 'アイコン画像のアップロードが必要です。' }
  }

  let avatarUrl = null
  try {
    // Validate File Type (MIME Type)
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif', 'image/heic', 'image/heif']
    if (!allowedTypes.includes(icon.type)) {
      return { success: false, error: '許可されていないファイル形式です（JPG, PNG, WebP, AVIF, HEICのみ）。' }
    }

    // Validate File Size (Max 2MB)
    const maxSize = 2 * 1024 * 1024
    if (icon.size > maxSize) {
      return { success: false, error: 'ファイルサイズが大きすぎます（2MBまで）。' }
    }

    const fileExt = icon.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
    
    // Server Action環境（Node.js）では ArrayBuffer への変換が推奨される
    const buffer = await icon.arrayBuffer()
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('melocolla-assets')
      .upload(fileName, buffer, {
        contentType: icon.type,
        upsert: false
      })

    if (uploadError) {
      console.error('Supabase Storage Error Details:', uploadError)
      // セキュリティのためユーザーへのメッセージは簡潔にしつつ、管理者はログで詳細を確認可能にする
      throw new Error(`画像の保存に失敗しました (${uploadError.message})`)
    }

    const { data: { publicUrl } } = supabase.storage
      .from('melocolla-assets')
      .getPublicUrl(fileName)
    avatarUrl = publicUrl
  } catch (e: any) {
    console.error('Application Submission - Icon Process Failed:', e)
    return { success: false, error: e.message || 'アイコンの処理中にエラーが発生しました。' }
  }

  const { error } = await supabase.from('member_applications').insert({
    name,
    furigana,
    avatar_url: avatarUrl,
    email,
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
  const webhookUrl = process.env.APPLY_DISCORD_WEBHOOK_URL
  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          embeds: [{
            title: '【新規メンバー申請】',
            url: 'https://melocolla.vercel.app/admin',
            thumbnail: avatarUrl ? { url: avatarUrl } : undefined,
            color: 0x3498db,
            fields: [
              { name: 'お名前', value: `${name} (${furigana})`, inline: true },
              // メールが空の場合の表示を「未入力」にする
              { name: 'メール', value: email || '未入力', inline: true },
              { name: 'ロール', value: role || '未設定' },
              { name: '希望URL', value: slug ? `/members/${slug}` : 'なし' },
              { name: '管理画面', value: 'https://melocolla.vercel.app/admin' }
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
