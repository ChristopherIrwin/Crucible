import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { MutationVariants } from '@/lib/types'

interface Props {
  mutation: MutationVariants
}

const MUTATIONS: { key: keyof MutationVariants; label: string; description: string }[] = [
  { key: 'safer',           label: 'Safer',            description: 'Smaller niche, faster monetization' },
  { key: 'scalable',        label: 'Scalable',         description: 'Larger TAM, venture potential' },
  { key: 'unfairAdvantage', label: 'Unfair Advantage', description: 'Built on founder strengths' },
  { key: 'wildcard',        label: 'Wildcard',         description: 'High-risk, asymmetric upside' },
]

export function MutationCards({ mutation }: Props) {
  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Mutations</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {MUTATIONS.map(({ key, label, description }) => (
          mutation[key] ? (
            <Card key={key} className="bg-zinc-900 border-zinc-800">
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-sm font-medium">{label}</CardTitle>
                <p className="text-xs text-muted-foreground">{description}</p>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <p className="text-sm text-zinc-300">{mutation[key]}</p>
              </CardContent>
            </Card>
          ) : null
        ))}
      </div>
    </div>
  )
}
