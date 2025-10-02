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
  unitBestPrice: number
  brand?: string
  product?: ProductSnapshot
}

export { PriceLevel, isPriceLevel, getPriceLevelText }

export interface ProductSnapshot {
  id: string
  name: string
  unit: string
  unitBestPrice: number
  brand?: string
  skuId?: string
}

export function toProductSnapshot(p: ProductType | undefined | null): ProductSnapshot | undefined {
  if (!p) return undefined
  return {
    id: p.id,
    name: p.name,
    unit: p.unit,
    unitBestPrice: p.unitBestPrice,
    brand: p.brand,
  }
}
