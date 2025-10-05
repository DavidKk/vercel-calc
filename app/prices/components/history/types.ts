import { PriceLevel, isPriceLevel, getPriceLevelText } from '@/app/prices/types'
import type { ProductType } from '@/app/actions/prices/product'

export interface HistoryRecord {
  /** Unique identifier for the history record */
  id: number
  /** Name of the product type */
  productType: string
  /** Total price of the product */
  totalPrice: number
  /** Total quantity of the product */
  totalQuantity: number
  /** Unit of measurement for the product */
  unit: string
  /** Calculated average price */
  averagePrice: number
  /** Price level classification */
  priceLevel: PriceLevel
  /** Timestamp when the record was created */
  timestamp: string
  /** Best unit price for comparison */
  unitBestPrice: number
  /** Optional brand information */
  brand?: string
  /** Snapshot of the product information */
  product?: ProductSnapshot
  /** Optional remark for the history record */
  remark?: string
}

export { PriceLevel, isPriceLevel, getPriceLevelText }

export interface ProductSnapshot {
  /** Unique identifier of the product */
  id: string
  /** Name of the product */
  name: string
  /** Unit of measurement for the product */
  unit: string
  /** Best unit price for comparison */
  unitBestPrice: number
  /** Optional brand information */
  brand?: string
  /** Optional SKU identifier */
  skuId?: string
  /** Optional remark for the product */
  remark?: string
}

export function toProductSnapshot(p: ProductType | undefined | null): ProductSnapshot | undefined {
  if (!p) return undefined
  return {
    id: p.id,
    name: p.name,
    unit: p.unit,
    unitBestPrice: p.unitBestPrice,
    brand: p.brand,
    remark: p.remark,
  }
}
