'use server'

import type { HistoryRecord } from '@/app/prices/components/history/types'
import { validateCookie } from '@/services/auth/access'
import { readGistFile, writeGistFile, getGistInfo } from '@/services/gist'

const HISTORY_FILE_NAME = 'history.json'

async function getHistoryFromGist(): Promise<HistoryRecord[]> {
  try {
    const { gistId, gistToken } = getGistInfo()
    const content = await readGistFile({ gistId, gistToken, fileName: HISTORY_FILE_NAME })
    return JSON.parse(content)
  } catch (error) {
    // 如果文件不存在或读取失败，返回空数组
    return []
  }
}

async function saveHistoryToGist(history: HistoryRecord[]): Promise<void> {
  const { gistId, gistToken } = getGistInfo()
  const content = JSON.stringify(history, null, 2)
  await writeGistFile({ gistId, gistToken, fileName: HISTORY_FILE_NAME, content })
}

function getComparableBrand(r: HistoryRecord) {
  return r.brand ?? r.product?.brand ?? undefined
}

function getComparableProductId(r: HistoryRecord) {
  return r.product?.id ?? undefined
}

function dedupeAndInsert(newRecord: HistoryRecord, current: HistoryRecord[]): HistoryRecord[] {
  // identical record check
  const isSameRecord = (a: HistoryRecord, b: HistoryRecord) => {
    const productEqual = (() => {
      if (!a.product && !b.product) return true
      if (!a.product || !b.product) return false
      return (
        a.product.id === b.product.id &&
        a.product.name === b.product.name &&
        a.product.unit === b.product.unit &&
        a.product.unitBestPrice === b.product.unitBestPrice &&
        a.product.brand === b.product.brand &&
        a.product.skuId === b.product.skuId
      )
    })()

    return (
      a.productType === b.productType &&
      a.totalPrice === b.totalPrice &&
      a.totalQuantity === b.totalQuantity &&
      a.unit === b.unit &&
      a.averagePrice === b.averagePrice &&
      a.priceLevel === b.priceLevel &&
      a.timestamp === b.timestamp &&
      a.unitBestPrice === b.unitBestPrice &&
      a.brand === b.brand &&
      productEqual
    )
  }

  const existingIndex = current.findIndex((r) => isSameRecord(r, newRecord))
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

// CRUD API
export async function getHistoryList(productTypeName?: string): Promise<HistoryRecord[]> {
  if (!(await validateCookie())) {
    return []
  }

  const history = await getHistoryFromGist()
  if (!productTypeName) {
    return history
  }

  return history.filter((h) => h.productType === productTypeName)
}

export async function addHistory(record: HistoryRecord): Promise<HistoryRecord[]> {
  if (!(await validateCookie())) {
    throw new Error('Not authorized')
  }

  const currentHistory = await getHistoryFromGist()
  const updatedHistory = dedupeAndInsert(record, currentHistory)
  await saveHistoryToGist(updatedHistory)
  return updatedHistory
}

export async function removeHistory(id: number): Promise<HistoryRecord[]> {
  if (!(await validateCookie())) {
    throw new Error('Not authorized')
  }

  const currentHistory = await getHistoryFromGist()
  const updatedHistory = currentHistory.filter((h) => h.id !== id)
  await saveHistoryToGist(updatedHistory)
  return updatedHistory
}

export async function modifyHistory(id: number, updates: Partial<HistoryRecord>): Promise<HistoryRecord[]> {
  if (!(await validateCookie())) {
    throw new Error('Not authorized')
  }

  const currentHistory = await getHistoryFromGist()
  const idx = currentHistory.findIndex((h) => h.id === id)
  if (idx === -1) return currentHistory

  const updated = { ...currentHistory[idx], ...updates }
  // re-apply dedupe in case product/brand/date/avg changed
  const without = currentHistory.filter((_, i) => i !== idx)
  const updatedHistory = dedupeAndInsert(updated, without)
  await saveHistoryToGist(updatedHistory)
  return updatedHistory
}

/** Add new history record with per-day per-product per-brand lowest price dedupe */
export async function addHistoryItem(newRecord: Omit<HistoryRecord, 'id' | 'timestamp'>, currentHistory?: HistoryRecord[]) {
  if (!(await validateCookie())) {
    throw new Error('Not authorized')
  }

  const history = currentHistory && currentHistory.length ? currentHistory : await getHistoryFromGist()

  // Generate incremental ID
  const maxId = history.length > 0 ? Math.max(...history.map((h) => h.id)) : 0

  // Generate timestamp
  const today = new Date()
  const timestamp = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0')

  const recordWithId: HistoryRecord = {
    ...newRecord,
    id: maxId + 1,
    timestamp,
  }

  const updatedHistory = dedupeAndInsert(recordWithId, history)
  await saveHistoryToGist(updatedHistory)
  return updatedHistory
}

/** Clear all history */
export async function clearHistory() {
  if (!(await validateCookie())) {
    throw new Error('Not authorized')
  }

  await saveHistoryToGist([])
}
