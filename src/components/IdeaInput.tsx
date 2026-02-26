'use client'

import { useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

interface Props {
  onAnalyze: (idea: string, intensity: 'mild' | 'brutal') => void
  isLoading: boolean
}

export function IdeaInput({ onAnalyze, isLoading }: Props) {
  const [idea, setIdea] = useState('')
  const [intensity, setIntensity] = useState<'mild' | 'brutal'>('brutal')

  function handleSubmit() {
    if (!idea.trim() || isLoading) return
    onAnalyze(idea.trim(), intensity)
  }

  return (
    <div className="space-y-4 w-full max-w-2xl">
      <Textarea
        placeholder="Describe your idea in a few sentences. What does it do? Who is it for?"
        value={idea}
        onChange={(e) => setIdea(e.target.value)}
        className="min-h-[120px] resize-none text-base"
        onKeyDown={(e) => {
          if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmit()
        }}
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Intensity</span>
          <ToggleGroup
            type="single"
            value={intensity}
            onValueChange={(v) => v && setIntensity(v as 'mild' | 'brutal')}
          >
            <ToggleGroupItem value="mild" className="text-sm">Mild</ToggleGroupItem>
            <ToggleGroupItem value="brutal" className="text-sm">Brutal</ToggleGroupItem>
          </ToggleGroup>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!idea.trim() || isLoading}
        >
          {isLoading ? 'Analyzing…' : 'Analyze →'}
        </Button>
      </div>
    </div>
  )
}
