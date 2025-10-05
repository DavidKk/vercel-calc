import type { PriceLevel } from '@/app/prices/types'
import { PriceLevelDisplay } from '@/app/prices/components/PriceLevelDisplay'
import { PriceDisplay } from '@/app/prices/components/PriceDisplay'
import { Quantity } from '@/app/prices/components/Quantity'
import { safeDivide } from '@/utils/calc'

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
  /** Current price of the product per unit */
  unitCurrentPrice: number
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
}

/**
 * List component displays a list of product comparison items
 * @param props - List component props
 * @returns React component for displaying a list of products
 */
export function List({ items, onBrandSelect }: ListProps) {
  return (
    <div className="flex flex-col gap-2 w-full">
      {items.map((item, idx) => {
        const { name, brand, unit, remark, unitCurrentPrice, quantity, unitBestPrice, level } = item

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
                <span className="text-white font-light text-lg">{unitCurrentPrice ? <PriceDisplay amount={unitCurrentPrice} size="lg" /> : <>N/A</>}</span>
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
