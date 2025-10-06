import { PriceLevel } from '@/app/prices/types'
import { calculatePriceLevel } from '@/utils/price/calculatePriceLevel'

describe('calculatePriceLevel', () => {
  it('should throw error when unitBestPrice is zero', () => {
    expect(() => calculatePriceLevel(100, 0)).toThrow('Recommended price cannot be zero')
  })

  it('should return EXCELLENT price level when ratio is <= 0.7', () => {
    // ratio = 70 / 100 = 0.7
    expect(calculatePriceLevel(70, 100)).toBe(PriceLevel.EXCELLENT)

    // ratio = 50 / 100 = 0.5
    expect(calculatePriceLevel(50, 100)).toBe(PriceLevel.EXCELLENT)
  })

  it('should return GOOD price level when ratio is <= 0.9', () => {
    // ratio = 80 / 100 = 0.8
    expect(calculatePriceLevel(80, 100)).toBe(PriceLevel.GOOD)

    // ratio = 90 / 100 = 0.9
    expect(calculatePriceLevel(90, 100)).toBe(PriceLevel.GOOD)
  })

  it('should return ACCEPTABLE price level when ratio is <= 1.1', () => {
    // ratio = 100 / 100 = 1.0
    expect(calculatePriceLevel(100, 100)).toBe(PriceLevel.ACCEPTABLE)

    // ratio = 110 / 100 = 1.1
    expect(calculatePriceLevel(110, 100)).toBe(PriceLevel.ACCEPTABLE)
  })

  it('should return HIGH price level when ratio is <= 1.3', () => {
    // ratio = 120 / 100 = 1.2
    expect(calculatePriceLevel(120, 100)).toBe(PriceLevel.HIGH)

    // ratio = 130 / 100 = 1.3
    expect(calculatePriceLevel(130, 100)).toBe(PriceLevel.HIGH)
  })

  it('should return EXPENSIVE price level when ratio is <= 1.5', () => {
    // ratio = 140 / 100 = 1.4
    expect(calculatePriceLevel(140, 100)).toBe(PriceLevel.EXPENSIVE)

    // ratio = 150 / 100 = 1.5
    expect(calculatePriceLevel(150, 100)).toBe(PriceLevel.EXPENSIVE)
  })

  it('should return FAMILY_TREASURE price level when ratio is > 1.5', () => {
    // ratio = 160 / 100 = 1.6
    expect(calculatePriceLevel(160, 100)).toBe(PriceLevel.FAMILY_TREASURE)

    // ratio = 200 / 100 = 2.0
    expect(calculatePriceLevel(200, 100)).toBe(PriceLevel.FAMILY_TREASURE)
  })

  it('should handle decimal values correctly', () => {
    // ratio = 0.699
    expect(calculatePriceLevel(69.9, 100)).toBe(PriceLevel.EXCELLENT)

    // ratio = 0.701
    expect(calculatePriceLevel(70.1, 100)).toBe(PriceLevel.GOOD)

    // ratio = 0.899
    expect(calculatePriceLevel(89.9, 100)).toBe(PriceLevel.GOOD)

    // ratio = 0.901
    expect(calculatePriceLevel(90.1, 100)).toBe(PriceLevel.ACCEPTABLE)

    // ratio = 1.099
    expect(calculatePriceLevel(109.9, 100)).toBe(PriceLevel.ACCEPTABLE)

    // ratio = 1.101
    expect(calculatePriceLevel(110.1, 100)).toBe(PriceLevel.HIGH)

    // ratio = 1.299
    expect(calculatePriceLevel(129.9, 100)).toBe(PriceLevel.HIGH)

    // ratio = 1.301
    expect(calculatePriceLevel(130.1, 100)).toBe(PriceLevel.EXPENSIVE)

    // ratio = 1.499
    expect(calculatePriceLevel(149.9, 100)).toBe(PriceLevel.EXPENSIVE)

    // ratio = 1.501
    expect(calculatePriceLevel(150.1, 100)).toBe(PriceLevel.FAMILY_TREASURE)
  })
})
