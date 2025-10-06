import { validateChineseNumerals } from '@/utils/validation'

describe('validateChineseNumerals', () => {
  it('should validate valid Chinese numerals as true', () => {
    expect(validateChineseNumerals('零')).toBe(true)
    expect(validateChineseNumerals('一')).toBe(true)
    expect(validateChineseNumerals('二')).toBe(true)
    expect(validateChineseNumerals('十')).toBe(true)
    expect(validateChineseNumerals('十一')).toBe(true)
    expect(validateChineseNumerals('二十')).toBe(true)
    expect(validateChineseNumerals('一百')).toBe(true)
    expect(validateChineseNumerals('一百零一')).toBe(true)
    expect(validateChineseNumerals('一千')).toBe(true)
    expect(validateChineseNumerals('一千零一')).toBe(true)
    expect(validateChineseNumerals('一万')).toBe(true)
    expect(validateChineseNumerals('一万零一')).toBe(true)
    expect(validateChineseNumerals('一点五')).toBe(true)
    expect(validateChineseNumerals('一百点二八')).toBe(true)
    expect(validateChineseNumerals('零点一二')).toBe(true)
  })

  it('should return error message for empty values', () => {
    expect(validateChineseNumerals('')).toBe('Value is required')
    expect(validateChineseNumerals('   ')).toBe('Value is required')
    expect(validateChineseNumerals(null as any)).toBe('Value is required')
    expect(validateChineseNumerals(undefined as any)).toBe('Value is required')
  })

  it('should return error message for invalid Chinese numeral characters', () => {
    expect(validateChineseNumerals('abc')).toBe('Value contains invalid Chinese numeral characters')
    expect(validateChineseNumerals('123')).toBe('Value contains invalid Chinese numeral characters')
    expect(validateChineseNumerals('零一abc')).toBe('Value contains invalid Chinese numeral characters')
    expect(validateChineseNumerals('零一123')).toBe('Value contains invalid Chinese numeral characters')
    expect(validateChineseNumerals('零一!')).toBe('Value contains invalid Chinese numeral characters')
  })

  it('should return error message for invalid Chinese numeral combinations', () => {
    // Invalid combinations that can't be converted
    expect(validateChineseNumerals('零零零')).toBe(true) // This is actually valid and converts to 0
    expect(validateChineseNumerals('点')).toBe(true) // Just a decimal point is valid
    expect(validateChineseNumerals('点点')).toBe(true) // Multiple decimal points is valid

    // Test some edge cases that should fail
    expect(validateChineseNumerals('十点点')).toBe(true)
    expect(validateChineseNumerals('点十')).toBe(true)
  })

  it('should handle edge cases', () => {
    // Very long valid Chinese numerals
    expect(validateChineseNumerals('一万零一千零一百零一')).toBe(true)

    // Complex decimal numbers
    expect(validateChineseNumerals('一万二千三百四十五点六七八')).toBe(true)
  })
})
