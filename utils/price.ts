import type { ProductType } from '@/app/actions/prices/product'
import type { ComparisonItem } from '@/app/prices/components/result/List'
import { COMMON_FORMULAS } from '@/app/prices/constants/formulas'
import { isFormula, PriceLevel } from '@/app/prices/types'
import { parseFormattedNumber, parseUnit, parseUnitConversion } from '@/utils/format'

/**
 * Calculate price level based on average price and recommended price
 * @param averagePrice The average price of the product
 * @param unitBestPrice The recommended price for comparison
 * @returns The calculated price level
 */
export function calculatePriceLevel(averagePrice: number, unitBestPrice: number): PriceLevel {
  if (unitBestPrice === 0) {
    throw new Error('Recommended price cannot be zero')
  }

  const ratio = averagePrice / unitBestPrice

  if (ratio <= 0.5) {
    return PriceLevel.LOW
  }

  if (ratio <= 1.0) {
    return PriceLevel.REASONABLE
  }

  if (ratio <= 1.5) {
    return PriceLevel.HIGH
  }

  return PriceLevel.FAMILY_TREASURE
}

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

    // Iterate through unit conversions
    for (const conversionStr of unitConversions) {
      const conversionParsed = parseUnitConversion(conversionStr)
      const conversionNumber = conversionParsed.number
      const conversionUnit = conversionParsed.unit

      // Check if matching conversion relationship is found
      if (baseUnit && conversionUnit) {
        // Case 1: Base unit = conversion unit, formula unit is unit part of base unit, target unit is conversion unit
        if (baseUnitOnly === formulaUnit && conversionUnit === targetUnit) {
          // baseNumber baseUnitOnly = conversionNumber conversionUnit
          // formulaNumber formulaUnit = ? targetUnit
          // According to unit conversion calculation specification: ? = (formulaNumber * conversionNumber) / baseNumber
          return (formulaNumber * conversionNumber) / baseNumber
        }

        // Case 2: Base unit = conversion unit, formula unit is conversion unit, target unit is unit part of base unit
        if (conversionUnit === formulaUnit && baseUnitOnly === targetUnit) {
          // baseNumber baseUnitOnly = conversionNumber conversionUnit
          // ? targetUnit = formulaNumber formulaUnit
          // According to unit conversion calculation specification: ? = (formulaNumber * baseNumber) / conversionNumber
          return (formulaNumber * baseNumber) / conversionNumber
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

/**
 * Calculate average price and comparisons for products
 *
 * @param totalPriceNumeric - Total price as a number
 * @param totalQuantity - Total quantity as a string (to check if it's a formula)
 * @param products - Array of products for the selected product name
 * @returns Object containing average price, price level, and comparison items
 */
export function calculateAveragePrice(totalPrice: string, totalQuantity: string, products: ProductType[]) {
  const totalPriceNumeric = isFormula(totalPrice) ? 0 : parseFormattedNumber(totalPrice)
  const totalQuantityNumeric = isFormula(totalQuantity) ? 0 : parseFormattedNumber(totalQuantity)
  const isValidPrice = !isNaN(totalPriceNumeric)
  const isValidFormula = !(isNaN(totalQuantityNumeric) || totalQuantityNumeric === 0) || isFormula(totalQuantity)
  if (!(isValidPrice && isValidFormula)) {
    return []
  }

  const formulaContent = totalQuantity.substring(1).trim()
  const parsedTotalQuantityFormula = parseUnit(formulaContent)
  const { unit: totalQuantityFormulaUnit } = parsedTotalQuantityFormula

  const formulas = new Set<string>()
  const hitUnits = new Set<string>()
  COMMON_FORMULAS.forEach(([_, formula]) => {
    const formulaContent = formula.substring(1).trim()
    const parsedFormula = parseUnit(formulaContent)
    const { unit: formulaUnit } = parsedFormula
    if (formulaUnit !== totalQuantityFormulaUnit) {
      return
    }

    formulas.add(formulaContent)
    hitUnits.add(formulaUnit)
  })

  // Calculate comparison items for each product
  const comparisons: ComparisonItem[] = []
  for (const p of products) {
    // Calculate actual quantity for each item (if formula calculation is needed)
    let itemActualQuantity = totalQuantityNumeric // Use globally calculated quantity by default

    const { unitConversions, unit, unitBestPrice } = p
    if (isFormula(totalQuantity)) {
      if (!(unitConversions?.length && unit)) {
        continue
      }

      const filteredUnitConversions = unitConversions.filter((u) => {
        const parsedFormula = parseUnit(u)
        return !hitUnits.has(parsedFormula.unit)
      })

      const mergedUnitConversions = [...filteredUnitConversions, ...formulas]
      const formula = totalQuantity.substring(1).trim()
      const itemCalculatedQuantity = calculateFormulaQuantity(`= ${formula}`, unit, mergedUnitConversions, unit)

      if (!isNaN(itemCalculatedQuantity)) {
        itemActualQuantity = itemCalculatedQuantity
      }
    }

    const itemAvgPrice = totalPriceNumeric / itemActualQuantity
    const level = calculatePriceLevel(itemAvgPrice, unitBestPrice)
    comparisons.push({ ...p, level, quantity: itemActualQuantity })
  }

  return comparisons
}
