import type { ProductType } from '@/app/actions/prices/product'
import type { ComparisonItem } from '@/app/prices/components/result/List'
import { COMMON_FORMULAS } from '@/app/prices/constants/formulas'
import { isFormula } from '@/app/prices/types'
import { safeDivide } from '@/utils/calc'
import { convertChineseNumeralsInString, parseFormattedNumber, parseUnit } from '@/utils/format'

import { calculateFormulaQuantity } from './calculateFormulaQuantity'
import { calculatePriceLevel } from './calculatePriceLevel'
import { batchProcessUnitConversionNumericPart } from './processUnitConversionNumericPart'

/**
 * Calculate product comparisons based on total price and quantity
 * This function validates the input price and quantity, processes formula quantities if needed,
 * and calculates unit prices and price levels for each product to enable comparisons
 *
 * @param totalPrice - Total price as a string (may be a formula starting with '=')
 * @param totalQuantity - Total quantity as a string (may be a formula starting with '=')
 * @param products - Array of products for the selected product name
 * @param productUnitOnly - The unit of the current product being calculated, needed because formula inputs may use different units
 * @returns Array of comparison items with calculated prices and levels
 */
export function calculateProductComparisons(totalPrice: string, totalQuantity: string, products: ProductType[], productUnitOnly: string) {
  const totalPriceNumeric = isFormula(totalPrice) ? 0 : parseFormattedNumber(totalPrice)
  const totalQuantityNumeric = isFormula(totalQuantity) ? 0 : parseFormattedNumber(totalQuantity)
  const isValidPrice = !isNaN(totalPriceNumeric)
  const isValidFormula = !(isNaN(totalQuantityNumeric) || totalQuantityNumeric === 0) || isFormula(totalQuantity)
  if (!(isValidPrice && isValidFormula)) {
    return []
  }

  // If the input formula unit is the same as the product unit and the product unit has a quantity (e.g., 100 g),
  // then the quantity needs to be divided by 100 to achieve consistent conversion.
  // Using the following logic would multiply the final result by 100 again.
  const comparisons: ComparisonItem[] = []
  const { number: inputQuantityNumberic, unit: inputQuantityUnit } = parseUnit(totalQuantity.substring(1))
  if (inputQuantityUnit === productUnitOnly) {
    for (const p of products) {
      const { unitBestPrice, unit } = p
      const { number: productNumberic } = parseUnit(unit)
      const itemActualQuantity = safeDivide(inputQuantityNumberic, productNumberic)
      const itemUnitPrice = safeDivide(totalPriceNumeric, itemActualQuantity) || 0
      const level = calculatePriceLevel(itemUnitPrice, unitBestPrice)
      comparisons.push({ ...p, level, quantity: itemActualQuantity, unitCurrentPrice: itemUnitPrice })
    }

    return comparisons
  }

  // Calculate comparison items for each product
  const formulas = new Set<string>()
  const hitUnits = new Set<string>()
  COMMON_FORMULAS.forEach(([unit, formula]) => {
    if (unit !== productUnitOnly) {
      return
    }

    const formulaContent = formula.substring(1).trim()
    formulas.add(formulaContent)

    const parsedFormula = parseUnit(formulaContent)
    const { unit: formulaUnit } = parsedFormula
    hitUnits.add(formulaUnit)
  })

  for (const p of products) {
    // Calculate actual quantity for each item (if formula calculation is needed)
    let itemActualQuantity = totalQuantityNumeric // Use globally calculated quantity by default

    const { unitConversions, unit: productUnit, unitBestPrice } = p
    if (isFormula(totalQuantity)) {
      if (!productUnit) {
        continue
      }

      const conversions = unitConversions?.length ? unitConversions : []
      const filteredUnitConversions = conversions.filter((u) => {
        const parsedFormula = parseUnit(u)
        return !hitUnits.has(parsedFormula.unit)
      })

      // If the unit is something like 'per 100g', the formula needs to be converted to 'per 1g' for calculation.
      // Both unit and formulas need to be converted.
      const unitOnly = parseUnit(productUnit).unit
      const adjustedFormulas = batchProcessUnitConversionNumericPart(productUnit, Array.from(formulas))
      const mergedUnitConversions = [...filteredUnitConversions, ...adjustedFormulas]
      const formula = convertChineseNumeralsInString(totalQuantity.substring(1).trim())
      const itemCalculatedQuantity = calculateFormulaQuantity(`= ${formula}`, unitOnly, mergedUnitConversions, unitOnly)

      if (!isNaN(itemCalculatedQuantity)) {
        itemActualQuantity = itemCalculatedQuantity
      }
    }

    const itemUnitPrice = safeDivide(totalPriceNumeric, itemActualQuantity) || 0
    const level = calculatePriceLevel(itemUnitPrice, unitBestPrice)
    comparisons.push({ ...p, level, quantity: itemActualQuantity, unitCurrentPrice: itemUnitPrice })
  }

  return comparisons
}
