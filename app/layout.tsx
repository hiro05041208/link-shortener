import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { ThemeProvider } from '@/components/layout/theme-provider'
import { isClerkConfigured } from '@/lib/clerk-config'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'LinkShort - URLを短縮してシェア',
  description: '無料のリンク短縮サービス。クリック数の追跡、QRコード生成、アクセス解析機能付き。',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const inner = (
    <html lang="ja" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )

  if (!isClerkConfigured()) {
    return inner
  }

  const { ClerkProvider } = await import('@clerk/nextjs')
  return <ClerkProvider>{inner}</ClerkProvider>
}
