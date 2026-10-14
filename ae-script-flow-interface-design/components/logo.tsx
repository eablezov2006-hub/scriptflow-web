import { Braces } from 'lucide-react'

export function Logo() {
  return (
    <span
      aria-hidden="true"
      className="relative flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-cyan p-px"
    >
      <span className="flex size-full items-center justify-center rounded-[7px] bg-card">
        <Braces className="size-4 text-cyan" strokeWidth={2.25} />
      </span>
    </span>
  )
}
