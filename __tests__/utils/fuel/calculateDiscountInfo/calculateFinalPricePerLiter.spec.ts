import { calculateFinalPricePerLiter } from '@/utils/fuel/calculateDiscountInfo'

describe('calculateFinalPricePerLiter', () => {
  it('should calculate correct final price per liter', () => {
    // Given:
    // - Unit price: 7.13 yuan/liter
    // - Discount per liter: 0.65 yuan
    const unitPrice = 7.13
    const discountPerLiter = 0.65

    // When:
    const finalPricePerLiter = calculateFinalPricePerLiter(unitPrice, discountPerLiter)

    // Then:
    // The expected final price per liter should be 7.13 - 0.65 = 6.48 yuan
    expect(finalPricePerLiter).toBeCloseTo(6.48, 2)
  })

  it('should handle zero discount', () => {
    const finalPrice = calculateFinalPricePerLiter(7.13, 0)
    expect(finalPrice).toBeCloseTo(7.13, 2)
  })

  it('should handle negative discount (price increase)', () => {
    const finalPrice = calculateFinalPricePerLiter(7.13, -0.5)
    expect(finalPrice).toBeCloseTo(7.63, 2)
  })
})
