import type { ProductType } from '@/app/actions/prices/product'
import { List } from './List'
import { Placeholder } from './Placeholder'
import type { ComparisonItem } from './List'

/**
 * Props for the Result component
 */
export interface ResultProps {
  /** Array of comparison items */
  comparisons?: ComparisonItem[]
  /** Callback function when a brand is selected */
  onBrandSelect?: (item: ComparisonItem) => void
  /** Currently selected product */
  selectedProduct?: ProductType | null
  /** Unit price of the product */
  totalPriceNumeric?: number
  /** Quantity input - can be a formula (starts with =) or a regular input */
  quantity?: string | number
}

/**
 * Result component displays product comparison results or product information
 * @param props - Result component props
 * @returns React component for displaying results
 */
export function Result({ comparisons = [], onBrandSelect, selectedProduct, quantity, totalPriceNumeric }: ResultProps) {
  if (!selectedProduct) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 w-full h-full">
        <div className="text-gray-400 text-lg">Please select a product</div>
      </div>
    )
  }

  if (comparisons.length > 0) {
    return (
      <div className="flex flex-col gap-2 w-full">
        <List items={comparisons} onBrandSelect={onBrandSelect} totalPriceNumeric={totalPriceNumeric} quantity={quantity} />
      </div>
    )
  }

  return <Placeholder product={selectedProduct} />
}
