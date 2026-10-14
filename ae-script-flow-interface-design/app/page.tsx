import { SiteHeader } from '@/components/site-header'
import { Hero } from '@/components/hero'
import { ExpressionGenerator } from '@/components/expression-generator'
import { SiteFooter } from '@/components/site-footer'
import { PricingProvider } from '@/components/pricing-provider'

export default function Page() {
  return (
    <div className="relative flex min-h-dvh flex-col overflow-x-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[560px] bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,oklch(0.63_0.22_293/0.22),transparent_70%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[560px] bg-[linear-gradient(to_right,oklch(1_0_0/0.03)_1px,transparent_1px),linear-gradient(to_bottom,oklch(1_0_0/0.03)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]"
      />
      <PricingProvider>
        <SiteHeader />
        <main className="flex-1">
          <Hero />
          <ExpressionGenerator />
        </main>
        <SiteFooter />
      </PricingProvider>
    </div>
  )
}
