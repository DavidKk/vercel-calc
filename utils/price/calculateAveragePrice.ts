import type { ProductType } from '@/app/actions/prices/product'
import type { ComparisonItem } from '@/app/prices/components/result/List'
import { COMMON_FORMULAS } from '@/app/prices/constants/formulas'
import { isFormula } from '@/app/prices/types'
import { convertChineseNumeralsInString, parseFormattedNumber, parseUnit } from '@/utils/format'
import { calculateFormulaQuantity } from './calculateFormulaQuantity'
import { calculatePriceLevel } from './calculatePriceLevel'
import { batchProcessUnitConversionNumericPart } from '../price'

/**
 * Calculate average price and comparisons for products
 *
 * @param totalPriceNumeric - Total price as a number
 * @param totalQuantity - Total quantity as a string (to check if it's a formula)
 * @param products - Array of products for the selected product name
 * @param productUnitOnly - 因为输入的数量如果为公式则可能是其他单位，因此这里需要单独传入当前计算的商品数量单位
 * @returns Object containing average price, price level, and comparison items
 */
export function calculateAveragePrice(totalPrice: string, totalQuantity: string, products: ProductType[], productUnitOnly: string) {
  const totalPriceNumeric = isFormula(totalPrice) ? 0 : parseFormattedNumber(totalPrice)
  const totalQuantityNumeric = isFormula(totalQuantity) ? 0 : parseFormattedNumber(totalQuantity)

  const isValidPrice = !isNaN(totalPriceNumeric)
  const isValidFormula = !(isNaN(totalQuantityNumeric) || totalQuantityNumeric === 0) || isFormula(totalQuantity)
  if (!(isValidPrice && isValidFormula)) {
    return []
  }

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

  // Calculate comparison items for each product
  const comparisons: ComparisonItem[] = []
  for (const p of products) {
    // Calculate actual quantity for each item (if formula calculation is needed)
    let itemActualQuantity = totalQuantityNumeric // Use globally calculated quantity by default

    const { unitConversions, unit, unitBestPrice } = p
    if (isFormula(totalQuantity)) {
      if (!unit) {
        continue
      }

      const conversions = unitConversions?.length ? unitConversions : []
      const filteredUnitConversions = conversions.filter((u) => {
        const parsedFormula = parseUnit(u)
        return !hitUnits.has(parsedFormula.unit)
      })

      // 如果单位为 每 100g，则需要将公式转换成 每 1g 进行计算，unit 与 formulas 都需要转换
      const unitOnly = parseUnit(unit).unit
      const adjustedFormulas = batchProcessUnitConversionNumericPart(unit, Array.from(formulas))
      const mergedUnitConversions = [...filteredUnitConversions, ...adjustedFormulas]
      const formula = convertChineseNumeralsInString(totalQuantity.substring(1).trim())
      const itemCalculatedQuantity = calculateFormulaQuantity(`= ${formula}`, unitOnly, mergedUnitConversions, unitOnly)

      if (!isNaN(itemCalculatedQuantity)) {
        itemActualQuantity = itemCalculatedQuantity
      }
    }

    const itemAvgPrice = totalPriceNumeric / itemActualQuantity
    const level = calculatePriceLevel(itemAvgPrice, unitBestPrice)
    comparisons.push({ ...p, level, quantity: itemActualQuantity, unitCurrentPrice: itemAvgPrice })
  }

  return comparisons
}
