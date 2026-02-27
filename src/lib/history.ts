import { kv } from '@vercel/kv'

export interface HistoryEntry {
  id: string
  ideaSnippet: string
  overallScore: number
  createdAt: number
}

const historyKey = (userId: string) => `user:${userId}:history`

export async function addToHistory(userId: string, entry: HistoryEntry): Promise<void> {
  await kv.zadd(historyKey(userId), { score: entry.createdAt, member: JSON.stringify(entry) })
  // Keep only last 100 entries
  await kv.zremrangebyrank(historyKey(userId), 0, -101)
}

export async function getHistory(userId: string, limit = 20): Promise<HistoryEntry[]> {
  const raw = await kv.zrange(historyKey(userId), 0, limit - 1, { rev: true }) as string[]
  return raw.map(e => JSON.parse(e))
}
