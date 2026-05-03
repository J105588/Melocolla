'use server'

export async function sendToDiscord(formData: FormData) {
  const name = formData.get('name') as string
  const furigana = formData.get('furigana') as string
  const email = formData.get('email') as string
  const subject = formData.get('subject') as string
  const message = formData.get('message') as string

  const webhookUrl = process.env.DISCORD_WEBHOOK_URL

  if (!webhookUrl) {
    console.error('DISCORD_WEBHOOK_URL is not set')
    return { success: false, error: 'System configuration error.' }
  }

  const payload = {
    embeds: [
      {
        title: `【お問い合わせ】${subject || '件名なし'}`,
        color: 0x603E44, // Brand color
        fields: [
          { name: 'お名前', value: `${name} (${furigana})`, inline: true },
          { name: 'メールアドレス', value: email || '未設定', inline: true },
          { name: 'メッセージ', value: message || '空欄' },
        ],
        timestamp: new Date().toISOString(),
        footer: {
          text: 'Melocolla System',
        },
      },
    ],
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error('Discord response was not ok')
    }

    return { success: true }
  } catch (error) {
    console.error('Error sending to Discord:', error)
    return { success: false, error: 'Failed to send message. Please try again later.' }
  }
}
