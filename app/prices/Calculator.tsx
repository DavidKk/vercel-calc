'use client'

import { useState, useEffect, useMemo } from 'react'
import type { ProductType } from '@/app/actions/prices/product'
import { useNotification } from '@/components/Notification/useNotification'
import { useLocalStorageState } from '@/hooks/useLocalStorageState'
import { calculatePriceLevel, calculateFormulaQuantity } from '@/utils/price'
import { parseFormattedNumber, parseUnit } from '@/utils/format'
import { InputSection } from './components/InputSection'
import { Result } from './components/result/Result'
import { List } from './components/history'
import type { HistoryRecord } from './components/history/types'
import { toProductSnapshot } from './components/history/types'
import type { ComparisonItem } from './components/result/List'
import { useHistoryActions } from './contexts/history'
import { COMMON_FORMULAS } from './constants/formulas'
import { isFormula, type PriceLevel } from './types'

export interface CalculatorProps {
  productTypes: ProductType[]
  initialProductType: ProductType | null
}

export function Calculator({ productTypes, initialProductType }: CalculatorProps) {
  const { history, loading, loadHistoryByProduct, addToHistory, loadingAddToHistory } = useHistoryActions()
  const notification = useNotification()
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
  }

  const productsBySelectedName = useMemo(() => {
    const types = productTypes.filter((p) => p.name === selectedProductName)
    if (types.length === 0) {
      return productTypes.filter((p) => p.name === defualtProductName)
    }

    return types
  }, [productTypes, selectedProductName, defualtProductName])

  const selectedUnit = productsBySelectedName[0]?.unit || (initialProductType?.unit ?? '')

  useEffect(() => {
    if (selectedProductName && totalPrice && totalQuantity) {
      const comparisons = calculateAveragePrice(totalPrice, totalQuantity, productsBySelectedName)
      setComparisons(comparisons)
    } else {
      setComparisons([])
    }
  }, [selectedProductName, totalPrice, totalQuantity])

  const clearAll = () => {
    setTotalPrice('')
    setTotalQuantity('')
    setComparisons([])

    notification.success('Clear successful')
  }

  const handleBrandSelect = async (item: ComparisonItem) => {
    // const price = parseFloat(totalPrice)
    // // Use formula calculated actual quantity (if exists)
    // const qty = totalQuantityNumeric !== null ? totalQuantityNumeric : parseFloat(totalQuantity)

    // const today = new Date()
    // const dateString = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0')

    // const newRecord: HistoryRecord = {
    //   id: Date.now(),
    //   productType: selectedProductName,
    //   unitPrice: price,
    //   quantity: qty,
    //   unit: selectedUnit,
    //   averagePrice: averagePrice,
    //   priceLevel: item.level,
    //   timestamp: dateString,
    //   unitBestPrice: item.unitBestPrice,
    //   brand: item.brand,
    //   product: toProductSnapshot(productsBySelectedName.find((p) => p.brand === item.brand) ?? productsBySelectedName[0]),
    // }

    // try {
    //   await addToHistory(newRecord)
    //   notification.success(`Save ${item.brand} to history records`)
    // } catch (error) {
    //   const message = error instanceof Error ? error.message : Object.prototype.toString.call(error)
    //   notification.error(`Save failed: ${message}`)
    // }
  }

  return (
    <div className="flex flex-col w-full max-w-4xl bg-black rounded-lg p-2 md:p-4">
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
              // averagePrice={averagePrice}
              // priceLevel={priceLevel}
              // disableSave={comparisons.some((item) => item.brand)}
              // saving={loading || loadingAddToHistory}
              supportFormula={productsBySelectedName.some((p) => p.unitConversions && p.unitConversions.length > 0)}
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

/**
 * Calculate average price and comparisons for products
 *
 * @param totalPriceNumeric - Total price as a number
 * @param totalQuantity - Total quantity as a string (to check if it's a formula)
 * @param products - Array of products for the selected product name
 * @returns Object containing average price, price level, and comparison items
 */
export function calculateAveragePrice(totalPrice: string, totalQuantity: string, products: ProductType[]) {
  const totalPriceNumeric = isFormula(totalPrice) ? 0 : parseFormattedNumber(totalPrice)
  const totalQuantityNumeric = isFormula(totalQuantity) ? 0 : parseFormattedNumber(totalQuantity)
  const isValidPrice = !isNaN(totalPriceNumeric)
  const isValidFormula = !(isNaN(totalQuantityNumeric) || totalQuantityNumeric === 0) || isFormula(totalQuantity)
  if (!(isValidPrice && isValidFormula)) {
    return []
  }

  const formulaContent = totalQuantity.substring(1).trim()
  const parsedTotalQuantityFormula = parseUnit(formulaContent)
  const { unit: totalQuantityFormulaUnit } = parsedTotalQuantityFormula

  const formulas = new Set<string>()
  const hitUnits = new Set<string>()
  COMMON_FORMULAS.forEach(([_, formula]) => {
    const formulaContent = formula.substring(1).trim()
    const parsedFormula = parseUnit(formulaContent)
    const { unit: formulaUnit } = parsedFormula
    if (formulaUnit !== totalQuantityFormulaUnit) {
      return
    }

    formulas.add(formulaContent)
    hitUnits.add(formulaUnit)
  })

  // Calculate comparison items for each product
  const comparisons: ComparisonItem[] = []
  for (const p of products) {
    // Calculate actual quantity for each item (if formula calculation is needed)
    let itemActualQuantity = totalQuantityNumeric // Use globally calculated quantity by default

    const { unitConversions, unit, unitBestPrice } = p
    if (isFormula(totalQuantity)) {
      if (!(unitConversions?.length && unit)) {
        continue
      }

      const filteredUnitConversions = unitConversions.filter((u) => {
        const parsedFormula = parseUnit(u)
        return !hitUnits.has(parsedFormula.unit)
      })

      const mergedUnitConversions = [...filteredUnitConversions, ...formulas]
      const formula = totalQuantity.substring(1).trim()
      const itemCalculatedQuantity = calculateFormulaQuantity(`= ${formula}`, unit, mergedUnitConversions, unit)

      if (!isNaN(itemCalculatedQuantity)) {
        itemActualQuantity = itemCalculatedQuantity
      }
    }

    const itemAvgPrice = totalPriceNumeric / itemActualQuantity
    const level = calculatePriceLevel(itemAvgPrice, unitBestPrice)
    comparisons.push({ ...p, level, quantity: itemActualQuantity })
  }

  return comparisons
}
