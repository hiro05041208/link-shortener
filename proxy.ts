import { NextResponse, type NextRequest } from 'next/server'

const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? ''
const SECRET_KEY = process.env.CLERK_SECRET_KEY ?? ''

function clerkConfigured(): boolean {
  if (!PUBLISHABLE_KEY || !SECRET_KEY) return false
  if (!PUBLISHABLE_KEY.startsWith('pk_test_') && !PUBLISHABLE_KEY.startsWith('pk_live_')) return false
  if (PUBLISHABLE_KEY.length < 50) return false
  return true
}

export default async function proxy(request: NextRequest) {
  if (!clerkConfigured()) return NextResponse.next()

  const { clerkMiddleware, createRouteMatcher } = await import('@clerk/nextjs/server')

  const isPublicRoute = createRouteMatcher([
    '/',
    '/sign-in(.*)',
    '/sign-up(.*)',
    '/:slug',
  ])

  const handler = clerkMiddleware(async (auth, req) => {
    if (!isPublicRoute(req)) await auth.protect()
  })

  return handler(request, {} as Parameters<typeof handler>[1])
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
