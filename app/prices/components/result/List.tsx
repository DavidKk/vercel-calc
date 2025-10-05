import type { PriceLevel } from '@/app/prices/types'
import { isFormula } from '@/app/prices/types'
import { PriceLevelDisplay } from '@/app/prices/components/PriceLevelDisplay'
import { PriceDisplay } from '@/app/prices/components/PriceDisplay'
import { Quantity } from '@/app/prices/components/Quantity'

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
  /** Unit of the product */
  unit?: string
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
  /** Unit price of the product */
  totalPriceNumeric?: number
}

/**
 * List component displays a list of product comparison items
 * @param props - List component props
 * @returns React component for displaying a list of products
 */
export function List({ items, onBrandSelect, quantity, totalPriceNumeric }: ListProps) {
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
        const { name, brand, unit, remark, quantity, unitBestPrice, level } = item

        let averagePrice = unitBestPrice
        if (totalPriceNumeric !== undefined && actualQuantity !== 0) {
          averagePrice = totalPriceNumeric / actualQuantity
        }

        return (
          <div
            className="flex items-center bg-gray-800/90 hover:bg-gray-800 transition-colors rounded-md p-3 cursor-pointer gap-3"
            onClick={() => onBrandSelect?.(item)}
            key={`${brand || 'no-brand'}-${name}-${idx}`}
          >
            <div className="flex flex-col flex-1">
              <div className="text-white text-base font-medium">
                {name} {brand && <span className="text-gray-400 text-sm font-normal">&nbsp;-&nbsp;{brand}</span>}
              </div>

              {remark && <div className="text-gray-400 text-xs">{remark}</div>}

              <div className="flex items-center gap-x-2">
                <PriceDisplay amount={averagePrice} classNName="text-white font-light" size="lg" />
                {quantity && unit && (
                  <span className="text-gray-400 text-sm">
                    (total <Quantity quantity={quantity} unit={unit} />)
                  </span>
                )}
              </div>

              <div className="flex items-center flex-wrap gap-x-1">
                <span className="text-gray-400 text-[10px] bg-gray-600 px-1 rounded-sm font-bold">BEST</span>
                <PriceDisplay amount={unitBestPrice} classNName="text-gray-400 text-sm" size="md" />
                {unit && (
                  <span className="text-gray-400 text-sm">
                    /<Quantity quantity={1} unit={unit} />
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-center">
              <PriceLevelDisplay priceLevel={level} />
            </div>
          </div>
        )
      })}
    </div>
  )
}
