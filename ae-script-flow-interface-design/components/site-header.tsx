'use client'

import { Crown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/logo'
import { usePricing } from '@/components/pricing-provider'

export function SiteHeader() {
  const { openPricing } = usePricing()

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <a href="/" className="flex items-center gap-2.5" aria-label="AE ScriptFlow home">
          <Logo />
          <span className="text-[15px] font-semibold tracking-tight">AE ScriptFlow</span>
          <span className="hidden rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-primary sm:inline-block">
            v1.0 Beta
          </span>
        </a>
        <nav className="flex items-center gap-2" aria-label="Account">
          <Button variant="ghost" size="lg" className="hidden px-3 text-muted-foreground sm:inline-flex">
            Sign In
          </Button>
                  <button
            type="button"
            onClick={openPricing}
            className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-primary to-cyan px-3.5 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-95"
          >
            <Crown aria-hidden="true" />
            <span className="sm:hidden">Pro</span>
            <span className="hidden sm:inline">Upgrade to Pro</span>
          </button>
        </nav>
      </div>
    </header>
  )
}
