import { auth } from '@clerk/nextjs/server'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { formatNumber } from '@/lib/utils'
import { BarChart3, MousePointerClick } from 'lucide-react'

export default async function AnalyticsOverviewPage() {
  const { userId } = await auth()

  const links = await prisma.link.findMany({
    where: { userId: userId! },
    orderBy: { clicks: { _count: 'desc' } },
    include: { _count: { select: { clicks: true } } },
    take: 20,
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">アクセス解析</h1>
        <p className="text-muted-foreground mt-1">リンクごとのクリック数ランキング</p>
      </div>

      {links.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-12 text-center">
          <p className="text-muted-foreground">まだデータがありません</p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">リンク</th>
                <th className="text-right px-4 py-3 text-sm font-medium text-muted-foreground">クリック数</th>
                <th className="text-right px-4 py-3 text-sm font-medium text-muted-foreground">詳細</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {links.map((link) => (
                <tr key={link.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-0.5">
                      {link.title && <span className="text-sm font-medium">{link.title}</span>}
                      <span className="text-sm text-primary font-mono">/{link.slug}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <MousePointerClick className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="font-medium">{formatNumber(link._count.clicks)}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/dashboard/analytics/${link.id}`}
                      className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
                    >
                      <BarChart3 className="h-3.5 w-3.5" />
                      詳細
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
