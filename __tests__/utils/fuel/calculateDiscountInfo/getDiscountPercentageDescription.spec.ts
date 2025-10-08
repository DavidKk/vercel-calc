import { getDiscountPercentageDescription } from '@/utils/fuel/calculateDiscountInfo'

describe('getDiscountPercentageDescription', () => {
  it('should calculate correct Chinese discount description', () => {
    // If original price is 10 and final price is 9, that's 10% off, which is 9折 in Chinese
    expect(getDiscountPercentageDescription(10, 9)).toBe('9.0折')
    // If original price is 10 and final price is 5, that's 50% off, which is 5.0折 in Chinese
    expect(getDiscountPercentageDescription(10, 5)).toBe('5.0折')
  })

  it('should handle edge cases', () => {
    // If original price equals final price, that's 0% off, which is 10.0折 in Chinese
    expect(getDiscountPercentageDescription(10, 10)).toBe('10.0折')
    // If final price is 0, that's 100% off, which is 0.0折 in Chinese
    expect(getDiscountPercentageDescription(10, 0)).toBe('0.0折')
  })
})
