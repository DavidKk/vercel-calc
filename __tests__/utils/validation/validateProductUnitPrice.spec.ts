import { validateProductUnitPrice } from '@/utils/validation'

describe('validateProductUnitPrice', () => {
  it('should validate valid price formats as true', () => {
    // Basic integers
    expect(validateProductUnitPrice('0')).toBe(true)
    expect(validateProductUnitPrice('123')).toBe(true)
    expect(validateProductUnitPrice('1000')).toBe(true)

    // Valid decimals (up to 2 decimal places)
    expect(validateProductUnitPrice('123.45')).toBe(true)
    expect(validateProductUnitPrice('0.1')).toBe(true)
    expect(validateProductUnitPrice('1000.00')).toBe(true)
    expect(validateProductUnitPrice('123.4')).toBe(true)

    // Prices with commas (only one comma allowed)
    expect(validateProductUnitPrice('1,000')).toBe(true)
    expect(validateProductUnitPrice('1,000.50')).toBe(true)

    // Edge cases
    expect(validateProductUnitPrice('.5')).toBe(true) // Leading decimal
  })

  it('should return specific error message for empty values', () => {
    expect(validateProductUnitPrice('')).toBe('Unit price is required')
    expect(validateProductUnitPrice('   ')).toBe('Unit price is required')
    expect(validateProductUnitPrice(null as any)).toBe('Unit price is required')
    expect(validateProductUnitPrice(undefined as any)).toBe('Unit price is required')
  })

  it('should return specific error message for negative prices', () => {
    expect(validateProductUnitPrice('-123')).toBe('Price cannot be negative')
    expect(validateProductUnitPrice('-0')).toBe('Price cannot be negative')
    expect(validateProductUnitPrice('-123.45')).toBe('Price cannot be negative')
    expect(validateProductUnitPrice('-1,000')).toBe('Price cannot be negative')
  })

  it('should return specific error message for invalid characters', () => {
    expect(validateProductUnitPrice('123abc')).toBe('Price can only contain numbers, commas, and periods')
    expect(validateProductUnitPrice('123!')).toBe('Price can only contain numbers, commas, and periods')
    expect(validateProductUnitPrice('123@')).toBe('Price can only contain numbers, commas, and periods')
    expect(validateProductUnitPrice('123#')).toBe('Price can only contain numbers, commas, and periods')
  })

  it('should return specific error message for invalid comma and decimal combinations', () => {
    // Multiple decimals
    expect(validateProductUnitPrice('123.45.67')).toBe('Price can only contain numbers, commas, and periods')

    // Multiple commas
    expect(validateProductUnitPrice('1,000,000,000')).toBe('Price can only contain numbers, commas, and periods')
    expect(validateProductUnitPrice('1,000,000')).toBe('Price can only contain numbers, commas, and periods')

    // Comma in wrong position
    expect(validateProductUnitPrice(',123')).toBe('Price can only contain numbers, commas, and periods')

    // Comma after decimal
    expect(validateProductUnitPrice('123.,456')).toBe('Price can only contain numbers, commas, and periods')

    // This is actually valid (comma before decimal point)
    expect(validateProductUnitPrice('12,3.45')).toBe(true)
  })

  it('should return error message for prices that are too large', () => {
    // Values larger than Number.MAX_SAFE_INTEGER
    expect(validateProductUnitPrice('9007199254740992')).toBe('Price is too high') // Number.MAX_SAFE_INTEGER + 1
    expect(validateProductUnitPrice('9007199254740993')).toBe('Price is too high')
    expect(validateProductUnitPrice('10000000000000000')).toBe('Price is too high')
  })

  it('should return error message for only decimal point', () => {
    expect(validateProductUnitPrice('.')).toBe('Price can only contain numbers, commas, and periods')
  })

  it('should return error message for prices with more than 2 decimal places', () => {
    expect(validateProductUnitPrice('123.456')).toBe('Price can have at most 2 decimal places')
    expect(validateProductUnitPrice('123.4567')).toBe('Price can have at most 2 decimal places')
    expect(validateProductUnitPrice('0.123')).toBe('Price can have at most 2 decimal places')
    expect(validateProductUnitPrice('1,000.123')).toBe('Price can have at most 2 decimal places')
  })

  it('should handle edge cases', () => {
    // Zero is valid
    expect(validateProductUnitPrice('0')).toBe(true)

    // Leading zeros
    expect(validateProductUnitPrice('000123')).toBe(true)
    expect(validateProductUnitPrice('000.12')).toBe(true)

    // Trailing zeros after decimal
    expect(validateProductUnitPrice('123.00')).toBe(true)

    // Exactly 2 decimal places
    expect(validateProductUnitPrice('123.45')).toBe(true)
  })
})
