import { parseUnit } from '@/utils/format'
import { multiply } from '@/utils/math'

export function processUnitConversionNumericPart(unit: string, conversion: string) {
  // Parse the base unit to extract number and unit parts
  const parsedBaseUnit = parseUnit(unit)
  const baseNumber = parsedBaseUnit.number
  if (baseNumber === 1 || isNaN(baseNumber)) {
    return conversion
  }

  const parsedConversion = parseUnit(conversion)
  const conversionNumber = parsedConversion.number
  const conversionUnit = parsedConversion.unit

  // Calculate the adjusted conversion number
  // If base unit is "100g = 1 bottle", then for "500g" we need "5 bottles"
  const adjustedNumber = multiply(conversionNumber, baseNumber)
  // Return the adjusted conversion
  return `${adjustedNumber} ${conversionUnit}`
}

/**
 * Process unit conversions that contain numbers in their base unit
 * For example, if baseUnit is "100g" and conversion is "1 bottle",
 * this function will adjust the conversion to maintain the correct ratio
 *
 * @param baseUnit The base unit which may contain a number (e.g. "100g")
 * @param conversions The array of unit conversions
 * @returns Processed conversions with adjusted ratios when base unit contains numbers
 */
export function batchProcessUnitConversionNumericPart(baseUnit: string, conversions: string[]): string[] {
  return conversions.map((conversion) => {
    return processUnitConversionNumericPart(baseUnit, conversion)
  })
}
