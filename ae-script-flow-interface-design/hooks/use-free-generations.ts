'use client'

import { useCallback, useSyncExternalStore } from 'react'

export const FREE_GENERATION_LIMIT = 3
const STORAGE_KEY = 'ae-scriptflow:generations-used'
const PRO_KEY = 'ae-scriptflow:pro-unlocked'
const SECRET_CODE = 'FLOW2026' // Секретный код для покупателей

const listeners = new Set<() => void>()

function isProUser(): boolean {
  if (typeof window === 'undefined') return false
  return window.localStorage.getItem(PRO_KEY) === 'true'
}

function readUsed() {
  if (typeof window === 'undefined') return 0
  if (isProUser()) return 0
  const value = Number(window.localStorage.getItem(STORAGE_KEY))
  return Number.isFinite(value) ? Math.min(Math.max(value, 0), FREE_GENERATION_LIMIT) : 0
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  const handleStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY || e.key === PRO_KEY) {
      listener()
    }
  }
  window.addEventListener('storage', handleStorage)
  return () => {
    listeners.delete(listener)
    window.removeEventListener('storage', handleStorage)
  }
}

export function useFreeGenerations() {
  const used = useSyncExternalStore(subscribe, readUsed, () => 0)
  const isPro = typeof window !== 'undefined' ? isProUser() : false
  const remaining = isPro ? 999999 : FREE_GENERATION_LIMIT - used

  const consume = useCallback(() => {
    if (isProUser()) return 999999
    const next = Math.min(readUsed() + 1, FREE_GENERATION_LIMIT)
    window.localStorage.setItem(STORAGE_KEY, String(next))
    listeners.forEach((listener) => listener())
    return FREE_GENERATION_LIMIT - next
  }, [])

  const unlockPro = useCallback((code: string) => {
    if (code.trim().toUpperCase() === SECRET_CODE) {
      window.localStorage.setItem(PRO_KEY, 'true')
      listeners.forEach((listener) => listener())
      return true
    }
    return false
  }, [])

  return {
    remaining,
    limit: FREE_GENERATION_LIMIT,
    consume,
    isPro,
    unlockPro,
  }
}
