'use client'

import Link from 'next/link'
import dynamic from 'next/dynamic'
import { Button } from '@/components/ui/button'

const ClerkNavButtons = dynamic(
  () => import('./nav-buttons-clerk').then((m) => m.ClerkNavButtons),
  { ssr: false }
)

function StaticNavButtons() {
  return (
    <>
      <Link href="/sign-in">
        <Button variant="ghost">ログイン</Button>
      </Link>
      <Link href="/sign-up">
        <Button>無料で始める</Button>
      </Link>
    </>
  )
}

export function NavButtons() {
  const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  const configured =
    typeof key === 'string' &&
    (key.startsWith('pk_test_') || key.startsWith('pk_live_')) &&
    key.length >= 50

  if (!configured) return <StaticNavButtons />
  return <ClerkNavButtons />
}
