import Link from 'next/link'
import { HistoryEntry } from '@/lib/history'

function scoreColor(n: number) {
  if (n >= 7) return 'text-green-400'
  if (n >= 5) return 'text-amber-400'
  return 'text-red-400'
}

function scoreBg(n: number) {
  if (n >= 7) return 'bg-green-950/60 border-green-900/40'
  if (n >= 5) return 'bg-amber-950/60 border-amber-900/40'
  return 'bg-red-950/60 border-red-900/40'
}

interface Props {
  entry: HistoryEntry
}

export function DashboardCard({ entry }: Props) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950/80 backdrop-blur-sm p-5 space-y-4 hover:border-zinc-700 transition-colors">
      <p className="text-sm text-zinc-200 leading-snug line-clamp-2">{entry.ideaSnippet}</p>

      <div className="flex items-center justify-between">
        <div className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 ${scoreBg(entry.overallScore)}`}>
          <span className={`text-xl font-bold ${scoreColor(entry.overallScore)}`}>{entry.overallScore}</span>
          <span className="text-xs text-zinc-500">/10</span>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/share/${entry.id}`}
            className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            View →
          </Link>
          <Link
            href={`/?idea=${encodeURIComponent(entry.ideaSnippet)}`}
            className="text-xs text-indigo-500 hover:text-indigo-300 transition-colors"
          >
            Re-analyze →
          </Link>
        </div>
      </div>
    </div>
  )
}
