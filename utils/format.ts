export function formatProjectName(name: string): string {
  return name
    .replace('vercel-', '')
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function formatNumberWithCommas(value: string | number, decimals?: number): string {
  if (value === null || value === undefined) return ''

  // Convert to string
  const stringValue = typeof value === 'number' ? value.toString() : value

  // If empty string, return directly
  if (!stringValue) return stringValue

  // Remove all non-digit and non-decimal characters, but keep decimal point
  const cleanValue = stringValue.replace(/[^0-9.]/g, '')

  // If empty after cleaning, return empty string
  if (!cleanValue) return cleanValue

  // Separate integer and decimal parts
  const parts = cleanValue.split('.')
  const integerPart = parts[0]
  let decimalPart = parts[1]

  // If no integer part but has decimal part, return 0 plus decimal part
  if (!integerPart && decimalPart !== undefined) {
    // Apply decimal limit if specified
    if (decimals !== undefined && decimalPart.length > decimals) {
      decimalPart = decimalPart.substring(0, decimals)
    }
    // 如果指定了小数位数，确保小数部分长度符合要求
    if (decimals !== undefined) {
      decimalPart = decimalPart.padEnd(decimals, '0').substring(0, decimals)
      return `0.${decimalPart}`
    }
    return `0.${decimalPart}`
  }

  // If no integer part, return clean value
  if (!integerPart) return cleanValue

  // Apply decimal limit if specified
  if (decimals !== undefined && decimalPart !== undefined) {
    if (decimalPart.length > decimals) {
      decimalPart = decimalPart.substring(0, decimals)
    }
    // 确保小数部分长度符合要求
    decimalPart = decimalPart.padEnd(decimals, '0').substring(0, decimals)
  } else if (decimals !== undefined && decimalPart === undefined) {
    // 如果指定了小数位数但没有小数部分，则创建小数部分
    decimalPart = ''.padEnd(decimals, '0')
  }

  // Format integer part with thousands separators
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')

  // If there is a decimal part, merge and return
  if (decimalPart !== undefined && decimalPart !== '') {
    return `${formattedInteger}.${decimalPart}`
  } else if (decimals !== undefined && decimals > 0) {
    // 如果指定了小数位数但没有小数部分，则添加相应数量的0
    const zeros = ''.padEnd(decimals, '0')
    return `${formattedInteger}.${zeros}`
  }

  return formattedInteger
}

/**
 * Parse formatted number string to numeric value
 * @param value The formatted number string (e.g. "1,234.56")
 * @returns The parsed numeric value
 */
export function parseFormattedNumber(value: string): number {
  if (!value) return 0

  // Remove all commas and parse as float
  const cleanValue = value.replace(/,/g, '')
  const parsed = parseFloat(cleanValue)

  // Return 0 if parsing fails, otherwise return the parsed value
  return isNaN(parsed) ? 0 : parsed
}
