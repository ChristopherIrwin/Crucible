import { parseStream } from '@/lib/ai/parse'

const FULL_RESPONSE = `## TEAR_DOWN
This idea faces serious distribution challenges. No clear acquisition channel.

## ASSUMPTIONS
For this to succeed, the following must be true:
- Users will pay before seeing value
- Market is not already saturated

## FAILURE_MODES
Dies at month 8: zero organic growth, paid CAC exceeds LTV.

## REBUILD
Narrow to a single niche. Launch as a free tool with a paid export.

## MUTATION
SAFER: B2B SaaS targeting one vertical
SCALABLE: Platform play with API access
UNFAIR_ADVANTAGE: Leverage existing audience
WILDCARD: Open source core, paid hosted

<scorecard>{"clarity":7,"realPain":8,"defensibility":5,"monetization":6,"executionComplexity":7,"timing":8}</scorecard>`

describe('parseStream', () => {
  it('returns empty sections for empty string', () => {
    const result = parseStream('')
    expect(result.isComplete).toBe(false)
    expect(result.tearDown).toBeUndefined()
  })

  it('parses TEAR_DOWN section when present', () => {
    const partial = '## TEAR_DOWN\nThis idea faces serious distribution challenges.'
    const result = parseStream(partial)
    expect(result.tearDown).toBe('This idea faces serious distribution challenges.')
  })

  it('parses all six sections from full response', () => {
    const result = parseStream(FULL_RESPONSE)
    expect(result.tearDown).toContain('distribution challenges')
    expect(result.assumptions).toContain('must be true')
    expect(result.failureModes).toContain('month 8')
    expect(result.rebuild).toContain('Narrow')
    expect(result.mutation?.safer).toContain('B2B SaaS')
    expect(result.mutation?.wildcard).toContain('Open source')
  })

  it('parses scorecard JSON when present', () => {
    const result = parseStream(FULL_RESPONSE)
    expect(result.scorecard).toEqual({
      clarity: 7,
      realPain: 8,
      defensibility: 5,
      monetization: 6,
      executionComplexity: 7,
      timing: 8,
    })
  })

  it('sets isComplete true only when scorecard is present', () => {
    const partial = '## TEAR_DOWN\nSome content'
    expect(parseStream(partial).isComplete).toBe(false)
    expect(parseStream(FULL_RESPONSE).isComplete).toBe(true)
  })

  it('handles malformed scorecard JSON gracefully', () => {
    const broken = FULL_RESPONSE.replace('"clarity":7', '"clarity":')
    const result = parseStream(broken)
    expect(result.scorecard).toBeUndefined()
    expect(result.isComplete).toBe(false)
  })
})
