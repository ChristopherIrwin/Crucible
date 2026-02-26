'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { AnalysisResult } from '@/lib/types'

interface Props {
  result: AnalysisResult
}

export function ShareButton({ result }: Props) {
  const [state, setState] = useState<'idle' | 'saving' | 'copied'>('idle')

  async function handleShare() {
    setState('saving')
    try {
      const res = await fetch('/api/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result),
      })
      const { id } = await res.json()
      const url = `${window.location.origin}/share/${id}`
      await navigator.clipboard.writeText(url)
      setState('copied')
      setTimeout(() => setState('idle'), 2500)
    } catch {
      setState('idle')
    }
  }

  return (
    <Button
      variant="outline"
      onClick={handleShare}
      disabled={state === 'saving'}
      className="mt-4"
    >
      {state === 'idle'   && 'Share result →'}
      {state === 'saving' && 'Saving…'}
      {state === 'copied' && 'Link copied!'}
    </Button>
  )
}
