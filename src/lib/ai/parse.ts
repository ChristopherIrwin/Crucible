import { ParsedSections, MutationVariants, Scorecard } from '@/lib/types'

const SECTION_NAMES = ['TEAR_DOWN', 'ASSUMPTIONS', 'FAILURE_MODES', 'REBUILD', 'MUTATION'] as const

export function parseStream(text: string): ParsedSections {
  const result: ParsedSections = { isComplete: false }

  // Extract each named section (content up to next section or scorecard)
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
      case 'MUTATION':       result.mutation      = parseMutation(content); break
    }
  }

  // Extract scorecard
  const scorecardMatch = text.match(/<scorecard>\s*(\{[\s\S]*?\})\s*<\/scorecard>/)
  if (scorecardMatch) {
    try {
      result.scorecard = JSON.parse(scorecardMatch[1]) as Scorecard
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
