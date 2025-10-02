'use client'

import React from 'react'

export interface AccessContextValue {
  access?: boolean
}

const AccessContext = React.createContext<AccessContextValue>({})

export interface AccessProviderProps {
  access?: boolean
  children: React.ReactNode
}

export function AccessProvider({ access = false, children }: AccessProviderProps) {
  return <AccessContext.Provider value={{ access }}>{children}</AccessContext.Provider>
}

export function useAccess() {
  const context = React.useContext(AccessContext)
  if (!context) {
    return {
      access: false,
    }
  }

  return {
    access: !!context?.access,
  }
}
