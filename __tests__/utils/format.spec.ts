import {
  formatProjectName,
  formatNumberWithCommas,
  parseFormattedNumber,
  formatNumber,
  parseUnit,
  parseUnitConversion,
  convertChineseToArabic,
  extractChineseNumerals,
  convertChineseNumeralsInString,
} from '../../utils/format'

describe('formatProjectName', () => {
  it('should format project names correctly', () => {
    expect(formatProjectName('vercel-app')).toBe('App')
    expect(formatProjectName('vercel-test-project')).toBe('Test Project')
    expect(formatProjectName('my-vercel-app')).toBe('My App')
    expect(formatProjectName('vercel')).toBe('Vercel')
    expect(formatProjectName('vercel-')).toBe('')
  })
})

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

  it('should parse Chinese numerals with units', () => {
    expect(parseUnit('十斤')).toEqual({ number: 10, unit: '斤' })
    expect(parseUnit('一百克')).toEqual({ number: 100, unit: '克' })
    expect(parseUnit('一千零一米')).toEqual({ number: 1001, unit: '米' })
    expect(parseUnit('两百克')).toEqual({ number: 200, unit: '克' }) // Test for colloquial "两百"
    expect(parseUnit('两百八十斤')).toEqual({ number: 280, unit: '斤' }) // Test for colloquial "两百八十"
  })

  it('should parse Chinese numerals with decimal points and units', () => {
    expect(parseUnit('一点五公斤')).toEqual({ number: 1.5, unit: '公斤' })
    expect(parseUnit('一百点二八斤')).toEqual({ number: 100.28, unit: '斤' })
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

describe('convertChineseToArabic', () => {
  it('should convert simple Chinese numerals to Arabic numerals', () => {
    expect(convertChineseToArabic('零')).toBe(0)
    expect(convertChineseToArabic('一')).toBe(1)
    expect(convertChineseToArabic('二')).toBe(2)
    expect(convertChineseToArabic('两')).toBe(2) // Test for colloquial "两"
    expect(convertChineseToArabic('三')).toBe(3)
    expect(convertChineseToArabic('四')).toBe(4)
    expect(convertChineseToArabic('五')).toBe(5)
    expect(convertChineseToArabic('六')).toBe(6)
    expect(convertChineseToArabic('七')).toBe(7)
    expect(convertChineseToArabic('八')).toBe(8)
    expect(convertChineseToArabic('九')).toBe(9)
  })

  it('should convert complex Chinese numerals to Arabic numerals', () => {
    expect(convertChineseToArabic('十')).toBe(10)
    expect(convertChineseToArabic('十一')).toBe(11)
    expect(convertChineseToArabic('二十')).toBe(20)
    expect(convertChineseToArabic('二十一')).toBe(21)
    expect(convertChineseToArabic('两')).toBe(2) // Test for colloquial "两"
    expect(convertChineseToArabic('两百')).toBe(200) // Test for colloquial "两百"
    expect(convertChineseToArabic('两百八十')).toBe(280) // Test for colloquial "两百八十"
    expect(convertChineseToArabic('两千')).toBe(2000) // Test for colloquial "两千"
    expect(convertChineseToArabic('两千零二')).toBe(2002) // Test for colloquial "两千零二"
    expect(convertChineseToArabic('两千二百')).toBe(2200) // Test for colloquial "两千二百"
    expect(convertChineseToArabic('一百')).toBe(100)
    expect(convertChineseToArabic('一百零一')).toBe(101)
    expect(convertChineseToArabic('一百一十')).toBe(110)
    expect(convertChineseToArabic('一百二十三')).toBe(123)
    expect(convertChineseToArabic('一千')).toBe(1000)
    expect(convertChineseToArabic('一千零一')).toBe(1001)
    expect(convertChineseToArabic('一千零一十')).toBe(1010)
    expect(convertChineseToArabic('一千一百')).toBe(1100)
    expect(convertChineseToArabic('一千二百三十四')).toBe(1234)
    expect(convertChineseToArabic('一万')).toBe(10000)
    expect(convertChineseToArabic('一万零一')).toBe(10001)
    expect(convertChineseToArabic('一万零一百')).toBe(10100)
    expect(convertChineseToArabic('一万一千')).toBe(11000)
    expect(convertChineseToArabic('一万一千一百一十一')).toBe(11111)
  })

  it('should handle numbers with multiple zeros', () => {
    expect(convertChineseToArabic('一千零零一')).toBe(1001)
    expect(convertChineseToArabic('一万零零零一')).toBe(10001)
    // In Chinese numerals, trailing zeros after a unit are ignored
    expect(convertChineseToArabic('一百零零')).toBe(100)
    expect(convertChineseToArabic('一千零零')).toBe(1000)
  })

  it('should handle decimal numbers', () => {
    expect(convertChineseToArabic('一点五')).toBe(1.5)
    expect(convertChineseToArabic('一百点二八')).toBe(100.28)
    expect(convertChineseToArabic('零点一二')).toBe(0.12)
    expect(convertChineseToArabic('十点五')).toBe(10.5)
    expect(convertChineseToArabic('一百二十三点四五')).toBe(123.45)
  })

  it('should handle edge cases', () => {
    expect(convertChineseToArabic('')).toBe(0)
    expect(convertChineseToArabic('零零零')).toBe(0)
  })
})

describe('extractChineseNumerals', () => {
  it('should extract Chinese numerals from strings', () => {
    expect(extractChineseNumerals('十一斤')).toBe('十一')
    expect(extractChineseNumerals('一百点二八斤')).toBe('一百点二八')
    expect(extractChineseNumerals('零公斤')).toBe('零')
    expect(extractChineseNumerals('一千零一米')).toBe('一千零一')
    expect(extractChineseNumerals('一万零零零一克')).toBe('一万零零零一')
  })

  it('should return empty string when no Chinese numerals found', () => {
    expect(extractChineseNumerals('')).toBe('')
    expect(extractChineseNumerals('kg')).toBe('')
    expect(extractChineseNumerals('123')).toBe('')
    expect(extractChineseNumerals('abc')).toBe('')
  })

  it('should handle edge cases', () => {
    expect(extractChineseNumerals('十')).toBe('十')
    expect(extractChineseNumerals('十kg')).toBe('十')
    expect(extractChineseNumerals('一百零一  ')).toBe('一百零一')
  })
})

describe('convertChineseNumeralsInString', () => {
  it('should convert Chinese numerals in strings', () => {
    expect(convertChineseNumeralsInString('= 十斤')).toBe('= 10斤')
    expect(convertChineseNumeralsInString('= 一百公斤')).toBe('= 100公斤')
    expect(convertChineseNumeralsInString('= 一千零一米')).toBe('= 1001米')
    expect(convertChineseNumeralsInString('= 一百点二八斤')).toBe('= 100.28斤')
  })

  it('should handle strings without Chinese numerals', () => {
    expect(convertChineseNumeralsInString('= 10 kg')).toBe('= 10 kg')
    expect(convertChineseNumeralsInString('abc')).toBe('abc')
    expect(convertChineseNumeralsInString('')).toBe('')
  })

  it('should handle mixed Chinese and Arabic numerals', () => {
    expect(convertChineseNumeralsInString('= 十5斤')).toBe('= 105斤')
    expect(convertChineseNumeralsInString('= 10十斤')).toBe('= 1010斤')
  })

  it('should handle multiple Chinese numerals in a string', () => {
    expect(convertChineseNumeralsInString('十斤十五两')).toBe('10斤15两')
    expect(convertChineseNumeralsInString('= 一百公斤二百斤')).toBe('= 100公斤200斤')
  })
})
