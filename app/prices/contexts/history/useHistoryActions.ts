'use client'

import { useEffect } from 'react'
import { useAction } from '@/hooks/useAction'
import type { HistoryRecord } from '@/app/prices/components/history/types'
import { getHistoryList, addHistoryItem, removeHistory, modifyHistory, clearHistory } from '@/app/actions/prices/history'
import { useAccess } from '@/contexts/access'
import { getHistoryListFromLocalStorage, addHistoryToLocalStorage, removeHistoryFromLocalStorage, modifyHistoryFromLocalStorage, clearHistoryFromLocalStorage } from './actions'
import { useHistoryContext } from './HistoryContext'

export function useHistoryActions() {
  const { access } = useAccess()
  const useLocalStorage = !access

  const { history, loading, dispatch } = useHistoryContext()
  const [loadHistory, loadingLoadHistory, errorLoadHistory] = useAction(async () => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const loadedHistory = useLocalStorage ? await getHistoryListFromLocalStorage() : await getHistoryList()
      dispatch({ type: 'SET_HISTORY', payload: loadedHistory })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error as Error })
      throw error
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [])

  const [loadHistoryByProduct, loadingLoadHistoryByProduct, errorLoadHistoryByProduct] = useAction(async (productTypeName: string) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const loadedHistory = useLocalStorage ? await getHistoryListFromLocalStorage(productTypeName) : await getHistoryList(productTypeName)
      dispatch({ type: 'SET_HISTORY', payload: loadedHistory })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error as Error })
      throw error
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [])

  const [addToHistory, loadingAddToHistory, errorAddToHistory] = useAction(async (record: HistoryRecord) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const updatedHistory = useLocalStorage ? await addHistoryToLocalStorage(record) : await addHistoryItem(record)
      dispatch({ type: 'SET_HISTORY', payload: updatedHistory })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error as Error })
      throw error
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [])

  const [removeFromHistory, loadingRemoveFromHistory, errorRemoveFromHistory] = useAction(async (id: number) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      useLocalStorage ? await removeHistoryFromLocalStorage(id) : await removeHistory(id)
      dispatch({ type: 'REMOVE_ITEM', payload: id })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error as Error })
      throw error
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [])

  const [updateHistory, loadingUpdateHistory, errorUpdateHistory] = useAction(async (id: number, updates: Partial<HistoryRecord>) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const updatedHistory = useLocalStorage ? await modifyHistoryFromLocalStorage(id, updates) : await modifyHistory(id, updates)
      dispatch({ type: 'SET_HISTORY', payload: updatedHistory })
      dispatch({ type: 'UPDATE_ITEM', payload: { id, updates } })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error as Error })
      throw error
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [])

  const [clearAllHistory, loadingClearAllHistory, errorClearAllHistory] = useAction(async () => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      useLocalStorage ? await clearHistoryFromLocalStorage() : await clearHistory()
      dispatch({ type: 'CLEAR_HISTORY' })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error as Error })
      throw error
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [])

  useEffect(() => {
    if (useLocalStorage) {
      loadHistory()
    }
  }, [useLocalStorage])

  return {
    history,
    loading,
    loadHistory,
    loadHistoryByProduct,
    addToHistory,
    removeFromHistory,
    updateHistory,
    clearAllHistory,
    loadingLoadHistory,
    loadingLoadHistoryByProduct,
    loadingAddToHistory,
    loadingRemoveFromHistory,
    loadingUpdateHistory,
    loadingClearAllHistory,
    errorLoadHistory,
    errorLoadHistoryByProduct,
    errorAddToHistory,
    errorRemoveFromHistory,
    errorUpdateHistory,
    errorClearAllHistory,
  }
}
