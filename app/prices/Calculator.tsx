'use client'

import { useState, useEffect, useMemo } from 'react'
import type { ProductType } from '@/app/actions/prices/product'
import { useNotification } from '@/components/Notification/useNotification'
import { useLocalStorageState } from '@/hooks/useLocalStorageState'
import { calculatePriceLevel, calculateFormulaQuantity } from '@/utils/price'
import { InputSection } from './components/InputSection'
import { Result } from './components/result/Result'
import { List } from './components/history'
import type { HistoryRecord } from './components/history/types'
import { toProductSnapshot } from './components/history/types'
import type { ComparisonItem } from './components/result/List'
import { useHistoryActions } from './contexts/history'
import { isFormula, type PriceLevel } from './types'

export interface CalculatorProps {
  productTypes: ProductType[]
  initialProductType: ProductType | null
}

export function Calculator({ productTypes, initialProductType }: CalculatorProps) {
  const { history, loading, loadHistoryByProduct, addToHistory, loadingAddToHistory } = useHistoryActions()
  const notification = useNotification()
  /** Name of the currently selected product */
  const [selectedProductName, setSelectedProductName] = useLocalStorageState('product-name', () => {
    return initialProductType?.name || productTypes[0]?.name || ''
  })

  /** Total price input value as string */
  const [totalPrice, setTotalPrice] = useState<string>('')
  /** Total quantity input value as string */
  const [totalQuantity, setTotalQuantity] = useState<string>('')
  /** Numeric value of the total price */
  const [totalPriceNumeric, setTotalPriceNumeric] = useState<number>(0)
  /** Numeric value of the total quantity */
  const [totalQuantityNumeric, setTotalQuantityNumeric] = useState<number>(0)
  /** Calculated average price (total price / total quantity) */
  const [averagePrice, setAveragePrice] = useState<number | null>(null)
  /** Price level based on comparison with other products */
  const [priceLevel, setPriceLevel] = useState<PriceLevel | null>(null)
  /** Array of comparison items for displaying product comparisons */
  const [comparisons, setComparisons] = useState<ComparisonItem[]>([])

  const handleProductChange = (value: any) => {
    setSelectedProductName(String(value))
    loadHistoryByProduct(String(value))
  }

  const productsBySelectedName = useMemo(() => productTypes.filter((p) => p.name === selectedProductName), [productTypes, selectedProductName])
  const selectedUnit = productsBySelectedName[0]?.unit || (initialProductType?.unit ?? '')

  const calculateAveragePrice = () => {
    const isValidPrice = !isNaN(totalPriceNumeric)
    const isValidFormula = !(isNaN(totalQuantityNumeric) || totalQuantityNumeric === 0) || isFormula(totalQuantity)
    if (!(isValidPrice && isValidFormula)) {
      setAveragePrice(null)
      setPriceLevel(null)
      setComparisons([])
      return null
    }

    const avg = totalPriceNumeric / totalQuantityNumeric
    setAveragePrice(parseFloat(avg.toFixed(2)))

    // Calculate comparison items for each product
    const comparisons: ComparisonItem[] = []
    for (const p of productsBySelectedName) {
      // Calculate actual quantity for each item (if formula calculation is needed)
      let itemActualQuantity = totalQuantityNumeric // Use globally calculated quantity by default
      const { unitConversions, unit, unitBestPrice } = p
      if (isFormula(totalQuantity)) {
        if (!(unitConversions?.length && unit)) {
          continue
        }

        const formula = totalQuantity.substring(1).trim()
        const itemCalculatedQuantity = calculateFormulaQuantity(`= ${formula}`, unit, unitConversions, unit)

        if (!isNaN(itemCalculatedQuantity)) {
          itemActualQuantity = itemCalculatedQuantity
        }
      }

      const itemAvgPrice = totalPriceNumeric / itemActualQuantity
      const level = calculatePriceLevel(itemAvgPrice, unitBestPrice)
      comparisons.push({ ...p, level, quantity: itemActualQuantity })
    }

    setComparisons(comparisons)

    const bestLevel = comparisons.reduce<PriceLevel | null>((acc, cur) => {
      if (acc === null) {
        return cur.level
      }

      return cur.level < acc ? cur.level : acc
    }, null)

    setPriceLevel(bestLevel)

    return {
      averagePrice: parseFloat(avg.toFixed(2)),
      priceLevel: bestLevel,
    }
  }

  const saveToHistory = async () => {
    if (averagePrice === null || priceLevel === null) {
      notification.error('Cannot calculate price level without average price')
      return
    }

    const price = parseFloat(totalPrice)
    const qty = parseFloat(totalQuantity)
    const today = new Date()
    const dateString = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0')

    const newRecord: HistoryRecord = {
      id: Date.now(),
      productType: selectedProductName,
      unitPrice: price,
      quantity: qty,
      unit: selectedUnit,
      averagePrice,
      priceLevel,
      timestamp: dateString,
      unitBestPrice: productsBySelectedName[0]?.unitBestPrice ?? 0,
      brand: undefined,
      product: toProductSnapshot(productsBySelectedName[0]),
    }

    try {
      await addToHistory(newRecord)
      notification.success('Save successful')
    } catch (error) {
      const message = error instanceof Error ? error.message : Object.prototype.toString.call(error)
      notification.error(`Save failed: ${message}`)
    }
  }

  useEffect(() => {
    if (selectedProductName && totalPrice && totalQuantity) {
      calculateAveragePrice()
    } else {
      setAveragePrice(null)
      setPriceLevel(null)
      setComparisons([])
    }
  }, [selectedProductName, totalPrice, totalQuantity])

  const handleTotalPriceChange = (value: string, numericValue: number) => {
    setTotalPrice(value)
    setTotalPriceNumeric(numericValue)
  }

  const handleTotalQuantityChange = (value: string, numericValue: number) => {
    setTotalQuantity(value)
    setTotalQuantityNumeric(numericValue)
  }

  const clearAll = () => {
    setTotalPrice('')
    setTotalQuantity('')
    setTotalPriceNumeric(0)
    setTotalQuantityNumeric(0)
    setAveragePrice(null)
    setPriceLevel(null)
    setComparisons([])

    notification.success('Clear successful')
  }

  const handleBrandSelect = async (item: ComparisonItem) => {
    if (averagePrice === null || priceLevel === null) {
      notification.error('Cannot calculate price level without average price')
      return
    }

    const price = parseFloat(totalPrice)
    // Use formula calculated actual quantity (if exists)
    const qty = totalQuantityNumeric !== null ? totalQuantityNumeric : parseFloat(totalQuantity)

    const today = new Date()
    const dateString = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0')

    const newRecord: HistoryRecord = {
      id: Date.now(),
      productType: selectedProductName,
      unitPrice: price,
      quantity: qty,
      unit: selectedUnit,
      averagePrice: averagePrice,
      priceLevel: item.level,
      timestamp: dateString,
      unitBestPrice: item.unitBestPrice,
      brand: item.brand,
      product: toProductSnapshot(productsBySelectedName.find((p) => p.brand === item.brand) ?? productsBySelectedName[0]),
    }

    try {
      await addToHistory(newRecord)
      notification.success(`Save ${item.brand} to history records`)
    } catch (error) {
      const message = error instanceof Error ? error.message : Object.prototype.toString.call(error)
      notification.error(`Save failed: ${message}`)
    }
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
              onTotalPriceChange={handleTotalPriceChange}
              onTotalQuantityChange={handleTotalQuantityChange}
              onClear={clearAll}
              onSave={saveToHistory}
              averagePrice={averagePrice}
              priceLevel={priceLevel}
              disableSave={comparisons.some((item) => item.brand)}
              saving={loading || loadingAddToHistory}
              supportFormula={productsBySelectedName.some((p) => p.unitConversions && p.unitConversions.length > 0)}
            />
          </div>

          <div className="flex-1 min-h-0">
            <div className="bg-gray-900 rounded-lg p-2 md:p-4 h-full flex justify-center">
              <Result
                comparisons={comparisons}
                onBrandSelect={handleBrandSelect}
                selectedProduct={productsBySelectedName[0] || null}
                quantity={totalQuantity}
                totalPriceNumeric={totalPriceNumeric}
              />
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
