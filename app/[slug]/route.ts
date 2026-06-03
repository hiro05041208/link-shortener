import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { parseUserAgent } from '@/lib/utils'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  const link = await prisma.link.findUnique({ where: { slug } })

  if (!link) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  const ua = request.headers.get('user-agent') ?? ''
  const { device, browser } = parseUserAgent(ua)
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null
  const referer = request.headers.get('referer') ?? null

  await prisma.click.create({
    data: {
      linkId: link.id,
      ip,
      device,
      browser,
      referer,
    },
  })

  return NextResponse.redirect(link.url, { status: 302 })
}
