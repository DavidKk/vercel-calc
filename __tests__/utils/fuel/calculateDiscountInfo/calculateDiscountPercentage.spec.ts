import { calculateDiscountPercentage } from '@/utils/fuel/calculateDiscountInfo'

describe('calculateDiscountPercentage', () => {
  it('should calculate correct discount percentage', () => {
    // Given:
    // - Original price: 7.13 yuan/liter
    // - Final price: 6.48 yuan/liter
    const originalPrice = 7.13
    const finalPrice = 6.48

    // When:
    const discountPercentage = calculateDiscountPercentage(originalPrice, finalPrice)

    // Then:
    // The expected discount percentage should be approximately 9.1%
    expect(discountPercentage).toBeCloseTo(9.1, 1)
  })

  it('should return 0 when original price is 0 or negative', () => {
    expect(calculateDiscountPercentage(0, 5)).toBe(0)
    expect(calculateDiscountPercentage(-10, 5)).toBe(0)
  })

  it('should handle case when prices are equal', () => {
    const discount = calculateDiscountPercentage(7.13, 7.13)
    expect(discount).toBe(0)
  })
})
