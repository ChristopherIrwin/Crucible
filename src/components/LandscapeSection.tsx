'use client'

import { useState } from 'react'
import { ConfidenceLevel } from '@/lib/types'

const CONFIDENCE_STYLES: Record<ConfidenceLevel, string> = {
  high: 'bg-green-950/60 text-green-400 border border-green-800/50',
  med:  'bg-amber-950/60 text-amber-400 border border-amber-800/50',
  low:  'bg-zinc-900/60 text-zinc-500 border border-zinc-700/50',
}

interface Props {
  content: string
  confidence?: ConfidenceLevel
  onRegenerate?: (key: string) => Promise<void>
}

export function LandscapeSection({ content, confidence, onRegenerate }: Props) {
  const [regenerating, setRegenerating] = useState(false)

  async function handleRegenerate() {
    if (!onRegenerate) return
    setRegenerating(true)
    await onRegenerate('landscape')
    setRegenerating(false)
  }

  return (
    <div className="group rounded-xl border border-zinc-800/50 bg-zinc-950/80 backdrop-blur-sm p-6 space-y-3 animate-in slide-in-from-bottom-4 fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-400">Landscape</h3>
          {confidence && (
            <span className={`text-[10px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded ${CONFIDENCE_STYLES[confidence]}`}>
              {confidence}
            </span>
          )}
        </div>
        {onRegenerate && (
          <button
            onClick={handleRegenerate}
            disabled={regenerating}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-zinc-600 hover:text-zinc-300 text-xs disabled:cursor-not-allowed"
            title="Regenerate landscape"
          >
            {regenerating ? '…' : '↺'}
          </button>
        )}
      </div>
      <div className="text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed">{content}</div>
    </div>
  )
}
