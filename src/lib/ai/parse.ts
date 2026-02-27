import { ParsedSections, MutationVariants, Scorecard, Confidence } from '@/lib/types'

const SECTION_NAMES = [
  'TEAR_DOWN', 'ASSUMPTIONS', 'FAILURE_MODES', 'REBUILD', 'LANDSCAPE', 'MUTATION', 'FOLLOW_UP',
] as const

export function parseStream(text: string): ParsedSections {
  const result: ParsedSections = { isComplete: false }

  for (const name of SECTION_NAMES) {
    const pattern = new RegExp(
      `## ${name}\\n([\\s\\S]*?)(?=\\n## [A-Z_]+|\\n<scorecard>|$)`
    )
    const match = text.match(pattern)
    if (!match) continue
    const content = match[1].trim()

    switch (name) {
      case 'TEAR_DOWN':      result.tearDown      = content; break
      case 'ASSUMPTIONS':    result.assumptions   = content; break
      case 'FAILURE_MODES':  result.failureModes  = content; break
      case 'REBUILD':        result.rebuild       = content; break
      case 'LANDSCAPE':      result.landscape     = content; break
      case 'MUTATION':       result.mutation      = parseMutation(content); break
      case 'FOLLOW_UP':      result.followUpQuestions = parseFollowUp(content); break
    }
  }

  const scorecardMatch = text.match(/<scorecard>\s*(\{[\s\S]*?\})\s*<\/scorecard>/)
  if (scorecardMatch) {
    try {
      const raw = JSON.parse(scorecardMatch[1])
      const { confidence, ...scores } = raw
      result.scorecard = scores as Scorecard
      if (confidence) result.confidence = confidence as Confidence
      result.isComplete = true
    } catch {
      // Malformed JSON — scorecard not ready yet
    }
  }

  return result
}

function parseMutation(text: string): Partial<MutationVariants> {
  return {
    safer:           extractVariant(text, 'SAFER'),
    scalable:        extractVariant(text, 'SCALABLE'),
    unfairAdvantage: extractVariant(text, 'UNFAIR_ADVANTAGE'),
    wildcard:        extractVariant(text, 'WILDCARD'),
  }
}

function extractVariant(text: string, variant: string): string | undefined {
  const pattern = new RegExp(
    `${variant}:\\s*([\\s\\S]*?)(?=\\n(?:SAFER|SCALABLE|UNFAIR_ADVANTAGE|WILDCARD):|$)`
  )
  return text.match(pattern)?.[1]?.trim()
}

function parseFollowUp(text: string): string[] {
  return text
    .split('\n')
    .filter(line => /^Q\d+:/.test(line.trim()))
    .map(line => line.replace(/^Q\d+:\s*/, '').trim())
    .filter(Boolean)
}
