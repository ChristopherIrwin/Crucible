import { randomUUID } from 'crypto'
import { saveResult } from '@/lib/kv'
import { addToHistory } from '@/lib/history'
import { auth } from '@/lib/auth'
import { AnalysisResult } from '@/lib/types'

export async function POST(req: Request) {
  const session = await auth()
  const body = await req.json() as Omit<AnalysisResult, 'createdAt'>

  const result: AnalysisResult = {
    ...body,
    createdAt: Date.now(),
  }

  const id = randomUUID()
  const isAuthenticated = !!session?.user?.id

  await saveResult(id, result, isAuthenticated)

  if (isAuthenticated) {
    const scoreValues = Object.values(result.scorecard) as number[]
    const overallScore = Math.round(scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length)
    await addToHistory(session.user.id, {
      id,
      ideaSnippet: result.idea.slice(0, 60),
      overallScore,
      createdAt: result.createdAt,
    })
  }

  return Response.json({ id })
}
