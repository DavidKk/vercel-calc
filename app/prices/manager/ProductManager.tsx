'use client'

import { useState } from 'react'
import type { ProductType } from '@/app/actions/prices/product'
import { useProductActions, useProductContext } from '@/app/prices/contexts/product'
import { useNotification } from '@/components/Notification/useNotification'
import { ProductList } from './components/ProductList'
import { ProductForm } from './components/ProductForm'

export function ProductManager() {
  const notification = useNotification()
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null)
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const { products, loading } = useProductContext()
  const { removeProductAction } = useProductActions()

  const handleProductSelect = (product: ProductType) => {
    setSelectedProduct(product)
    setIsEditing(true)
  }

  const handleAddNew = () => {
    setSelectedProduct(null)
    setIsEditing(true)
  }

  const handleProductAfterSaved = () => {
    if (selectedProduct) {
      setIsEditing(false)
      setSelectedProduct(null)
      return
    }

    setSelectedProduct(null)
    setIsEditing(false)
  }

  const handleProductDeleted = async (productId: string) => {
    try {
      await removeProductAction(productId)
      if (selectedProduct?.id === productId) {
        setSelectedProduct(null)
        setIsEditing(false)
      }
    } catch (err) {
      notification.error('Failed to delete product')
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setSelectedProduct(null)
  }

  return (
    <div className="flex flex-col w-full h-full max-w-4xl bg-black rounded-lg p-2 md:p-4 relative">
      <div className="flex flex-col md:flex-row gap-4 flex-1">
        <div className={`flex flex-col md:w-1/2 ${isEditing ? 'hidden md:block' : 'block'}`}>
          <ProductList
            products={products}
            selectedProduct={selectedProduct}
            onProductSelect={handleProductSelect}
            onAddNew={handleAddNew}
            onProductDeleted={handleProductDeleted}
            loading={loading}
          />
        </div>

        <div className="flex flex-col md:w-1/2">
          <ProductForm product={selectedProduct} afterSaved={handleProductAfterSaved} onCancel={handleCancel} showEmptyState={!isEditing} />
        </div>
      </div>
    </div>
  )
}
