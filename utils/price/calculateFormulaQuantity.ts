import { parseUnit, parseUnitConversion } from '@/utils/format'
import { divide, multiply } from '@/utils/math'

/**
 * Calculate actual quantity based on formula and unit conversion relationships
 *
 * @param formula Formula content (must include = prefix), e.g. "= 5 kg" or "= 2 斤"
 * @param targetUnit Target unit, e.g. "斤"
 * @param unitConversions Unit conversion list, e.g. ["2 斤"] means 1 base unit = 2 斤
 * @param baseUnit Base unit, can include number and unit, e.g. "1 kg" or "1000 ml"
 *
 * @example
 * // Basic unit conversion: 1 kg = 2 斤
 * calculateFormulaQuantity('= 5 kg', '斤', ['2 斤'], 'kg')
 *
 * @example
 * // Complex unit conversion: 1 L = 1000 ml
 * calculateFormulaQuantity('= 5000 ml', 'L', ['1000 ml'], 'L')
 *
 * @example
 * // Same unit returns directly
 * calculateFormulaQuantity('= 5 kg', 'kg', ['2 斤'], 'kg')
 *
 * @example
 * // Returns NaN when no unit conversion list is provided
 * calculateFormulaQuantity('= 5 斤', 'kg', [], 'kg')
 *
 * @returns Calculated actual quantity, or NaN if input is invalid or cannot be calculated
 */
export function calculateFormulaQuantity(formula: string, targetUnit: string, unitConversions: string[], baseUnit: string): number {
  // Check if formula starts with = prefix
  if (!formula.startsWith('=')) {
    return NaN
  }

  // Extract actual formula content after =
  const actualFormula = formula.substring(1).trim()

  // Return NaN if actual formula content is empty
  if (!actualFormula) {
    return NaN
  }

  try {
    // Parse unit in formula
    const parsedFormulaUnit = parseUnit(actualFormula)
    const formulaNumber = parsedFormulaUnit.number
    const formulaUnit = parsedFormulaUnit.unit

    // Return number directly if formula unit equals target unit
    if (formulaUnit === targetUnit) {
      return formulaNumber
    }

    // Return NaN if no unit conversion list is provided
    if (!unitConversions || unitConversions.length === 0) {
      return NaN
    }

    // Parse base unit
    const baseUnitParsed = parseUnit(baseUnit)
    const baseNumber = baseUnitParsed.number
    const baseUnitOnly = baseUnitParsed.unit // Unit part of base unit

    const targetUnitParsed = parseUnit(targetUnit)
    const targetUnitOnly = targetUnitParsed.unit

    // Iterate through unit conversions
    for (const conversionStr of unitConversions) {
      const conversionParsed = parseUnitConversion(conversionStr)
      const conversionNumber = conversionParsed.number
      const conversionUnit = conversionParsed.unit

      // Check if matching conversion relationship is found
      if (baseUnit && conversionUnit) {
        // Case 1: Base unit = conversion unit, formula unit is unit part of base unit, target unit is conversion unit
        if (baseUnitOnly === formulaUnit && conversionUnit === targetUnitOnly) {
          // baseNumber baseUnitOnly = conversionNumber conversionUnit
          // formulaNumber formulaUnit = ? targetUnit
          // According to unit conversion calculation specification: ? = (formulaNumber * conversionNumber) / baseNumber
          return divide(multiply(formulaNumber, conversionNumber), baseNumber)
        }

        // Case 2: Base unit = conversion unit, formula unit is conversion unit, target unit is unit part of base unit
        if (conversionUnit === formulaUnit && baseUnitOnly === targetUnitOnly) {
          // baseNumber baseUnitOnly = conversionNumber conversionUnit
          // ? targetUnit = formulaNumber formulaUnit
          // According to unit conversion calculation specification: ? = (formulaNumber * baseNumber) / conversionNumber
          return divide(multiply(formulaNumber, baseNumber), conversionNumber)
        }
      }
    }

    // Return NaN if no conversion relationship is found
    return NaN
  } catch (error) {
    // Return NaN if any error occurs during parsing
    return NaN
  }
}
