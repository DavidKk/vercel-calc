import { useMemo } from 'react'
import { BackspaceIcon } from '@heroicons/react/24/solid'
import type { ProductType } from '@/app/actions/prices/product'
import SearchableSelect from '@/components/SearchableSelect'
import { COMMON_FORMULAS } from '@/app/prices/constants/formulas'
import { parseUnit } from '@/utils/format'
import { processUnitConversionNumericPart } from '@/utils/price'
import { NumberInput, type Suggestion } from './NumberInput'
import { Button } from './Button'
import { isFormula } from '../types'

/**
 * Props for the InputSection component
 */
export interface InputSectionProps {
  /** Array of available product types */
  productTypes: ProductType[]
  /** Currently selected product type */
  selectedProductType: ProductType
  /** Total price input value */
  totalPrice: string
  /** Total quantity input value */
  totalQuantity: string
  /** Callback function when product selection changes */
  onProductChange: (value: any) => void
  /** Callback function when total price changes */
  onTotalPriceChange: (value: string, numericValue: number) => void
  /** Callback function when total quantity changes */
  onTotalQuantityChange: (value: string, numericValue: number) => void
  /** Callback function to clear all inputs */
  onClear: () => void
  /** Whether to support formula input */
  supportFormula?: boolean
}

/**
 * InputSection component provides input fields for product selection, total price, and total quantity
 * For example: 42 yuan for 2 jin (42元 2斤) means purchasing something that costs 42 yuan in total for 2 jin in total.
 * @param props - InputSection component props
 * @returns React component for inputting product data
 */
export function InputSection({
  productTypes,
  selectedProductType,
  totalPrice,
  totalQuantity,
  onProductChange,
  onTotalPriceChange,
  onTotalQuantityChange,
  onClear,
  supportFormula = false,
}: InputSectionProps) {
  const { name, unit } = selectedProductType
  const productOptions = useMemo(() => {
    const nameSet = new Set(productTypes.map((t) => t.name))
    const names = Array.from(nameSet)
    return names.map((name) => ({ value: name, label: name }))
  }, [productTypes])

  // Generate suggestions based on current unit and products
  const quantitySuggestions = useMemo(() => {
    if (!unit) return []

    const suggestions: Suggestion[] = []

    // Check if the current input is a pure number (not a formula)
    const isPureNumber = totalQuantity && !isFormula(totalQuantity)
    // Extract the numeric value from the input
    let inputNumber = ''
    if (isPureNumber) {
      // Remove commas and other formatting to get the pure number
      inputNumber = totalQuantity.replace(/[^\d.-]/g, '')
    }

    // Add common formulas that match the current unit
    const formulaConversions: string[] = []
    for (const [sourceUnit, formula] of COMMON_FORMULAS) {
      const { unit: finalUnit } = parseUnit(unit)
      if (sourceUnit !== finalUnit) {
        continue
      }

      const adjustedFormula = processUnitConversionNumericPart(unit, formula.slice(1))
      formulaConversions.push(adjustedFormula)
    }

    // Add unit conversions from products only if there's no corresponding formula
    const productConversionsSet = new Set<string>()
    for (const p of productTypes) {
      if (p.unit === unit && p.unitConversions) {
        for (const conversion of p.unitConversions) {
          productConversionsSet.add(conversion)
        }
      }
    }
    const productConversions = Array.from(productConversionsSet)

    // Use a single loop to filter and push suggestions
    for (const conversion of productConversions) {
      // Check if there's already a formula with this conversion
      const hasCorrespondingFormula = formulaConversions.some((formula) => formula.includes(conversion) || conversion.includes(formula.replace(/^=\s*/, '')))

      // Skip conversion if there's a corresponding formula
      if (hasCorrespondingFormula) {
        continue
      }

      let formattedConversion = `= ${conversion}`

      // If input is a pure number, replace the number in the conversion
      if (isPureNumber && inputNumber) {
        // Replace the first number in the conversion with the input number
        formattedConversion = `= ${conversion}`.replace(/\d[\d,.]*/, inputNumber)
      }

      // Add indicator for custom product conversions
      const labeledConversion = `${formattedConversion} (Custom)`
      suggestions.push({
        label: labeledConversion,
        value: formattedConversion,
      })
    }

    // Add formula conversions with proper formatting (no label needed for common formulas)
    for (const formula of formulaConversions) {
      let formattedFormula = isFormula(formula) ? formula : `= ${formula}`

      // If input is a pure number, replace the number in the formula
      if (isPureNumber && inputNumber) {
        // Replace the first number in the formula with the input number
        formattedFormula = formattedFormula.replace(/\d[\d,.]*/, inputNumber)
      }

      suggestions.push({
        label: formattedFormula,
        value: formattedFormula,
      })
    }

    return suggestions
  }, [productTypes, unit, totalQuantity])

  return (
    <div className="bg-gray-900 rounded-lg p-4 h-full">
      <div className="flex flex-col gap-4 h-full">
        <div className="flex gap-2 mt-auto">
          <SearchableSelect value={name} options={productOptions} onChange={onProductChange} clearable={false} size="md" />
          <Button className="w-1/3" onClick={onClear} variant="danger" size="lg" icon={<BackspaceIcon className="h-6 w-6" />} title="Clear" />
        </div>

        {/* Input field for total price */}
        <NumberInput value={totalPrice} unit="¥" onChange={onTotalPriceChange} />

        {/* Input field for total quantity with suggestions */}
        <NumberInput value={totalQuantity} unit={unit} supportFormula={supportFormula} suggestions={quantitySuggestions} onChange={onTotalQuantityChange} />
      </div>
    </div>
  )
}
