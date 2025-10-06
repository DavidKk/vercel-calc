import { calculateMathExpression } from '@/utils/mathExpression'

describe('calculateMathExpression', () => {
  it('should calculate simple addition', () => {
    expect(calculateMathExpression('1+1')).toBe(2)
    expect(calculateMathExpression('1 + 1')).toBe(2)
    expect(calculateMathExpression('1.5 + 2.5')).toBe(4)
  })

  it('should calculate simple subtraction', () => {
    expect(calculateMathExpression('3-1')).toBe(2)
    expect(calculateMathExpression('3 - 1')).toBe(2)
    expect(calculateMathExpression('5.5 - 2.5')).toBe(3)
  })

  it('should calculate simple multiplication', () => {
    expect(calculateMathExpression('3*2')).toBe(6)
    expect(calculateMathExpression('3 * 2')).toBe(6)
    expect(calculateMathExpression('1.5 * 2')).toBe(3)
  })

  it('should calculate simple division', () => {
    expect(calculateMathExpression('6/2')).toBe(3)
    expect(calculateMathExpression('6 / 2')).toBe(3)
    expect(calculateMathExpression('5 / 2')).toBe(2.5)
  })

  it('should follow order of operations (multiplication before addition)', () => {
    expect(calculateMathExpression('1 + 2 * 3')).toBe(7)
    expect(calculateMathExpression('2 * 3 + 1')).toBe(7)
  })

  it('should follow order of operations (division before subtraction)', () => {
    expect(calculateMathExpression('10 - 6 / 2')).toBe(7)
    expect(calculateMathExpression('6 / 2 - 1')).toBe(2)
  })

  it('should handle complex expressions', () => {
    expect(calculateMathExpression('1 + 2 * 3 - 4 / 2')).toBe(5)
    expect(calculateMathExpression('2 * 3 + 4 * 5')).toBe(26)
  })

  it('should handle decimal numbers', () => {
    expect(calculateMathExpression('1.5 + 2.5')).toBe(4)
    expect(calculateMathExpression('0.1 + 0.2')).toBe(0.3)
    expect(calculateMathExpression('1.1 * 2')).toBe(2.2)
  })

  it('should return NaN for invalid expressions', () => {
    expect(isNaN(calculateMathExpression('1 + '))).toBe(true)
    expect(isNaN(calculateMathExpression('1 ++ 2'))).toBe(true)
    expect(isNaN(calculateMathExpression('1 + 2a'))).toBe(true)
    expect(isNaN(calculateMathExpression('abc'))).toBe(true)
    expect(isNaN(calculateMathExpression(''))).toBe(true)
    expect(isNaN(calculateMathExpression('1 + * 2'))).toBe(true)
  })

  it('should handle negative numbers', () => {
    expect(calculateMathExpression('-1 + 2')).toBe(1)
    expect(calculateMathExpression('2 + -1')).toBe(1)
    expect(calculateMathExpression('-1 * 2')).toBe(-2)
  })
})
