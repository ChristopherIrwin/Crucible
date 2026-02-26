'use client'

import { useState } from 'react'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { detectProvider } from '@/lib/ai/provider'
import { ApiConfig, Provider } from '@/lib/types'

interface Props {
  open: boolean
  onSave: (config: ApiConfig) => void
}

const PROVIDERS: { id: Provider; label: string; free: string; link: string }[] = [
  { id: 'groq',      label: 'Groq',       free: '14,400 req/day · Llama 3.3 70B',     link: 'https://console.groq.com/keys' },
  { id: 'google',    label: 'Google AI',  free: '1,500 req/day · Gemini 2.0 Flash',   link: 'https://aistudio.google.com/apikey' },
  { id: 'openai',    label: 'OpenAI',     free: 'Paid · Pay as you go · GPT-4o',      link: 'https://platform.openai.com/api-keys' },
  { id: 'anthropic', label: 'Anthropic',  free: 'Paid · Pay as you go · Claude',      link: 'https://console.anthropic.com/keys' },
]

export function KeySetupModal({ open, onSave }: Props) {
  const [apiKey, setApiKey] = useState('')

  const detected = apiKey ? detectProvider(apiKey) : null

  function handleSave() {
    if (!detected || !apiKey) return
    onSave({ provider: detected, apiKey })
  }

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-lg" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Add your API key to start</DialogTitle>
          <DialogDescription>
            Your key is stored locally in your browser and never sent to our servers.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 mt-2">
          <p className="text-sm text-muted-foreground font-medium">Free options (recommended)</p>
          {PROVIDERS.map((p) => (
            <div key={p.id} className="flex items-center justify-between rounded-md border border-border px-3 py-2">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">{p.label}</span>
                <span className="text-xs text-muted-foreground">{p.free}</span>
              </div>
              <a href={p.link} target="_blank" rel="noreferrer" className="text-xs text-blue-400 hover:underline">
                Get key ↗
              </a>
            </div>
          ))}
        </div>

        <div className="mt-4 space-y-2">
          <Input
            placeholder="Paste your API key here"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            type="password"
          />
          {detected && (
            <p className="text-xs text-muted-foreground">
              Detected: <Badge variant="secondary">{detected}</Badge>
            </p>
          )}
        </div>

        <Button onClick={handleSave} disabled={!detected} className="w-full mt-2">
          Start Analyzing
        </Button>
      </DialogContent>
    </Dialog>
  )
}
