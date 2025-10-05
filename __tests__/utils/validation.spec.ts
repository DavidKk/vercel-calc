import { validateChineseNumerals } from '../../utils/validation'

describe('validateChineseNumerals', () => {
  it('should validate valid Chinese numerals', () => {
    expect(validateChineseNumerals('零')).toBe(true)
    expect(validateChineseNumerals('一')).toBe(true)
    expect(validateChineseNumerals('十')).toBe(true)
    expect(validateChineseNumerals('十一')).toBe(true)
    expect(validateChineseNumerals('一百')).toBe(true)
    expect(validateChineseNumerals('一百零一')).toBe(true)
    expect(validateChineseNumerals('一千零一')).toBe(true)
    expect(validateChineseNumerals('一万')).toBe(true)
    expect(validateChineseNumerals('一点五')).toBe(true)
    expect(validateChineseNumerals('一百点二八')).toBe(true)
  })

  it('should reject invalid Chinese numerals', () => {
    expect(validateChineseNumerals('')).toBe('Value is required')
    expect(validateChineseNumerals('abc')).toBe('Value contains invalid Chinese numeral characters')
    expect(validateChineseNumerals('十一斤')).toBe('Value contains invalid Chinese numeral characters')
    expect(validateChineseNumerals('十一 ')).toBe('Value contains invalid Chinese numeral characters')
  })
})
