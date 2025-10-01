import type { HistoryRecord } from '@/app/prices/components/history/types'

export interface HistoryState {
  history: HistoryRecord[]
  loading: boolean
  error: Error | null
}

export type HistoryAction =
  | { type: 'SET_HISTORY'; payload: HistoryRecord[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: Error | null }
  | { type: 'ADD_ITEM'; payload: HistoryRecord }
  | { type: 'REMOVE_ITEM'; payload: number }
  | { type: 'UPDATE_ITEM'; payload: { id: number; updates: Partial<HistoryRecord> } }
  | { type: 'CLEAR_HISTORY' }

export const initialState: HistoryState = {
  history: [],
  loading: false,
  error: null,
}
