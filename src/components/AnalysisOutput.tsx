'use client'

import { useState } from 'react'
import { ParsedSections, MutationVariants, ConfidenceLevel } from '@/lib/types'
import { ScoreCard } from './ScoreCard'
import { MutationCards } from './MutationCards'
import { LandscapeSection } from './LandscapeSection'
import { FollowUpBlock } from './FollowUpBlock'

const CONFIDENCE_STYLES: Record<ConfidenceLevel, string> = {
  high: 'bg-green-950/60 text-green-400 border border-green-800/50',
  med:  'bg-amber-950/60 text-amber-400 border border-amber-800/50',
  low:  'bg-zinc-900/60 text-zinc-500 border border-zinc-700/50',
}

interface SectionCardProps {
  title: string
  content?: string
  accent?: 'red' | 'green' | 'indigo' | 'default'
  confidence?: ConfidenceLevel
  sectionKey?: string
  onRegenerate?: (key: string) => Promise<void>
}

function SectionCard({
  title,
  content,
  accent = 'default',
  confidence,
  sectionKey,
  onRegenerate,
}: SectionCardProps) {
  const [regenerating, setRegenerating] = useState(false)

  if (!content) return null

  const borderColor =
    accent === 'red'    ? 'border-red-900/30 shadow-[0_0_30px_rgba(239,68,68,0.04)]' :
    accent === 'green'  ? 'border-green-900/30 shadow-[0_0_30px_rgba(34,197,94,0.04)]' :
    accent === 'indigo' ? 'border-indigo-900/30 shadow-[0_0_30px_rgba(99,102,241,0.05)]' :
    'border-zinc-800/50'

  const titleColor =
    accent === 'red'   ? 'text-red-400' :
    accent === 'green' ? 'text-green-400' :
    'text-zinc-400'

  async function handleRegenerate() {
    if (!onRegenerate || !sectionKey) return
    setRegenerating(true)
    await onRegenerate(sectionKey)
    setRegenerating(false)
  }

  return (
    <div className={`group rounded-xl border ${borderColor} bg-zinc-950/80 backdrop-blur-sm p-6 space-y-3 animate-in slide-in-from-bottom-4 fade-in duration-500`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <h3 className={`text-xs font-semibold uppercase tracking-widest ${titleColor}`}>{title}</h3>
          {confidence && (
            <span className={`text-[10px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded ${CONFIDENCE_STYLES[confidence]}`}>
              {confidence}
            </span>
          )}
        </div>
        {onRegenerate && sectionKey && (
          <button
            onClick={handleRegenerate}
            disabled={regenerating}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-zinc-600 hover:text-zinc-300 text-xs disabled:cursor-not-allowed"
            title="Regenerate this section"
          >
            {regenerating ? '…' : '↺'}
          </button>
        )}
      </div>
      <div className="text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed">{content}</div>
    </div>
  )
}

interface Props {
  sections: ParsedSections
  idea?: string
  apiConfig?: { provider: string; apiKey: string }
  onRegenerate?: (sectionKey: string) => Promise<void>
}

export function AnalysisOutput({ sections, idea, apiConfig, onRegenerate }: Props) {
  if (!sections.tearDown && !sections.assumptions) return null

  return (
    <div className="w-full max-w-2xl space-y-4 mt-8">
      <SectionCard
        title="Tear Down"
        content={sections.tearDown}
        accent="red"
        confidence={sections.confidence?.tearDown}
        sectionKey="tearDown"
        onRegenerate={onRegenerate}
      />
      <SectionCard
        title="Assumptions"
        content={sections.assumptions}
        confidence={sections.confidence?.assumptions}
        sectionKey="assumptions"
        onRegenerate={onRegenerate}
      />
      <SectionCard
        title="Failure Modes"
        content={sections.failureModes}
        confidence={sections.confidence?.failureModes}
        sectionKey="failureModes"
        onRegenerate={onRegenerate}
      />
      <SectionCard
        title="Rebuild"
        content={sections.rebuild}
        accent="green"
        confidence={sections.confidence?.rebuild}
        sectionKey="rebuild"
        onRegenerate={onRegenerate}
      />

      {sections.landscape && (
        <LandscapeSection
          content={sections.landscape}
          confidence={sections.confidence?.landscape}
          onRegenerate={onRegenerate}
        />
      )}

      {sections.mutation && Object.values(sections.mutation).some(Boolean) && sections.rebuild && (
        <MutationCards mutation={sections.mutation as MutationVariants} />
      )}

      {sections.scorecard && (
        <ScoreCard scorecard={sections.scorecard} />
      )}

      {sections.followUpQuestions && sections.followUpQuestions.length > 0 && (
        <FollowUpBlock questions={sections.followUpQuestions} idea={idea ?? ''} apiConfig={apiConfig} />
      )}
    </div>
  )
}
