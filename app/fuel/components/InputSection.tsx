import { ArrowsPointingInIcon, ArrowsPointingOutIcon, BackspaceIcon } from '@heroicons/react/24/solid'
import { useMemo } from 'react'

import type { FuelType } from '@/app/fuel/types'
import { Button } from '@/app/prices/components/Button'
import { NumberInput, type Suggestion } from '@/app/prices/components/NumberInput'
import SearchableSelect from '@/components/SearchableSelect'
import { formatNumberWithCommas } from '@/utils/format'

/**
 * Props for the InputSection component
 */
export interface InputSectionProps {
  /** Array of available fuel types */
  fuelTypes: FuelType[]
  /** Array of available provinces */
  provinces: string[]
  /** Currently selected fuel */
  selectedFuel: {
    fuel: FuelType
    rechargeAmount: string
    giftAmount: string
  }
  /** Currently selected province */
  selectedProvince: string
  /** Whether fullscreen is active */
  isFullscreen?: boolean
  /** Whether there is any input value */
  hasValue: boolean
  /** Callback function when province selection changes */
  onProvinceChange: (province: string) => void
  /** Callback function when fuel type changes */
  onFuelTypeChange: (fuelId: string) => void
  /** Callback function when recharge amount changes */
  onRechargeAmountChange: (value: string, numericValue: number) => void
  /** Callback function when gift amount changes */
  onGiftAmountChange: (value: string, numericValue: number) => void
  /** Callback function to clear all inputs */
  onClear: () => void
  /** Callback function to toggle fullscreen */
  onToggleFullscreen?: () => void
}

/**
 * InputSection component provides input fields for province selection, fuel type selection,
 * recharge amount, and gift amount for fuel discount calculation
 * @param props - InputSection component props
 * @returns React component for inputting fuel discount data
 */
export function InputSection({
  fuelTypes,
  provinces,
  selectedFuel,
  selectedProvince,
  isFullscreen,
  hasValue,
  onProvinceChange,
  onFuelTypeChange,
  onRechargeAmountChange,
  onGiftAmountChange,
  onClear,
  onToggleFullscreen,
}: InputSectionProps) {
  // Generate province options with map pin icon
  const provinceOptions = useMemo(() => {
    return provinces.map((province) => ({
      value: province,
      label: `${province}`,
    }))
  }, [provinces])

  // Generate fuel options with # prefix
  const fuelOptions = useMemo(() => {
    return fuelTypes.map((fuel) => ({
      value: fuel.id,
      label: `#${fuel.name}`,
    }))
  }, [fuelTypes])

  // Generate recharge amount suggestions with fixed values when no input, formatted with thousand separators
  const generateRechargeSuggestions = (inputValue: string): Suggestion[] => {
    // When no input, return default suggestions
    if (!inputValue) {
      return [
        { label: formatNumberWithCommas(1000), value: formatNumberWithCommas(1000) },
        { label: formatNumberWithCommas(2000), value: formatNumberWithCommas(2000) },
        { label: formatNumberWithCommas(3000), value: formatNumberWithCommas(3000) },
        { label: formatNumberWithCommas(5000), value: formatNumberWithCommas(5000) },
        { label: formatNumberWithCommas(10000), value: formatNumberWithCommas(10000) },
      ]
    }

    // Remove non-numeric characters, but keep decimal points
    const cleanInput = inputValue.replace(/[^\d.]/g, '')
    if (!cleanInput) return []

    // If four or more digits are entered, do not show suggestions
    const digits = cleanInput.replace(/\D/g, '')
    if (digits.length >= 4) return []

    const num = parseFloat(cleanInput)
    if (isNaN(num)) return []

    // Format suggestion items with thousand separators
    const value1 = num * 1000
    const value2 = num * 10000
    return [
      { label: formatNumberWithCommas(value1), value: formatNumberWithCommas(value1) },
      { label: formatNumberWithCommas(value2), value: formatNumberWithCommas(value2) },
    ]
  }

  // Generate gift amount suggestions with fixed values when no input, formatted with thousand separators
  const generateGiftSuggestions = (inputValue: string): Suggestion[] => {
    // When no input, return default suggestions
    if (!inputValue) {
      return [
        { label: formatNumberWithCommas(100), value: formatNumberWithCommas(100) },
        { label: formatNumberWithCommas(200), value: formatNumberWithCommas(200) },
        { label: formatNumberWithCommas(300), value: formatNumberWithCommas(300) },
        { label: formatNumberWithCommas(500), value: formatNumberWithCommas(500) },
        { label: formatNumberWithCommas(1000), value: formatNumberWithCommas(1000) },
      ]
    }

    // Remove non-numeric characters, but keep decimal points
    const cleanInput = inputValue.replace(/[^\d.]/g, '')
    if (!cleanInput) return []

    // If three or more digits are entered, do not show suggestions
    const digits = cleanInput.replace(/\D/g, '')
    if (digits.length >= 3) return []

    const num = parseFloat(cleanInput)
    if (isNaN(num)) return []

    // Format suggestion items with thousand separators
    const value1 = num * 100
    const value2 = num * 1000
    return [
      { label: formatNumberWithCommas(value1), value: formatNumberWithCommas(value1) },
      { label: formatNumberWithCommas(value2), value: formatNumberWithCommas(value2) },
    ]
  }

  return (
    <div className="bg-gray-900 rounded-lg p-4 h-full">
      <form className="flex flex-col gap-4 h-full">
        {/* Top section: Province selection */}
        <div className="flex gap-2 mt-auto">
          <SearchableSelect value={selectedProvince} options={provinceOptions} onChange={onProvinceChange} clearable={false} size="md" placeholder="Select Province" />
          {hasValue ? (
            <Button className="w-1/4" onClick={onClear} variant="danger" size="lg" icon={<BackspaceIcon className="h-6 w-6" />} title="Clear" type="button" />
          ) : (
            <Button
              className="w-1/4"
              onClick={onToggleFullscreen}
              variant="secondary"
              size="lg"
              icon={isFullscreen ? <ArrowsPointingInIcon className="h-6 w-6" /> : <ArrowsPointingOutIcon className="h-6 w-6" />}
              title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
              type="button"
            />
          )}
        </div>

        {/* Fuel type selection on a separate line */}
        <div className="flex gap-2">
          <SearchableSelect value={selectedFuel.fuel.id} options={fuelOptions} onChange={onFuelTypeChange} clearable={false} size="md" className="flex-1" />
        </div>

        {/* Bottom section: Input fields - Recharge amount */}
        <NumberInput
          name="rechargeAmount"
          inputMode="decimal"
          value={selectedFuel.rechargeAmount}
          unit="¥"
          placeholder="Recharge Amount"
          onChange={onRechargeAmountChange}
          suggestions={generateRechargeSuggestions(selectedFuel.rechargeAmount)}
          enterKeyHint="next"
          tabIndex={1}
          commitOnEnter={true}
        />

        {/* Bottom section: Input fields - Gift amount */}
        <NumberInput
          name="giftAmount"
          inputMode="decimal"
          value={selectedFuel.giftAmount}
          unit="¥"
          placeholder="Gift Amount"
          onChange={onGiftAmountChange}
          suggestions={generateGiftSuggestions(selectedFuel.giftAmount)}
          enterKeyHint="done"
          tabIndex={2}
          commitOnEnter={true}
        />
      </form>
    </div>
  )
}
