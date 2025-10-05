import { useMemo } from 'react'
import { BackspaceIcon, CheckIcon } from '@heroicons/react/24/solid'
import type { ProductType } from '@/app/actions/prices/product'
import SearchableSelect from '@/components/SearchableSelect'
import type { PriceLevel } from '@/app/prices/types'
import { NumberInput } from './NumberInput'
import { Button } from './Button'

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

  return (
    <div className="bg-gray-900 rounded-lg p-4 h-full">
      <div className="flex flex-col gap-4 h-full">
        <div className="flex gap-2 mt-auto">
          <SearchableSelect value={name} options={productOptions} onChange={onProductChange} clearable={false} size="md" />
          <Button className="w-1/4" onClick={onClear} variant="danger" size="lg" icon={<BackspaceIcon className="h-6 w-6" />} title="Clear" fullWidth />
        </div>

        {/* Input field for total price */}
        <NumberInput value={totalPrice} unit="¥" onChange={onTotalPriceChange} />
        {/* Input field for total quantity */}
        <NumberInput value={totalQuantity} unit={unit} supportFormula={supportFormula} onChange={onTotalQuantityChange} />
      </div>
    </div>
  )
}
