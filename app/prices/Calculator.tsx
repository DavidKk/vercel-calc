'use client'

import { useEffect, useMemo, useState } from 'react'

import type { ProductType } from '@/app/actions/prices/product'
import { useNotification } from '@/components/Notification/useNotification'
import { useFullscreen } from '@/hooks/useFullscreen'
import { useLocalStorageState } from '@/hooks/useLocalStorageState'
import { parseFormattedNumber, parseUnit } from '@/utils/format'
import { calculateAveragePrice } from '@/utils/price/calculateAveragePrice'

import { List } from './components/history'
import { toProductSnapshot } from './components/history/types'
import { InputSection } from './components/InputSection'
import type { ComparisonItem } from './components/result/List'
import { Result } from './components/result/Result'
import { COMMON_FORMULAS } from './constants/formulas'
import { useHistoryActions } from './contexts/history'
import { isFormula } from './types'

export interface CalculatorProps {
  productTypes: ProductType[]
  initialProductType: ProductType | null
}

export function Calculator({ productTypes, initialProductType }: CalculatorProps) {
  const { history, loading, loadHistoryByProduct, addToHistory } = useHistoryActions()
  const notification = useNotification()
  const { isFullscreen, toggleFullscreen, elementRef } = useFullscreen<HTMLDivElement>()

  /** Name of the currently selected product */
  const defualtProductName = initialProductType?.name || productTypes[0]?.name || ''
  const [selectedProductName, setSelectedProductName] = useLocalStorageState('product-name', () => defualtProductName)
  /** Total price input value as string */
  const [totalPrice, setTotalPrice] = useState<string>('')
  /** Total quantity input value as string */
  const [totalQuantity, setTotalQuantity] = useState<string>('')
  /** Array of comparison items for displaying product comparisons */
  const [comparisons, setComparisons] = useState<ComparisonItem[]>([])

  const handleProductChange = (value: any) => {
    setSelectedProductName(String(value))
    loadHistoryByProduct(String(value))
    // Clear the price and quantity input fields when product changes
    setTotalPrice('')
    setTotalQuantity('')
    setComparisons([])
  }

  const productsBySelectedName = useMemo(() => {
    const types = productTypes.filter((p) => p.name === selectedProductName)
    if (types.length === 0) {
      return productTypes.filter((p) => p.name === defualtProductName)
    }

    return types
  }, [productTypes, selectedProductName, defualtProductName])

  const selectedUnitStr = productsBySelectedName[0]?.unit || (initialProductType?.unit ?? '')
  const { unit: selectedUnit } = parseUnit(selectedUnitStr)

  // Check if there are unit conversions available (either custom or from common formulas)
  const hasUnitConversions = useMemo(() => {
    // Check if any product has custom unit conversions
    const hasCustomConversions = productsBySelectedName.some((p) => p.unitConversions && p.unitConversions.length > 0)

    // Check if the selected unit matches any common formulas
    const hasCommonFormulaConversions = COMMON_FORMULAS.some(([sourceUnit]) => sourceUnit === selectedUnit)
    return hasCustomConversions || hasCommonFormulaConversions
  }, [productsBySelectedName, selectedUnitStr])

  useEffect(() => {
    if (selectedProductName && totalPrice && totalQuantity) {
      const comparisons = calculateAveragePrice(totalPrice, totalQuantity, productsBySelectedName, selectedUnit)
      setComparisons(comparisons)
    } else {
      setComparisons([])
    }
  }, [selectedProductName, totalPrice, totalQuantity, selectedUnit])

  const clearAll = () => {
    setTotalPrice('')
    setTotalQuantity('')
    setComparisons([])
  }

  const handleBrandSelect = async (item: ComparisonItem) => {
    const { level: priceLevel, brand, unitCurrentPrice, quantity, unitBestPrice } = item
    const product = toProductSnapshot(productsBySelectedName.find((p) => p.brand === item.brand) ?? productsBySelectedName[0])
    const totalPriceNumeric = isFormula(totalPrice) ? 0 : parseFormattedNumber(totalPrice)

    try {
      await addToHistory({
        productType: selectedProductName,
        totalPrice: totalPriceNumeric,
        totalQuantity: quantity,
        unit: selectedUnitStr,
        unitPrice: unitCurrentPrice,
        priceLevel,
        unitBestPrice,
        brand,
        product,
      })

      notification.success(`Save ${item.brand} to history records`)
    } catch (error) {
      const message = error instanceof Error ? error.message : Object.prototype.toString.call(error)
      notification.error(`Save failed: ${message}`)
    }
  }

  return (
    <div ref={elementRef} className="flex flex-col w-full max-w-4xl bg-black rounded-lg p-2 md:p-4">
      <div className="flex flex-col md:flex-row gap-4 flex-1">
        <div className="flex flex-col md:w-1/2">
          <div className="mb-3 flex-shrink-0">
            <InputSection
              productTypes={productTypes}
              selectedProductType={productsBySelectedName[0]}
              totalPrice={totalPrice}
              totalQuantity={totalQuantity}
              onProductChange={handleProductChange}
              onTotalPriceChange={(value) => setTotalPrice(value)}
              onTotalQuantityChange={(value) => setTotalQuantity(value)}
              onClear={clearAll}
              onToggleFullscreen={() => toggleFullscreen()}
              isFullscreen={isFullscreen}
              supportFormula={hasUnitConversions}
            />
          </div>

          <div className="flex-1 min-h-0">
            <div className="bg-gray-900 rounded-lg p-2 md:p-4 h-full flex justify-center">
              <Result comparisons={comparisons} onBrandSelect={handleBrandSelect} selectedProduct={productsBySelectedName[0] || null} />
            </div>
          </div>
        </div>

        <div className="flex flex-col md:w-1/2">
          <div className="bg-gray-900 rounded-lg p-2 md:p-4 h-full flex flex-col">
            <List history={history.filter((r) => r.productType === (selectedProductName || initialProductType?.name || ''))} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  )
}
