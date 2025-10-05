import { batchProcessUnitConversionNumericPart } from '@/utils/price/processUnitConversionNumericPart'

describe('batchProcessUnitConversionNumericPart', () => {
  it('should return conversions as-is when base unit number is 1', () => {
    const baseUnit = '1kg'
    const conversions = ['2 斤', '1000 g']
    const result = batchProcessUnitConversionNumericPart(baseUnit, conversions)
    expect(result).toEqual(conversions)
  })

  it('should return conversions as-is when base unit number is invalid', () => {
    const baseUnit = 'kg' // No number
    const conversions = ['2 斤', '1000 g']
    const result = batchProcessUnitConversionNumericPart(baseUnit, conversions)
    expect(result).toEqual(conversions)
  })

  it('should adjust conversions when base unit contains a number', () => {
    // If base unit is "100g" and conversion is "1 bottle",
    // then for actual quantity we need to adjust the conversion
    const baseUnit = '100g'
    const conversions = ['1 瓶']
    const result = batchProcessUnitConversionNumericPart(baseUnit, conversions)
    expect(result).toEqual(['100 瓶'])
  })

  it('should handle multiple conversions', () => {
    const baseUnit = '500ml'
    const conversions = ['1 瓶', '2 杯']
    const result = batchProcessUnitConversionNumericPart(baseUnit, conversions)
    expect(result).toEqual(['500 瓶', '1000 杯'])
  })

  it('should handle decimal numbers in base unit', () => {
    const baseUnit = '0.5kg'
    const conversions = ['1 斤']
    const result = batchProcessUnitConversionNumericPart(baseUnit, conversions)
    expect(result).toEqual(['0.5 斤'])
  })

  it('should handle empty conversions array', () => {
    const baseUnit = '100g'
    const conversions: string[] = []
    const result = batchProcessUnitConversionNumericPart(baseUnit, conversions)
    expect(result).toEqual([])
  })

  it('should handle conversions with numbers', () => {
    const baseUnit = '100g'
    const conversions = ['0.5 瓶']
    const result = batchProcessUnitConversionNumericPart(baseUnit, conversions)
    expect(result).toEqual(['50 瓶'])
  })
})
