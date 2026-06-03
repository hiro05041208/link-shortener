import Link from 'next/link'
import { ArrowRight, BarChart3, Link2, QrCode, Shield, Zap } from 'lucide-react'
import { auth } from '@clerk/nextjs/server'
import { Button } from '@/components/ui/button'

export default async function LandingPage() {
  const { userId } = await auth()

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <Link2 className="h-5 w-5 text-primary" />
            <span>LinkShort</span>
          </Link>
          <nav className="flex items-center gap-4">
            {userId ? (
              <Link href="/dashboard">
                <Button>ダッシュボード</Button>
              </Link>
            ) : (
              <>
                <Link href="/sign-in">
                  <Button variant="ghost">ログイン</Button>
                </Link>
                <Link href="/sign-up">
                  <Button>無料で始める</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="py-24 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <h1 className="text-5xl font-bold tracking-tight mb-6 leading-tight">
              URLを短縮して、
              <br />
              <span className="text-primary">シェアを最大化</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              長いURLをスマートに短縮。クリック数の追跡、QRコード生成、詳細なアクセス解析まで、すべて無料でご利用いただけます。
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/sign-up">
                <Button size="lg" className="gap-2">
                  今すぐ始める <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/sign-in">
                <Button size="lg" variant="outline">
                  ログイン
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 px-4 bg-muted/30">
          <div className="container mx-auto max-w-5xl">
            <h2 className="text-3xl font-bold text-center mb-12">主な機能</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="bg-card border border-border rounded-xl p-6 flex flex-col gap-3"
                >
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 px-4">
          <div className="container mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold mb-4">今すぐ無料で始めよう</h2>
            <p className="text-muted-foreground mb-8">クレジットカード不要。登録から1分以内にリンク短縮を開始できます。</p>
            <Link href="/sign-up">
              <Button size="lg" className="gap-2">
                無料アカウントを作成 <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-8 px-4">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Link2 className="h-4 w-4" />
            <span>LinkShort</span>
          </div>
          <p>© {new Date().getFullYear()} LinkShort. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

const features = [
  {
    icon: Link2,
    title: 'リンク短縮',
    description: '長いURLをわずか数秒でコンパクトなリンクに変換。カスタムスラッグで覚えやすいURLを作成できます。',
  },
  {
    icon: BarChart3,
    title: 'アクセス解析',
    description: 'クリック数、デバイス、ブラウザ、地域など詳細な統計データをリアルタイムで確認できます。',
  },
  {
    icon: QrCode,
    title: 'QRコード生成',
    description: '各リンクのQRコードを自動生成。印刷物やSNSへの掲載に最適なフォーマットでダウンロード可能。',
  },
  {
    icon: Shield,
    title: 'セキュアな認証',
    description: 'Clerkによる安全な認証システムを採用。あなたのリンクは常にあなただけが管理できます。',
  },
  {
    icon: Zap,
    title: '高速リダイレクト',
    description: 'エッジネットワークを活用した超高速リダイレクト。ユーザーのストレスになる遅延ゼロを実現。',
  },
  {
    icon: BarChart3,
    title: 'リンク管理',
    description: 'すべてのリンクをダッシュボードで一元管理。編集、削除、有効/無効の切り替えが簡単に行えます。',
  },
]
