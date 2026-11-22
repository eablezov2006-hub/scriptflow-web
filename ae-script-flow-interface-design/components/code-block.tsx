'use client'

import { useEffect, useRef, useState } from 'react'
import { Check, Clipboard, Crown, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const KEYWORDS = new Set([
  'var', 'let', 'const', 'if', 'else', 'return', 'function', 'for', 'while', 'true', 'false', 'null', 'undefined', 'new', 'try', 'catch',
])
const BUILTINS = new Set([
  'time', 'value', 'thisComp', 'thisLayer', 'thisProperty', 'inPoint', 'outPoint', 'Math', 'transform', 'effect', 'index', 'key', 'numKeys', 'width', 'height', 'text',
])

type TokenType = 'keyword' | 'string' | 'number' | 'function' | 'comment' | 'builtin' | 'plain'

const TOKEN_PATTERN =
  /(\/\/.*$|\/\*[\s\S]*?\*\/)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_$][\w$]*)(?=\s*\()|([A-Za-z_$][\w$]*)/gm

function tokenize(code: string) {
  const tokens: { type: TokenType; text: string }[] = []
  let last = 0
  for (const match of code.matchAll(TOKEN_PATTERN)) {
    const start = match.index ?? 0
    if (start > last) tokens.push({ type: 'plain', text: code.slice(last, start) })
    const [text, comment, str, num, fn, ident] = match
    let type: TokenType = 'plain'
    if (comment) type = 'comment'
    else if (str) type = 'string'
    else if (num) type = 'number'
    else if (fn) type = KEYWORDS.has(fn) ? 'keyword' : 'function'
    else if (ident) type = KEYWORDS.has(ident) ? 'keyword' : BUILTINS.has(ident) ? 'builtin' : 'plain'
    tokens.push({ type, text })
    last = start + text.length
  }
  if (last < code.length) tokens.push({ type: 'plain', text: code.slice(last) })
  return tokens
}

const TOKEN_CLASS: Record<TokenType, string> = {
  keyword: 'text-syntax-keyword',
  string: 'text-syntax-string',
  number: 'text-syntax-number',
  function: 'text-syntax-function',
  comment: 'text-syntax-comment italic',
  builtin: 'text-syntax-builtin',
  plain: 'text-foreground/90',
}

function copyWithFallback(text: string) {
  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.setAttribute('readonly', '')
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'
  document.body.appendChild(textarea)
  textarea.select()
  const ok = document.execCommand('copy')
  document.body.removeChild(textarea)
  return ok
}

export function CodeBlock({
  code,
  className,
  disabled,
  isPro,
  onDownloadJsx,
}: {
  code: string
  className?: string
  disabled?: boolean
  isPro?: boolean
  onDownloadJsx?: () => void
}) {
  const [copied, setCopied] = useState(false)
  const [downloaded, setDownloaded] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null)
  const lines = code.split('\n')

  useEffect(() => () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
  }, [])

  async function handleCopy() {
    let ok = false
    try {
      await navigator.clipboard.writeText(code)
      ok = true
    } catch {
      ok = copyWithFallback(code)
    }
    if (!ok) return
    setCopied(true)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => setCopied(false), 2000)
  }

  function handleJsxClick() {
    if (!onDownloadJsx) return
    onDownloadJsx()
    if (isPro) {
      setDownloaded(true)
      setTimeout(() => setDownloaded(false), 2000)
    }
  }

  return (
    <div className={cn('overflow-hidden rounded-xl border border-border bg-code', className)}>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-2">
        <div className="flex items-center gap-1.5" aria-hidden="true">
          <span className="size-2.5 rounded-full bg-foreground/15" />
          <span className="size-2.5 rounded-full bg-foreground/15" />
          <span className="size-2.5 rounded-full bg-foreground/15" />
          <span className="ml-2 font-mono text-xs text-muted-foreground">expression.js</span>
        </div>
        <div className="flex items-center gap-2">
          {onDownloadJsx && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleJsxClick}
              disabled={disabled || !code}
              className={cn(
                'gap-1.5 transition-colors',
                isPro
                  ? 'border-cyan/40 bg-cyan/10 text-cyan hover:bg-cyan/20'
                  : 'border-primary/40 bg-primary/10 text-foreground hover:bg-primary/20'
              )}
            >
              {downloaded ? (
                <Check className="size-3.5" aria-hidden="true" />
              ) : isPro ? (
                <Download className="size-3.5" aria-hidden="true" />
              ) : (
                <Crown className="size-3.5 text-cyan" aria-hidden="true" />
              )}
              <span>{downloaded ? 'Saved .jsx!' : 'Download .jsx'}</span>
              {!isPro && (
                <span className="rounded bg-gradient-to-r from-primary to-cyan px-1.5 py-0.2 text-[10px] font-bold text-primary-foreground">
                  PRO
                </span>
              )}
            </Button>
          )}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCopy}
            disabled={disabled || !code}
            aria-live="polite"
            className={cn(copied && 'border-cyan/40 text-cyan')}
          >
            {copied ? <Check aria-hidden="true" /> : <Clipboard aria-hidden="true" />}
            {copied ? 'Copied!' : 'Copy Code'}
          </Button>
        </div>
      </div>
      <pre className="max-h-[420px] overflow-auto py-4 font-mono text-[13px] leading-6">
        <code>
          {lines.map((line, i) => (
            <div key={i} className="flex px-4 hover:bg-foreground/[0.03]">
              <span className="mr-5 inline-block w-6 shrink-0 select-none text-right text-muted-foreground/50">
                {i + 1}
              </span>
              <span className="whitespace-pre">
                {line.length === 0
                  ? ' '
                  : tokenize(line).map((t, j) => (
                      <span key={j} className={TOKEN_CLASS[t.type]}>
                        {t.text}
                      </span>
                    ))}
              </span>
            </div>
          ))}
        </code>
      </pre>
    </div>
  )
}
