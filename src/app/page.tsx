'use client'

import { useCompletion } from '@ai-sdk/react'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { IdeaInput } from '@/components/IdeaInput'
import { AnalysisOutput } from '@/components/AnalysisOutput'
import { ShareButton } from '@/components/ShareButton'
import { KeySetupModal } from '@/components/KeySetupModal'
import { SignInBanner } from '@/components/SignInBanner'
import { useApiConfig } from '@/hooks/useApiConfig'
import { parseStream } from '@/lib/ai/parse'
import { AnalysisResult, ParsedSections } from '@/lib/types'

export default function Home() {
  const { config, loaded, saveConfig, clearConfig } = useApiConfig()
  const { data: session } = useSession()
  const [currentIdea, setCurrentIdea] = useState('')
  const [currentIntensity, setCurrentIntensity] = useState<'mild' | 'brutal'>('brutal')
  const [sections, setSections] = useState<ParsedSections>({ isComplete: false })

  // Pre-fill idea from URL ?idea= param (used by dashboard Re-analyze)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const idea = params.get('idea')
    if (idea) setCurrentIdea(idea)
  }, [])

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
    complete(idea, { body: { intensity } })
  }

  async function handleRegenerate(sectionKey: string): Promise<void> {
    if (!config) return
    const res = await fetch('/api/regenerate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-ai-provider': config.provider,
        'x-ai-key': config.apiKey,
      },
      body: JSON.stringify({ section: sectionKey, idea: currentIdea, intensity: currentIntensity }),
    })
    if (!res.ok || !res.body) return

    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    let text = ''
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      text += decoder.decode(value, { stream: true })
      setSections(prev => ({ ...prev, [sectionKey]: text }))
    }
  }

  const shareResult: AnalysisResult | null =
    sections.isComplete && sections.scorecard && sections.mutation && sections.confidence
      ? {
          idea: currentIdea,
          intensity: currentIntensity,
          tearDown:     sections.tearDown ?? '',
          assumptions:  sections.assumptions ?? '',
          failureModes: sections.failureModes ?? '',
          rebuild:      sections.rebuild ?? '',
          landscape:    sections.landscape ?? '',
          mutation:     sections.mutation as AnalysisResult['mutation'],
          followUpQuestions: sections.followUpQuestions ?? [],
          scorecard:    sections.scorecard,
          confidence:   sections.confidence,
          createdAt:    Date.now(),
        }
      : null

  if (!loaded) return null

  return (
    <main className="flex flex-col items-center px-4 py-12 pb-24">
      <KeySetupModal open={!config} onSave={saveConfig} />

      <div className="w-full max-w-2xl space-y-2 mb-10">
        <p className="text-zinc-500 text-sm">Before you waste 6 months, pressure test it in 60 seconds.</p>
      </div>

      <IdeaInput onAnalyze={handleAnalyze} isLoading={isLoading} initialIdea={currentIdea} />

      <AnalysisOutput
        sections={sections}
        idea={currentIdea}
        apiConfig={config ?? undefined}
        onRegenerate={sections.isComplete ? handleRegenerate : undefined}
      />

      {shareResult && <ShareButton result={shareResult} />}

      {shareResult && !session?.user && <SignInBanner />}

      {config && (
        <button
          onClick={clearConfig}
          className="fixed bottom-4 right-4 text-xs text-zinc-700 hover:text-zinc-400 transition-colors"
        >
          Change API key
        </button>
      )}
    </main>
  )
}
