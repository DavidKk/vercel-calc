import { PriceLevel } from '@/app/prices/types'
import { calculatePriceLevel } from '../../../utils/price'

describe('calculatePriceLevel', () => {
  it('should throw error when unitBestPrice is zero', () => {
    expect(() => calculatePriceLevel(100, 0)).toThrow('Recommended price cannot be zero')
  })

  it('should return LOW price level when ratio is <= 0.5', () => {
    // ratio = 50 / 100 = 0.5
    expect(calculatePriceLevel(50, 100)).toBe(PriceLevel.LOW)

    // ratio = 25 / 100 = 0.25
    expect(calculatePriceLevel(25, 100)).toBe(PriceLevel.LOW)
  })

  it('should return REASONABLE price level when ratio is <= 1.0', () => {
    // ratio = 75 / 100 = 0.75
    expect(calculatePriceLevel(75, 100)).toBe(PriceLevel.REASONABLE)

    // ratio = 100 / 100 = 1.0
    expect(calculatePriceLevel(100, 100)).toBe(PriceLevel.REASONABLE)
  })

  it('should return HIGH price level when ratio is <= 1.5', () => {
    // ratio = 125 / 100 = 1.25
    expect(calculatePriceLevel(125, 100)).toBe(PriceLevel.HIGH)

    // ratio = 150 / 100 = 1.5
    expect(calculatePriceLevel(150, 100)).toBe(PriceLevel.HIGH)
  })

  it('should return FAMILY_TREASURE price level when ratio is > 1.5', () => {
    // ratio = 200 / 100 = 2.0
    expect(calculatePriceLevel(200, 100)).toBe(PriceLevel.FAMILY_TREASURE)

    // ratio = 300 / 100 = 3.0
    expect(calculatePriceLevel(300, 100)).toBe(PriceLevel.FAMILY_TREASURE)
  })

  it('should handle decimal values correctly', () => {
    // ratio = 0.499
    expect(calculatePriceLevel(49.9, 100)).toBe(PriceLevel.LOW)

    // ratio = 0.501
    expect(calculatePriceLevel(50.1, 100)).toBe(PriceLevel.REASONABLE)

    // ratio = 1.499
    expect(calculatePriceLevel(149.9, 100)).toBe(PriceLevel.HIGH)

    // ratio = 1.501
    expect(calculatePriceLevel(150.1, 100)).toBe(PriceLevel.FAMILY_TREASURE)
  })
})
