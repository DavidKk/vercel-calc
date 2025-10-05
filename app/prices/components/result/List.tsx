import type { PriceLevel } from '@/app/prices/types'
import { isFormula } from '@/app/prices/types'
import { PriceLevelDisplay } from '../PriceLevelDisplay'
import { PriceDisplay } from '../PriceDisplay'
import { formatNumberWithCommas } from '@/utils/format'

/**
 * Comparison item interface for product comparison
 */
export interface ComparisonItem {
  /** Product name */
  name: string
  /** Product brand (optional) */
  brand?: string
  /** Best unit price of the product */
  unitBestPrice: number
  /** Price level of the product */
  level: PriceLevel
  /** Quantity of the product */
  quantity: number
  /** Product remark (optional) */
  remark?: string
}

/**
 * Props for the List component
 */
export interface ListProps {
  /** Array of comparison items to display */
  items: ComparisonItem[]
  /** Callback function when a brand is selected */
  onBrandSelect?: (item: ComparisonItem) => void
  /** Quantity input - can be a formula (starts with =) or a regular input */
  quantity?: string | number
  /** Unit of the product */
  unit?: string
  /** Unit price of the product */
  totalPriceNumeric?: number
}

/**
 * List component displays a list of product comparison items
 * @param props - List component props
 * @returns React component for displaying a list of products
 */
export function List({ items, onBrandSelect, quantity, unit, totalPriceNumeric }: ListProps) {
  // Calculate actual quantity based on whether it's a formula or regular input
  let actualQuantity: number | null = null
  if (typeof quantity === 'string' && isFormula(quantity)) {
    // For formulas, we would need to calculate the actual value
    // This is just a placeholder - actual formula calculation would happen elsewhere
    actualQuantity = null // Will be calculated by the parent component
  } else if (quantity !== undefined) {
    actualQuantity = Number(quantity)
  }

  // If we don't have a valid quantity, default to 1
  if (actualQuantity === null || isNaN(actualQuantity)) {
    actualQuantity = 1
  }

  return (
    <div className="flex flex-col gap-2 w-full">
      {items.map((item, idx) => {
        let averagePrice = item.unitBestPrice
        if (totalPriceNumeric !== undefined && actualQuantity !== 0) {
          averagePrice = totalPriceNumeric / actualQuantity
        }

        return (
          <div
            className="flex items-center bg-gray-800/90 hover:bg-gray-800 transition-colors rounded-md p-3 cursor-pointer gap-3"
            onClick={() => onBrandSelect?.(item)}
            key={`${item.brand || 'no-brand'}-${item.name}-${idx}`}
          >
            <div className="flex flex-col flex-1">
              <div className="text-white text-base font-medium">
                {item.name} {item.brand && <span className="text-gray-400 text-sm font-normal">&nbsp;-&nbsp;{item.brand}</span>}
              </div>
              {item.remark && <div className="text-gray-400 text-xs">{item.remark}</div>}

              <div className="flex items-center gap-x-1 text-white font-light">
                <PriceDisplay amount={averagePrice} size="lg" />
                {item.quantity ? (
                  <span className="text-gray-400 text-sm">
                    {formatNumberWithCommas(item.quantity)} {unit}
                  </span>
                ) : null}
              </div>

              <div className="flex items-center flex-wrap gap-x-1">
                <span className="text-gray-400 text-sm">
                  <PriceDisplay amount={item.unitBestPrice} size="md" />
                </span>
                {unit ? (
                  <span className="text-gray-400 text-sm">
                    {formatNumberWithCommas(actualQuantity)} {unit}
                  </span>
                ) : null}
              </div>
            </div>

            <div className="flex items-center justify-center">
              <PriceLevelDisplay priceLevel={item.level} />
            </div>
          </div>
        )
      })}
    </div>
  )
}
