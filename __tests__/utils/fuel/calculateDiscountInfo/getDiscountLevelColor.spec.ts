import { getDiscountLevelColor } from '@/utils/fuel/calculateDiscountInfo'

describe('getDiscountLevelColor', () => {
  it('should return blue-400 for excellent deal (>= 0.7)', () => {
    expect(getDiscountLevelColor(0.7)).toBe('text-blue-400')
    expect(getDiscountLevelColor(0.8)).toBe('text-blue-400')
  })

  it('should return green-400 for good deal (>= 0.5)', () => {
    expect(getDiscountLevelColor(0.5)).toBe('text-green-400')
    expect(getDiscountLevelColor(0.6)).toBe('text-green-400')
  })

  it('should return yellow-500 for normal discount (>= 0.3)', () => {
    expect(getDiscountLevelColor(0.3)).toBe('text-yellow-500')
    expect(getDiscountLevelColor(0.4)).toBe('text-yellow-500')
  })

  it('should return orange-400 for low discount (>= 0.1)', () => {
    expect(getDiscountLevelColor(0.1)).toBe('text-orange-400')
    expect(getDiscountLevelColor(0.2)).toBe('text-orange-400')
  })

  it('should return red-500 for not worth discount (< 0.1)', () => {
    expect(getDiscountLevelColor(0)).toBe('text-red-500')
    expect(getDiscountLevelColor(0.05)).toBe('text-red-500')
  })
})
