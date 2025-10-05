import type { ProductType } from '@/app/actions/prices/product'
import { formatNumber, parseUnit, parseUnitConversion } from '@/utils/format'

// Generate unit conversion suggestions based on existing products
export function generateUnitConversionSuggestions(unit: string, products: ProductType[]) {
  if (!unit) {
    return []
  }

  // Parse the current unit to get the number and unit part (e.g., "2kg" -> { number: 2, unit: "kg" })
  const parsedCurrentUnit = parseUnit(unit)
  const currentUnitNumber = parsedCurrentUnit.number
  const currentUnit = parsedCurrentUnit.unit || unit

  if (!currentUnit) {
    return []
  }

  // Collect all unit conversions that involve the current unit
  const suggestionsMap = new Map<string, string>()

  // Only add suggestions from products, not from common formulas
  products.forEach((product) => {
    if (!(product.unitConversions && product.unitConversions.length > 0)) {
      return
    }

    // Parse the product's base unit
    const productBaseUnitParsed = parseUnit(product.unit)
    const productBaseUnit = productBaseUnitParsed.unit || product.unit
    const productBaseNumber = productBaseUnitParsed.number

    product.unitConversions.forEach((conversionStr) => {
      // Parse the conversion
      const parsed = parseUnitConversion(conversionStr)
      const conversionNumber = parsed.number
      const conversionUnit = parsed.unit

      if (!(conversionUnit && productBaseUnit)) {
        return
      }

      // Create a conversion relationship: productBaseNumber productBaseUnit = conversionNumber conversionUnit
      // For example: 1 kg = 2 斤
      if (productBaseUnit === currentUnit) {
        // Current unit is the base unit
        // Calculate how many conversion units equal currentUnitNumber of current units
        // For example, if we have "1 kg = 2 斤", and current unit is "2 kg",
        // we want to show "4 斤 (Product Name - Brand)" as a suggestion
        if (productBaseNumber > 0) {
          const conversionUnitsForCurrent = (conversionNumber * currentUnitNumber) / productBaseNumber
          const formattedNumber = formatNumber(conversionUnitsForCurrent, 6)
          const productInfo = product.brand ? `${product.name} - ${product.brand}` : product.name
          const key = `${formattedNumber} ${conversionUnit} (${productInfo})`
          suggestionsMap.set(key, key)
        }

        return
      }

      if (conversionUnit === currentUnit) {
        // Current unit is the conversion unit
        // Calculate how many base units equal currentUnitNumber of current units
        // For example, if we have "1 kg = 2 斤", and current unit is "4 斤",
        // we want to show "2 kg (Product Name - Brand)" as a suggestion
        if (conversionNumber > 0) {
          const baseUnitsForCurrent = (productBaseNumber * currentUnitNumber) / conversionNumber
          const formattedNumber = formatNumber(baseUnitsForCurrent, 6)
          const productInfo = product.brand ? `${product.name} - ${product.brand}` : product.name
          const key = `${formattedNumber} ${productBaseUnit} (${productInfo})`
          suggestionsMap.set(key, key)
        }
      }
    })
  })

  // Convert map to array of suggestion objects
  const suggestions = Array.from(suggestionsMap.values()).map((value) => ({
    label: value,
    value: value,
  }))

  // Filter out invalid suggestions (ones that don't parse correctly)
  const validSuggestions = suggestions.filter((suggestion) => {
    try {
      // Extract just the unit part for validation (before the parentheses)
      const unitPart = suggestion.value.split(' (')[0]
      const parsed = parseUnitConversion(unitPart)
      return parsed.unit && parsed.number > 0
    } catch {
      return false
    }
  })

  return validSuggestions
}
