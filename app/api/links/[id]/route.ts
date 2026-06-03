import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

type Params = { params: Promise<{ id: string }> }

export async function GET(_request: NextRequest, { params }: Params) {
  const { id } = await params
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const link = await prisma.link.findUnique({
    where: { id, userId },
    include: { _count: { select: { clicks: true } } },
  })

  if (!link) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(link)
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const { id } = await params
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { url, title } = body

  const link = await prisma.link.findUnique({ where: { id, userId } })
  if (!link) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const updated = await prisma.link.update({
    where: { id },
    data: {
      ...(url && { url }),
      ...(title !== undefined && { title: title || null }),
    },
  })

  return NextResponse.json(updated)
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const { id } = await params
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const link = await prisma.link.findUnique({ where: { id, userId } })
  if (!link) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await prisma.link.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
