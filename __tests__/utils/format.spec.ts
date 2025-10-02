import { formatNumberWithCommas, parseFormattedNumber, formatNumber, parseUnit, parseUnitConversion } from '../../utils/format'

describe('formatNumberWithCommas', () => {
  // Test basic integer formatting
  it('should format integer numbers with commas', () => {
    expect(formatNumberWithCommas(0)).toBe('0')
    expect(formatNumberWithCommas(100)).toBe('100')
    expect(formatNumberWithCommas(1000)).toBe('1,000')
    expect(formatNumberWithCommas(10000)).toBe('10,000')
    expect(formatNumberWithCommas(100000)).toBe('100,000')
    expect(formatNumberWithCommas(1000000)).toBe('1,000,000')
    expect(formatNumberWithCommas(123456789)).toBe('123,456,789')
  })

  // Test string form of integers
  it('should format string integers with commas', () => {
    expect(formatNumberWithCommas('0')).toBe('0')
    expect(formatNumberWithCommas('100')).toBe('100')
    expect(formatNumberWithCommas('1000')).toBe('1,000')
    expect(formatNumberWithCommas('10000')).toBe('10,000')
    expect(formatNumberWithCommas('100000')).toBe('100,000')
    expect(formatNumberWithCommas('1000000')).toBe('1,000,000')
    expect(formatNumberWithCommas('123456789')).toBe('123,456,789')
  })

  // Test decimal number formatting
  it('should format decimal numbers correctly', () => {
    expect(formatNumberWithCommas(0.1)).toBe('0.1')
    expect(formatNumberWithCommas(123.45)).toBe('123.45')
    expect(formatNumberWithCommas(1000.123)).toBe('1,000.123')
    expect(formatNumberWithCommas(12345.6789)).toBe('12,345.6789')
  })

  // Test string form of decimals
  it('should format string decimals correctly', () => {
    expect(formatNumberWithCommas('0.1')).toBe('0.1')
    expect(formatNumberWithCommas('123.45')).toBe('123.45')
    expect(formatNumberWithCommas('1000.123')).toBe('1,000.123')
    expect(formatNumberWithCommas('12345.6789')).toBe('12,345.6789')
  })

  // Test input with thousand separators
  it('should handle inputs with commas correctly', () => {
    expect(formatNumberWithCommas('1,000')).toBe('1,000')
    expect(formatNumberWithCommas('1,000.50')).toBe('1,000.50')
    expect(formatNumberWithCommas('1,234,567.89')).toBe('1,234,567.89')
  })

  // Test special character cleaning
  it('should clean non-numeric characters except decimal point', () => {
    expect(formatNumberWithCommas('1,000abc')).toBe('1,000')
    expect(formatNumberWithCommas('1.23.45')).toBe('1.23')
    expect(formatNumberWithCommas('$1,234.56')).toBe('1,234.56')
    expect(formatNumberWithCommas('1,2a3b4c.5d6e')).toBe('1,234.56')
  })

  // Test decimals parameter
  it('should respect the decimals parameter', () => {
    expect(formatNumberWithCommas(123.456, 2)).toBe('123.45')
    expect(formatNumberWithCommas(1000.12345, 3)).toBe('1,000.123')
    expect(formatNumberWithCommas('1234.56789', 1)).toBe('1,234.5')
    expect(formatNumberWithCommas(1234.5, 0)).toBe('1,234')
    expect(formatNumberWithCommas(1234, 2)).toBe('1,234.00') // 整数应该保留指定的小数位数
    expect(formatNumberWithCommas('1234.00', 2)).toBe('1,234.00')
  })

  // Test edge cases
  it('should handle edge cases', () => {
    expect(formatNumberWithCommas('')).toBe('')
    expect(formatNumberWithCommas(null as any)).toBe('')
    expect(formatNumberWithCommas(undefined as any)).toBe('')
    expect(formatNumberWithCommas('.123')).toBe('0.123')
    expect(formatNumberWithCommas('.')).toBe('0.') // '.' 会被解析为 '0.'
    expect(formatNumberWithCommas('0.')).toBe('0') // '0.' 会被解析为 '0'
  })

  // Test numbers with only decimal part
  it('should handle numbers with only decimal part', () => {
    expect(formatNumberWithCommas('.5')).toBe('0.5')
    expect(formatNumberWithCommas('.123456')).toBe('0.123456')
    expect(formatNumberWithCommas('.123456', 3)).toBe('0.123')
  })
})

