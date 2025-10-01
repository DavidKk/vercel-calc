import { api } from '@/initializer/controller'
import { withAuthHandler } from '@/initializer/wrapper'
import { jsonInvalidParameters } from '@/initializer/response'
import { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } from '@/app/actions/prices/product'

/**
 * GET /api/prices/products
 * - if query param `id` present, return single product
 * - otherwise return all products
 */
export const GET = api(async (req) => {
  const url = new URL(req.url)
  const id = url.searchParams.get('id')

  if (id) {
    const product = await getProductById(id)
    if (!product) return jsonInvalidParameters('product not found')
    return { data: product }
  }

  const products = await getAllProducts()
  return { data: products }
})

/** POST /api/prices/products - create product */
export const POST = api(
  withAuthHandler(async (req) => {
    const body = await req.json()
    if (!body || !body.name || typeof body.recommendedPrice !== 'number') {
      return jsonInvalidParameters('invalid product payload')
    }

    const product = await createProduct(body)
    return { data: product }
  })
)

/** PUT /api/prices/products - update product (query id) */
export const PUT = api(
  withAuthHandler(async (req) => {
    const url = new URL(req.url)
    const id = url.searchParams.get('id')
    if (!id) return jsonInvalidParameters('missing id')

    const updates = await req.json()
    const updated = await updateProduct(id, updates)
    if (!updated) return jsonInvalidParameters('product not found')
    return { data: updated }
  })
)

/** DELETE /api/prices/products - delete product (query id) */
export const DELETE = api(
  withAuthHandler(async (req) => {
    const url = new URL(req.url)
    const id = url.searchParams.get('id')
    if (!id) return jsonInvalidParameters('missing id')

    const ok = await deleteProduct(id)
    return { data: ok }
  })
)
