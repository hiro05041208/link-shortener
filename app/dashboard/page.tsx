import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { formatNumber } from '@/lib/utils'
import { BarChart3, Link2, MousePointerClick, TrendingUp } from 'lucide-react'
import { StatsCard } from '@/components/analytics/stats-card'
import { RecentLinks } from '@/components/links/recent-links'

export default async function DashboardPage() {
  const { userId } = await auth()

  const [totalLinks, totalClicks, recentLinks] = await Promise.all([
    prisma.link.count({ where: { userId: userId! } }),
    prisma.click.count({
      where: { link: { userId: userId! } },
    }),
    prisma.link.findMany({
      where: { userId: userId! },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { _count: { select: { clicks: true } } },
    }),
  ])

  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)

  const todayClicks = await prisma.click.count({
    where: {
      link: { userId: userId! },
      createdAt: { gte: todayStart },
    },
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">ダッシュボード</h1>
        <p className="text-muted-foreground mt-1">リンクのパフォーマンスを確認しましょう</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="総リンク数"
          value={formatNumber(totalLinks)}
          icon={Link2}
          description="作成済みリンク"
        />
        <StatsCard
          title="総クリック数"
          value={formatNumber(totalClicks)}
          icon={MousePointerClick}
          description="全期間の合計"
        />
        <StatsCard
          title="本日のクリック"
          value={formatNumber(todayClicks)}
          icon={TrendingUp}
          description="今日のアクセス"
        />
        <StatsCard
          title="平均クリック"
          value={totalLinks > 0 ? formatNumber(Math.round(totalClicks / totalLinks)) : '0'}
          icon={BarChart3}
          description="1リンクあたり"
        />
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">最近のリンク</h2>
        <RecentLinks links={recentLinks} />
      </div>
    </div>
  )
}
