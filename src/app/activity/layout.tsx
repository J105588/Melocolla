import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Activity',
  description: 'Melocollaの活動報告一覧。',
}

export default function ActivityLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
