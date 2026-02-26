'use client'

import { useState, useEffect } from 'react'
import { ApiConfig } from '@/lib/types'

const STORAGE_KEY = 'crucible:api-config'

export function useApiConfig() {
  const [config, setConfig] = useState<ApiConfig | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) setConfig(JSON.parse(stored))
    } catch {}
    setLoaded(true)
  }, [])

  function saveConfig(c: ApiConfig) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(c))
    setConfig(c)
  }

  function clearConfig() {
    localStorage.removeItem(STORAGE_KEY)
    setConfig(null)
  }

  return { config, loaded, saveConfig, clearConfig }
}
