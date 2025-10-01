'use client'

import React, { createContext, useContext, useReducer } from 'react'
import type { ProductState, ProductAction } from './types'
import { productReducer } from './reducer'
import type { ProductType } from '@/app/actions/prices/product'

interface ProductContextType extends ProductState {
  dispatch: React.Dispatch<ProductAction>
}

const ProductContext = createContext<ProductContextType | undefined>(undefined)

export function ProductProvider({ children, initialProducts = [] }: { children: React.ReactNode; initialProducts?: ProductType[] }) {
  const [state, dispatch] = useReducer(productReducer, {
    products: initialProducts,
    loading: false,
    error: null,
  })

  return <ProductContext.Provider value={{ ...state, dispatch }}>{children}</ProductContext.Provider>
}

export function useProductContext() {
  const context = useContext(ProductContext)
  if (context === undefined) {
    throw new Error('useProductContext must be used within a ProductProvider')
  }

  return context
}
