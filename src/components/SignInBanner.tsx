'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'

export function SignInBanner() {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  return (
    <div className="w-full max-w-2xl mt-6 flex items-center justify-between gap-4 rounded-lg border border-zinc-800 bg-zinc-900/60 px-4 py-3">
      <p className="text-sm text-zinc-400">
        Sign in to save your analysis history.
      </p>
      <div className="flex items-center gap-2 shrink-0">
        <Button size="sm" variant="outline" onClick={() => signIn('github')} className="text-xs h-7">
          GitHub
        </Button>
        <Button size="sm" variant="outline" onClick={() => signIn('google')} className="text-xs h-7">
          Google
        </Button>
        <button
          onClick={() => setDismissed(true)}
          className="text-zinc-600 hover:text-zinc-400 text-xs ml-1"
          aria-label="Dismiss"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
