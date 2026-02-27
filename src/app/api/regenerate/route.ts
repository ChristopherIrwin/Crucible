import { streamText } from 'ai'
import { getModel } from '@/lib/ai/provider'
import { buildSystemPrompt } from '@/lib/ai/prompts'
import { z } from 'zod'
import { Provider } from '@/lib/types'

const SECTION_PROMPTS: Record<string, string> = {
  tearDown:     'Rewrite ONLY the tear-down critique with fresh perspective and different angles.',
  assumptions:  'Rewrite ONLY the assumptions list — find different or deeper assumptions.',
  failureModes: 'Rewrite ONLY the failure modes with new specific failure scenarios.',
  rebuild:      'Rewrite ONLY the rebuild strategy with a different strategic angle.',
  landscape:    'Rewrite ONLY the competitive landscape — name different competitors or reframe the market.',
}

const schema = z.object({
  section: z.string(),
  idea: z.string().min(10).max(2000),
  intensity: z.enum(['mild', 'brutal']),
})

export async function POST(req: Request) {
  const provider = (req.headers.get('x-ai-provider') ?? 'groq') as Provider
  const apiKey = req.headers.get('x-ai-key')

  if (!apiKey) return new Response('Missing API key', { status: 401 })

  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return new Response('Invalid request body', { status: 400 })

  const { section, idea, intensity } = parsed.data
  const sectionInstruction = SECTION_PROMPTS[section]
  if (!sectionInstruction) return new Response('Unknown section', { status: 400 })

  try {
    const model = getModel(provider, apiKey)
    const result = streamText({
      model,
      system: `${buildSystemPrompt(intensity)}\n\nSPECIAL INSTRUCTION: ${sectionInstruction} Output ONLY the raw section content — no section header, no other sections, no scorecard.`,
      messages: [{ role: 'user', content: `Idea: ${idea}` }],
      maxOutputTokens: 500,
    })
    return result.toTextStreamResponse()
  } catch (err) {
    const message = err instanceof Error ? err.message : 'AI provider error'
    return new Response(message, { status: 502 })
  }
}
