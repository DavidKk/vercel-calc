import type { PriceLevel } from '@/app/prices/types'
import { getPriceLevelText } from '@/app/prices/types'
import { api } from '@/initializer/controller'
import { jsonInvalidParameters } from '@/initializer/response'
import { safeDivide } from '@/utils/calc'
import { calculatePriceLevel } from '@/utils/price'

export interface CalculateResult {
  productName: string
  averagePrice: number
  ratio: number
  unitPrice: number
  quantity: number
  unitBestPrice: number
  priceLevel: PriceLevel
  description: string
  recommendation: string
}

/**
 * Calculate price and determine price level
 * @param productName Name of the product
 * @param unitPrice Total price of the product
 * @param quantity Quantity of the product
 * @param unitBestPrice Recommended price for comparison
 * @returns Calculation result with price level
 */
const calculatePriceAction = async (productName: string, unitPrice: number, quantity: number, unitBestPrice: number): Promise<CalculateResult> => {
  if (quantity === 0) {
    throw new Error('Quantity cannot be zero')
  }

  const averagePrice = safeDivide(unitPrice, quantity)
  const ratio = averagePrice / unitBestPrice
  const priceLevel = calculatePriceLevel(averagePrice, unitBestPrice)

  const description = getPriceLevelText(priceLevel)
  const recommendation = description

  return {
    productName,
    averagePrice: parseFloat(averagePrice.toFixed(2)),
    ratio: parseFloat(ratio.toFixed(2)),
    unitPrice,
    quantity,
    unitBestPrice,
    priceLevel,
    description,
    recommendation,
  }
}

export const POST = api(async (req) => {
  const body = await req.json()
  const { productName, unitPrice, quantity, unitBestPrice } = body

  if (quantity === 0) {
    return jsonInvalidParameters('Quantity cannot be zero')
  }

  try {
    const result = await calculatePriceAction(productName, unitPrice, quantity, unitBestPrice)
    return Response.json(result)
  } catch (error) {
    return jsonInvalidParameters(error instanceof Error ? error.message : 'Invalid parameters')
  }
})
