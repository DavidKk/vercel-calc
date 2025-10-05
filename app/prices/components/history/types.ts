import type { ProductType } from '@/app/actions/prices/product'
import { getPriceLevelText, isPriceLevel, PriceLevel } from '@/app/prices/types'

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
  unitPrice: number
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

export { getPriceLevelText, isPriceLevel, PriceLevel }

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

/**
 * Check if two history records are identical
 * @param a First history record
 * @param b Second history record
 * @param options Options for comparison
 * @returns True if records are identical, false otherwise
 */
export function isSameRecord(a: HistoryRecord, b: HistoryRecord, options?: { compareUnitPrice?: boolean }): boolean {
  const compareUnitPrice = options?.compareUnitPrice ?? true

  const productEqual = (() => {
    if (!a.product && !b.product) return true
    if (!a.product || !b.product) return false
    return (
      a.product.id === b.product.id &&
      a.product.name === b.product.name &&
      a.product.unit === b.product.unit &&
      a.product.unitBestPrice === b.product.unitBestPrice &&
      a.product.brand === b.product.brand &&
      a.product.skuId === b.product.skuId
    )
  })()

  return (
    a.productType === b.productType &&
    a.totalPrice === b.totalPrice &&
    a.totalQuantity === b.totalQuantity &&
    a.unit === b.unit &&
    a.priceLevel === b.priceLevel &&
    a.timestamp === b.timestamp &&
    a.unitBestPrice === b.unitBestPrice &&
    a.brand === b.brand &&
    productEqual &&
    (compareUnitPrice ? a.unitPrice === b.unitPrice : true)
  )
}
