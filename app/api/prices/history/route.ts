import { api } from '@/initializer/controller'
import { withAuthHandler } from '@/initializer/wrapper'
import { jsonInvalidParameters } from '@/initializer/response'
import { getHistoryList, addHistory, removeHistory, modifyHistory, clearHistory } from '@/app/actions/prices/history'

/**
 * Get history list
 * Optional query param `productType`
 */
export const GET = api(
  withAuthHandler(async (req) => {
    const url = new URL(req.url)
    const productType = url.searchParams.get('productType') || undefined
    const list = await getHistoryList(productType)
    return { data: list }
  })
)

/**
 * Add history record
 */
export const POST = api(
  withAuthHandler(async (req) => {
    const body = await req.json()
    if (!body) return jsonInvalidParameters('invalid body')
    const updated = await addHistory(body)
    return { data: updated }
  })
)

/**
 * Delete history record
 * Query param `id` required
 */
export const DELETE = api(
  withAuthHandler(async (req) => {
    const url = new URL(req.url)
    const id = url.searchParams.get('id')
    if (!id) return jsonInvalidParameters('missing id')
    const updated = await removeHistory(Number(id))
    return { data: updated }
  })
)

/**
 * Modify history record
 * Query param `id` required
 */
export const PATCH = api(
  withAuthHandler(async (req) => {
    const url = new URL(req.url)
    const id = url.searchParams.get('id')
    if (!id) return jsonInvalidParameters('missing id')
    const updates = await req.json()
    const updated = await modifyHistory(Number(id), updates)
    return { data: updated }
  })
)

/**
 * Clear all history
 */
export const PUT = api(
  withAuthHandler(async () => {
    await clearHistory()
    return { data: true }
  })
)
