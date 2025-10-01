import type { ComparisonItem } from './ResultDisplay'
import { PriceLevelDisplay } from './PriceLevelDisplay'

export interface BrandResultsProps {
  items: ComparisonItem[]
  onBrandSelect?: (item: ComparisonItem) => void
}

export function BrandResults({ items, onBrandSelect }: BrandResultsProps) {
  if (!items || items.length === 0) {
    return null
  }

  return (
    <div className="flex items-center justify-center gap-2">
      {items.map((b, idx) => (
        <div
          className="flex items-center gap-2 justify-between bg-gray-800/90 hover:bg-gray-800 transition-colors rounded-md px-3 py-2 cursor-pointer"
          onClick={() => onBrandSelect?.(b)}
          key={`${b.brand || 'item'}-${idx}`}
        >
          <div className="flex flex-col">
            <span className="text-white text-sm">{b.brand}</span>
            <span className="inline-flex gap-x-1 text-gray-400 text-xs">
              <b>¥</b>
              {b.recommendedPrice.toFixed(2)}
            </span>
          </div>
          <PriceLevelDisplay priceLevel={b.level} />
        </div>
      ))}
    </div>
  )
}
