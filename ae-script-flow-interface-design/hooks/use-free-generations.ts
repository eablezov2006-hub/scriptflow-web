'use client'

import { useCallback, useSyncExternalStore } from 'react'

export const FREE_GENERATION_LIMIT = 3
const STORAGE_KEY = 'ae-scriptflow:generations-used'
const listeners = new Set<() => void>()

function readUsed() {
  const value = Number(window.localStorage.getItem(STORAGE_KEY))
  return Number.isFinite(value) ? Math.min(Math.max(value, 0), FREE_GENERATION_LIMIT) : 0
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  window.addEventListener('storage', listener)
  return () => {
    listeners.delete(listener)
    window.removeEventListener('storage', listener)
  }
}

export function useFreeGenerations() {
  const used = useSyncExternalStore(subscribe, readUsed, () => 0)
  const remaining = FREE_GENERATION_LIMIT - used

  const consume = useCallback(() => {
    const next = Math.min(readUsed() + 1, FREE_GENERATION_LIMIT)
    window.localStorage.setItem(STORAGE_KEY, String(next))
    listeners.forEach((listener) => listener())
    return FREE_GENERATION_LIMIT - next
  }, [])

  return { remaining, limit: FREE_GENERATION_LIMIT, consume }
}
