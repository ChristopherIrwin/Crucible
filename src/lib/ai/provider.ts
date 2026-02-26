import { createGroq } from '@ai-sdk/groq'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { createOpenAI } from '@ai-sdk/openai'
import { createAnthropic } from '@ai-sdk/anthropic'
import { LanguageModel } from 'ai'
import { Provider } from '@/lib/types'

const MODELS: Record<Provider, string> = {
  groq:      'llama-3.3-70b-versatile',
  google:    'gemini-2.0-flash',
  openai:    'gpt-4o',
  anthropic: 'claude-sonnet-4-6',
}

export function getModel(provider: Provider, apiKey: string): LanguageModel {
  switch (provider) {
    case 'groq':
      return createGroq({ apiKey })(MODELS.groq)
    case 'google':
      return createGoogleGenerativeAI({ apiKey })(MODELS.google)
    case 'openai':
      return createOpenAI({ apiKey })(MODELS.openai)
    case 'anthropic':
      return createAnthropic({ apiKey })(MODELS.anthropic)
    default:
      throw new Error(`Unknown provider: ${provider}`)
  }
}

/** Detect provider from API key prefix */
export function detectProvider(apiKey: string): Provider | null {
  if (apiKey.startsWith('gsk_'))    return 'groq'
  if (apiKey.startsWith('AIza'))    return 'google'
  if (apiKey.startsWith('sk-ant-')) return 'anthropic'
  if (apiKey.startsWith('sk-'))     return 'openai'
  return null
}
