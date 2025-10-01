import { api } from '@/initializer/controller'
import { withAuthHandler } from '@/initializer/wrapper'
import { jsonInvalidParameters } from '@/initializer/response'
import { getHistoryList, addHistory, removeHistory, modifyHistory, clearHistory } from '@/app/actions/prices/history'

/** GET /api/prices/history - optional query `productType` */
export const GET = api(
  withAuthHandler(async (req) => {
    const url = new URL(req.url)
    const productType = url.searchParams.get('productType') || undefined
    const list = await getHistoryList(productType)
    return { data: list }
  })
)

/** POST /api/prices/history - add history record */
export const POST = api(
  withAuthHandler(async (req) => {
    const body = await req.json()
    if (!body) return jsonInvalidParameters('invalid body')
    const updated = await addHistory(body)
    return { data: updated }
  })
)

/** DELETE /api/prices/history - expects query id */
export const DELETE = api(
  withAuthHandler(async (req) => {
    const url = new URL(req.url)
    const id = url.searchParams.get('id')
    if (!id) return jsonInvalidParameters('missing id')
    const updated = await removeHistory(Number(id))
    return { data: updated }
  })
)

/** PATCH /api/prices/history - modify history record (expects id in query) */
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

/** PUT /api/prices/history/clear - clear all history (no body) */
export const PUT = api(
  withAuthHandler(async () => {
    await clearHistory()
    return { data: true }
  })
)