describe('parseFormattedNumber', () => {
  it('should parse formatted numbers correctly', () => {
    expect(parseFormattedNumber('0')).toBe(0)
    expect(parseFormattedNumber('100')).toBe(100)
    expect(parseFormattedNumber('1,000')).toBe(1000)
    expect(parseFormattedNumber('10,000')).toBe(10000)
    expect(parseFormattedNumber('100,000')).toBe(100000)
    expect(parseFormattedNumber('1,000,000')).toBe(1000000)
    expect(parseFormattedNumber('123,456,789')).toBe(123456789)
  })

  it('should parse formatted decimal numbers correctly', () => {
    expect(parseFormattedNumber('0.1')).toBe(0.1)
    expect(parseFormattedNumber('123.45')).toBe(123.45)
    expect(parseFormattedNumber('1,000.123')).toBe(1000.123)
    expect(parseFormattedNumber('12,345.6789')).toBe(12345.6789)
  })

  it('should handle edge cases', () => {
    expect(parseFormattedNumber('')).toBe(0)
    expect(parseFormattedNumber('abc')).toBe(0)
    expect(parseFormattedNumber('1,2a3b4c.5d6e')).toBe(12) // parseFloat 会解析到第一个非数字字符为止
  })
})

describe('formatNumber', () => {
  it('should format numbers correctly', () => {
    expect(formatNumber(0)).toBe('0')
    expect(formatNumber(1)).toBe('1')
    expect(formatNumber(1.5)).toBe('1.5')
    expect(formatNumber(1.25)).toBe('1.25')
    expect(formatNumber(1.256, 2)).toBe('1.26') // Should round to 2 decimal places
    expect(formatNumber(1.254, 2)).toBe('1.25') // Should round to 2 decimal places
  })

  it('should remove trailing zeros', () => {
    expect(formatNumber(1.5)).toBe('1.5')
    expect(formatNumber(1.0)).toBe('1')
    expect(formatNumber(1.23)).toBe('1.23')
  })

  it('should handle edge cases', () => {
    expect(formatNumber(NaN)).toBe('0')
    expect(formatNumber(Infinity)).toBe('Infinity')
    expect(formatNumber(-Infinity)).toBe('-Infinity')
  })
})

describe('parseUnit', () => {
  it('should parse simple units correctly', () => {
    expect(parseUnit('kg')).toEqual({ number: 1, unit: 'kg' })
    expect(parseUnit('ml')).toEqual({ number: 1, unit: 'ml' })
    expect(parseUnit('斤')).toEqual({ number: 1, unit: '斤' })
  })

  it('should parse number + unit combinations correctly', () => {
    expect(parseUnit('10 kg')).toEqual({ number: 10, unit: 'kg' })
    expect(parseUnit('100 ml')).toEqual({ number: 100, unit: 'ml' })
    expect(parseUnit('1,000.5 g')).toEqual({ number: 1000.5, unit: 'g' })
    expect(parseUnit('0.5 斤')).toEqual({ number: 0.5, unit: '斤' })
  })

  it('should parse units without space correctly', () => {
    expect(parseUnit('10kg')).toEqual({ number: 10, unit: 'kg' })
    expect(parseUnit('100ml')).toEqual({ number: 100, unit: 'ml' })
    expect(parseUnit('1000.5g')).toEqual({ number: 1000.5, unit: 'g' })
  })

  it('should handle edge cases', () => {
    expect(parseUnit('')).toEqual({ number: 1, unit: '' })
    expect(parseUnit(' ')).toEqual({ number: 1, unit: '' })
    // For "10 20 kg", it splits by spaces into ["10", "20", "kg"]
    // Since there are more than 2 parts, it goes to the else branch
    // It processes only the first part "10", parsing it as number 10 with unit "10"
    expect(parseUnit('10 20 kg')).toEqual({ number: 10, unit: '10' })
  })
})

describe('parseUnitConversion', () => {
  it('should parse unit conversions the same as parseUnit', () => {
    expect(parseUnitConversion('kg')).toEqual({ number: 1, unit: 'kg' })
    expect(parseUnitConversion('10 kg')).toEqual({ number: 10, unit: 'kg' })
    expect(parseUnitConversion('100ml')).toEqual({ number: 100, unit: 'ml' })
  })
})
