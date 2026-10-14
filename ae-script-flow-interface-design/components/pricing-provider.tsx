'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'
import { PricingModal } from '@/components/pricing-modal'

type PricingContextValue = {
  openPricing: (reason?: 'limit' | 'upgrade') => void
}

const PricingContext = createContext<PricingContextValue | null>(null)

export function PricingProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState<'limit' | 'upgrade'>('upgrade')

  return (
    <PricingContext.Provider
      value={{
        openPricing: (next = 'upgrade') => {
          setReason(next)
          setOpen(true)
        },
      }}
    >
      {children}
      <PricingModal open={open} onOpenChange={setOpen} reason={reason} />
    </PricingContext.Provider>
  )
}

export function usePricing() {
  const context = useContext(PricingContext)
  if (!context) throw new Error('usePricing must be used within PricingProvider')
  return context
}
