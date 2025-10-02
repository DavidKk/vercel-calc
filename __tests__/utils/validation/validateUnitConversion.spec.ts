import { validateUnitConversion } from '@/utils/validation'

describe('validateUnitConversion', () => {
  it('should validate valid unit conversion formats', () => {
    // Valid formats
    expect(validateUnitConversion('')).toBe(true)
    expect(validateUnitConversion(' ')).toBe(true)
    expect(validateUnitConversion('100ml')).toBe(true)
    expect(validateUnitConversion('100 ml')).toBe(true)
    expect(validateUnitConversion('1,000ml')).toBe(true)
    expect(validateUnitConversion('1,000 ml')).toBe(true)
    expect(validateUnitConversion('1,000.00ml')).toBe(true)
    expect(validateUnitConversion('1,000.00 ml')).toBe(true)
    expect(validateUnitConversion('100kg')).toBe(true)
    expect(validateUnitConversion('100.5g')).toBe(true)
    expect(validateUnitConversion('100.5 g')).toBe(true)

    // Support for large numbers including Number.MAX_SAFE_INTEGER
    expect(validateUnitConversion(`${Number.MAX_SAFE_INTEGER}ml`)).toBe(true)
    expect(validateUnitConversion(`${Number.MAX_SAFE_INTEGER} ml`)).toBe(true)
    expect(validateUnitConversion('9007199254740991ml')).toBe(true) // Number.MAX_SAFE_INTEGER literal
    expect(validateUnitConversion('9007199254740991 ml')).toBe(true) // Number.MAX_SAFE_INTEGER literal with space

    // Support for large numbers with commas (different formats)
    expect(validateUnitConversion('9,007,199,254,740,991ml')).toBe(true) // Number.MAX_SAFE_INTEGER with commas
    expect(validateUnitConversion('9,007,199,254,740,991 ml')).toBe(true) // Number.MAX_SAFE_INTEGER with commas and space
    expect(validateUnitConversion('900,719,925,474,099,1ml')).toBe(true) // Non-standard comma placement
    expect(validateUnitConversion('900,719,925,474,099,1 ml')).toBe(true) // Non-standard comma placement with space

    // Large numbers without commas
    expect(validateUnitConversion('1000000ml')).toBe(true)
    expect(validateUnitConversion('1000000 ml')).toBe(true)

    // Non-English units (single word)
    expect(validateUnitConversion('100毫升')).toBe(true) // Chinese characters
    expect(validateUnitConversion('100мл')).toBe(true) // Cyrillic characters
    expect(validateUnitConversion('100μl')).toBe(true) // Greek characters with symbol
    expect(validateUnitConversion('100kg1')).toBe(true) // Unit with number at end
  })

  it('should reject invalid unit conversion formats with error messages', () => {
    // Invalid formats
    expect(validateUnitConversion('10 10 ml')).toEqual(expect.any(String)) // Should return error message
    expect(validateUnitConversion('100')).toEqual(expect.any(String)) // Should return error message
    expect(validateUnitConversion('ml')).toEqual(expect.any(String)) // Should return error message
    expect(validateUnitConversion('100 50 ml')).toEqual(expect.any(String)) // Should return error message
    expect(validateUnitConversion('100 ml kg')).toEqual(expect.any(String)) // Should return error message
    expect(validateUnitConversion('100 100')).toEqual(expect.any(String)) // Should return error message
    expect(validateUnitConversion('100ml kg')).toEqual(expect.any(String)) // Should return error message
    expect(validateUnitConversion('100ml!')).toEqual(expect.any(String)) // Should return error message
    expect(validateUnitConversion('100ml@')).toEqual(expect.any(String)) // Should return error message
    expect(validateUnitConversion('100ml#')).toEqual(expect.any(String)) // Should return error message
    expect(validateUnitConversion('100ml$')).toEqual(expect.any(String)) // Should return error message
    expect(validateUnitConversion('100ml.')).toEqual(expect.any(String)) // Should return error message
    expect(validateUnitConversion('100ml-')).toEqual(expect.any(String)) // Should return error message
    expect(validateUnitConversion('100ml_')).toEqual(expect.any(String)) // Should return error message
    expect(validateUnitConversion('100ml kg')).toEqual(expect.any(String)) // Should return error message

    // Invalid non-English formats
    expect(validateUnitConversion('100!毫升')).toEqual(expect.any(String)) // Should return error message
    expect(validateUnitConversion('100毫升 kg')).toEqual(expect.any(String)) // Should return error message
  })

  it('should handle edge cases', () => {
    expect(validateUnitConversion(null as any)).toBe(true) // Null should be treated as empty
    expect(validateUnitConversion(undefined as any)).toBe(true) // Undefined should be treated as empty
  })
})
