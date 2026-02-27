import { buildSystemPrompt } from '@/lib/ai/prompts'

describe('buildSystemPrompt', () => {
  it('includes all required section headers', () => {
    const prompt = buildSystemPrompt('mild')
    expect(prompt).toContain('## TEAR_DOWN')
    expect(prompt).toContain('## ASSUMPTIONS')
    expect(prompt).toContain('## FAILURE_MODES')
    expect(prompt).toContain('## REBUILD')
    expect(prompt).toContain('## LANDSCAPE')
    expect(prompt).toContain('## MUTATION')
    expect(prompt).toContain('## FOLLOW_UP')
    expect(prompt).toContain('<scorecard>')
  })

  it('includes scorecard field names', () => {
    const prompt = buildSystemPrompt('mild')
    expect(prompt).toContain('clarity')
    expect(prompt).toContain('realPain')
    expect(prompt).toContain('defensibility')
    expect(prompt).toContain('monetization')
    expect(prompt).toContain('executionComplexity')
    expect(prompt).toContain('timing')
  })

  it('includes confidence in scorecard format', () => {
    const prompt = buildSystemPrompt('mild')
    expect(prompt).toContain('"confidence"')
    expect(prompt).toContain('"tearDown"')
    expect(prompt).toContain('"landscape"')
  })

  it('includes all mutation variant labels', () => {
    const prompt = buildSystemPrompt('mild')
    expect(prompt).toContain('SAFER:')
    expect(prompt).toContain('SCALABLE:')
    expect(prompt).toContain('UNFAIR_ADVANTAGE:')
    expect(prompt).toContain('WILDCARD:')
  })

  it('includes follow-up question format', () => {
    const prompt = buildSystemPrompt('mild')
    expect(prompt).toContain('Q1:')
    expect(prompt).toContain('Q2:')
    expect(prompt).toContain('Q3:')
  })

  it('brutal mode contains harder language than mild', () => {
    const mild = buildSystemPrompt('mild')
    const brutal = buildSystemPrompt('brutal')
    expect(brutal).toContain('ruthless')
    expect(mild).not.toContain('ruthless')
  })
})
