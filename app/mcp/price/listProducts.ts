import { z } from 'zod'
import { tool } from '@/initializer/mcp'
import { getAllProducts } from '@/app/actions/prices/product'

const name = 'list_products'
const description = 'Get all products'
const paramsSchema = z.object({})

/**
 * List all products tool for MCP
 * @returns Products list and total count
 */
export default tool(name, description, paramsSchema, async () => {
  const products = await getAllProducts()
  return {
    products,
    total: products.length,
  }
})
