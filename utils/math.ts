/**
 * Mathematical utility functions for precise floating point operations
 */

/**
 * Add two numbers with precision handling
 * @param a First number
 * @param b Second number
 * @returns Sum of a and b
 */
export function add(a: number, b: number): number {
  if (!Number.isFinite(a) || !Number.isFinite(b)) {
    return a + b
  }

  const aStr = a.toString()
  const bStr = b.toString()
  const aDecimal = aStr.split('.')[1]
  const bDecimal = bStr.split('.')[1]
  const aDecimalLength = aDecimal ? aDecimal.length : 0
  const bDecimalLength = bDecimal ? bDecimal.length : 0
  const maxDecimalLength = Math.max(aDecimalLength, bDecimalLength)

  const multiplier = Math.pow(10, maxDecimalLength)
  return (Math.round(a * multiplier) + Math.round(b * multiplier)) / multiplier
}

/**
 * Subtract two numbers with precision handling
 * @param a First number
 * @param b Second number
 * @returns Difference of a and b
 */
export function subtract(a: number, b: number): number {
  if (!Number.isFinite(a) || !Number.isFinite(b)) {
    return a - b
  }

  const aStr = a.toString()
  const bStr = b.toString()
  const aDecimal = aStr.split('.')[1]
  const bDecimal = bStr.split('.')[1]
  const aDecimalLength = aDecimal ? aDecimal.length : 0
  const bDecimalLength = bDecimal ? bDecimal.length : 0
  const maxDecimalLength = Math.max(aDecimalLength, bDecimalLength)

  const multiplier = Math.pow(10, maxDecimalLength)
  return (Math.round(a * multiplier) - Math.round(b * multiplier)) / multiplier
}

/**
 * Multiply two numbers with precision handling
 * @param a First number
 * @param b Second number
 * @returns Product of a and b
 */
export function multiply(a: number, b: number): number {
  if (!Number.isFinite(a) || !Number.isFinite(b)) {
    return a * b
  }

  const aStr = a.toString()
  const bStr = b.toString()
  const aDecimal = aStr.split('.')[1]
  const bDecimal = bStr.split('.')[1]
  const aDecimalLength = aDecimal ? aDecimal.length : 0
  const bDecimalLength = bDecimal ? bDecimal.length : 0
  const totalDecimalLength = aDecimalLength + bDecimalLength

  const aInt = parseInt(aStr.replace('.', ''), 10)
  const bInt = parseInt(bStr.replace('.', ''), 10)

  return (aInt * bInt) / Math.pow(10, totalDecimalLength)
}

/**
 * Divide two numbers with precision handling
 * @param a Dividend
 * @param b Divisor
 * @returns Quotient of a and b
 */
export function divide(a: number, b: number): number {
  if (!Number.isFinite(a) || !Number.isFinite(b)) {
    return a / b
  }

  if (b === 0) {
    throw new Error('Division by zero')
  }

  const aStr = a.toString()
  const bStr = b.toString()
  const aDecimal = aStr.split('.')[1]
  const bDecimal = bStr.split('.')[1]
  const aDecimalLength = aDecimal ? aDecimal.length : 0
  const bDecimalLength = bDecimal ? bDecimal.length : 0

  const aInt = parseInt(aStr.replace('.', ''), 10)
  const bInt = parseInt(bStr.replace('.', ''), 10)

  return (aInt / bInt) * Math.pow(10, bDecimalLength - aDecimalLength)
}

/**
 * Round a number to specified decimal places
 * @param num Number to round
 * @param decimals Number of decimal places
 * @returns Rounded number
 */
export function round(num: number, decimals: number): number {
  const multiplier = Math.pow(10, decimals)
  return Math.round(num * multiplier) / multiplier
}
