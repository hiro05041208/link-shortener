import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getBaseUrl } from '@/lib/utils'
import QRCode from 'qrcode'

type Params = { params: Promise<{ id: string }> }

export async function GET(_request: NextRequest, { params }: Params) {
  const { id } = await params
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const link = await prisma.link.findUnique({ where: { id, userId } })
  if (!link) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const url = `${getBaseUrl()}/${link.slug}`
  const dataUrl = await QRCode.toDataURL(url, {
    width: 512,
    margin: 2,
    color: { dark: '#000000', light: '#ffffff' },
  })

  return NextResponse.json({ dataUrl, url })
}
