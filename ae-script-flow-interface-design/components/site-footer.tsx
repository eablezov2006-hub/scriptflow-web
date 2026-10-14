import { BookOpen, MessageCircle } from 'lucide-react'

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:px-6">
        <p>
          {'© 2026 AE ScriptFlow. Built for motion designers. Not affiliated with Adobe.'}
        </p>
        <nav className="flex items-center gap-5" aria-label="Footer">
          <a href="#" className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground">
            <BookOpen className="size-4" aria-hidden="true" />
            Docs
          </a>
          <a href="#" className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground">
            <MessageCircle className="size-4" aria-hidden="true" />
            Join Discord
          </a>
        </nav>
      </div>
    </footer>
  )
}
