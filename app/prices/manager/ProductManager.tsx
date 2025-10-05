'use client'

import { useEffect, useState } from 'react'

import type { ProductType } from '@/app/actions/prices/product'
import { useProductActions, useProductContext } from '@/app/prices/contexts/product'
import { useNotification } from '@/components/Notification/useNotification'

import { ProductForm } from './components/ProductForm'
import { ProductList } from './components/ProductList'

export function ProductManager() {
  const notification = useNotification()
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null)
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const { products, loading } = useProductContext()
  const { removeProductAction } = useProductActions()
  const [filteredProducts, setFilteredProducts] = useState<ProductType[]>(products)
  const [nameFilter, setNameFilter] = useState<string>('')

  // Update filtered products when all products or filter change
  useEffect(() => {
    if (!nameFilter) {
      setFilteredProducts(products)
    } else {
      const filtered = products.filter((product) => {
        // Search in both name and brand fields
        const nameMatch = product.name.toLowerCase().includes(nameFilter.toLowerCase())
        const brandMatch = product.brand ? product.brand.toLowerCase().includes(nameFilter.toLowerCase()) : false
        return nameMatch || brandMatch
      })
      setFilteredProducts(filtered)
    }
  }, [products, nameFilter])

  const handleProductSelect = (product: ProductType) => {
    setSelectedProduct(product)
    setIsEditing(true)
  }

  const handleAddNew = () => {
    setSelectedProduct(null)
    setIsEditing(true)
  }

  const handleProductAfterSaved = (product: ProductType) => {
    setSelectedProduct(product)
    setIsEditing(true)
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

  const handleFilterChange = (filterText: string) => {
    setNameFilter(filterText)
  }

  return (
    <div className="flex flex-col w-full h-full max-w-4xl bg-black rounded-lg relative">
      <div className="flex flex-col md:flex-row gap-4 flex-1">
        <div className={`flex flex-col md:w-1/2 ${isEditing ? 'hidden md:block' : 'block'}`}>
          <ProductList
            products={filteredProducts}
            selectedProduct={selectedProduct}
            onProductSelect={handleProductSelect}
            onAddNew={handleAddNew}
            onProductDeleted={handleProductDeleted}
            loading={loading}
            onFilterChange={handleFilterChange}
          />
        </div>

        <div className="flex flex-col md:w-1/2">
          <ProductForm product={selectedProduct} afterSaved={handleProductAfterSaved} onCancel={handleCancel} showEmptyState={!isEditing} />
        </div>
      </div>
    </div>
  )
}
