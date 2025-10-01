import { useMemo } from 'react'
import { BackspaceIcon, CheckIcon } from '@heroicons/react/24/solid'
import type { ProductType } from '@/app/actions/prices/product'
import SearchableSelect from '@/components/SearchableSelect'
import type { PriceLevel } from '@/app/prices/types'
import { NumberInput } from './NumberInput'
import { Button } from './Button'

export interface InputSectionProps {
  productTypes: ProductType[]
  selectedProductType: ProductType
  unitPrice: string
  quantity: string
  onProductChange: (value: any) => void
  onUnitPriceChange: (value: string, numericValue: number) => void
  onQuantityChange: (value: string, numericValue: number) => void
  onClear: () => void
  onSave: () => void
  averagePrice: number | null
  priceLevel: PriceLevel | null
  disableSave?: boolean
  saving?: boolean
}

export function InputSection({
  productTypes,
  selectedProductType,
  unitPrice,
  quantity,
  onProductChange,
  onUnitPriceChange,
  onQuantityChange,
  onClear,
  onSave,
  averagePrice,
  priceLevel,
  disableSave,
  saving = false,
}: InputSectionProps) {
  const productOptions = useMemo(() => {
    const nameSet = new Set(productTypes.map((t) => t.name))
    const names = nameSet.values().toArray()
    return names.map((name) => ({ value: name, label: name }))
  }, [productTypes])

  const disabled = disableSave || (averagePrice === null && priceLevel === null)

  return (
    <div className="bg-gray-900 rounded-lg p-4 h-full">
      <div className="flex flex-col gap-4 h-full">
        <SearchableSelect value={selectedProductType.name} options={productOptions} onChange={onProductChange} clearable={false} size="md" />
        <NumberInput value={unitPrice} unit="元" label="总价" onChange={onUnitPriceChange} />
        <NumberInput value={quantity} unit={selectedProductType.unit} label="数量" onChange={onQuantityChange} />

        <div className="flex gap-2 mt-auto">
          <Button onClick={onClear} variant="danger" size="lg" icon={<BackspaceIcon className="h-6 w-6" />} title="Clear" fullWidth />

          <Button
            onClick={onSave}
            disabled={disabled}
            loading={saving}
            variant={disabled ? 'secondary' : 'success'}
            size="lg"
            icon={<CheckIcon className="h-6 w-6" />}
            title="Save"
            fullWidth
          />
        </div>
      </div>
    </div>
  )
}
