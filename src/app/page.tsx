'use client'

import { useCompletion } from '@ai-sdk/react'
import { useState, useEffect } from 'react'
import { IdeaInput } from '@/components/IdeaInput'
import { AnalysisOutput } from '@/components/AnalysisOutput'
import { ShareButton } from '@/components/ShareButton'
import { KeySetupModal } from '@/components/KeySetupModal'
import { useApiConfig } from '@/hooks/useApiConfig'
import { parseStream } from '@/lib/ai/parse'
import { AnalysisResult, ParsedSections } from '@/lib/types'

export default function Home() {
  const { config, loaded, saveConfig, clearConfig } = useApiConfig()
  const [currentIdea, setCurrentIdea] = useState('')
  const [currentIntensity, setCurrentIntensity] = useState<'mild' | 'brutal'>('brutal')
  const [sections, setSections] = useState<ParsedSections>({ isComplete: false })

  const { complete, completion, isLoading } = useCompletion({
    api: '/api/analyze',
    headers: config
      ? { 'x-ai-provider': config.provider, 'x-ai-key': config.apiKey }
      : {},
    body: { intensity: currentIntensity },
    streamProtocol: 'text',
    onError: (err) => console.error('Analysis error:', err),
  })

  useEffect(() => {
    if (completion) setSections(parseStream(completion))
  }, [completion])

  function handleAnalyze(idea: string, intensity: 'mild' | 'brutal') {
    setCurrentIdea(idea)
    setCurrentIntensity(intensity)
    setSections({ isComplete: false })
    complete(idea)
  }

  const shareResult: AnalysisResult | null =
    sections.isComplete && sections.scorecard && sections.mutation
      ? {
          idea: currentIdea,
          intensity: currentIntensity,
          tearDown:     sections.tearDown ?? '',
          assumptions:  sections.assumptions ?? '',
          failureModes: sections.failureModes ?? '',
          rebuild:      sections.rebuild ?? '',
          mutation:     sections.mutation as AnalysisResult['mutation'],
          scorecard:    sections.scorecard,
          createdAt:    Date.now(),
        }
      : null

  if (!loaded) return null

  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-16">
      <KeySetupModal open={!config} onSave={saveConfig} />

      <div className="w-full max-w-2xl space-y-2 mb-12">
        <h1 className="text-3xl font-bold tracking-tight">Crucible</h1>
        <p className="text-muted-foreground">Before you waste 6 months, pressure test it in 60 seconds.</p>
      </div>

      <IdeaInput onAnalyze={handleAnalyze} isLoading={isLoading} />
      <AnalysisOutput sections={sections} />

      {shareResult && <ShareButton result={shareResult} />}

      {config && (
        <button
          onClick={clearConfig}
          className="fixed bottom-4 right-4 text-xs text-zinc-600 hover:text-zinc-400"
        >
          Change API key
        </button>
      )}
    </main>
  )
}
