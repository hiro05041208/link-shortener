'use client'

import Link from 'next/link'
import { useUser } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'

function StaticLinks() {
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

export function ClerkNavButtons() {
  const { isLoaded, isSignedIn } = useUser()

  if (!isLoaded) return <StaticLinks />
  if (isSignedIn) {
    return (
      <Link href="/dashboard">
        <Button>ダッシュボード</Button>
      </Link>
    )
  }
  return <StaticLinks />
}
