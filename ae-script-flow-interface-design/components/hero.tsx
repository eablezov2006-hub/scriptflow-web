export function Hero() {
  return (
    <section className="mx-auto max-w-3xl px-4 pt-14 pb-10 text-center sm:pt-20 sm:pb-12">
      <p className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs text-muted-foreground">
        <span className="size-1.5 rounded-full bg-cyan" aria-hidden="true" />
        AI expression generator for Adobe After Effects
      </p>
      <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
        Generate After Effects Expressions with{' '}
        <span className="bg-gradient-to-r from-primary to-cyan bg-clip-text text-transparent">plain text</span>
      </h1>
      <p className="mx-auto mt-5 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
        Describe the motion you want. Get clean, commented code ready to paste onto any property.
      </p>
    </section>
  )
}
