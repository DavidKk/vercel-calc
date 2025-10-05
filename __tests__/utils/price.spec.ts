import { calculateFormulaQuantity } from '@/utils/price/calculateFormulaQuantity'

describe('calculateFormulaQuantity', () => {
  it('should return NaN when formula does not start with =', () => {
    const result = calculateFormulaQuantity('5 kg', 'kg', ['2 斤'], 'kg')
    expect(isNaN(result)).toBe(true)
  })

  it('should return NaN when formula is empty after =', () => {
    const result = calculateFormulaQuantity('=', 'kg', ['2 斤'], 'kg')
    expect(isNaN(result)).toBe(true)
  })

  it('should return the same number when formula unit equals target unit', () => {
    const result = calculateFormulaQuantity('= 5 kg', 'kg', [], 'kg')
    expect(result).toBe(5)
  })

  it('should return NaN when no unit conversions are provided', () => {
    const result = calculateFormulaQuantity('= 5 斤', 'kg', [], 'kg')
    expect(isNaN(result)).toBe(true)
  })

  it('should convert from base unit to conversion unit', () => {
    // 1 kg = 2 斤
    // 5 kg = ? 斤
    // ? = (5 * 2) / 1 = 10
    const result = calculateFormulaQuantity('= 5 kg', '斤', ['2 斤'], 'kg')
    expect(result).toBe(10)
  })

  it('should convert from conversion unit to base unit', () => {
    // 1 kg = 2 斤
    // 10 斤 = ? kg
    // ? = (10 * 1) / 2 = 5
    const result = calculateFormulaQuantity('= 10 斤', 'kg', ['2 斤'], 'kg')
    expect(result).toBe(5)
  })

  it('should handle decimal numbers in conversion', () => {
    // 1 kg = 2.5 斤
    // 4 kg = ? 斤
    // ? = (4 * 2.5) / 1 = 10
    const result = calculateFormulaQuantity('= 4 kg', '斤', ['2.5 斤'], 'kg')
    expect(result).toBe(10)
  })

  it('should handle decimal numbers in formula', () => {
    // 1 kg = 2 斤
    // 3.5 kg = ? 斤
    // ? = (3.5 * 2) / 1 = 7
    const result = calculateFormulaQuantity('= 3.5 kg', '斤', ['2 斤'], 'kg')
    expect(result).toBe(7)
  })

  it('should return NaN when no matching conversion is found', () => {
    // 1 kg = 2 斤
    // Try to convert 5 ml to kg (no conversion for ml)
    const result = calculateFormulaQuantity('= 5 ml', 'kg', ['2 斤'], 'kg')
    expect(isNaN(result)).toBe(true)
  })

  it('should handle complex unit expressions', () => {
    // 1 L = 1000 ml
    // 5000 ml = ? L
    // ? = (5000 * 1) / 1000 = 5
    const result = calculateFormulaQuantity('= 5000 ml', 'L', ['1000 ml'], 'L')
    expect(result).toBe(5)
  })

  it('should handle unit expressions with spaces', () => {
    // 1 kg = 2 斤
    // 3 kg = ? 斤
    // ? = (3 * 2) / 1 = 6
    const result = calculateFormulaQuantity('= 3 kg', '斤', ['2 斤'], 'kg')
    expect(result).toBe(6)
  })

  it('should return NaN for invalid formula format', () => {
    // Test with an invalid formula that can't be parsed properly
    const result = calculateFormulaQuantity('= invalid', 'kg', ['2 斤'], 'kg')
    expect(isNaN(result)).toBe(true)
  })

  it('should handle base unit with number and string', () => {
    // 500 ml = 1 瓶 (每 500 毫升为 1 瓶)
    // 1500 ml = ? 瓶
    // ? = (1500 * 1) / 500 = 3
    const result = calculateFormulaQuantity('= 1500 ml', '瓶', ['1 瓶'], '500 ml')
    expect(result).toBe(3)
  })
})
