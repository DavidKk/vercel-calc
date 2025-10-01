import type { HistoryState, HistoryAction } from './types'

export function historyReducer(state: HistoryState, action: HistoryAction): HistoryState {
  switch (action.type) {
    case 'SET_HISTORY':
      return { ...state, history: action.payload }
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    case 'ADD_ITEM':
      return { ...state, history: [action.payload, ...state.history] }
    case 'REMOVE_ITEM':
      return { ...state, history: state.history.filter((item) => item.id !== action.payload) }
    case 'UPDATE_ITEM':
      return {
        ...state,
        history: state.history.map((item) => (item.id === action.payload.id ? { ...item, ...action.payload.updates } : item)),
      }
    case 'CLEAR_HISTORY':
      return { ...state, history: [] }
    default:
      return state
  }
}
