import { getPriceLevelDescription } from '@/utils/fuel/calculateDiscountInfo'

describe('getPriceLevelDescription', () => {
  it('should return "Excellent Deal" for discount >= 0.7', () => {
    expect(getPriceLevelDescription(0.7)).toBe('Excellent Deal')
    expect(getPriceLevelDescription(0.8)).toBe('Excellent Deal')
  })

  it('should return "Good Deal" for discount >= 0.5', () => {
    expect(getPriceLevelDescription(0.5)).toBe('Good Deal')
    expect(getPriceLevelDescription(0.6)).toBe('Good Deal')
  })

  it('should return "Normal" for discount >= 0.3', () => {
    expect(getPriceLevelDescription(0.3)).toBe('Normal')
    expect(getPriceLevelDescription(0.4)).toBe('Normal')
  })

  it('should return "Low Discount" for discount >= 0.1', () => {
    expect(getPriceLevelDescription(0.1)).toBe('Low Discount')
    expect(getPriceLevelDescription(0.2)).toBe('Low Discount')
  })

  it('should return "Not Worth" for discount < 0.1', () => {
    expect(getPriceLevelDescription(0)).toBe('Not Worth')
    expect(getPriceLevelDescription(0.05)).toBe('Not Worth')
  })
})
