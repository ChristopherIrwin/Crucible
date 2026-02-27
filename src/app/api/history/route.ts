import { auth } from '@/lib/auth'
import { getHistory } from '@/lib/history'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return new Response('Unauthorized', { status: 401 })

  const history = await getHistory(session.user.id)
  return Response.json(history)
}
