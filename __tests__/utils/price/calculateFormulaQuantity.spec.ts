import { calculateFormulaQuantity } from '@/utils/price/calculateFormulaQuantity'

describe('calculateFormulaQuantity', () => {
  it('should return NaN when formula does not start with =', () => {
    expect(calculateFormulaQuantity('5 kg', '斤', ['2 斤'], 'kg')).toBeNaN()
    expect(calculateFormulaQuantity('', '斤', ['2 斤'], 'kg')).toBeNaN()
  })

  it('should return NaN when formula content is empty', () => {
    expect(calculateFormulaQuantity('=', '斤', ['2 斤'], 'kg')).toBeNaN()
    expect(calculateFormulaQuantity('= ', '斤', ['2 斤'], 'kg')).toBeNaN()
  })

  it('should return the number directly when formula unit equals target unit', () => {
    expect(calculateFormulaQuantity('= 5 kg', 'kg', ['2 斤'], 'kg')).toBe(5)
    expect(calculateFormulaQuantity('= 100 ml', 'ml', ['1000 ml'], 'L')).toBe(100)
  })

  it('should return NaN when no unit conversion list is provided', () => {
    expect(calculateFormulaQuantity('= 5 斤', 'kg', [], 'kg')).toBeNaN()
    expect(calculateFormulaQuantity('= 5 斤', 'kg', null as any, 'kg')).toBeNaN()
  })

  it('should calculate quantity correctly for valid unit conversions', () => {
    // Case 1: Base unit = conversion unit, formula unit is unit part of base unit, target unit is conversion unit
    // 1 kg = 2 斤, so 5 kg = 10 斤
    expect(calculateFormulaQuantity('= 5 kg', '斤', ['2 斤'], 'kg')).toBe(10)

    // Case 2: Base unit = conversion unit, formula unit is conversion unit, target unit is unit part of base unit
    // 1 kg = 2 斤, so 10 斤 = 5 kg
    expect(calculateFormulaQuantity('= 10 斤', 'kg', ['2 斤'], 'kg')).toBe(5)

    // Complex unit conversion: 1 L = 1000 ml, so 5000 ml = 5 L
    expect(calculateFormulaQuantity('= 5000 ml', 'L', ['1000 ml'], 'L')).toBe(5)
  })

  it('should handle Chinese numerals in formulas', () => {
    // "= 十斤" should be converted to "= 10斤"
    expect(calculateFormulaQuantity('= 十斤', 'kg', ['2 斤'], 'kg')).toBe(5)
  })

  it('should return NaN when no matching conversion relationship is found', () => {
    // For this case, we need to provide a conversion that doesn't match the formula
    expect(calculateFormulaQuantity('= 5 kg', 'g', ['2 斤'], 'kg')).toBeNaN()

    // Another case where no matching conversion relationship is found
    expect(calculateFormulaQuantity('= 5 m', 'cm', ['2 斤'], 'kg')).toBeNaN()
  })

  it('should handle edge cases gracefully', () => {
    // Invalid formula number - this actually gets parsed as 0, not NaN
    expect(calculateFormulaQuantity('= abc kg', '斤', ['2 斤'], 'kg')).toBe(0)

    // Invalid conversion number - this gets parsed as 0
    expect(calculateFormulaQuantity('= 5 kg', '斤', ['abc 斤'], 'kg')).toBe(0)

    // Invalid base unit - this results in NaN because no matching conversion is found
    expect(calculateFormulaQuantity('= 5 kg', '斤', ['2 斤'], 'abc')).toBeNaN()
  })

  it('should handle decimal numbers correctly', () => {
    // 1 kg = 2 斤, so 0.5 kg = 1 斤
    expect(calculateFormulaQuantity('= 0.5 kg', '斤', ['2 斤'], 'kg')).toBe(1)

    // 1 L = 1000 ml, so 1.5 L = 1500 ml
    expect(calculateFormulaQuantity('= 1.5 L', 'ml', ['1000 ml'], 'L')).toBe(1500)
  })

  it('should handle large numbers', () => {
    // 1 kg = 1000 g, so 1000000 g = 1000 kg
    expect(calculateFormulaQuantity('= 1000000 g', 'kg', ['1000 g'], 'kg')).toBe(1000)
  })
})
