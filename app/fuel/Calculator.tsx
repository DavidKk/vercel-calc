'use client'

import { useEffect, useMemo, useState } from 'react'

import type { FuelPrice } from '@/app/actions/fuel/price'
import { useFullscreen } from '@/hooks/useFullscreen'
import { useLocalStorageState } from '@/hooks/useLocalStorageState'

import { InputSection } from './components/InputSection'
import { Result } from './components/Result'
import type { FuelType, ProvincePrice, SelectedFuel } from './types'

export interface CalculatorProps {
  fuelTypes: FuelType[]
  fuelPrices: FuelPrice[]
  defaultProvince: string
}

export function Calculator({ fuelTypes, fuelPrices, defaultProvince }: CalculatorProps) {
  const { isFullscreen, toggleFullscreen, elementRef } = useFullscreen<HTMLDivElement>()

  // Use localStorage to remember selected province and fuel type
  const [selectedProvince = defaultProvince, setSelectedProvince] = useLocalStorageState<string>('fuel-selected-province', () => defaultProvince)
  const [selectedFuelId, setSelectedFuelId] = useLocalStorageState<string>('fuel-selected-fuel-id', () => fuelTypes[0]?.id || '')

  const [selectedFuel, setSelectedFuel] = useState<SelectedFuel>({
    fuel: fuelTypes.find((f) => f.id === selectedFuelId) || fuelTypes[0] || { id: '92', name: '92 Gasoline', unit: 'L', unitPrice: 7.0 },
    rechargeAmount: '',
    giftAmount: '',
  })

  // Extract province list and price data from fuelPrices
  const { provinces, provincePrices } = useMemo(() => {
    if (fuelPrices && fuelPrices.length > 0) {
      const provinceList = fuelPrices.map((item) => item.province)
      const provincePriceList: ProvincePrice[] = fuelPrices.map((item) => ({
        province: item.province,
        b92: item['92'].toString(),
        b95: item['95'].toString(),
        b98: item['98'].toString(),
        b0: item.diesel.toString(),
      }))

      return {
        provinces: provinceList,
        provincePrices: provincePriceList,
      }
    }

    // If no fuel prices data, provide default province list with the default province
    return {
      provinces: [defaultProvince],
      provincePrices: [],
    }
  }, [fuelPrices, defaultProvince])

  // Update selected fuel when fuel type changes
  useEffect(() => {
    const fuel = fuelTypes.find((f) => f.id === selectedFuelId) || fuelTypes[0] || { id: '92', name: '92 Gasoline', unit: 'L', unitPrice: 7.0 }
    setSelectedFuel((prev) => ({
      ...prev,
      fuel,
    }))
  }, [selectedFuelId, fuelTypes])

  // Check if there is input value - simple boolean, no need for useMemo
  const hasValue = selectedFuel.rechargeAmount.trim() !== '' || selectedFuel.giftAmount.trim() !== ''

  const updateProvince = (province: string) => {
    setSelectedProvince(province)
  }

  const updateFuelType = (fuelId: string) => {
    setSelectedFuelId(fuelId)

    const fuel = fuelTypes.find((f) => f.id === fuelId) || fuelTypes[0]

    // If province price data is available, update corresponding fuel price
    if (provincePrices.length > 0) {
      const priceData = provincePrices.find((p) => p.province === selectedProvince)
      if (priceData) {
        const updatedFuel = { ...fuel }
        switch (fuelId) {
          case '92':
            updatedFuel.unitPrice = parseFloat(priceData.b92) || 0
            break
          case '95':
            updatedFuel.unitPrice = parseFloat(priceData.b95) || 0
            break
          case '98':
            updatedFuel.unitPrice = parseFloat(priceData.b98) || 0
            break
          case 'diesel':
            updatedFuel.unitPrice = parseFloat(priceData.b0) || 0
            break
        }
        setSelectedFuel({ ...selectedFuel, fuel: updatedFuel })
        return
      }
    }

    setSelectedFuel({ ...selectedFuel, fuel })
  }

  const updateRechargeAmount = (value: string, numericValue: number) => {
    setSelectedFuel({ ...selectedFuel, rechargeAmount: value })
  }

  const updateGiftAmount = (value: string, numericValue: number) => {
    setSelectedFuel({ ...selectedFuel, giftAmount: value })
  }

  const clearAll = () => {
    setSelectedFuel({
      ...selectedFuel,
      rechargeAmount: '',
      giftAmount: '',
    })
  }

  // Wrap toggleFullscreen function to adapt to button click events
  const handleToggleFullscreen = () => {
    toggleFullscreen()
  }

  // Calculate updated fuel price based on selected province and fuel type
  const currentSelectedFuel = useMemo(() => {
    if (provincePrices.length > 0) {
      const priceData = provincePrices.find((p) => p.province === selectedProvince)
      if (priceData) {
        // Update selected fuel type price
        const updatedFuel = { ...selectedFuel.fuel }
        switch (selectedFuel.fuel.id) {
          case '92':
            updatedFuel.unitPrice = parseFloat(priceData.b92) || 0
            break
          case '95':
            updatedFuel.unitPrice = parseFloat(priceData.b95) || 0
            break
          case '98':
            updatedFuel.unitPrice = parseFloat(priceData.b98) || 0
            break
          case 'diesel':
            updatedFuel.unitPrice = parseFloat(priceData.b0) || 0
            break
        }

        // If price has changed, return updated fuel object
        if (updatedFuel.unitPrice !== selectedFuel.fuel.unitPrice) {
          return {
            ...selectedFuel,
            fuel: updatedFuel,
          }
        }
      }
    }

    // If no change, return original selectedFuel
    return selectedFuel
  }, [selectedFuel, selectedProvince, provincePrices])

  const calculationResult = useMemo(() => {
    const { fuel, rechargeAmount, giftAmount } = currentSelectedFuel
    const recharge = parseFloat(rechargeAmount) || 0
    const gift = parseFloat(giftAmount) || 0

    // If form is incomplete (recharge amount is 0), only display current fuel price
    if (recharge <= 0 && gift <= 0) {
      return {
        fuel,
        rechargeAmount,
        giftAmount,
        discountPerLiter: 0,
        finalPricePerLiter: fuel.unitPrice,
        errorMessage: null,
        showOnlyPrice: true,
      }
    }

    if (recharge <= 0) {
      return {
        fuel,
        rechargeAmount,
        giftAmount,
        discountPerLiter: 0,
        finalPricePerLiter: fuel.unitPrice,
        errorMessage: 'Recharge amount must be greater than 0',
        showOnlyPrice: false,
      }
    }

    // Simplified calculation of discount per liter
    const totalAmount = recharge + gift
    const discountPerLiter = totalAmount > 0 ? (gift * fuel.unitPrice) / totalAmount : 0
    const finalPricePerLiter = fuel.unitPrice - discountPerLiter

    return {
      fuel,
      rechargeAmount,
      giftAmount,
      discountPerLiter,
      finalPricePerLiter,
      errorMessage: null,
      showOnlyPrice: false,
    }
  }, [currentSelectedFuel])

  return (
    <div ref={elementRef} className="flex flex-col w-full max-w-4xl bg-black rounded-lg p-2 md:p-4">
      <div className="flex flex-col md:flex-row gap-x-4 flex-1">
        {/* Left: Input Section */}
        <div className="flex flex-col md:w-1/2">
          <div className="mb-3 flex-shrink-0">
            <InputSection
              fuelTypes={fuelTypes}
              provinces={provinces}
              selectedFuel={selectedFuel}
              selectedProvince={selectedProvince}
              isFullscreen={isFullscreen}
              hasValue={hasValue}
              onProvinceChange={updateProvince}
              onFuelTypeChange={updateFuelType}
              onRechargeAmountChange={updateRechargeAmount}
              onGiftAmountChange={updateGiftAmount}
              onClear={clearAll}
              onToggleFullscreen={handleToggleFullscreen}
            />
          </div>
        </div>

        {/* Right: Result Display Area */}
        <div className="flex flex-col md:w-1/2">
          <div className="bg-gray-900 rounded-lg p-4">
            <Result calculationResult={calculationResult} selectedProvince={selectedProvince} />
          </div>
        </div>
      </div>
    </div>
  )
}
