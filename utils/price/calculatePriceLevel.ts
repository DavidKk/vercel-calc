import { PriceLevel } from '@/app/prices/types'

/**
 * Calculate price level based on average price and recommended price
 * @param averagePrice The average price of the product
 * @param unitBestPrice The recommended price for comparison
 * @returns The calculated price level
 */
export function calculatePriceLevel(averagePrice: number, unitBestPrice: number): PriceLevel {
  if (unitBestPrice === 0) {
    throw new Error('Recommended price cannot be zero')
  }

  const ratio = averagePrice / unitBestPrice

  if (ratio <= 0.5) {
    return PriceLevel.LOW
  }

  if (ratio <= 1.0) {
    return PriceLevel.REASONABLE
  }

  if (ratio <= 1.5) {
    return PriceLevel.HIGH
  }

  return PriceLevel.FAMILY_TREASURE
}
