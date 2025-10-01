'use client'

import { useState, useEffect, useMemo } from 'react'
import type { ProductType } from '@/app/actions/prices/product'
import { InputSection } from './components/InputSection'
import { ResultDisplay } from './components/ResultDisplay'
import { List } from './components/history'
import type { HistoryRecord } from './components/history/types'
import { toProductSnapshot } from './components/history/types'
import type { ComparisonItem } from './components/ResultDisplay'
import { useHistoryContext, useHistoryActions } from './contexts/history'
import { PriceLevel } from './types'
import { useNotification } from '@/components/Notification/useNotification'

export interface CalculatorProps {
  productTypes: ProductType[]
  initialProductType: ProductType | null
}

export function Calculator({ productTypes, initialProductType }: CalculatorProps) {
  const { history, loading } = useHistoryContext()
  const { loadHistoryByProduct, addToHistory, loadingAddToHistory } = useHistoryActions()
  const notification = useNotification()
  const [selectedProductName, setSelectedProductName] = useState<string>(() => initialProductType?.name || productTypes[0]?.name || '')
  const [unitPrice, setUnitPrice] = useState<string>('')
  const [quantity, setQuantity] = useState<string>('')
  const [unitPriceNumeric, setUnitPriceNumeric] = useState<number>(0)
  const [quantityNumeric, setQuantityNumeric] = useState<number>(0)
  const [averagePrice, setAveragePrice] = useState<number | null>(null)
  const [priceLevel, setPriceLevel] = useState<PriceLevel | null>(null)
  const [comparisons, setComparisons] = useState<ComparisonItem[]>([])

  const handleProductChange = (value: any) => {
    setSelectedProductName(String(value))
  }

  // 当产品类型改变时，加载对应的历史记录
  // 注意：这里我们只在用户主动切换产品类型时加载，而不是在组件初始化时自动加载
  const handleLoadHistoryForProduct = (productTypeName: string) => {
    loadHistoryByProduct(productTypeName)
  }

  const productsBySelectedName = useMemo(() => productTypes.filter((p) => p.name === selectedProductName), [productTypes, selectedProductName])
  const selectedUnit = productsBySelectedName[0]?.unit || (initialProductType?.unit ?? '')

  const calculatePriceLevel = (avgPrice: number, recommendedPrice: number): PriceLevel => {
    const ratio = avgPrice / recommendedPrice

    if (ratio <= 0.5) {
      return PriceLevel.LOW
    } else if (ratio <= 1.0) {
      return PriceLevel.REASONABLE
    } else if (ratio <= 1.5) {
      return PriceLevel.HIGH
    } else {
      return PriceLevel.FAMILY_TREASURE
    }
  }

  const calculateAveragePrice = () => {
    if (isNaN(unitPriceNumeric) || isNaN(quantityNumeric) || quantityNumeric === 0) {
      setAveragePrice(null)
      setPriceLevel(null)
      setComparisons([])
      return null
    }

    const avg = unitPriceNumeric / quantityNumeric
    setAveragePrice(parseFloat(avg.toFixed(2)))

    const comparisons: ComparisonItem[] = Array.from(
      (function* () {
        for (const p of productsBySelectedName) {
          yield {
            name: p.name,
            brand: p.brand,
            recommendedPrice: p.recommendedPrice,
            level: calculatePriceLevel(avg, p.recommendedPrice),
          }
        }
      })()
    )

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

  const saveToHistory = () => {
    if (averagePrice === null || priceLevel === null) {
      notification.error('请先计算平均价格')
      return
    }

    const price = parseFloat(unitPrice)
    const qty = parseFloat(quantity)
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
      recommendedPrice: productsBySelectedName[0]?.recommendedPrice ?? 0,
      brand: undefined,
      product: toProductSnapshot(productsBySelectedName[0]),
    }

    addToHistory(newRecord)
      .then(() => {
        notification.success('已保存到历史记录')
      })
      .catch(() => {
        notification.error('保存失败')
      })
  }

  useEffect(() => {
    if (unitPrice && quantity && selectedProductName) {
      calculateAveragePrice()
    } else {
      setAveragePrice(null)
      setPriceLevel(null)
      setComparisons([])
    }
  }, [unitPriceNumeric, quantityNumeric, selectedProductName])

  const handleUnitPriceChange = (value: string, numericValue: number) => {
    setUnitPrice(value)
    setUnitPriceNumeric(numericValue)
  }

  const handleQuantityChange = (value: string, numericValue: number) => {
    setQuantity(value)
    setQuantityNumeric(numericValue)
  }

  const clearAll = () => {
    setUnitPrice('')
    setQuantity('')
    setUnitPriceNumeric(0)
    setQuantityNumeric(0)
    setAveragePrice(null)
    setPriceLevel(null)
    setComparisons([])
    notification.info('已清空所有输入')
  }

  const handleBrandSelect = async (item: ComparisonItem) => {
    if (averagePrice === null || priceLevel === null) {
      notification.error('请先计算平均价格')
      return
    }

    const price = parseFloat(unitPrice)
    const qty = parseFloat(quantity)

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
      recommendedPrice: item.recommendedPrice,
      brand: item.brand,
      product: toProductSnapshot(productsBySelectedName.find((p) => p.brand === item.brand) ?? productsBySelectedName[0]),
    }

    try {
      await addToHistory(newRecord)
      notification.success(`已保存 ${item.brand} 到历史记录`)
    } catch (error) {
      notification.error('保存失败')
    }
  }

  return (
    <div className="flex flex-col w-full max-w-4xl bg-black rounded-lg p-2 md:p-4">
      <div className="flex flex-col md:flex-row gap-4 flex-1">
        <div className="flex flex-col md:w-1/2">
          <div className="mb-3 flex-shrink-0">
            <InputSection
              productTypes={productTypes}
              selectedProductType={{ id: '', name: selectedProductName, unit: selectedUnit, recommendedPrice: productsBySelectedName[0]?.recommendedPrice ?? 0 }}
              unitPrice={unitPrice}
              quantity={quantity}
              onProductChange={(value) => {
                handleProductChange(value)
                handleLoadHistoryForProduct(String(value))
              }}
              onUnitPriceChange={handleUnitPriceChange}
              onQuantityChange={handleQuantityChange}
              onClear={clearAll}
              onSave={saveToHistory}
              averagePrice={averagePrice}
              priceLevel={priceLevel}
              disableSave={comparisons.some((item) => item.brand)}
              saving={loading || loadingAddToHistory}
            />
          </div>

          <div className="flex-1 min-h-0">
            <div className="bg-gray-900 rounded-lg p-2 md:p-4 h-full flex justify-center">
              <ResultDisplay
                averagePrice={averagePrice}
                priceLevel={priceLevel}
                comparisons={comparisons}
                onBrandSelect={handleBrandSelect}
                selectedProduct={productsBySelectedName[0] || null}
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
