import { validateNumber } from '@/utils/validation'

describe('validateNumber', () => {
  it('should validate valid number formats as true', () => {
    // Basic integers
    expect(validateNumber('0')).toBe(true)
    expect(validateNumber('123')).toBe(true)
    expect(validateNumber('1000')).toBe(true)

    // Decimals
    expect(validateNumber('123.45')).toBe(true)
    expect(validateNumber('0.1')).toBe(true)
    expect(validateNumber('1000.00')).toBe(true)

    // Numbers with commas (only one comma allowed)
    expect(validateNumber('1,000')).toBe(true)
    expect(validateNumber('1,000.50')).toBe(true)

    // Edge cases
    expect(validateNumber('.5')).toBe(true) // Leading decimal
  })

  it('should return error message for empty values', () => {
    expect(validateNumber('')).toBe('Value is required')
    expect(validateNumber('   ')).toBe('Value is required')
    expect(validateNumber(null as any)).toBe('Value is required')
    expect(validateNumber(undefined as any)).toBe('Value is required')
  })

  it('should return error message for negative numbers', () => {
    expect(validateNumber('-123')).toBe('Value cannot be negative')
    expect(validateNumber('-0')).toBe('Value cannot be negative')
    expect(validateNumber('-123.45')).toBe('Value cannot be negative')
    expect(validateNumber('-1,000')).toBe('Value cannot be negative')
  })

  it('should return error message for invalid characters', () => {
    expect(validateNumber('123abc')).toBe('Value can only contain numbers, commas, and periods')
    expect(validateNumber('123!')).toBe('Value can only contain numbers, commas, and periods')
    expect(validateNumber('123@')).toBe('Value can only contain numbers, commas, and periods')
    expect(validateNumber('123#')).toBe('Value can only contain numbers, commas, and periods')
  })

  it('should return error message for invalid comma and decimal combinations', () => {
    // Multiple decimals
    expect(validateNumber('123.45.67')).toBe('Value can only contain numbers, commas, and periods')

    // Multiple commas
    expect(validateNumber('1,000,000,000')).toBe('Value can only contain numbers, commas, and periods')
    expect(validateNumber('1,000,000')).toBe('Value can only contain numbers, commas, and periods')

    // Comma in wrong position
    expect(validateNumber(',123')).toBe('Value can only contain numbers, commas, and periods')

    // Comma after decimal
    expect(validateNumber('123.,456')).toBe('Value can only contain numbers, commas, and periods')

    // This is actually valid (comma before decimal point)
    expect(validateNumber('12,3.45')).toBe(true)
  })

  it('should return error message for values that are too large', () => {
    // Values larger than Number.MAX_SAFE_INTEGER
    expect(validateNumber('9007199254740992')).toBe('Value is too large') // Number.MAX_SAFE_INTEGER + 1
    expect(validateNumber('9007199254740993')).toBe('Value is too large')
    expect(validateNumber('10000000000000000')).toBe('Value is too large')
  })

  it('should return error message for only decimal point', () => {
    expect(validateNumber('.')).toBe('Value can only contain numbers, commas, and periods')
  })

  it('should handle edge cases', () => {
    // Zero is valid
    expect(validateNumber('0')).toBe(true)

    // Leading zeros
    expect(validateNumber('000123')).toBe(true)
    expect(validateNumber('000.123')).toBe(true)

    // Trailing zeros after decimal
    expect(validateNumber('123.000')).toBe(true)
  })
})
