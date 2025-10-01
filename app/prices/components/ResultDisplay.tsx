import type { PriceLevel } from '@/app/prices/types'
import type { ProductType } from '@/app/actions/prices/product'
import { PriceLevelDisplay } from './PriceLevelDisplay'
import { BrandResults } from './BrandResults'

// Co-located type for brand comparison entries
export interface ComparisonItem {
  name: string
  brand?: string
  recommendedPrice: number
  level: PriceLevel
}

export interface ResultDisplayProps {
  averagePrice: number | null
  priceLevel: PriceLevel | null
  comparisons?: ComparisonItem[]
  onBrandSelect?: (item: ComparisonItem) => void
  selectedProduct?: ProductType | null // 添加选中的商品信息
}

export function ResultDisplay({ averagePrice, priceLevel, comparisons = [], onBrandSelect, selectedProduct }: ResultDisplayProps) {
  const brandComparisons = comparisons.filter((item) => item.brand)

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <div className="text-gray-300 text-base">平均单价</div>
      <div className="text-3xl font-light text-white">
        <b className="text-xl">¥</b>
        {averagePrice ? averagePrice.toFixed(2) : '0.00'}
      </div>

      {selectedProduct && (
        <div className="text-gray-400 text-sm">
          推荐价: <b>¥{selectedProduct.recommendedPrice.toFixed(2)}</b>
        </div>
      )}

      {brandComparisons?.length ? <BrandResults items={brandComparisons} onBrandSelect={onBrandSelect} /> : <PriceLevelDisplay priceLevel={priceLevel} className="text-lg" />}
    </div>
  )
}
