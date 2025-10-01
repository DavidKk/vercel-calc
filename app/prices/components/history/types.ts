import { PriceLevel, isPriceLevel, getPriceLevelText } from '@/app/prices/types'
import type { ProductType } from '@/app/actions/prices/product'

export interface HistoryRecord {
  id: number
  productType: string
  unitPrice: number
  quantity: number
  unit: string
  averagePrice: number
  priceLevel: PriceLevel
  timestamp: string
  // 添加推荐价格字段
  recommendedPrice: number
  // 添加品牌字段（可选）
  brand?: string
  // 商品快照（保存当时的商品所有属性）
  product?: ProductSnapshot
}

export { PriceLevel, isPriceLevel, getPriceLevelText }

export interface ProductSnapshot {
  id: string
  name: string
  unit: string
  recommendedPrice: number
  brand?: string
  skuId?: string
}

export function toProductSnapshot(p: ProductType | undefined | null): ProductSnapshot | undefined {
  if (!p) return undefined
  return {
    id: p.id,
    name: p.name,
    unit: p.unit,
    recommendedPrice: p.recommendedPrice,
    brand: p.brand,
  }
}
