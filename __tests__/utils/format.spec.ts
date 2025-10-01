import { formatNumberWithCommas, parseFormattedNumber } from '../../utils/format'

describe('formatNumberWithCommas', () => {
  // 测试基本的整数格式化
  it('should format integer numbers with commas', () => {
    expect(formatNumberWithCommas(0)).toBe('0')
    expect(formatNumberWithCommas(100)).toBe('100')
    expect(formatNumberWithCommas(1000)).toBe('1,000')
    expect(formatNumberWithCommas(10000)).toBe('10,000')
    expect(formatNumberWithCommas(100000)).toBe('100,000')
    expect(formatNumberWithCommas(1000000)).toBe('1,000,000')
    expect(formatNumberWithCommas(123456789)).toBe('123,456,789')
  })

  // 测试字符串形式的整数
  it('should format string integers with commas', () => {
    expect(formatNumberWithCommas('0')).toBe('0')
    expect(formatNumberWithCommas('100')).toBe('100')
    expect(formatNumberWithCommas('1000')).toBe('1,000')
    expect(formatNumberWithCommas('10000')).toBe('10,000')
    expect(formatNumberWithCommas('100000')).toBe('100,000')
    expect(formatNumberWithCommas('1000000')).toBe('1,000,000')
    expect(formatNumberWithCommas('123456789')).toBe('123,456,789')
  })

  // 测试小数格式化
  it('should format decimal numbers correctly', () => {
    expect(formatNumberWithCommas(0.1)).toBe('0.1')
    expect(formatNumberWithCommas(123.45)).toBe('123.45')
    expect(formatNumberWithCommas(1000.123)).toBe('1,000.123')
    expect(formatNumberWithCommas(12345.6789)).toBe('12,345.6789')
  })

  // 测试字符串形式的小数
  it('should format string decimals correctly', () => {
    expect(formatNumberWithCommas('0.1')).toBe('0.1')
    expect(formatNumberWithCommas('123.45')).toBe('123.45')
    expect(formatNumberWithCommas('1000.123')).toBe('1,000.123')
    expect(formatNumberWithCommas('12345.6789')).toBe('12,345.6789')
  })

  // 测试带千位分隔符的输入
  it('should handle inputs with commas correctly', () => {
    expect(formatNumberWithCommas('1,000')).toBe('1,000')
    expect(formatNumberWithCommas('1,000.50')).toBe('1,000.50')
    expect(formatNumberWithCommas('1,234,567.89')).toBe('1,234,567.89')
  })

  // 测试特殊字符清理
  it('should clean non-numeric characters except decimal point', () => {
    expect(formatNumberWithCommas('1,000abc')).toBe('1,000')
    expect(formatNumberWithCommas('1.23.45')).toBe('1.23')
    expect(formatNumberWithCommas('$1,234.56')).toBe('1,234.56')
    expect(formatNumberWithCommas('1,2a3b4c.5d6e')).toBe('1,234.56')
  })

  // 测试 decimals 参数
  it('should respect the decimals parameter', () => {
    expect(formatNumberWithCommas(123.456, 2)).toBe('123.45')
    expect(formatNumberWithCommas(1000.12345, 3)).toBe('1,000.123')
    expect(formatNumberWithCommas('1234.56789', 1)).toBe('1,234.5')
    expect(formatNumberWithCommas(1234.5, 0)).toBe('1,234')
    expect(formatNumberWithCommas(1234, 2)).toBe('1,234.00') // 整数应该保留指定的小数位数
    expect(formatNumberWithCommas('1234.00', 2)).toBe('1,234.00')
  })

  // 测试边界情况
  it('should handle edge cases', () => {
    expect(formatNumberWithCommas('')).toBe('')
    expect(formatNumberWithCommas(null as any)).toBe('')
    expect(formatNumberWithCommas(undefined as any)).toBe('')
    expect(formatNumberWithCommas('.123')).toBe('0.123')
    expect(formatNumberWithCommas('.')).toBe('0.') // '.' 会被解析为 '0.'
    expect(formatNumberWithCommas('0.')).toBe('0') // '0.' 会被解析为 '0'
  })

  // 测试只有小数部分的情况
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
