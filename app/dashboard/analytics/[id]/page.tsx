import { auth } from '@clerk/nextjs/server'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { formatNumber, getBaseUrl } from '@/lib/utils'
import { ClickChart } from '@/components/analytics/click-chart'
import { StatsCard } from '@/components/analytics/stats-card'
import { MousePointerClick, Globe, Monitor, Calendar } from 'lucide-react'
import { QrCodeDisplay } from '@/components/links/qr-code-display'

type Props = { params: Promise<{ id: string }> }

export default async function AnalyticsPage({ params }: Props) {
  const { id } = await params
  const { userId } = await auth()

  const link = await prisma.link.findUnique({
    where: { id, userId: userId! },
    include: {
      clicks: {
        orderBy: { createdAt: 'desc' },
        take: 1000,
      },
      _count: { select: { clicks: true } },
    },
  })

  if (!link) notFound()

  const clicksByDay = groupClicksByDay(link.clicks)
  const deviceStats = groupBy(link.clicks, 'device')
  const browserStats = groupBy(link.clicks, 'browser')
  const shortUrl = `${getBaseUrl()}/${link.slug}`

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold truncate">{link.title ?? link.slug}</h1>
        <p className="text-muted-foreground mt-1 text-sm">{link.url}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="総クリック数" value={formatNumber(link._count.clicks)} icon={MousePointerClick} description="全期間" />
        <StatsCard title="今日" value={formatNumber(todayCount(link.clicks))} icon={Calendar} description="本日のクリック" />
        <StatsCard title="デバイス種別" value={Object.keys(deviceStats).length.toString()} icon={Monitor} description="デバイスタイプ数" />
        <StatsCard title="国・地域" value={countryCount(link.clicks).toString()} icon={Globe} description="アクセス元地域数" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6">
          <h2 className="font-semibold mb-4">クリック推移（直近30日）</h2>
          <ClickChart data={clicksByDay} />
        </div>
        <div className="bg-card border border-border rounded-xl p-6 flex flex-col items-center gap-4">
          <h2 className="font-semibold self-start">QRコード</h2>
          <QrCodeDisplay url={shortUrl} slug={link.slug} linkId={link.id} />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="font-semibold mb-4">デバイス別</h2>
          <ul className="space-y-2">
            {Object.entries(deviceStats).map(([device, count]) => (
              <li key={device} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{device || '不明'}</span>
                <span className="font-medium">{formatNumber(count)}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="font-semibold mb-4">ブラウザ別</h2>
          <ul className="space-y-2">
            {Object.entries(browserStats).map(([browser, count]) => (
              <li key={browser} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{browser || '不明'}</span>
                <span className="font-medium">{formatNumber(count)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

function groupClicksByDay(clicks: { createdAt: Date }[]) {
  const days: Record<string, number> = {}
  const now = new Date()
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    days[d.toISOString().slice(0, 10)] = 0
  }
  for (const click of clicks) {
    const key = click.createdAt.toISOString().slice(0, 10)
    if (key in days) days[key]++
  }
  return Object.entries(days).map(([date, count]) => ({ date, count }))
}

function groupBy(clicks: { [key: string]: unknown }[], key: string): Record<string, number> {
  return clicks.reduce<Record<string, number>>((acc, click) => {
    const val = (click[key] as string) ?? '不明'
    acc[val] = (acc[val] ?? 0) + 1
    return acc
  }, {})
}

function todayCount(clicks: { createdAt: Date }[]): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return clicks.filter((c) => c.createdAt >= today).length
}

function countryCount(clicks: { country: string | null }[]): number {
  return new Set(clicks.map((c) => c.country).filter(Boolean)).size
}
