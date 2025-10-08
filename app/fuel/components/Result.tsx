import { MapPinIcon } from '@heroicons/react/24/solid'
import { useMemo } from 'react'

import type { FuelType } from '@/app/fuel/types'
import { PriceDisplay } from '@/components/PriceDisplay'
import { useLanguage } from '@/contexts/language'
import { getDiscountLevelColor, getDiscountPercentageDescription, getPriceLevelDescription } from '@/utils/fuel/calculateDiscountInfo'

/**
 * Props for the Result component
 */
export interface ResultProps {
  /** The calculation result data */
  calculationResult: {
    fuel: FuelType
    rechargeAmount: string
    giftAmount: string
    discountPerLiter: number
    finalPricePerLiter: number
    errorMessage: string | null
    showOnlyPrice: boolean
  }
  /** The currently selected province */
  selectedProvince?: string
}

/**
 * Result component displays the fuel discount calculation results
 * @param props - Result component props
 * @returns React component for displaying fuel discount results
 */
export function Result({ calculationResult, selectedProvince }: ResultProps) {
  const { supportChinese, tl } = useLanguage()

  // Get price level description based on discount amount per liter
  const priceLevelDescription = useMemo(() => {
    const description = getPriceLevelDescription(calculationResult.discountPerLiter)
    // If browser supports Chinese, translate the description
    if (supportChinese) {
      return tl(description, 'zh-CN')
    }
    return description
  }, [calculationResult.discountPerLiter, supportChinese, tl])

  // Extract fuel name without the ID prefix
  const getFuelDisplayName = (fuel: FuelType) => {
    if (fuel.name.startsWith(fuel.id)) {
      return fuel.name.substring(fuel.id.length).trim()
    }
    return fuel.name
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4 flex items-center justify-center">
      <div className="text-center">
        {calculationResult.showOnlyPrice ? (
          // When form is incomplete, only display current fuel price
          <div className="flex flex-col gap-2 items-center">
            <div className="flex items-center text-white text-lg">
              #{calculationResult.fuel.id} {getFuelDisplayName(calculationResult.fuel)} {selectedProvince}
              {selectedProvince && <MapPinIcon className="h-4 w-4 inline ml-1 text-red-500" />}
            </div>
            <div className="text-base font-bold text-white">
              <PriceDisplay amount={calculationResult.finalPricePerLiter} currency="¥" size="lg" />
              /L
            </div>
          </div>
        ) : calculationResult.errorMessage ? (
          <div className="text-red-400 text-center">
            <div className="text-lg">{calculationResult.errorMessage}</div>
          </div>
        ) : (
          <>
            {/* First line: Discount amount (how much is reduced per liter) */}
            <div className="text-white text-2xl font-bold mb-2">
              -<PriceDisplay amount={calculationResult.discountPerLiter} currency="¥" size="lg" />
              <span className="text-gray-400 text-sm ml-2">{getDiscountPercentageDescription(calculationResult.fuel.unitPrice, calculationResult.finalPricePerLiter)}</span>
            </div>

            {/* Second line: Price per liter - original price with strikethrough and discounted price */}
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-gray-400 text-sm line-through">
                <PriceDisplay amount={calculationResult.fuel.unitPrice} currency="¥" size="md" />
                /L
              </span>
              <span className="text-gray-400">→</span>
              <span className="text-white text-sm">
                <PriceDisplay amount={calculationResult.finalPricePerLiter} currency="¥" size="md" />
                /L
              </span>
            </div>

            {/* Third line: Discount level description and selected province */}
            <div className="flex items-center justify-center gap-2">
              <div className={`text-sm font-medium ${getDiscountLevelColor(calculationResult.discountPerLiter)}`}>{priceLevelDescription}</div>
              {selectedProvince && (
                <span className="text-sm inline-flex items-center">
                  <MapPinIcon className="h-4 w-4 inline mr-1 text-red-500" />
                  <span className="text-gray-400">{selectedProvince}</span>
                </span>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
