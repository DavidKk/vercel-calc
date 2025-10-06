import { add, divide, multiply, round, subtract } from '@/utils/math'

describe('math', () => {
  describe('add', () => {
    it('should add two integers correctly', () => {
      expect(add(1, 2)).toBe(3)
      expect(add(10, 20)).toBe(30)
      expect(add(0, 5)).toBe(5)
    })

    it('should add two decimal numbers correctly', () => {
      expect(add(0.1, 0.2)).toBe(0.3)
      expect(add(1.5, 2.3)).toBe(3.8)
      expect(add(10.12, 20.34)).toBe(30.46)
    })

    it('should handle classic floating point addition problems', () => {
      // Classic floating point issue
      expect(add(0.1, 0.2)).toBe(0.3)
      // Precision loss
      expect(add(0.7, 0.1)).toBe(0.8)
      // Different decimal places
      expect(add(1.01, 2.02)).toBe(3.03)
      // Carry error amplification
      expect(add(0.105, 0.005)).toBe(0.11)
    })

    it('should handle negative numbers', () => {
      expect(add(-1, 2)).toBe(1)
      expect(add(1, -2)).toBe(-1)
      expect(add(-1, -2)).toBe(-3)
    })

    it('should handle edge cases', () => {
      expect(add(0, 0)).toBe(0)
      expect(add(Number.MAX_SAFE_INTEGER, 1)).toBe(Number.MAX_SAFE_INTEGER + 1)
    })
  })

  describe('subtract', () => {
    it('should subtract two integers correctly', () => {
      expect(subtract(3, 2)).toBe(1)
      expect(subtract(20, 10)).toBe(10)
      expect(subtract(5, 0)).toBe(5)
    })

    it('should subtract two decimal numbers correctly', () => {
      expect(subtract(0.3, 0.1)).toBe(0.2)
      expect(subtract(2.5, 1.3)).toBe(1.2)
      expect(subtract(30.46, 20.34)).toBe(10.12)
    })

    it('should handle classic floating point subtraction problems', () => {
      // Common trailing difference
      expect(subtract(0.3, 0.2)).toBe(0.1)
      // Same error
      expect(subtract(1.0, 0.9)).toBe(0.1)
      // Error at different orders of magnitude
      expect(subtract(10.1, 9.9)).toBe(0.2)
      // Rounding error
      expect(subtract(0.58, 0.18)).toBe(0.4)
    })

    it('should handle negative numbers', () => {
      expect(subtract(-1, 2)).toBe(-3)
      expect(subtract(1, -2)).toBe(3)
      expect(subtract(-1, -2)).toBe(1)
    })

    it('should handle edge cases', () => {
      expect(subtract(0, 0)).toBe(0)
      expect(subtract(Number.MAX_SAFE_INTEGER, 1)).toBe(Number.MAX_SAFE_INTEGER - 1)
    })
  })

  describe('multiply', () => {
    it('should multiply two integers correctly', () => {
      expect(multiply(3, 2)).toBe(6)
      expect(multiply(5, 4)).toBe(20)
      expect(multiply(0, 5)).toBe(0)
    })

    it('should multiply two decimal numbers correctly', () => {
      expect(multiply(0.1, 0.2)).toBe(0.02)
      expect(multiply(1.5, 2.0)).toBe(3.0)
      expect(multiply(2.5, 4.0)).toBe(10.0)
    })

    it('should handle classic floating point multiplication problems', () => {
      // Binary multiplication error
      expect(multiply(0.1, 0.2)).toBe(0.02)
      // Precision loss on too many digits
      expect(multiply(1.23, 100)).toBe(123)
      // Looks correct but is a boundary case
      expect(multiply(2.5, 1.2)).toBe(3)
      // Decimal to integer conversion error
      expect(multiply(0.07, 100)).toBe(7)
    })

    it('should handle negative numbers', () => {
      expect(multiply(-2, 3)).toBe(-6)
      expect(multiply(2, -3)).toBe(-6)
      expect(multiply(-2, -3)).toBe(6)
    })

    it('should handle edge cases', () => {
      expect(multiply(0, 0)).toBe(0)
      expect(multiply(1, Number.MAX_SAFE_INTEGER)).toBe(Number.MAX_SAFE_INTEGER)
    })
  })

  describe('divide', () => {
    it('should divide two integers correctly', () => {
      expect(divide(6, 2)).toBe(3)
      expect(divide(20, 4)).toBe(5)
      expect(divide(0, 5)).toBe(0)
    })

    it('should divide two decimal numbers correctly', () => {
      expect(divide(0.6, 0.2)).toBe(3)
      expect(divide(3.0, 1.5)).toBe(2.0)
      expect(divide(10.0, 2.5)).toBe(4.0)
    })

    it('should handle classic floating point division problems', () => {
      // Classic division error
      expect(divide(0.3, 0.1)).toBe(3)
      // Decimal divided by integer
      expect(divide(0.69, 10)).toBe(0.069)
      // Non-integer multiple decimal
      expect(divide(1.21, 1.1)).toBe(1.1)
      // Repeating decimal representation
      expect(divide(10, 3)).toBeCloseTo(3.3333, 4)
    })

    it('should handle negative numbers', () => {
      expect(divide(-6, 2)).toBe(-3)
      expect(divide(6, -2)).toBe(-3)
      expect(divide(-6, -2)).toBe(3)
    })

    it('should throw error when dividing by zero', () => {
      expect(() => divide(5, 0)).toThrow('Division by zero')
      expect(() => divide(0, 0)).toThrow('Division by zero')
    })

    it('should handle edge cases', () => {
      expect(divide(0, 1)).toBe(0)
      expect(divide(1, 1)).toBe(1)
    })
  })

  describe('round', () => {
    it('should round numbers to specified decimal places', () => {
      expect(round(1.234, 2)).toBe(1.23)
      expect(round(1.235, 2)).toBe(1.24)
      expect(round(1.236, 2)).toBe(1.24)
      expect(round(1.0, 0)).toBe(1)
      expect(round(1.5, 0)).toBe(2)
    })

    it('should handle negative numbers', () => {
      expect(round(-1.234, 2)).toBe(-1.23)
      expect(round(-1.235, 2)).toBe(-1.24)
      expect(round(-1.236, 2)).toBe(-1.24)
    })

    it('should handle edge cases', () => {
      expect(round(0, 2)).toBe(0)
      expect(round(1234.5678, 0)).toBe(1235)
      expect(round(1234.5678, 1)).toBe(1234.6)
      expect(round(1234.5678, 3)).toBe(1234.568)
    })
  })
})
