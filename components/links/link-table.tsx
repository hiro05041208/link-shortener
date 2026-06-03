'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { BarChart3, Copy, ExternalLink, QrCode, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getBaseUrl, formatNumber } from '@/lib/utils'

type LinkWithCount = {
  id: string
  slug: string
  url: string
  title: string | null
  createdAt: Date
  _count: { clicks: number }
}

export function LinkTable({ links }: { links: LinkWithCount[] }) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const baseUrl = getBaseUrl()

  async function handleDelete(id: string) {
    if (!confirm('このリンクを削除しますか？')) return
    setDeletingId(id)
    await fetch(`/api/links/${id}`, { method: 'DELETE' })
    router.refresh()
    setDeletingId(null)
  }

  function handleCopy(slug: string) {
    navigator.clipboard.writeText(`${baseUrl}/${slug}`)
  }

  if (links.length === 0) {
    return (
      <div className="bg-card border border-border rounded-xl p-12 text-center">
        <p className="text-muted-foreground">まだリンクがありません</p>
        <Link href="/dashboard/links/new" className="mt-4 inline-block">
          <Button size="sm" className="mt-4">最初のリンクを作成</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">リンク</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground hidden md:table-cell">元のURL</th>
              <th className="text-right px-4 py-3 text-sm font-medium text-muted-foreground">クリック</th>
              <th className="text-right px-4 py-3 text-sm font-medium text-muted-foreground">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {links.map((link) => (
              <tr key={link.id} className="hover:bg-muted/20 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex flex-col gap-1">
                    {link.title && <span className="text-sm font-medium">{link.title}</span>}
                    <span className="text-sm text-primary font-mono">/{link.slug}</span>
                  </div>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <p className="text-sm text-muted-foreground truncate max-w-xs">{link.url}</p>
                </td>
                <td className="px-4 py-3 text-right">
                  <Badge variant="secondary">{formatNumber(link._count.clicks)}</Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleCopy(link.slug)}
                      title="URLをコピー"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" asChild title="元のURLを開く">
                      <a href={link.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button variant="ghost" size="icon" asChild title="解析を見る">
                      <Link href={`/dashboard/analytics/${link.id}`}>
                        <BarChart3 className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      title="削除"
                      onClick={() => handleDelete(link.id)}
                      disabled={deletingId === link.id}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
