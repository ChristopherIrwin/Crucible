import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { getHistory } from '@/lib/history'
import { DashboardCard } from '@/components/DashboardCard'
import Link from 'next/link'

export const metadata = { title: 'Crucible — Your History' }

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/')

  const history = await getHistory(session.user.id, 50)

  return (
    <main className="min-h-screen px-4 py-12">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Your Analyses</h1>
          <p className="text-sm text-zinc-500">
            {history.length} idea{history.length !== 1 ? 's' : ''} pressure-tested
          </p>
        </div>

        {history.length === 0 ? (
          <div className="text-center py-20 space-y-3">
            <p className="text-zinc-500">No analyses yet.</p>
            <Link href="/" className="text-sm text-indigo-400 hover:underline">
              Analyze your first idea →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {history.map((entry) => (
              <DashboardCard key={entry.id} entry={entry} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
