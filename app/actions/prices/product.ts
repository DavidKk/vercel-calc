'use server'

import { validateCookie } from '@/services/auth/access'
import { getGistInfo, readGistFile, writeGistFile } from '@/services/gist'
import { validateUnit } from '@/utils/validation'

export interface ProductType {
  id: string
  name: string
  unit: string
  unitBestPrice: number
  brand?: string
  unitConversions?: string[]
  remark?: string
}

const PRODUCTS_FILE_NAME = 'products.json'

/**
 * Get all products from gist storage
 * @returns Promise that resolves to array of products
 */
async function getProductsFromGist(): Promise<ProductType[]> {
  const { gistId, gistToken } = getGistInfo()
  const content = await readGistFile({ gistId, gistToken, fileName: PRODUCTS_FILE_NAME })
  return JSON.parse(content)
}

/**
 * Save products to gist storage
 * @param products Array of products to save
 */
async function saveProductsToGist(products: ProductType[]): Promise<void> {
  const { gistId, gistToken } = getGistInfo()
  const content = JSON.stringify(products, null, 2)
  await writeGistFile({ gistId, gistToken, fileName: PRODUCTS_FILE_NAME, content })
}

/**
 * Get all products
 * @returns Promise that resolves to array of all products
 */
export async function getAllProducts(): Promise<ProductType[]> {
  return await getProductsFromGist()
}

/**
 * Get product by ID
 * @param id Product ID to retrieve
 * @returns Promise that resolves to product or undefined if not found
 */
export async function getProductById(id: string): Promise<ProductType | undefined> {
  if (!(await validateCookie())) {
    throw new Error('Not authorized')
  }

  const products = await getProductsFromGist()
  return products.find((product) => product.id === id)
}

/**
 * Generate incremental ID for new products
 * @param products Current product list
 * @returns New incremental ID string
 */
function generateIncrementalId(products: ProductType[]): string {
  if (products.length === 0) {
    return '0'
  }

  // Find the maximum ID and add 1
  const maxId = Math.max(...products.map((p) => parseInt(p.id, 10)).filter((id) => !isNaN(id)))
  return (maxId + 1).toString()
}

/**
 * Create a new product
 * @param product Product data without ID
 * @returns Promise that resolves to created product with ID
 * @throws Error if a product with the same name and brand already exists, or same name but different unit
 */
export async function createProduct(product: Omit<ProductType, 'id'>): Promise<ProductType> {
  if (!(await validateCookie())) {
    throw new Error('Not authorized')
  }

  const products = await getProductsFromGist()

  // Validate unit format
  if (!validateUnit(product.unit)) {
    throw new Error(`Invalid unit format: "${product.unit}"`)
  }

  // Check if a product with the same name and brand already exists (original logic)
  const existingProduct = products.find((p) => p.name === product.name && (p.brand || '') === (product.brand || ''))
  if (existingProduct) {
    throw new Error(`Product with name "${product.name}" and brand "${product.brand || ''}" already exists`)
  }

  // Check if a product with the same name but different unit already exists (new logic)
  const sameNameProduct = products.find((p) => p.name === product.name)
  if (sameNameProduct && sameNameProduct.unit !== product.unit) {
    throw new Error(`Product with name "${product.name}" already exists with different unit: "${sameNameProduct.unit}". Cannot create with unit: "${product.unit}"`)
  }

  const newProduct: ProductType = {
    ...product,
    id: generateIncrementalId(products),
  }

  products.push(newProduct)
  await saveProductsToGist(products)
  return newProduct
}

/**
 * Update product by ID
 * @param id Product ID to update
 * @param updates Partial product data to update
 * @returns Promise that resolves to updated product or null if not found
 * @throws Error if updating to a product with the same name and brand that already exists, or same name but different unit
 */
export async function updateProduct(id: string, updates: Partial<ProductType>): Promise<ProductType | null> {
  if (!(await validateCookie())) {
    throw new Error('Not authorized')
  }

  const products = await getProductsFromGist()
  const index = products.findIndex((product) => product.id === id)
  if (index === -1) {
    return null
  }

  // Validate unit format if being updated
  if (updates.unit && !validateUnit(updates.unit)) {
    throw new Error(`Invalid unit format: "${updates.unit}"`)
  }

  // Check if updating to a product with the same name and brand that already exists (original logic)
  if (updates.name || updates.brand !== undefined) {
    const updatedProduct = { ...products[index], ...updates }
    const existingProduct = products.find(
      (p) =>
        p.id !== id && // Exclude the current product being updated
        p.name === updatedProduct.name &&
        (p.brand || '') === (updatedProduct.brand || '')
    )

    if (existingProduct) {
      throw new Error(`Product with name "${updatedProduct.name}" and brand "${updatedProduct.brand || ''}" already exists`)
    }
  }

  // Check if updating to a product with the same name but different unit (new logic)
  if (updates.name || updates.unit) {
    const updatedProduct = { ...products[index], ...updates }
    const sameNameProduct = products.find(
      (p) =>
        p.id !== id && // Exclude the current product being updated
        p.name === updatedProduct.name
    )

    if (sameNameProduct && sameNameProduct.unit !== updatedProduct.unit) {
      throw new Error(`Product with name "${updatedProduct.name}" already exists with different unit: "${sameNameProduct.unit}". Cannot update to unit: "${updatedProduct.unit}"`)
    }
  }

  products[index] = { ...products[index], ...updates }
  await saveProductsToGist(products)
  return products[index]
}

/**
 * Delete product by ID
 * @param id Product ID to delete
 * @returns Promise that resolves to true if deleted, false if not found
 */
export async function deleteProduct(id: string): Promise<boolean> {
  if (!(await validateCookie())) {
    throw new Error('Not authorized')
  }

  const products = await getProductsFromGist()
  const index = products.findIndex((product) => product.id === id)
  if (index === -1) return false

  products.splice(index, 1)
  await saveProductsToGist(products)
  return true
}
