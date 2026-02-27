'use client'

import { signIn, signOut } from 'next-auth/react'
import { Session } from 'next-auth'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface Props {
  session: Session | null
}

export function AuthButton({ session }: Props) {
  if (session?.user) {
    return (
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard"
          className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          History
        </Link>
        {session.user.image ? (
          <img
            src={session.user.image}
            alt={session.user.name ?? 'User'}
            className="w-7 h-7 rounded-full cursor-pointer border border-zinc-700 hover:border-zinc-500 transition-colors"
            onClick={() => signOut()}
            title="Sign out"
          />
        ) : (
          <Button variant="ghost" size="sm" onClick={() => signOut()} className="text-xs">
            Sign out
          </Button>
        )}
      </div>
    )
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => signIn()}
      className="text-xs text-zinc-400 hover:text-zinc-200"
    >
      Sign in
    </Button>
  )
}
