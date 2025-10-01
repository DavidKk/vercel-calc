'use client'

import { useState, useEffect } from 'react'
import { CheckIcon, XMarkIcon, ArrowPathIcon } from '@heroicons/react/24/solid'
import type { ProductType } from '@/app/actions/prices/product'
import { Button } from '@/app/prices/components/Button'
import { useNotification } from '@/components/Notification/useNotification'
import { Spinner } from '@/components/Spinner'
import { useProductActions } from '@/app/prices/contexts/product'
import { Input } from './Input'

export interface ProductFormProps {
  product?: ProductType | null
  afterSaved?: (product: ProductType) => void
  onCancel: () => void
  showEmptyState?: boolean
}

export function ProductForm({ product, afterSaved, onCancel, showEmptyState = true }: ProductFormProps) {
  const notification = useNotification()
  const [name, setName] = useState('')
  const [brand, setBrand] = useState('')
  const [unit, setUnit] = useState('')
  const [recommendedPrice, setRecommendedPrice] = useState('')
  const { loadingAddProduct, loadingUpdateProduct, loadingRemoveProduct, addProductAction, updateProductAction, removeProductAction } = useProductActions()

  const isEditing = !!product
  const isFormSubmitting = loadingAddProduct || loadingUpdateProduct || loadingRemoveProduct

  useEffect(() => {
    if (product) {
      setName(product.name)
      setBrand(product.brand || '')
      setUnit(product.unit)
      setRecommendedPrice(product.recommendedPrice.toString())
    } else {
      setName('')
      setBrand('')
      setUnit('')
      setRecommendedPrice('')
    }
  }, [product])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim() || !unit.trim() || !recommendedPrice.trim()) {
      notification.error('Please fill in all required fields')
      return
    }

    const price = parseFloat(recommendedPrice)
    if (isNaN(price) || price <= 0) {
      notification.error('Please enter a valid recommended price')
      return
    }

    try {
      let savedProduct: ProductType

      if (isEditing && product) {
        const updated = await updateProductAction(product.id, {
          name: name.trim(),
          brand: brand.trim() || undefined,
          unit: unit.trim(),
          recommendedPrice: price,
        })

        if (!updated) {
          throw new Error('Failed to update product')
        }

        savedProduct = updated
        notification.success('Product updated successfully')
      } else {
        const newProduct = await addProductAction({
          name: name.trim(),
          brand: brand.trim() || undefined,
          unit: unit.trim(),
          recommendedPrice: price,
        })

        if (!newProduct) {
          throw new Error('Failed to create product')
        }

        savedProduct = newProduct
        notification.success('Product created successfully')
      }

      if (afterSaved) {
        afterSaved(savedProduct)
      }
    } catch (error) {
      notification.error(`Failed to save product, please try again`)
    } finally {
      if (!isEditing) {
        setName('')
        setBrand('')
        setUnit('')
        setRecommendedPrice('')
      }
    }
  }

  const handleDelete = async () => {
    if (!product) return

    if (confirm(`Are you sure you want to delete the product "${product.name}${product.brand ? ` - ${product.brand}` : ''}"?`)) {
      try {
        await removeProductAction(product.id)

        setName('')
        setBrand('')
        setUnit('')
        setRecommendedPrice('')
        onCancel()

        notification.success('Product deleted successfully')
      } catch (error) {
        notification.error(`Failed to delete product: ${error}`)
      }
    }
  }

  // 重置表单到初始状态
  const handleReset = () => {
    if (product) {
      // 如果是编辑模式，重置为产品原始数据
      setName(product.name)
      setBrand(product.brand || '')
      setUnit(product.unit)
      setRecommendedPrice(product.recommendedPrice.toString())
    } else {
      // 如果是新增模式，清空所有字段
      setName('')
      setBrand('')
      setUnit('')
      setRecommendedPrice('')
    }
  }

  if (showEmptyState && !isEditing && !product) {
    return (
      <div className="flex flex-col h-full p-2 md:p-4 bg-gray-900 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white text-lg font-medium">Product Manager</h2>
          <button onClick={onCancel} className="h-6 w-6 text-gray-400 hover:text-white transition-colors duration-200" title="Cancel">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="flex items-center justify-center h-full">
          <div className="text-center text-gray-400">
            <p className="text-lg mb-2">Select a product to edit</p>
            <p className="text-sm">or click "Add Product" button to create new product</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full p-3 bg-gray-900 rounded-lg relative">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white text-lg font-medium">{isEditing ? 'Edit Product' : 'Add New Product'}</h2>
        <button onClick={onCancel} className="h-6 w-6 text-gray-400 hover:text-white transition-colors duration-200" title="Cancel">
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col h-full">
        <div className="flex flex-col gap-y-3">
          <Input label="Product Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Cola, Vegetables, Meat" required />
          <Input label="Brand" value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="e.g. Coca-Cola, Pepsi (optional)" />
          <Input label="Unit" value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="e.g. per KG, per bottle, per pack" required />
          <Input label="Recommended Price" prefix="¥" value={recommendedPrice} onChange={(e) => setRecommendedPrice(e.target.value)} placeholder="0.00" required />
        </div>

        <div className="flex flex-col gap-2 pt-4 mt-auto">
          {isEditing && (
            <Button
              type="button"
              onClick={handleDelete}
              disabled={isFormSubmitting}
              variant="danger"
              size="lg"
              icon={<XMarkIcon className="h-5 w-5" />}
              iconPosition="left"
              fullWidth
            >
              Delete
            </Button>
          )}

          <Button
            type="submit"
            disabled={isFormSubmitting}
            variant={isFormSubmitting ? 'secondary' : 'primary'}
            size="lg"
            icon={<CheckIcon className="h-5 w-5" />}
            iconPosition="left"
            fullWidth
          >
            {isEditing ? 'Update' : 'Add'}
          </Button>

          <Button type="button" onClick={handleReset} variant="secondary" size="lg" icon={<ArrowPathIcon className="h-5 w-5" />} iconPosition="left" fullWidth>
            Reset
          </Button>
        </div>
      </form>

      {isFormSubmitting && (
        <div className="absolute inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center rounded-lg">
          <Spinner color="text-white" />
        </div>
      )}
    </div>
  )
}
