'use client'

import type { HistoryRecord } from '@/app/prices/components/history/types'

export async function getHistoryListFromLocalStorage(productTypeName?: string): Promise<HistoryRecord[]> {
  const history = localStorage.getItem('history')

  try {
    const list = history ? JSON.parse(history) : []
    return productTypeName ? list.filter((item: HistoryRecord) => item.productType === productTypeName) : list
  } catch (error) {
    localStorage.removeItem('history')
    return []
  }
}

export async function saveHistoryToLocalStorage(history: HistoryRecord[]) {
  localStorage.setItem('history', JSON.stringify(history))
}

export async function addHistoryToLocalStorage(history: Omit<HistoryRecord, 'id'>) {
  const currentHistory = await getHistoryListFromLocalStorage()

  // Generate incremental ID
  const maxId = currentHistory.length > 0 ? Math.max(...currentHistory.map((h) => h.id)) : 0
  const recordWithId: HistoryRecord = {
    ...history,
    id: maxId + 1,
  }

  currentHistory.push(recordWithId)
  await saveHistoryToLocalStorage(currentHistory)
  return currentHistory
}

export async function removeHistoryFromLocalStorage(id: number) {
  const currentHistory = await getHistoryListFromLocalStorage()
  const updatedHistory = currentHistory.filter((h) => h.id !== id)
  await saveHistoryToLocalStorage(updatedHistory)
  return updatedHistory
}

export async function modifyHistoryFromLocalStorage(id: number, updates: Partial<HistoryRecord>) {
  const currentHistory = await getHistoryListFromLocalStorage()
  const updatedHistory = currentHistory.map((h) => (h.id === id ? { ...h, ...updates } : h))
  await saveHistoryToLocalStorage(updatedHistory)
  return updatedHistory
}

export async function clearHistoryFromLocalStorage() {
  localStorage.removeItem('history')
}
