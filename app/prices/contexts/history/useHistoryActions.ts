'use client'

import { useAction } from '@/hooks/useAction'
import { useHistoryContext } from './HistoryContext'
import type { HistoryRecord } from '@/app/prices/components/history/types'
import { getHistoryList, addHistoryItem, removeHistory, modifyHistory, clearHistory } from '@/app/actions/prices/history'

export function useHistoryActions() {
  const { dispatch } = useHistoryContext()

  const [loadHistory, loadingLoadHistory, errorLoadHistory] = useAction(async () => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const loadedHistory = await getHistoryList()
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
      const loadedHistory = await getHistoryList(productTypeName)
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
      const updatedHistory = await addHistoryItem(record)
      dispatch({ type: 'SET_HISTORY', payload: updatedHistory })
      // 移除了重复的 ADD_ITEM dispatch，因为 SET_HISTORY 已经更新了完整的历史记录列表
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
      await removeHistory(id)
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
      const updatedHistory = await modifyHistory(id, updates)
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
      await clearHistory()
      dispatch({ type: 'CLEAR_HISTORY' })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error as Error })
      throw error
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [])

  return {
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
