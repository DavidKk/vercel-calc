'use server'

import type { HistoryRecord } from '@/app/prices/components/history/types'
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
        a.product.recommendedPrice === b.product.recommendedPrice &&
        a.product.brand === b.product.brand &&
        a.product.skuId === b.product.skuId
      )
    })()

    return (
      a.productType === b.productType &&
      a.unitPrice === b.unitPrice &&
      a.quantity === b.quantity &&
      a.unit === b.unit &&
      a.averagePrice === b.averagePrice &&
      a.priceLevel === b.priceLevel &&
      a.timestamp === b.timestamp &&
      a.recommendedPrice === b.recommendedPrice &&
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
  const history = await getHistoryFromGist()
  if (!productTypeName) return history
  return history.filter((h) => h.productType === productTypeName)
}

export async function addHistory(record: HistoryRecord): Promise<HistoryRecord[]> {
  const currentHistory = await getHistoryFromGist()
  const updatedHistory = dedupeAndInsert(record, currentHistory)
  await saveHistoryToGist(updatedHistory)
  return updatedHistory
}

export async function removeHistory(id: number): Promise<HistoryRecord[]> {
  const currentHistory = await getHistoryFromGist()
  const updatedHistory = currentHistory.filter((h) => h.id !== id)
  await saveHistoryToGist(updatedHistory)
  return updatedHistory
}

export async function modifyHistory(id: number, updates: Partial<HistoryRecord>): Promise<HistoryRecord[]> {
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
export async function addHistoryItem(newRecord: HistoryRecord, currentHistory?: HistoryRecord[]) {
  // 如果传入了 currentHistory，使用它；否则从 gist 读取
  const history = currentHistory && currentHistory.length ? currentHistory : await getHistoryFromGist()
  const updatedHistory = dedupeAndInsert(newRecord, history)
  await saveHistoryToGist(updatedHistory)
  return updatedHistory
}

/** Clear all history */
export async function clearHistory() {
  await saveHistoryToGist([])
}
