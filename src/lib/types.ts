export type ConfidenceLevel = 'high' | 'med' | 'low'

export interface Confidence {
  tearDown: ConfidenceLevel
  assumptions: ConfidenceLevel
  failureModes: ConfidenceLevel
  rebuild: ConfidenceLevel
  landscape: ConfidenceLevel
}

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
  landscape: string
  mutation: MutationVariants
  followUpQuestions: string[]
  scorecard: Scorecard
  confidence: Confidence
  createdAt: number
}

export interface ParsedSections {
  tearDown?: string
  assumptions?: string
  failureModes?: string
  rebuild?: string
  landscape?: string
  mutation?: Partial<MutationVariants>
  followUpQuestions?: string[]
  scorecard?: Scorecard
  confidence?: Confidence
  isComplete: boolean
}

export type Provider = 'groq' | 'google' | 'openai' | 'anthropic'

export interface ApiConfig {
  provider: Provider
  apiKey: string
}
