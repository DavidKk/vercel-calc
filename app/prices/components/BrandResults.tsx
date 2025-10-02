import type { PriceLevel } from '@/app/prices/types'
import type { ProductType } from '@/app/actions/prices/product'
import { PriceLevelDisplay } from './PriceLevelDisplay'
import { PriceDisplay } from './PriceDisplay'

export interface ComparisonItem {
  name: string
  brand?: string
  unitBestPrice: number
  level: PriceLevel
}

interface BrandResultsProps {
  items: ComparisonItem[]
  onBrandSelect?: (item: ComparisonItem) => void
  formulaQuantity?: number | null
  unit?: string
  unitPrice?: number
  inputQuantity?: number | string
  selectedProduct?: ProductType | null
  averagePrice?: number | null
  priceLevel?: PriceLevel | null
}

export function BrandResults({ items, onBrandSelect, formulaQuantity = null, unit, unitPrice, inputQuantity, selectedProduct, averagePrice, priceLevel }: BrandResultsProps) {
  // 当没有比较项时，显示默认结果
  if (!items || items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 w-full py-4">
        {selectedProduct && (
          <div className="flex flex-col items-center w-full">
            {/* Product name */}
            <div className="text-white text-lg font-medium mb-2">
              {selectedProduct.name}
              {selectedProduct.brand && <span className="text-gray-400 text-base font-normal ml-2">- {selectedProduct.brand}</span>}
            </div>

            {/* Original product unit price (highlighted) */}
            <div className="text-3xl font-light text-white mb-1">
              <PriceDisplay amount={selectedProduct.unitBestPrice} size="lg" />
            </div>

            {/* Input quantity and unit */}
            {unit && (
              <div className="text-gray-400 text-sm mb-2">
                {/* Display formula quantity if exists, otherwise input quantity, finally default to 1 */}
                Quantity: {formulaQuantity !== null ? `${formulaQuantity} ${unit}` : inputQuantity ? `${inputQuantity} ${unit}` : `1 ${unit}`}
              </div>
            )}

            {/* Calculated average price */}
            <div className="text-gray-400 text-sm">
              Avg: <PriceDisplay amount={averagePrice || 0} size="sm" />
            </div>
          </div>
        )}

        {!selectedProduct && (
          <>
            <div className="text-gray-300 text-base">Average Price</div>
            <div className="text-3xl font-light text-white">
              <PriceDisplay amount={averagePrice || 0} size="lg" />
            </div>
          </>
        )}

        {/* Display price level */}
        {priceLevel && <PriceLevelDisplay priceLevel={priceLevel} className="text-lg" />}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2 w-full">
      {items.map((b, idx) => {
        const actualQuantity = formulaQuantity !== null ? formulaQuantity : inputQuantity ? Number(inputQuantity) : 1

        let averagePrice = b.unitBestPrice
        if (unitPrice !== undefined && actualQuantity !== 0) {
          averagePrice = unitPrice / actualQuantity
        }

        return (
          <div
            className="flex items-center bg-gray-800/90 hover:bg-gray-800 transition-colors rounded-md p-3 cursor-pointer gap-3"
            onClick={() => onBrandSelect?.(b)}
            key={`${b.brand || 'no-brand'}-${b.name}-${idx}`}
          >
            <div className="flex flex-col flex-1">
              <div className="text-white text-base font-medium">
                {b.name}
                {b.brand && <span className="text-gray-400 text-sm font-normal">&nbsp;-&nbsp;{b.brand}</span>}
              </div>

              <div className="text-white text-lg font-light">
                <PriceDisplay amount={b.unitBestPrice} size="md" />
              </div>

              <div className="flex items-center flex-wrap gap-x-1">
                <span className="text-gray-400 text-sm">
                  <PriceDisplay amount={averagePrice} size="sm" />
                </span>
                {unit && (
                  <span className="text-gray-400 text-sm">
                    {actualQuantity}
                    {unit}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-center">
              <PriceLevelDisplay priceLevel={b.level} />
            </div>
          </div>
        )
      })}
    </div>
  )
}
