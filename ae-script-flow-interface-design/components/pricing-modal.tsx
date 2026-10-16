'use client'

import { useState } from 'react'
import { Check, Crown, Infinity as InfinityIcon, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

type Tier = {
  id: string
  name: string
  price: string
  cadence: string
  description: string
  features: string[]
  icon: typeof Zap
  highlight?: boolean
  href: string
 }


const TIERS: Tier[] = [
    {
    id: 'monthly',
    name: 'Pro Monthly',
    price: '$9',
    cadence: '/month',
    description: 'For motion designers shipping every week.',
    icon: Zap,
    features: ['Unlimited expressions', 'All property types', 'Priority response'],
    href: 'https://scriptflow.lemonsqueezy.com/checkout/buy/36ecd266-2470-4ad5-9eab-0221686dfd3a',
  },
  {
    id: 'lifetime',
    name: 'Lifetime Pass',
    price: '$29',
    cadence: 'one-time',
    description: 'Pay once, keep ScriptFlow forever.',
    icon: InfinityIcon,
    highlight: true,
    features: [
      'Lifetime unlimited access',
      'Free future updates',
      'Early access to the native AE plugin (.zxp)',
    ],
    href: 'https://scriptflow.lemonsqueezy.com/checkout/buy/bd703649-2537-42a8-97e4-a4811127777e',
  },
]

export function PricingModal({
  open,
  onOpenChange,
  reason,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  reason: 'limit' | 'upgrade'
}) {
  const [pendingTier, setPendingTier] = useState<string | null>(null)

  function selectTier(id: string) {
    setPendingTier(id)
    setTimeout(() => setPendingTier(null), 2200)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] gap-0 overflow-y-auto border border-border bg-card p-0 ring-0 shadow-2xl shadow-black/60 duration-200 sm:max-w-2xl">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(ellipse_70%_100%_at_50%_0%,oklch(0.63_0.22_293/0.25),transparent_70%)]"
        />
        <DialogHeader className="relative items-center px-6 pt-8 pb-6 text-center sm:px-8">
          <span className="mb-2 flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-cyan text-primary-foreground shadow-[0_0_32px_-6px] shadow-primary/70">
            <Crown className="size-5" aria-hidden="true" />
          </span>
          <DialogTitle className="text-2xl font-semibold tracking-tight text-balance">
            {reason === 'limit' ? "You've used all free generations" : 'Upgrade to ScriptFlow Pro'}
          </DialogTitle>
          <DialogDescription className="max-w-md text-pretty text-muted-foreground">
            {reason === 'limit'
              ? 'Unlock unlimited expressions and keep your animation workflow moving.'
              : 'Unlimited AI expressions for every property in your comp.'}
          </DialogDescription>
        </DialogHeader>

        <div className="relative grid gap-4 px-6 pb-6 sm:grid-cols-2 sm:px-8 sm:pb-8">
          {TIERS.map((tier) => {
            const Icon = tier.icon
            const pending = pendingTier === tier.id
            return (
              <div
                key={tier.id}
                className={cn(
                  'relative flex flex-col rounded-2xl border p-5 transition-colors',
                  tier.highlight
                    ? 'border-primary/50 bg-primary/[0.08] shadow-[0_0_40px_-12px] shadow-primary/60'
                    : 'border-border bg-background/50 hover:border-primary/25',
                )}
              >
                {tier.highlight && (
                  <span className="absolute -top-2.5 right-4 rounded-full bg-gradient-to-r from-primary to-cyan px-2.5 py-0.5 text-[11px] font-semibold text-primary-foreground">
                    Best Value
                  </span>
                )}
                <div className="flex items-center gap-2">
                  <Icon className={cn('size-4', tier.highlight ? 'text-cyan' : 'text-primary')} aria-hidden="true" />
                  <h3 className="font-medium">{tier.name}</h3>
                </div>
                <p className="mt-3 flex items-baseline gap-1.5">
                  <span className="text-4xl font-semibold tracking-tight">{tier.price}</span>
                  <span className="text-sm text-muted-foreground">{tier.cadence}</span>
                </p>
                <p className="mt-1.5 text-sm text-muted-foreground">{tier.description}</p>

                <ul className="mt-5 flex flex-1 flex-col gap-2.5">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <Check className="mt-0.5 size-4 shrink-0 text-cyan" aria-hidden="true" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                              <a
            href={tier.href}
            rel="noopener noreferrer"
            className={cn(
              'inline-flex items-center justify-center gap-2 mt-6 h-11 w-full rounded-xl font-semibold',
              tier.highlight
                ? 'bg-gradient-to-r from-primary to-cyan text-primary-foreground hover:opacity-90'
                : 'bg-secondary text-foreground hover:bg-secondary/70'
            )}
          >
            {tier.highlight && <Crown aria-hidden="true" />}
            {tier.id === 'monthly' ? 'Get Monthly Access' : 'Get Lifetime Access'}
          </a>
        </div>
      )
    })}
  </div>

  <p className="border-t border-border px-6 py-4 text-center text-xs text-muted-foreground">
    Secure checkout · One-time payment · Lifetime access
  </p>
</DialogContent>
    </Dialog>
  )
}
