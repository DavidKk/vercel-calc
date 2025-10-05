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
    // First part should be a number (could be Chinese numerals)
    const numberPart = parts[0].replace(/,/g, '') // Remove commas
    // Use parseFormattedNumber to handle both Arabic and Chinese numerals
    const number = parseFormattedNumber(numberPart)

    // Second part should be the unit
    const unitPart = parts[1]

    return {
      number: isNaN(number) ? 1 : number,
      unit: unitPart,
    }
  }

  // If no space, the whole thing should be number + unit
  // Find where number ends and unit begins
  const cleanInput = parts[0].replace(/,/g, '') // Remove commas

  // First, try to extract Chinese numerals
  const chinesePart = extractChineseNumerals(cleanInput)
  if (chinesePart) {
    // If we found Chinese numerals, convert them to Arabic numerals
    const chineseValue = convertChineseToArabic(chinesePart)
    if (!isNaN(chineseValue) && chineseValue !== 0) {
      // Get the unit part (everything after the Chinese numerals)
      const unitPart = cleanInput.substring(chinesePart.length)
      return {
        number: chineseValue,
        unit: unitPart || parts[0],
      }
    }
  }

  // Check if the input is just a unit with no number (e.g. "kg")
  // We do this by checking if the first character is a digit or decimal point
  if (!/^\d|^\./.test(cleanInput)) {
    return {
      number: 1,
      unit: cleanInput,
    }
  }

  // Find the boundary between number and unit
  let i = 0
  // Skip digits and decimal point
  while (i < cleanInput.length && (/^\d$/.test(cleanInput[i]) || cleanInput[i] === '.')) {
    i++
  }

  // The rest should be the unit
  const unitPart = cleanInput.substring(i)
  const numberPart = cleanInput.substring(0, i)

  const number = parseFormattedNumber(numberPart)

  return {
    number: isNaN(number) ? 1 : number,
    unit: unitPart || parts[0],
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

/**
 * Convert Chinese numerals to Arabic numerals
 * @param chineseNumber The Chinese numeral string (e.g. "一千零一" or "一百点二八")
 * @returns The corresponding Arabic numeral
 */
export function convertChineseToArabic(chineseNumber: string): number {
  if (!chineseNumber) return 0

  // Define Chinese numeral mappings
  const chineseNumerals: { [key: string]: number } = {
    零: 0,
    一: 1,
    二: 2,
    三: 3,
    四: 4,
    五: 5,
    六: 6,
    七: 7,
    八: 8,
    九: 9,
    十: 10,
    百: 100,
    千: 1000,
    万: 10000,
    亿: 100000000,
    点: -1, // Decimal point marker
  }

  // Remove whitespace
  const cleanInput = chineseNumber.trim()

  // Handle special case for "零"
  if (cleanInput === '零') return 0

  // Handle simple case for single digit numbers
  if (cleanInput.length === 1 && chineseNumerals[cleanInput] !== undefined && chineseNumerals[cleanInput] < 10) {
    return chineseNumerals[cleanInput]
  }

  // Check if there's a decimal point
  const pointIndex = cleanInput.indexOf('点')
  let integerPart = cleanInput
  let decimalPart = ''

  if (pointIndex !== -1) {
    integerPart = cleanInput.substring(0, pointIndex)
    decimalPart = cleanInput.substring(pointIndex + 1)
  }

  // Convert integer part
  let integerResult = 0
  if (integerPart) {
    integerResult = convertChineseInteger(integerPart, chineseNumerals)
  }

  // Convert decimal part
  let decimalResult = 0
  if (decimalPart) {
    decimalResult = convertChineseDecimal(decimalPart, chineseNumerals)
  }

  // Combine integer and decimal parts
  return integerResult + decimalResult
}

/**
 * Convert Chinese integer part to Arabic numeral
 * @param chineseInteger The Chinese integer string
 * @param chineseNumerals The mapping of Chinese numerals
 * @returns The corresponding Arabic integer
 */
function convertChineseInteger(chineseInteger: string, chineseNumerals: { [key: string]: number }): number {
  if (!chineseInteger) return 0

  // Handle special case - if the string is all zeros, return 0
  if (/^零+$/.test(chineseInteger)) return 0

  // For handling multiple zeros, we need to process the string more carefully
  // Let's use a stack-based approach
  let stack: number[] = []
  let result = 0

  for (let i = 0; i < chineseInteger.length; i++) {
    const char = chineseInteger[i]
    const value = chineseNumerals[char]

    if (value === undefined) {
      // Invalid character
      return 0
    }

    if (value === -1) {
      // Decimal point, should not appear in integer part
      break
    }

    if (value < 10) {
      // It's a digit (0-9)
      stack.push(value)
    } else if (value === 10 || value === 100 || value === 1000) {
      // It's a unit (十, 百, 千)
      if (stack.length === 0) {
        // Special case: "十" means 10
        stack.push(1)
      }

      // Multiply the last number in stack with the unit
      const lastNumber = stack.pop() || 0
      stack.push(lastNumber * value)
    } else if (value === 10000 || value === 100000000) {
      // It's a larger unit (万, 亿)
      // Sum all numbers in stack and multiply by this unit
      const sum = stack.reduce((acc, val) => acc + val, 0)
      result += sum * value
      stack = [] // Reset stack
    }
  }

  // Add any remaining values in stack
  result += stack.reduce((acc, val) => acc + val, 0)

  return result
}

/**
 * Convert Chinese decimal part to Arabic decimal
 * @param chineseDecimal The Chinese decimal string
 * @param chineseNumerals The mapping of Chinese numerals
 * @returns The corresponding Arabic decimal (e.g. 0.28 for "二八")
 */
function convertChineseDecimal(chineseDecimal: string, chineseNumerals: { [key: string]: number }): number {
  if (!chineseDecimal) return 0

  let decimalStr = '0.'

  for (let i = 0; i < chineseDecimal.length; i++) {
    const char = chineseDecimal[i]
    const value = chineseNumerals[char]

    if (value === undefined || value === -1) {
      // Invalid character or decimal point
      return 0
    }

    if (value < 10) {
      // It's a digit (0-9)
      decimalStr += value.toString()
    } else {
      // Units are not allowed in decimal part
      return 0
    }
  }

  return parseFloat(decimalStr)
}

/**
 * Extract Chinese numerals from a string
 * @param value The string to extract from (e.g. "十一斤" -> "十一")
 * @returns The extracted Chinese numerals or empty string if none found
 */
export function extractChineseNumerals(value: string): string {
  if (!value || value.trim() === '') {
    return ''
  }

  // Define Chinese numeral characters
  const chineseNumeralChars = '零一二三四五六七八九十百千万亿点'

  // Extract the Chinese numeral part from the beginning of the string
  let chineseNumeralPart = ''

  for (let i = 0; i < value.length; i++) {
    if (chineseNumeralChars.includes(value[i])) {
      chineseNumeralPart += value[i]
    } else {
      // Stop at the first non-Chinese numeral character
      break
    }
  }

  return chineseNumeralPart
}

/**
 * Convert Chinese numerals in a string to Arabic numerals
 * @param value The string containing Chinese numerals (e.g. "= 十斤" -> "= 10斤")
 * @returns The string with Chinese numerals converted to Arabic numerals
 */
export function convertChineseNumeralsInString(value: string): string {
  if (!value || value.trim() === '') {
    return value
  }

  // Define Chinese numeral characters
  const chineseNumeralChars = '零一二三四五六七八九十百千万亿点'

  let result = ''
  let i = 0

  while (i < value.length) {
    // Check if current character is a Chinese numeral
    if (chineseNumeralChars.includes(value[i])) {
      // Extract the entire Chinese numeral sequence
      let chineseNumeralPart = ''
      let j = i

      while (j < value.length && chineseNumeralChars.includes(value[j])) {
        chineseNumeralPart += value[j]
        j++
      }

      // Convert the Chinese numeral to Arabic numeral
      const arabicNumeral = convertChineseToArabic(chineseNumeralPart)

      // Add the converted numeral to result
      result += arabicNumeral.toString()

      // Move index to the end of the Chinese numeral sequence
      i = j
    } else {
      // Add non-Chinese numeral character as is
      result += value[i]
      i++
    }
  }

  return result
}
