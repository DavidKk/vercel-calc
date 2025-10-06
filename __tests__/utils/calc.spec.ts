import { safeDivide } from '@/utils/calc'

describe('safeDivide', () => {
  it('should return 0 when divisor is zero', () => {
    expect(safeDivide(10, 0)).toBe(0)
    expect(safeDivide(0, 0)).toBe(0)
    expect(safeDivide(-5, 0)).toBe(0)
  })

  it('should perform normal division when divisor is not zero', () => {
    expect(safeDivide(10, 2)).toBe(5)
    expect(safeDivide(7, 3)).toBeCloseTo(2.333333333333333)
    expect(safeDivide(100, 4)).toBe(25)
    expect(safeDivide(0, 5)).toBe(0)
    expect(safeDivide(-10, 2)).toBe(-5)
    expect(safeDivide(10, -2)).toBe(-5)
    expect(safeDivide(-10, -2)).toBe(5)
  })

  it('should handle decimal numbers correctly', () => {
    expect(safeDivide(1, 3)).toBeCloseTo(0.3333333333333333)
    expect(safeDivide(0.1, 0.2)).toBeCloseTo(0.5)
    expect(safeDivide(1.5, 0.5)).toBe(3)
  })

  it('should handle large numbers', () => {
    expect(safeDivide(1000000, 1000)).toBe(1000)
    expect(safeDivide(Number.MAX_SAFE_INTEGER, 1)).toBe(Number.MAX_SAFE_INTEGER)
  })

  it('should handle very small numbers', () => {
    expect(safeDivide(1, 1000000)).toBeCloseTo(0.000001)
    expect(safeDivide(0.0001, 0.0002)).toBeCloseTo(0.5)
  })
})
