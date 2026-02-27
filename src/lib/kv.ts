import { kv } from '@vercel/kv'
import { AnalysisResult } from '@/lib/types'

const TTL_SECONDS = 60 * 60 * 24 * 30 // 30 days
const KEY_PREFIX = 'share'

export async function saveResult(
  id: string,
  result: AnalysisResult,
  persist = false
): Promise<void> {
  if (persist) {
    await kv.set(`${KEY_PREFIX}:${id}`, result)
  } else {
    await kv.set(`${KEY_PREFIX}:${id}`, result, { ex: TTL_SECONDS })
  }
}

export async function getResult(id: string): Promise<AnalysisResult | null> {
  return kv.get<AnalysisResult>(`${KEY_PREFIX}:${id}`)
}
