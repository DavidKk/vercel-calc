'use client'

import React, { createContext, useContext, useReducer } from 'react'
import type { HistoryState, HistoryAction } from './types'
import { historyReducer } from './reducer'
import type { HistoryRecord } from '@/app/prices/components/history/types'

interface HistoryContextType extends HistoryState {
  dispatch: React.Dispatch<HistoryAction>
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined)

export function HistoryProvider({ children, initialHistory = [] }: { children: React.ReactNode; initialHistory?: HistoryRecord[] }) {
  const [state, dispatch] = useReducer(historyReducer, {
    history: initialHistory,
    loading: false,
    error: null,
  })

  return <HistoryContext.Provider value={{ ...state, dispatch }}>{children}</HistoryContext.Provider>
}

export function useHistoryContext() {
  const context = useContext(HistoryContext)
  if (context === undefined) {
    throw new Error('useHistoryContext must be used within a HistoryProvider')
  }

  return context
}
