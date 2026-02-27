import { auth } from '@/lib/auth'
import { AuthButton } from './AuthButton'
import { CrucibleLogo } from './CrucibleLogo'
import { HistoryPanel } from './HistoryPanel'
import Link from 'next/link'

export async function Header() {
  const session = await auth()

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 border-b border-zinc-800/40 backdrop-blur-md bg-zinc-950/60">
      <Link href="/" className="flex items-center gap-2.5 text-zinc-100 hover:text-white transition-colors">
        <CrucibleLogo size={18} />
        <span className="font-bold tracking-[0.18em] text-sm uppercase">Crucible</span>
      </Link>
      <div className="flex items-center gap-3">
        <HistoryPanel />
        <AuthButton session={session} />
      </div>
    </header>
  )
}
