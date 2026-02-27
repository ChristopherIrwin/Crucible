'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { HistoryEntry } from '@/lib/history'

function scoreColor(n: number) {
  if (n >= 7) return 'text-green-400'
  if (n >= 5) return 'text-amber-400'
  return 'text-red-400'
}

function timeAgo(ms: number) {
  const diff = Date.now() - ms
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'today'
  if (days === 1) return 'yesterday'
  return `${days}d ago`
}

export function HistoryPanel() {
  const { data: session } = useSession()
  const [open, setOpen] = useState(false)
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!open || !session?.user) return
    setLoading(true)
    fetch('/api/history')
      .then(r => r.json())
      .then(setHistory)
      .finally(() => setLoading(false))
  }, [open, session])

  if (!session?.user) return null

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-zinc-500 hover:text-zinc-300 transition-colors text-xs"
        title="History"
      >
        ⏱
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="fixed right-0 top-0 h-full w-80 z-50 bg-zinc-950 border-l border-zinc-800 flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-zinc-800">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-300">History</h2>
              <button onClick={() => setOpen(false)} className="text-zinc-500 hover:text-zinc-300 text-lg">✕</button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {loading && (
                <p className="text-xs text-zinc-600 text-center mt-8">Loading…</p>
              )}
              {!loading && history.length === 0 && (
                <p className="text-xs text-zinc-600 text-center mt-8">No history yet.</p>
              )}
              {history.map((entry) => (
                <Link
                  key={entry.id}
                  href={`/share/${entry.id}`}
                  onClick={() => setOpen(false)}
                  className="flex items-start justify-between px-5 py-4 border-b border-zinc-800/50 hover:bg-zinc-900/50 transition-colors gap-3"
                >
                  <p className="text-sm text-zinc-300 leading-snug flex-1 min-w-0 truncate">
                    {entry.ideaSnippet}
                  </p>
                  <div className="flex flex-col items-end shrink-0 gap-1">
                    <span className={`text-base font-bold ${scoreColor(entry.overallScore)}`}>
                      {entry.overallScore}
                    </span>
                    <span className="text-[10px] text-zinc-600">{timeAgo(entry.createdAt)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  )
}
