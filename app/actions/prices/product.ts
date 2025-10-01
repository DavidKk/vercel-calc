'use server'

import { readGistFile, writeGistFile, getGistInfo } from '@/services/gist'
import { guid } from '@/utils/guid'

export interface ProductType {
  id: string
  name: string
  unit: string
  recommendedPrice: number
  brand?: string
}

const PRODUCTS_FILE_NAME = 'products.json'

async function getProductsFromGist(): Promise<ProductType[]> {
  const { gistId, gistToken } = getGistInfo()
  const content = await readGistFile({ gistId, gistToken, fileName: PRODUCTS_FILE_NAME })
  return JSON.parse(content)
}

async function saveProductsToGist(products: ProductType[]): Promise<void> {
  const { gistId, gistToken } = getGistInfo()
  const content = JSON.stringify(products, null, 2)
  await writeGistFile({ gistId, gistToken, fileName: PRODUCTS_FILE_NAME, content })
}

export async function getAllProducts(): Promise<ProductType[]> {
  return await getProductsFromGist()
}

export async function getProductById(id: string): Promise<ProductType | undefined> {
  const products = await getProductsFromGist()
  return products.find((product) => product.id === id)
}

export async function createProduct(product: Omit<ProductType, 'id'>): Promise<ProductType> {
  const products = await getProductsFromGist()
  const newProduct: ProductType = {
    ...product,
    id: guid(),
  }

  products.push(newProduct)
  await saveProductsToGist(products)
  return newProduct
}

export async function updateProduct(id: string, updates: Partial<ProductType>): Promise<ProductType | null> {
  const products = await getProductsFromGist()
  const index = products.findIndex((product) => product.id === id)
  if (index === -1) return null

  products[index] = { ...products[index], ...updates }
  await saveProductsToGist(products)
  return products[index]
}

export async function deleteProduct(id: string): Promise<boolean> {
  const products = await getProductsFromGist()
  const index = products.findIndex((product) => product.id === id)
  if (index === -1) return false

  products.splice(index, 1)
  await saveProductsToGist(products)
  return true
}
