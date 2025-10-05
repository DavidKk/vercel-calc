'use client'

import type { ProductType } from '@/app/actions/prices/product'
import { createProduct, deleteProduct, getAllProducts, updateProduct } from '@/app/actions/prices/product'
import { useAction } from '@/hooks/useAction'

import { useProductContext } from './ProductContext'

export function useProductActions() {
  const { products, loading, dispatch } = useProductContext()

  const [loadProducts, loadingLoadProducts, errorLoadProducts] = useAction(async () => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const loadedProducts = await getAllProducts()
      dispatch({ type: 'SET_PRODUCTS', payload: loadedProducts })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error as Error })
      throw error
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [])

  const [addProductAction, loadingAddProduct, errorAddProduct] = useAction(async (product: Omit<ProductType, 'id'>) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const newProduct = await createProduct(product)
      dispatch({ type: 'ADD_PRODUCT', payload: newProduct })
      return newProduct
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error as Error })
      throw error
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [])

  const [updateProductAction, loadingUpdateProduct, errorUpdateProduct] = useAction(async (id: string, updates: Partial<ProductType>) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const updatedProduct = await updateProduct(id, updates)
      if (updatedProduct) {
        dispatch({ type: 'UPDATE_PRODUCT', payload: { id, updates } })
        return updatedProduct
      }
      throw new Error('Failed to update product')
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error as Error })
      throw error
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [])

  const [removeProductAction, loadingRemoveProduct, errorRemoveProduct] = useAction(async (id: string) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const success = await deleteProduct(id)
      if (success) {
        dispatch({ type: 'REMOVE_PRODUCT', payload: id })
      } else {
        throw new Error('Failed to delete product')
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error as Error })
      throw error
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [])

  const [clearAllProducts, loadingClearAllProducts, errorClearAllProducts] = useAction(async () => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const currentProducts = await getAllProducts()
      for (const product of currentProducts) {
        await deleteProduct(product.id)
      }

      dispatch({ type: 'CLEAR_PRODUCTS' })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error as Error })
      throw error
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [])

  return {
    products,
    loading,
    loadProducts,
    addProductAction,
    updateProductAction,
    removeProductAction,
    clearAllProducts,
    loadingLoadProducts,
    loadingAddProduct,
    loadingUpdateProduct,
    loadingRemoveProduct,
    loadingClearAllProducts,
    errorLoadProducts,
    errorAddProduct,
    errorUpdateProduct,
    errorRemoveProduct,
    errorClearAllProducts,
  }
}
