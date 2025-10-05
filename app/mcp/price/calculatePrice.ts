import { z } from 'zod'
import { tool } from '@/initializer/mcp'
import { getPriceLevelText } from '@/app/prices/types'
import { calculatePriceLevel } from '@/utils/price'
import { safeDivide } from '@/utils/calc'

const name = 'calculate_price'
const description = 'Calculate price and determine price level'
const paramsSchema = z.object({
  productName: z.string().describe('The name of the product'),
  totalPrice: z.number().positive().describe('The total price of the product'),
  totalQuantity: z.number().positive().describe('The total quantity of the product'),
  unitBestPrice: z.number().positive().describe('The recommended price for comparison'),
})

/**
 * Calculate price tool for MCP
 * @param params Tool parameters
 * @param params.productName Name of the product
 * @param params.totalPrice Total price of the product
 * @param params.totalQuantity Total quantity of the product
 * @param params.unitBestPrice Recommended price for comparison
 * @returns Price calculation result with level and description
 */
export default tool(name, description, paramsSchema, async (params) => {
  const { productName, totalPrice, totalQuantity, unitBestPrice } = params
  if (totalQuantity === 0) {
    throw new Error('Quantity cannot be zero')
  }

  const averagePrice = safeDivide(totalPrice, totalQuantity)
  const ratio = safeDivide(averagePrice, unitBestPrice)
  const priceLevel = calculatePriceLevel(averagePrice, unitBestPrice)
  const description = getPriceLevelText(priceLevel)

  return {
    productName,
    averagePrice: parseFloat(averagePrice.toFixed(2)),
    priceLevel,
    ratio: parseFloat(ratio.toFixed(2)),
    totalPrice,
    totalQuantity,
    unitBestPrice,
    description,
  }
})
