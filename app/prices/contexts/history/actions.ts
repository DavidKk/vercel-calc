'use client'

import type { HistoryRecord } from '@/app/prices/components/history/types'
import { isSameRecord } from '@/app/prices/components/history/types'

function getComparableBrand(r: HistoryRecord) {
  return r.brand ?? r.product?.brand ?? undefined
}

function getComparableProductId(r: HistoryRecord) {
  return r.product?.id ?? undefined
}

function dedupeAndInsert(newRecord: HistoryRecord, current: HistoryRecord[]): HistoryRecord[] {
  // identical record check
  const existingIndex = current.findIndex((r) => isSameRecord(r, newRecord, { compareUnitPrice: true }))
  if (existingIndex !== -1) {
    const existing = current[existingIndex]
    const withoutExisting = current.filter((_, idx) => idx !== existingIndex)
    return [existing, ...withoutExisting].slice(0, 10)
  }

  // Check for same product ID on the same day
  const productId = getComparableProductId(newRecord)
  const sameDayProductIdIndex = productId ? current.findIndex((r) => r.timestamp === newRecord.timestamp && getComparableProductId(r) === productId) : -1

  if (sameDayProductIdIndex !== -1) {
    const withoutExisting = current.filter((_, idx) => idx !== sameDayProductIdIndex)
    return [newRecord, ...withoutExisting].slice(0, 10)
  }

  // Check for same product type and brand on the same day (fallback)
  const sameDayProductBrandIndex = current.findIndex(
    (r) => r.timestamp === newRecord.timestamp && r.productType === newRecord.productType && getComparableBrand(r) === getComparableBrand(newRecord)
  )

  if (sameDayProductBrandIndex !== -1) {
    const withoutExisting = current.filter((_, idx) => idx !== sameDayProductBrandIndex)
    return [newRecord, ...withoutExisting].slice(0, 10)
  }

  return [newRecord, ...current].slice(0, 10)
}

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

export async function addHistoryToLocalStorage(history: Omit<HistoryRecord, 'id' | 'timestamp'>) {
  const currentHistory = await getHistoryListFromLocalStorage()

  // Generate incremental ID
  const maxId = currentHistory.length > 0 ? Math.max(...currentHistory.map((h) => h.id)) : 0

  // Generate timestamp
  const today = new Date()
  const timestamp = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0')

  const recordWithId: HistoryRecord = {
    ...history,
    id: maxId + 1,
    timestamp,
  }

  const updatedHistory = dedupeAndInsert(recordWithId, currentHistory)
  await saveHistoryToLocalStorage(updatedHistory)
  return updatedHistory
}

export async function removeHistoryFromLocalStorage(id: number) {
  const currentHistory = await getHistoryListFromLocalStorage()
  const updatedHistory = currentHistory.filter((h) => h.id !== id)
  await saveHistoryToLocalStorage(updatedHistory)
  return updatedHistory
}

export async function modifyHistoryFromLocalStorage(id: number, updates: Partial<HistoryRecord>) {
  const currentHistory = await getHistoryListFromLocalStorage()
  const idx = currentHistory.findIndex((h) => h.id === id)
  if (idx === -1) return currentHistory

  const updated = { ...currentHistory[idx], ...updates }
  // re-apply dedupe in case product/brand/date/avg changed
  const without = currentHistory.filter((_, i) => i !== idx)
  const updatedHistory = dedupeAndInsert(updated, without)
  await saveHistoryToLocalStorage(updatedHistory)
  return updatedHistory
}

export async function clearHistoryFromLocalStorage() {
  localStorage.removeItem('history')
}
