import { ImageResponse } from '@vercel/og'
import { getResult } from '@/lib/kv'
import { Scorecard } from '@/lib/types'

export const runtime = 'edge'

const SCORE_LABELS: Record<keyof Scorecard, string> = {
  clarity:            'Clarity',
  realPain:           'Real Pain',
  defensibility:      'Defend',
  monetization:       'Monetize',
  executionComplexity:'Execution',
  timing:             'Timing',
}

function scoreColor(n: number) {
  if (n >= 7) return '#22c55e'
  if (n >= 4) return '#f59e0b'
  return '#ef4444'
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')

  if (!id) return new Response('Missing id', { status: 400 })

  const result = await getResult(id)
  if (!result) return new Response('Not found', { status: 404 })

  const scores = Object.entries(result.scorecard) as [keyof Scorecard, number][]

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          backgroundColor: '#0a0a0a',
          padding: '60px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', fontSize: '18px', color: '#52525b', letterSpacing: '4px', marginBottom: '24px' }}>
          CRUCIBLE
        </div>
        <div style={{ display: 'flex', fontSize: '32px', color: '#f4f4f5', marginBottom: '48px', lineHeight: 1.3, maxWidth: '900px' }}>
          {result.idea.slice(0, 140)}
        </div>
        <div style={{ display: 'flex', gap: '40px' }}>
          {scores.map(([key, value]) => (
            <div key={key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <div style={{ fontSize: '52px', fontWeight: 'bold', color: scoreColor(value) }}>
                {value}
              </div>
              <div style={{ fontSize: '13px', color: '#71717a', textTransform: 'uppercase', letterSpacing: '1px' }}>
                {SCORE_LABELS[key]}
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', marginTop: 'auto', fontSize: '14px', color: '#3f3f46' }}>
          crucible.app/share/{id}
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
