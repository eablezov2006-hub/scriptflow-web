'use client'

import { useState } from 'react'
import { Crown, Lock, Loader2, MousePointerClick, Sparkles, Target, Timer } from 'lucide-react'
import { useFreeGenerations } from '@/hooks/use-free-generations'
import { usePricing } from '@/components/pricing-provider'
import { Button } from '@/components/ui/button'
import { CodeBlock } from '@/components/code-block'
import { PRESETS, SAMPLE_EXPRESSION, type Expression } from '@/lib/presets'
import { generateMockExpression } from '@/lib/mock-generator'
import { cn } from '@/lib/utils'

const MAX_LENGTH = 1000

export function ExpressionGenerator() {
  const [prompt, setPrompt] = useState('')
  const [result, setResult] = useState<Expression>(SAMPLE_EXPRESSION)
  const [isSample, setIsSample] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [activePreset, setActivePreset] = useState<string | null>(null)
  const { remaining, limit, consume } = useFreeGenerations()
  const { openPricing } = usePricing()
  const limitReached = remaining <= 0

  async function generate() {
    if (limitReached) {
      openPricing('limit')
      return
    }
    if (prompt.trim().length < 3 || isLoading) return
    const left = consume()
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setResult(generateMockExpression(prompt))
    setIsSample(false)
    setIsLoading(false)
    if (left <= 0) openPricing('limit')
  }

  return (
    <section
      aria-label="Expression generator"
      className="mx-auto grid max-w-6xl gap-5 px-4 pb-20 sm:px-6 lg:grid-cols-2 lg:gap-6"
    >
      <form
        onSubmit={(e) => {
          e.preventDefault()
          generate()
        }}
        className="flex flex-col rounded-2xl border border-border bg-card p-5 shadow-2xl shadow-black/40 sm:p-6"
      >
        <div className="mb-4 flex items-center justify-between">
          <label htmlFor="prompt" className="text-sm font-medium">
            Describe your animation
          </label>
          <span className="font-mono text-xs text-muted-foreground">
            {prompt.length}/{MAX_LENGTH}
          </span>
        </div>

        <textarea
          id="prompt"
          value={prompt}
          maxLength={MAX_LENGTH}
          onChange={(e) => {
            setPrompt(e.target.value)
            setActivePreset(null)
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
              if (e.nativeEvent.isComposing || e.keyCode === 229) return
              e.preventDefault()
              generate()
            }
          }}
          placeholder="e.g., Make the layer bounce when it appears with decay..."
          rows={7}
          className="min-h-44 w-full flex-1 resize-none rounded-xl border border-input bg-background/60 p-4 text-[15px] leading-relaxed text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus-visible:border-primary/60 focus-visible:ring-3 focus-visible:ring-primary/20"
        />

        <div className="mt-4">
          <p className="mb-2.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">Quick presets</p>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((preset) => {
              const active = activePreset === preset.label
              return (
                <button
                  key={preset.label}
                  type="button"
                  aria-pressed={active}
                  onClick={() => {
                    setPrompt(preset.prompt)
                    setActivePreset(preset.label)
                  }}
                  className={cn(
                    'rounded-full border px-3 py-1.5 text-xs font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/40',
                    active
                      ? 'border-primary/50 bg-primary/15 text-foreground'
                      : 'border-border bg-secondary/60 text-muted-foreground hover:border-primary/30 hover:text-foreground',
                  )}
                >
                  {preset.label}
                </button>
              )
            })}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between gap-3 rounded-xl border border-border bg-background/50 px-3.5 py-2.5">
          <div className="flex items-center gap-2.5 text-xs">
            <span className="text-muted-foreground">Free generations remaining:</span>
            <span
              className={cn(
                'rounded-full px-2 py-0.5 font-mono font-semibold',
                limitReached ? 'bg-destructive/15 text-destructive' : 'bg-cyan/10 text-cyan',
              )}
              aria-live="polite"
            >
              {remaining}/{limit}
            </span>
          </div>
          <div className="flex gap-1" aria-hidden="true">
            {Array.from({ length: limit }).map((_, i) => (
              <span
                key={i}
                className={cn(
                  'h-1.5 w-5 rounded-full transition-colors duration-500',
                  i < remaining ? 'bg-gradient-to-r from-primary to-cyan' : 'bg-secondary',
                )}
              />
            ))}
          </div>
        </div>

        {limitReached && !isLoading ? (
          <div className="mt-3 flex flex-col gap-2">
            <Button
              type="button"
              disabled
              className="h-12 w-full rounded-xl bg-secondary text-[15px] font-semibold text-muted-foreground"
            >
              <Lock className="size-5" aria-hidden="true" />
              {'Limit Reached \u2014 Upgrade to Pro'}
            </Button>
            <button
              type="button"
              onClick={() => openPricing('limit')}
              className="inline-flex items-center justify-center gap-1.5 text-xs font-medium text-primary hover:text-cyan"
            >
              <Crown className="size-3.5" aria-hidden="true" />
              View Pro plans
            </button>
          </div>
        ) : (
          <Button
            type="submit"
            disabled={prompt.trim().length < 3 || isLoading}
            className="mt-3 h-12 w-full rounded-xl bg-gradient-to-r from-primary via-[oklch(0.6_0.2_260)] to-cyan text-[15px] font-semibold text-primary-foreground shadow-[0_8px_32px_-8px] shadow-primary/70 transition-opacity hover:opacity-90"
          >
            {isLoading ? (
              <Loader2 className="size-5 animate-spin" aria-hidden="true" />
            ) : (
              <Sparkles className="size-5" aria-hidden="true" />
            )}
            {isLoading ? 'Generating...' : 'Generate Expression'}
          </Button>
        )}
        <p className="mt-2.5 text-center text-xs text-muted-foreground">
          Press <kbd className="rounded border border-border bg-secondary px-1.5 py-0.5 font-mono text-[10px]">Ctrl</kbd>{' '}
          + <kbd className="rounded border border-border bg-secondary px-1.5 py-0.5 font-mono text-[10px]">Enter</kbd> to
          generate
        </p>
      </form>

      <div className="flex flex-col rounded-2xl border border-border bg-card p-5 shadow-2xl shadow-black/40 sm:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-medium">Output</h2>
          <div className="flex items-center gap-2">
            {isSample && (
              <span className="rounded-full border border-border px-2 py-0.5 text-[11px] text-muted-foreground">
                Sample
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan/30 bg-cyan/10 px-2.5 py-1 text-xs font-medium text-cyan">
              <Target className="size-3.5" aria-hidden="true" />
              Property: {result.property}
            </span>
          </div>
        </div>

        <div aria-live="polite" aria-busy={isLoading} className="relative flex-1">
          <CodeBlock
            code={result.code}
            disabled={isLoading}
            className={cn('transition-opacity', isLoading && !result.code && 'opacity-40')}
          />
          {isLoading && !result.code && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-popover px-3 py-1.5 text-xs text-muted-foreground">
                <Loader2 className="size-3.5 animate-spin text-primary" aria-hidden="true" />
                Writing your expression
              </span>
            </div>
          )}
        </div>

        <p className="mt-3 text-sm text-muted-foreground">{result.summary}</p>

        <div className="mt-4 flex gap-3 rounded-xl border border-primary/20 bg-primary/[0.07] p-4">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <MousePointerClick className="size-4" aria-hidden="true" />
          </span>
          <div className="text-sm leading-relaxed">
            <p className="font-medium">How to apply in After Effects</p>
            <p className="mt-0.5 text-muted-foreground">
              Select the <span className="text-foreground">{result.property}</span> property, then{' '}
              <kbd className="rounded border border-border bg-secondary px-1.5 py-0.5 font-mono text-[11px] text-foreground">
                Alt
              </kbd>{' '}
              +{' '}
              <span className="inline-flex items-center gap-1 text-foreground">
                Click the stopwatch <Timer className="size-3.5" aria-hidden="true" />
              </span>{' '}
              (Option + Click on Mac) and paste the code.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
