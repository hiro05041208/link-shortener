import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateSlug } from '@/lib/utils'

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const links = await prisma.link.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { clicks: true } } },
  })

  return NextResponse.json(links)
}

export async function POST(request: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { url, slug: customSlug, title } = body

  if (!url) return NextResponse.json({ error: 'URLは必須です' }, { status: 400 })

  try {
    new URL(url)
  } catch {
    return NextResponse.json({ error: '有効なURLを入力してください' }, { status: 400 })
  }

  const slug = customSlug?.trim() || generateSlug()

  if (customSlug) {
    const existing = await prisma.link.findUnique({ where: { slug } })
    if (existing) {
      return NextResponse.json({ error: 'このスラッグはすでに使用されています' }, { status: 409 })
    }
  }

  const link = await prisma.link.create({
    data: { url, slug, title: title?.trim() || null, userId },
  })

  return NextResponse.json(link, { status: 201 })
}
