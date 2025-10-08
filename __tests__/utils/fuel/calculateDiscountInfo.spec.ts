import { calculateDiscountPercentage, getDiscountLevelColor, getDiscountPercentageDescription, getPriceLevelDescription } from '@/utils/fuel/calculateDiscountInfo'

describe('calculateDiscountInfo', () => {
  describe('getPriceLevelDescription', () => {
    it('should return "Excellent Deal" for discount >= 0.7', () => {
      expect(getPriceLevelDescription(0.7)).toBe('Excellent Deal')
      expect(getPriceLevelDescription(0.8)).toBe('Excellent Deal')
      expect(getPriceLevelDescription(1.2)).toBe('Excellent Deal')
    })

    it('should return "Good Deal" for discount between 0.5 and 0.7', () => {
      expect(getPriceLevelDescription(0.5)).toBe('Good Deal')
      expect(getPriceLevelDescription(0.6)).toBe('Good Deal')
    })

    it('should return "Normal" for discount between 0.3 and 0.5', () => {
      expect(getPriceLevelDescription(0.3)).toBe('Normal')
      expect(getPriceLevelDescription(0.4)).toBe('Normal')
    })

    it('should return "Low Discount" for discount between 0.1 and 0.3', () => {
      expect(getPriceLevelDescription(0.1)).toBe('Low Discount')
      expect(getPriceLevelDescription(0.25)).toBe('Low Discount')
    })

    it('should return "Not Worth" for discount < 0.1', () => {
      expect(getPriceLevelDescription(0.05)).toBe('Not Worth')
      expect(getPriceLevelDescription(0.0)).toBe('Not Worth')
    })
  })

  describe('getDiscountLevelColor', () => {
    it('should return blue for excellent deal (discount >= 0.7)', () => {
      expect(getDiscountLevelColor(0.7)).toBe('text-blue-400')
      expect(getDiscountLevelColor(1.2)).toBe('text-blue-400')
    })

    it('should return green for good deal (discount between 0.5 and 0.7)', () => {
      expect(getDiscountLevelColor(0.5)).toBe('text-green-400')
      expect(getDiscountLevelColor(0.6)).toBe('text-green-400')
    })

    it('should return yellow for normal (discount between 0.3 and 0.5)', () => {
      expect(getDiscountLevelColor(0.3)).toBe('text-yellow-500')
      expect(getDiscountLevelColor(0.4)).toBe('text-yellow-500')
    })

    it('should return orange for low discount (discount between 0.1 and 0.3)', () => {
      expect(getDiscountLevelColor(0.1)).toBe('text-orange-400')
      expect(getDiscountLevelColor(0.25)).toBe('text-orange-400')
    })

    it('should return red for not worth (discount < 0.1)', () => {
      expect(getDiscountLevelColor(0.05)).toBe('text-red-500')
      expect(getDiscountLevelColor(0.0)).toBe('text-red-500')
    })
  })

  describe('calculateDiscountPercentage', () => {
    it('should calculate discount percentage correctly', () => {
      expect(calculateDiscountPercentage(100, 90)).toBe(10)
      expect(calculateDiscountPercentage(7.5, 6.7)).toBeCloseTo(10.67, 2)
    })

    it('should return 0 for invalid original price', () => {
      expect(calculateDiscountPercentage(0, 50)).toBe(0)
      expect(calculateDiscountPercentage(-10, 50)).toBe(0)
    })

    it('should clamp values between 0 and 100', () => {
      expect(calculateDiscountPercentage(50, 100)).toBe(0) // Negative discount
      expect(calculateDiscountPercentage(100, 10)).toBe(90) // Large discount
    })
  })

  describe('getDiscountPercentageDescription', () => {
    it('should format discount percentage as Chinese discount', () => {
      // 10% discount should be 9.0折 (pay 90% of original price)
      expect(getDiscountPercentageDescription(100, 90)).toBe('9.0折')
      // 10.67% discount should be 8.9折 (pay 89.33% of original price)
      expect(getDiscountPercentageDescription(7.5, 6.7)).toBe('8.9折')
    })
  })
})
