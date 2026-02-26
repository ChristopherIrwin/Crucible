import { streamText } from 'ai'
import { getModel } from '@/lib/ai/provider'
import { buildSystemPrompt } from '@/lib/ai/prompts'
import { z } from 'zod'
import { Provider } from '@/lib/types'

const schema = z.object({
  prompt: z.string().min(10).max(2000),
  intensity: z.enum(['mild', 'brutal']),
})

export async function POST(req: Request) {
  const provider = (req.headers.get('x-ai-provider') ?? 'groq') as Provider
  const apiKey = req.headers.get('x-ai-key')

  if (!apiKey) {
    return new Response('Missing API key', { status: 401 })
  }

  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return new Response('Invalid request body', { status: 400 })
  }

  const { prompt: idea, intensity } = parsed.data

  try {
    const model = getModel(provider, apiKey)
    const result = streamText({
      model,
      system: buildSystemPrompt(intensity),
      messages: [{ role: 'user', content: `Analyze this idea: ${idea}` }],
      maxOutputTokens: 2000,
    })
    return result.toTextStreamResponse()
  } catch (err) {
    const message = err instanceof Error ? err.message : 'AI provider error'
    return new Response(message, { status: 502 })
  }
}
