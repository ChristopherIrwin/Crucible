'use client'

import { useState } from 'react'
import { useCompletion } from '@ai-sdk/react'

interface Props {
  questions: string[]
  idea: string
  apiConfig?: { provider: string; apiKey: string }
}

export function FollowUpBlock({ questions, idea, apiConfig }: Props) {
  const [activeQuestion, setActiveQuestion] = useState<string | null>(null)

  const { complete, completion, isLoading } = useCompletion({
    api: '/api/analyze',
    headers: apiConfig
      ? { 'x-ai-provider': apiConfig.provider, 'x-ai-key': apiConfig.apiKey }
      : {},
    body: { intensity: 'mild' },
    streamProtocol: 'text',
  })

  async function handleQuestion(question: string) {
    setActiveQuestion(question)
    await complete(`${idea}\n\nFollow-up question: ${question}\n\nAnswer this specific question directly and concisely. Do not use the full analysis format — just answer the question in 2-4 sentences.`)
  }

  return (
    <div className="rounded-xl border border-indigo-900/20 bg-zinc-950/80 backdrop-blur-sm p-6 space-y-4 animate-in slide-in-from-bottom-4 fade-in duration-500">
      <h3 className="text-xs font-semibold uppercase tracking-widest text-indigo-400">Dig Deeper</h3>

      <div className="space-y-2">
        {questions.map((q, i) => (
          <button
            key={i}
            onClick={() => handleQuestion(q)}
            disabled={isLoading}
            className="w-full text-left text-sm text-zinc-400 hover:text-zinc-200 py-2 px-3 rounded-lg border border-zinc-800/60 hover:border-indigo-900/40 hover:bg-indigo-950/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="text-indigo-500 font-medium mr-2">Q{i + 1}.</span>
            {q}
          </button>
        ))}
      </div>

      {activeQuestion && completion && (
        <div className="mt-4 space-y-2">
          <p className="text-xs text-zinc-500 italic">{activeQuestion}</p>
          <p className="text-sm text-zinc-300 leading-relaxed">{completion}</p>
        </div>
      )}
    </div>
  )
}
