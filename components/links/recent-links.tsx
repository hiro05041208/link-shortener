import Link from 'next/link'
import { BarChart3, MousePointerClick } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatNumber } from '@/lib/utils'

type LinkWithCount = {
  id: string
  slug: string
  url: string
  title: string | null
  _count: { clicks: number }
}

export function RecentLinks({ links }: { links: LinkWithCount[] }) {
  if (links.length === 0) {
    return (
      <div className="bg-card border border-border rounded-xl p-8 text-center">
        <p className="text-muted-foreground text-sm">まだリンクがありません</p>
        <Link href="/dashboard/links/new">
          <Button size="sm" className="mt-4">最初のリンクを作成</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-card border border-border rounded-xl divide-y divide-border">
      {links.map((link) => (
        <div key={link.id} className="flex items-center justify-between px-4 py-3 hover:bg-muted/20 transition-colors">
          <div className="flex flex-col min-w-0">
            {link.title && <span className="text-sm font-medium truncate">{link.title}</span>}
            <span className="text-sm text-primary font-mono">/{link.slug}</span>
            <span className="text-xs text-muted-foreground truncate max-w-xs hidden sm:block">{link.url}</span>
          </div>
          <div className="flex items-center gap-3 ml-4 shrink-0">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MousePointerClick className="h-3.5 w-3.5" />
              <Badge variant="secondary">{formatNumber(link._count.clicks)}</Badge>
            </div>
            <Button variant="ghost" size="icon" asChild>
              <Link href={`/dashboard/analytics/${link.id}`} title="解析を見る">
                <BarChart3 className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      ))}
      <div className="px-4 py-3">
        <Link href="/dashboard/links" className="text-sm text-primary hover:underline">
          すべてのリンクを見る →
        </Link>
      </div>
    </div>
  )
}
