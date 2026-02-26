'use client'

import { ParsedSections, MutationVariants } from '@/lib/types'
import { ScoreCard } from './ScoreCard'
import { MutationCards } from './MutationCards'
import { Separator } from '@/components/ui/separator'

interface SectionProps {
  title: string
  content?: string
  accent?: 'red' | 'green' | 'default'
}

function Section({ title, content, accent = 'default' }: SectionProps) {
  if (!content) return null

  const titleColor =
    accent === 'red'   ? 'text-red-400' :
    accent === 'green' ? 'text-green-400' :
    'text-muted-foreground'

  return (
    <div className="space-y-2 animate-in fade-in duration-500">
      <h3 className={`text-xs font-semibold uppercase tracking-widest ${titleColor}`}>{title}</h3>
      <div className="text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed">{content}</div>
    </div>
  )
}

interface Props {
  sections: ParsedSections
}

export function AnalysisOutput({ sections }: Props) {
  if (!sections.tearDown && !sections.assumptions) return null

  return (
    <div className="w-full max-w-2xl space-y-6 mt-8">
      <Section title="Tear Down" content={sections.tearDown} accent="red" />
      {sections.tearDown && sections.assumptions && <Separator className="bg-zinc-800" />}
      <Section title="Assumptions" content={sections.assumptions} />
      {sections.assumptions && sections.failureModes && <Separator className="bg-zinc-800" />}
      <Section title="Failure Modes" content={sections.failureModes} />
      {sections.failureModes && sections.rebuild && <Separator className="bg-zinc-800" />}
      <Section title="Rebuild" content={sections.rebuild} accent="green" />

      {sections.mutation &&
        Object.values(sections.mutation).some(Boolean) &&
        sections.rebuild && (
          <>
            <Separator className="bg-zinc-800" />
            <MutationCards mutation={sections.mutation as MutationVariants} />
          </>
        )}

      {sections.scorecard && (
        <>
          <Separator className="bg-zinc-800" />
          <ScoreCard scorecard={sections.scorecard} />
        </>
      )}
    </div>
  )
}
