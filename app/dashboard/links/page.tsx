import { auth } from '@clerk/nextjs/server'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { PlusCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LinkTable } from '@/components/links/link-table'

export default async function LinksPage() {
  const { userId } = await auth()

  const links = await prisma.link.findMany({
    where: { userId: userId! },
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { clicks: true } } },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">リンク一覧</h1>
          <p className="text-muted-foreground mt-1">{links.length}件のリンクを管理中</p>
        </div>
        <Link href="/dashboard/links/new">
          <Button className="gap-2">
            <PlusCircle className="h-4 w-4" />
            新しいリンク
          </Button>
        </Link>
      </div>

      <LinkTable links={links} />
    </div>
  )
}
