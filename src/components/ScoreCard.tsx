'use client'

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts'
import { Scorecard } from '@/lib/types'

interface Props {
  scorecard: Scorecard
}

const LABELS: Record<keyof Scorecard, string> = {
  clarity:            'Clarity',
  realPain:           'Real Pain',
  defensibility:      'Defensibility',
  monetization:       'Monetization',
  executionComplexity:'Execution',
  timing:             'Timing',
}

function scoreColor(n: number) {
  if (n >= 7) return 'text-green-400'
  if (n >= 5) return 'text-amber-400'
  return 'text-red-400'
}

function scoreBg(n: number) {
  if (n >= 7) return 'bg-green-400'
  if (n >= 5) return 'bg-amber-400'
  return 'bg-red-400'
}

export function ScoreCard({ scorecard }: Props) {
  const keys = Object.keys(scorecard) as (keyof Scorecard)[]
  const values = Object.values(scorecard) as number[]
  const overall = Math.round(values.reduce((a, b) => a + b, 0) / values.length)

  const data = keys.map((key) => ({
    subject: LABELS[key],
    value: scorecard[key],
    fullMark: 10,
  }))

  return (
    <div className="rounded-xl border border-indigo-900/30 bg-zinc-950/80 backdrop-blur-sm shadow-[0_0_30px_rgba(99,102,241,0.05)] p-6 space-y-6 animate-in slide-in-from-bottom-4 fade-in duration-500">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-indigo-400">Scorecard</h3>
        <div className="flex items-baseline gap-1">
          <span className={`text-4xl font-bold ${scoreColor(overall)}`}>{overall}</span>
          <span className="text-lg text-zinc-600">/10</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <RadarChart data={data}>
          <PolarGrid stroke="#27272a" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#52525b', fontSize: 11 }} />
          <Radar dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} strokeWidth={1.5} />
        </RadarChart>
      </ResponsiveContainer>

      <div className="space-y-2">
        {keys.map((key) => {
          const v = scorecard[key]
          return (
            <div key={key} className="flex items-center gap-3">
              <span className="text-xs text-zinc-500 w-28 shrink-0">{LABELS[key]}</span>
              <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${scoreBg(v)} transition-all duration-700`}
                  style={{ width: `${v * 10}%` }}
                />
              </div>
              <span className={`text-sm font-semibold w-4 text-right ${scoreColor(v)}`}>{v}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
