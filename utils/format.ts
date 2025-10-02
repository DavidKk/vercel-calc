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
  if (!value) {
    return 0
  }

  // Remove all commas and parse as float
  const cleanValue = value.replace(/,/g, '')
  const parsed = parseFloat(cleanValue)

  // Return 0 if parsing fails, otherwise return the parsed value
  return isNaN(parsed) ? 0 : parsed
}

/**
 * Format a number to a string with proper decimal places
 * @param num The number to format
 * @param maxDecimals Maximum number of decimal places (default: 6)
 * @returns Formatted number string
 */
export function formatNumber(num: number, maxDecimals = 6): string {
  if (isNaN(num)) return '0'

  // Round to maxDecimals decimal places
  const rounded = Math.round(num * Math.pow(10, maxDecimals)) / Math.pow(10, maxDecimals)

  // Convert to string and remove trailing zeros
  let str = rounded.toString()

  // If it's a decimal number, remove trailing zeros
  if (str.includes('.')) {
    str = str.replace(/\.?0+$/, '')
  }

  return str
}

/**
 * Parse unit string to extract number and unit parts
 * @param unit The unit string (e.g. "kg", "10 kg", "100ml")
 * @returns Object with number and unit properties
 */
export function parseUnit(unit: string): { number: number; unit: string } {
  if (!unit || unit.trim() === '') {
    return { number: 1, unit: '' }
  }

  const trimmed = unit.trim()

  // Split by spaces
  const parts = trimmed.split(/\s+/)

  // If we have two parts (number and unit separated by space)
  if (parts.length === 2) {
    // First part should be a number
    const numberPart = parts[0].replace(/,/g, '') // Remove commas
    const number = parseFloat(numberPart)

    // Second part should be the unit
    const unitPart = parts[1]

    return {
      number: isNaN(number) ? 1 : number,
      unit: unitPart,
    }
  } else {
    // If no space, the whole thing should be number + unit
    // Find where number ends and unit begins
    const cleanInput = parts[0].replace(/,/g, '') // Remove commas

    // Find the boundary between number and unit
    let i = 0
    // Skip digits and decimal point
    while (i < cleanInput.length && (/^\d$/.test(cleanInput[i]) || cleanInput[i] === '.')) {
      i++
    }

    // The rest should be the unit
    const unitPart = cleanInput.substring(i)
    const numberPart = cleanInput.substring(0, i)

    const number = parseFloat(numberPart)

    return {
      number: isNaN(number) ? 1 : number,
      unit: unitPart || parts[0],
    }
  }
}

/**
 * Parse unit conversion string to extract number and unit parts
 * @param conversion The unit conversion string (e.g. "100ml", "100 ml")
 * @returns Object with number and unit properties
 */
export function parseUnitConversion(conversion: string): { number: number; unit: string } {
  return parseUnit(conversion)
}
