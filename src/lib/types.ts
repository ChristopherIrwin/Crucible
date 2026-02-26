export interface Scorecard {
  clarity: number
  realPain: number
  defensibility: number
  monetization: number
  executionComplexity: number
  timing: number
}

export interface MutationVariants {
  safer: string
  scalable: string
  unfairAdvantage: string
  wildcard: string
}

export interface AnalysisResult {
  idea: string
  intensity: 'mild' | 'brutal'
  tearDown: string
  assumptions: string
  failureModes: string
  rebuild: string
  mutation: MutationVariants
  scorecard: Scorecard
  createdAt: number
}

export interface ParsedSections {
  tearDown?: string
  assumptions?: string
  failureModes?: string
  rebuild?: string
  mutation?: Partial<MutationVariants>
  scorecard?: Scorecard
  isComplete: boolean
}

export type Provider = 'groq' | 'google' | 'openai' | 'anthropic'

export interface ApiConfig {
  provider: Provider
  apiKey: string
}
