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

export function ScoreCard({ scorecard }: Props) {
  const data = (Object.keys(scorecard) as (keyof Scorecard)[]).map((key) => ({
    subject: LABELS[key],
    value: scorecard[key],
    fullMark: 10,
  }))

  const overall = Math.round(
    Object.values(scorecard).reduce((a, b) => a + b, 0) / Object.values(scorecard).length
  )

  return (
    <div className="rounded-lg border border-border p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Scorecard</h3>
        <span className="text-3xl font-bold">{overall}<span className="text-lg text-muted-foreground">/10</span></span>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <RadarChart data={data}>
          <PolarGrid stroke="#27272a" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#71717a', fontSize: 12 }} />
          <Radar dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.25} />
        </RadarChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-3 gap-2">
        {(Object.keys(scorecard) as (keyof Scorecard)[]).map((key) => (
          <div key={key} className="text-center">
            <div className="text-xl font-semibold">{scorecard[key]}</div>
            <div className="text-xs text-muted-foreground">{LABELS[key]}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
