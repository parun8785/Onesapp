import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Ones - Bar Management System',
  description: 'バー「Ones」の管理システム',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className="bg-background text-primary min-h-screen">
        {children}
      </body>
    </html>
  )
}

