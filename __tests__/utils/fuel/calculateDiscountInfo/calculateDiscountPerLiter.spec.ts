import { calculateDiscountPerLiter, calculateFinalPricePerLiter } from '@/utils/fuel/calculateDiscountInfo'

describe('calculateDiscountPerLiter', () => {
  it('should calculate correct discount for recharge 1000, gift 100, fuel price 7.13', () => {
    // Given:
    // - Recharge amount: 1000 yuan
    // - Gift amount: 100 yuan
    // - Fuel price: 7.13 yuan/liter
    const recharge = 1000
    const gift = 100
    const fuelPrice = 7.13

    // When:
    const discountPerLiter = calculateDiscountPerLiter(recharge, gift, fuelPrice)

    // Then:
    // The expected discount per liter should be approximately 0.65 yuan
    expect(discountPerLiter).toBeCloseTo(0.65, 2)
  })

  it('should return 0 when recharge amount is 0 or negative', () => {
    expect(calculateDiscountPerLiter(0, 100, 7.13)).toBe(0)
    expect(calculateDiscountPerLiter(-100, 100, 7.13)).toBe(0)
  })

  it('should handle edge cases with very small values', () => {
    const discount = calculateDiscountPerLiter(100, 10, 7.13)
    expect(discount).toBeGreaterThan(0)
  })
})

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
})
