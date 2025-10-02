'use client'

import { useState } from 'react'
import { PlusIcon } from '@heroicons/react/24/outline'
import type { ProductType } from '@/app/actions/prices/product'
import { ProductItem } from './ProductItem'
import { Button } from '@/app/prices/components/Button'
import { Spinner } from '@/components/Spinner'
import { ProductFilter } from './ProductFilter'

export interface ProductListProps {
  products: ProductType[]
  selectedProduct: ProductType | null
  onProductSelect: (product: ProductType) => void
  onAddNew: () => void
  onProductDeleted: (productId: string) => void
  loading?: boolean
  onFilterChange: (filterText: string) => void
}

export function ProductList({ products, selectedProduct, onProductSelect, onAddNew, onProductDeleted, loading = false, onFilterChange }: ProductListProps) {
  const [filterText, setFilterText] = useState<string>('')

  const handleFilterChange = (filterText: string) => {
    setFilterText(filterText)
    onFilterChange(filterText)
  }

  const handleDelete = (product: ProductType, e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm(`Are you sure you want to delete the product "${product.name}${product.brand ? ` - ${product.brand}` : ''}"?`)) {
      onProductDeleted(product.id)
    }
  }

  return (
    <div className="flex flex-col bg-gray-900 rounded-lg relative">
      <div className="flex items-center justify-between p-3">
        <h2 className="text-white text-lg font-medium">Products</h2>
        <span className="text-gray-400 text-sm">{products.length} items</span>
      </div>

      {/* Filter bar placed above the product list */}
      <div className="px-3">
        <ProductFilter onFilterChange={handleFilterChange} />
      </div>

      <div className="flex flex-col gap-y-3 px-3 h-[calc(100vh-350px)] overflow-y-auto custom-scrollbar relative">
        {products.length > 0 ? (
          <>
            {products.map((product) => (
              <ProductItem
                key={product.id}
                product={product}
                isSelected={selectedProduct?.id === product.id}
                onSelect={() => !loading && onProductSelect(product)}
                onDelete={(e) => !loading && handleDelete(product, e)}
                disabled={loading}
              />
            ))}
          </>
        ) : (
          <div className="text-gray-400 text-center py-8">
            <p className="mb-2">No products</p>
            <p className="text-sm">Click the button below to add your first product</p>
          </div>
        )}
      </div>

      <div className="flex p-3 border-gray-700">
        <Button onClick={onAddNew} variant="primary" size="lg" icon={<PlusIcon className="h-5 w-5" />} iconPosition="left" fullWidth disabled={loading}>
          Add Product
        </Button>
      </div>

      {loading && (
        <div className="absolute inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center rounded-lg">
          <Spinner color="text-white" />
        </div>
      )}
    </div>
  )
}
