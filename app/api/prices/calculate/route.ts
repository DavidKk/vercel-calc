import { api } from '@/initializer/controller'
import { jsonInvalidParameters } from '@/initializer/response'
import { PriceLevel } from '@/app/prices/types'

const calculatePriceAction = async (unitPrice: number, quantity: number, recommendedPrice: number) => {
  if (quantity === 0) {
    throw new Error('Quantity cannot be zero')
  }

  const averagePrice = unitPrice / quantity

  // Calculate price level
  const ratio = averagePrice / recommendedPrice
  let priceLevel: PriceLevel = PriceLevel.REASONABLE

  if (ratio <= 0.5) {
    priceLevel = PriceLevel.LOW
  } else if (ratio <= 1.0) {
    priceLevel = PriceLevel.REASONABLE
  } else if (ratio <= 1.5) {
    priceLevel = PriceLevel.HIGH
  } else {
    priceLevel = PriceLevel.FAMILY_TREASURE
  }

  return {
    averagePrice: parseFloat(averagePrice.toFixed(2)),
    priceLevel,
  }
}

/** POST /api/prices/calculate - calculate price without authentication */
export const POST = api(async (req) => {
  const body = await req.json()
  const { unitPrice, quantity, recommendedPrice } = body || {}
  if (typeof unitPrice !== 'number' || typeof quantity !== 'number' || typeof recommendedPrice !== 'number') {
    return jsonInvalidParameters('invalid parameters')
  }

  const result = await calculatePriceAction(unitPrice, quantity, recommendedPrice)
  return { data: result }
})
