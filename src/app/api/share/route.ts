import { randomUUID } from 'crypto'
import { saveResult } from '@/lib/kv'
import { AnalysisResult } from '@/lib/types'

export async function POST(req: Request) {
  const body = await req.json() as Omit<AnalysisResult, 'createdAt'>

  const result: AnalysisResult = {
    ...body,
    createdAt: Date.now(),
  }

  const id = randomUUID()
  await saveResult(id, result)

  return Response.json({ id })
}
