import { PriceLevel } from '@/app/prices/types'

/**
 * Calculate price level based on current unit price and recommended price
 * @param currentUnitPrice The current unit price of the product
 * @param unitBestPrice The recommended price for comparison
 * @returns The calculated price level
 */
export function calculatePriceLevel(currentUnitPrice: number, unitBestPrice: number): PriceLevel {
  if (unitBestPrice === 0) {
    throw new Error('Recommended price cannot be zero')
  }

  const ratio = currentUnitPrice / unitBestPrice

  if (ratio <= 0.7) {
    return PriceLevel.EXCELLENT
  }

  if (ratio <= 0.9) {
    return PriceLevel.GOOD
  }

  if (ratio <= 1.1) {
    return PriceLevel.ACCEPTABLE
  }

  if (ratio <= 1.3) {
    return PriceLevel.HIGH
  }

  if (ratio <= 1.5) {
    return PriceLevel.EXPENSIVE
  }

  return PriceLevel.FAMILY_TREASURE
}
