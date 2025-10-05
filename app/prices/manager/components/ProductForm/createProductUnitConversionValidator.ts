import { COMMON_FORMULAS } from '@/app/prices/constants/formulas'
import { parseUnit, parseUnitConversion } from '@/utils/format'
import { validateUnitConversion } from '@/utils/validation'

// Prevents common formulas by pre-calculating target units for the given unit
export function createProductUnitConversionValidator(currentUnit: string) {
  // Pre-calculate common formula target units for the current unit
  const commonFormulaTargetUnits = new Set<string>()
  COMMON_FORMULAS.forEach(([sourceUnit, formula]) => {
    if (sourceUnit === currentUnit) {
      // Parse the formula to get the target unit
      const formulaContent = formula.substring(1).trim() // Remove the '=' prefix
      const parsedFormula = parseUnit(formulaContent)
      const formulaTargetUnit = parsedFormula.unit
      if (formulaTargetUnit) {
        commonFormulaTargetUnits.add(formulaTargetUnit)
      }
    }
  })

  // Return a validator function that uses the pre-calculated target units
  return (value: string): true | string => {
    // First, validate the format using the existing validateUnitConversion function
    const formatValidation = validateUnitConversion(value)
    if (formatValidation !== true) {
      return formatValidation
    }

    // If format is valid, check if this conversion already exists in common formulas
    const parsedConversion = parseUnitConversion(value)
    const targetUnit = parsedConversion.unit

    // Check if this conversion already exists in common formulas
    if (commonFormulaTargetUnits.has(targetUnit)) {
      return `The conversion to "${targetUnit}" already exists in common formulas. No need to add it again.`
    }

    return true
  }
}
