import { validateUnit } from '@/utils/validation'

describe('validateUnit', () => {
  it('should validate valid unit formats', () => {
    // Valid units (pure units)
    expect(validateUnit('ml')).toBe(true)
    expect(validateUnit('kg')).toBe(true)
    expect(validateUnit('g')).toBe(true)
    expect(validateUnit('l')).toBe(true)
    expect(validateUnit('oz')).toBe(true)
    expect(validateUnit('lb')).toBe(true)
    expect(validateUnit('m')).toBe(true)
    expect(validateUnit('cm')).toBe(true)
    expect(validateUnit('mm')).toBe(true)
    expect(validateUnit('inch')).toBe(true)
    expect(validateUnit('foot')).toBe(true)
    expect(validateUnit('yard')).toBe(true)
    expect(validateUnit('km')).toBe(true)
    expect(validateUnit('mile')).toBe(true)
    expect(validateUnit('unit')).toBe(true)
    expect(validateUnit('item')).toBe(true)
    expect(validateUnit('piece')).toBe(true)
    expect(validateUnit('box')).toBe(true)
    expect(validateUnit('bottle')).toBe(true)
    expect(validateUnit('pack')).toBe(true)
    expect(validateUnit('bag')).toBe(true)
    expect(validateUnit('can')).toBe(true)
    expect(validateUnit('kg1')).toBe(true) // Unit with number at end
    expect(validateUnit('kg23')).toBe(true)

    // Valid units (number + unit without space)
    expect(validateUnit('10ml')).toBe(true)
    expect(validateUnit('100kg')).toBe(true)
    expect(validateUnit('1000g')).toBe(true)
    expect(validateUnit('1,000ml')).toBe(true)
    expect(validateUnit('1,000.00kg')).toBe(true)
    expect(validateUnit('1.5l')).toBe(true)

    // Valid units (number + unit with space)
    expect(validateUnit('10 ml')).toBe(true)
    expect(validateUnit('100 kg')).toBe(true)
    expect(validateUnit('1000 g')).toBe(true)
    expect(validateUnit('1,000 ml')).toBe(true)
    expect(validateUnit('1,000.00 kg')).toBe(true)
    expect(validateUnit('1.5 l')).toBe(true)

    // Non-English units
    expect(validateUnit('毫升')).toBe(true) // Chinese characters
    expect(validateUnit('克')).toBe(true) // Chinese characters
    expect(validateUnit('千克')).toBe(true) // Chinese characters
    expect(validateUnit('升')).toBe(true) // Chinese characters
    expect(validateUnit('мл')).toBe(true) // Cyrillic characters
    expect(validateUnit('г')).toBe(true) // Cyrillic characters
    expect(validateUnit('кг')).toBe(true) // Cyrillic characters
    expect(validateUnit('μl')).toBe(true) // Greek characters with symbol
  })

  it('should reject invalid unit formats with error messages', () => {
    // Empty or whitespace only
    expect(validateUnit('')).toEqual(expect.any(String)) // Should return error message
    expect(validateUnit(' ')).toEqual(expect.any(String)) // Should return error message
    expect(validateUnit('  ')).toEqual(expect.any(String)) // Should return error message

    // Units with special characters
    expect(validateUnit('ml!')).toEqual(expect.any(String)) // Should return error message
    expect(validateUnit('ml@')).toEqual(expect.any(String)) // Should return error message
    expect(validateUnit('ml#')).toEqual(expect.any(String)) // Should return error message
    expect(validateUnit('ml$')).toEqual(expect.any(String)) // Should return error message
    expect(validateUnit('ml%')).toEqual(expect.any(String)) // Should return error message
    expect(validateUnit('ml^')).toEqual(expect.any(String)) // Should return error message
    expect(validateUnit('ml&')).toEqual(expect.any(String)) // Should return error message
    expect(validateUnit('ml*')).toEqual(expect.any(String)) // Should return error message
    expect(validateUnit('ml(')).toEqual(expect.any(String)) // Should return error message
    expect(validateUnit('ml)')).toEqual(expect.any(String)) // Should return error message
    expect(validateUnit('ml-')).toEqual(expect.any(String)) // Should return error message
    expect(validateUnit('ml_')).toEqual(expect.any(String)) // Should return error message
    expect(validateUnit('ml+')).toEqual(expect.any(String)) // Should return error message
    expect(validateUnit('ml=')).toEqual(expect.any(String)) // Should return error message
    expect(validateUnit('ml{')).toEqual(expect.any(String)) // Should return error message
    expect(validateUnit('ml}')).toEqual(expect.any(String)) // Should return error message
    expect(validateUnit('ml[')).toEqual(expect.any(String)) // Should return error message
    expect(validateUnit('ml]')).toEqual(expect.any(String)) // Should return error message
    expect(validateUnit('ml|')).toEqual(expect.any(String)) // Should return error message
    expect(validateUnit('ml\\')).toEqual(expect.any(String)) // Should return error message
    expect(validateUnit('ml/')).toEqual(expect.any(String)) // Should return error message
    expect(validateUnit('ml:')).toEqual(expect.any(String)) // Should return error message
    expect(validateUnit('ml;')).toEqual(expect.any(String)) // Should return error message
    expect(validateUnit('ml"')).toEqual(expect.any(String)) // Should return error message
    expect(validateUnit("ml'")).toEqual(expect.any(String)) // Should return error message
    expect(validateUnit('ml<')).toEqual(expect.any(String)) // Should return error message
    expect(validateUnit('ml>')).toEqual(expect.any(String)) // Should return error message
    expect(validateUnit('ml,')).toEqual(expect.any(String)) // Should return error message
    expect(validateUnit('ml.')).toEqual(expect.any(String)) // Should return error message
    expect(validateUnit('ml?')).toEqual(expect.any(String)) // Should return error message

    // Units with multiple spaces
    expect(validateUnit('ml kg g')).toEqual(expect.any(String)) // Should return error message

    // Units starting with number (without proper unit)
    expect(validateUnit('123')).toEqual(expect.any(String)) // Should return error message
    expect(validateUnit('0')).toEqual(expect.any(String)) // Should return error message
    expect(validateUnit('1')).toEqual(expect.any(String)) // Should return error message

    // Invalid number formats
    expect(validateUnit('10.10.10ml')).toEqual(expect.any(String)) // Should return error message
    expect(validateUnit('10 10 ml')).toEqual(expect.any(String)) // Should return error message
  })

  it('should handle edge cases', () => {
    expect(validateUnit(null as any)).toEqual(expect.any(String)) // Should return error message
    expect(validateUnit(undefined as any)).toEqual(expect.any(String)) // Should return error message

    // Very long units
    const longUnit = 'a'.repeat(100)
    expect(validateUnit(longUnit)).toBe(true)

    // Mixed language units
    expect(validateUnit('ml毫升')).toBe(true)
    expect(validateUnit('kg千克')).toBe(true)

    // Units with leading/trailing spaces
    expect(validateUnit(' ml')).toEqual(expect.any(String)) // Should return error message
    expect(validateUnit('ml ')).toEqual(expect.any(String)) // Should return error message
  })

  it('should validate specific examples from requirements', () => {
    // Examples mentioned in the requirements
    expect(validateUnit('10ml')).toBe(true)
    expect(validateUnit('10 ml')).toBe(true)
    expect(validateUnit('ml')).toBe(true)
    expect(validateUnit('1.000ml')).toBe(true)
    expect(validateUnit('1,000.00 ml')).toBe(true)
  })
})
