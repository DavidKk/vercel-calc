'use client'

import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import type { ProductType } from '@/app/actions/prices/product'
import { Button } from '@/app/prices/components/Button'
import { PriceDisplay } from '@/app/prices/components/PriceDisplay'

export interface ProductItemProps {
  product: ProductType
  isSelected: boolean
  onSelect: () => void
  onDelete: (e: React.MouseEvent) => void
  disabled?: boolean
}

export function ProductItem({ product, isSelected, onSelect, onDelete, disabled = false }: ProductItemProps) {
  const displayName = product.brand ? `${product.name} - ${product.brand}` : product.name

  return (
    <div
      onClick={!disabled ? onSelect : undefined}
      className={`flex flex-col gap-2 px-3 py-3 rounded-md relative transition-all duration-300 ease-in-out group ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-md'
      } ${
        isSelected ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 shadow-lg' : 'bg-gray-800'
      } ${!disabled && !isSelected ? 'hover:bg-gradient-to-r hover:from-indigo-500/20 hover:to-indigo-600/20' : ''}`}
    >
      <div className={`absolute top-2 right-2 flex gap-1 transition-opacity duration-200 ${disabled ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'}`}>
        <Button
          onClick={(e) => {
            e.stopPropagation()
            if (!disabled) {
              onSelect()
            }
          }}
          variant="icon"
          size="sm"
          icon={<PencilIcon className="h-4 w-4" />}
          title="Edit Product"
          disabled={disabled}
        />

        <Button onClick={onDelete} variant="icon" size="sm" icon={<TrashIcon className="h-4 w-4" />} title="Delete Product" disabled={disabled} />
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex font-medium text-white text-sm">{displayName}</div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-x-1">
            <span className="text-white text-lg font-medium">
              <PriceDisplay amount={product.unitBestPrice} size="lg" />
            </span>
            <span className="text-gray-400 text-xs">/{product.unit}</span>
          </div>
        </div>

        <div className="flex justify-between items-center text-gray-400 text-xs">
          <span>Best Price</span>
          <span>ID: {product.id.slice(-8)}</span>
        </div>
      </div>
    </div>
  )
}
