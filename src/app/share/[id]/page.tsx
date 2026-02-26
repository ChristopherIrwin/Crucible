import { notFound } from 'next/navigation'
import { getResult } from '@/lib/kv'
import { AnalysisOutput } from '@/components/AnalysisOutput'
import { ParsedSections } from '@/lib/types'
import type { Metadata } from 'next'
import Link from 'next/link'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  return {
    title: 'Crucible — Idea Analysis',
    openGraph: {
      images: [`/api/og?id=${id}`],
    },
  }
}

export default async function SharePage({ params }: Props) {
  const { id } = await params
  const result = await getResult(id)

  if (!result) notFound()

  const sections: ParsedSections = {
    tearDown:     result.tearDown,
    assumptions:  result.assumptions,
    failureModes: result.failureModes,
    rebuild:      result.rebuild,
    mutation:     result.mutation,
    scorecard:    result.scorecard,
    isComplete:   true,
  }

  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-16">
      <div className="w-full max-w-2xl space-y-2 mb-12">
        <h1 className="text-3xl font-bold tracking-tight">Crucible</h1>
        <p className="text-sm text-muted-foreground italic">"{result.idea}"</p>
      </div>

      <AnalysisOutput sections={sections} />

      <Link href="/" className="mt-12 text-sm text-blue-400 hover:underline">
        Analyze your own idea →
      </Link>
    </main>
  )
}
