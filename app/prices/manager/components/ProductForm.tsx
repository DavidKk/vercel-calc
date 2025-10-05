'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { CheckIcon, XMarkIcon, ArrowPathIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/solid'
import type { ProductType } from '@/app/actions/prices/product'
import { Button } from '@/app/prices/components/Button'
import { useNotification } from '@/components/Notification/useNotification'
import { Spinner } from '@/components/Spinner'
import { useProductActions } from '@/app/prices/contexts/product'
import { ProductFormInput } from './ProductFormInput'
import { validateProductName, validateProductUnitPrice, validateUnit, validateUnitConversion, validateRemark } from '@/utils/validation'
import { parseUnit, parseUnitConversion, formatNumber } from '@/utils/format'
import { COMMON_FORMULAS } from '@/app/prices/constants/formulas'

export interface ProductFormProps {
  product?: ProductType | null
  afterSaved?: (product: ProductType) => void
  onCancel: () => void
  showEmptyState?: boolean
}

export function ProductForm({ product, afterSaved, onCancel, showEmptyState = true }: ProductFormProps) {
  const notification = useNotification()
  const formRef = useRef<HTMLFormElement>(null)
  const [name, setName] = useState(product?.name || '')
  const [brand, setBrand] = useState(product?.brand || '')
  const [unit, setUnit] = useState(product?.unit || '')
  const [unitBestPrice, setRecommendedPrice] = useState(product?.unitBestPrice?.toString() || '')
  const [unitConversions, setUnitConversions] = useState<string[]>(() => {
    if (product?.unitConversions && product.unitConversions.length > 0) {
      // unitConversions are stored without = prefix
      return [...product.unitConversions]
    }
    return ['']
  })
  const [remark, setRemark] = useState(product?.remark || '')
  const { products, loadingAddProduct, loadingUpdateProduct, loadingRemoveProduct, addProductAction, updateProductAction, removeProductAction } = useProductActions()
  const [isUnitDisabled, setIsUnitDisabled] = useState(false)

  // Create a list of unique product names for suggestions
  const productSuggestions = Array.from(new Set(products.map((p) => p.name))).map((name) => ({
    label: name,
    value: name,
  }))

  // Generate unit conversion suggestions based on existing products using useMemo
  const unitConversionSuggestions = useMemo(() => {
    return generateUnitConversionSuggestions(unit, products)
  }, [unit, products])

  const isEditing = !!product
  const isFormSubmitting = loadingAddProduct || loadingUpdateProduct || loadingRemoveProduct

  // Custom validator for unit conversions that prevents common formulas
  const unitConversionValidator = useMemo(() => createProductUnitConversionValidator(unit), [unit])

  // When product prop changes, update the form fields
  useEffect(() => {
    if (product) {
      setName(product.name)
      setBrand(product.brand || '')
      setUnit(product.unit)
      setRecommendedPrice(product.unitBestPrice.toString())
      // unitConversions are stored without = prefix
      const storedConversions = product.unitConversions && product.unitConversions.length > 0 ? [...product.unitConversions] : ['']
      setUnitConversions(storedConversions)
      setRemark(product.remark || '')
    } else {
      setName('')
      setBrand('')
      setUnit('')
      setRecommendedPrice('')
      setUnitConversions([''])
      setRemark('')
      setIsUnitDisabled(false)
    }
  }, [product])

  // When product name changes, check for existing products with same name
  // This handles unit auto-fill and locking logic
  useEffect(() => {
    if (name.trim() !== '') {
      let existingProduct

      if (isEditing && product) {
        // Edit mode: exclude current product
        existingProduct = products.find((p) => p.name === name.trim() && p.id !== product.id)
      } else {
        // Add mode: check all products
        existingProduct = products.find((p) => p.name === name.trim())
      }

      if (existingProduct) {
        // Auto-fill or sync unit
        if (unit !== existingProduct.unit) {
          setUnit(existingProduct.unit)
        }
        setIsUnitDisabled(true)

        // Auto-fill unit conversions if existing product has them
        // unitConversions are stored without = prefix
        if (existingProduct.unitConversions && existingProduct.unitConversions.length > 0) {
          setUnitConversions([...existingProduct.unitConversions])
        }
      } else {
        setIsUnitDisabled(false)
      }
    } else {
      setIsUnitDisabled(false)
    }
  }, [name, products, isEditing, product?.id, unit])

  // When product name changes in add mode, auto-fill unit formulas from existing products
  // This finds the earliest product with unit conversions and uses its formulas
  useEffect(() => {
    if (!isEditing && name.trim() !== '') {
      // Only in add mode, not edit mode
      const existingProducts = products.filter((p) => p.name === name.trim())

      if (existingProducts.length > 0) {
        // Find the earliest product (by ID) that has unit conversions
        const sortedProducts = [...existingProducts].sort((a, b) => parseInt(a.id) - parseInt(b.id))
        const productWithFormula = sortedProducts.find((p) => p.unitConversions && p.unitConversions.length > 0)

        if (productWithFormula && productWithFormula.unitConversions) {
          // Auto-fill unit conversions from the earliest product with formulas
          // unitConversions are stored without = prefix
          setUnitConversions([...productWithFormula.unitConversions])
        }
      }
    }
  }, [name, products, isEditing])

  const handleUnitConversionChange = (index: number, value: string) => {
    const newUnitConversions = [...unitConversions]
    newUnitConversions[index] = value
    setUnitConversions(newUnitConversions)
  }

  const addUnitConversion = () => {
    if (unitConversions.length < 5) {
      setUnitConversions([...unitConversions, ''])
    }
  }

  const removeUnitConversion = (index: number) => {
    if (unitConversions.length > 1) {
      const newUnitConversions = [...unitConversions]
      newUnitConversions.splice(index, 1)
      setUnitConversions(newUnitConversions)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim() || !unit.trim() || !unitBestPrice.trim()) {
      notification.error('Please fill in all required fields')
      return
    }

    const price = parseFloat(unitBestPrice)
    if (isNaN(price) || price <= 0) {
      notification.error('Please enter a valid recommended price')
      return
    }

    // Validate unit conversion formats and extract just the conversion part
    const conversionsToSave: string[] = []
    for (const conversion of unitConversions) {
      if (conversion.trim() !== '') {
        // If the conversion contains product info in parentheses, extract just the unit conversion part
        let conversionForValidation = conversion.trim()
        if (conversionForValidation.includes(' (') && conversionForValidation.endsWith(')')) {
          // Extract just the unit conversion part (before the parentheses)
          conversionForValidation = conversionForValidation.split(' (')[0]
        }

        // Validate the conversion part using our custom validator
        const validation = unitConversionValidator(conversionForValidation)
        if (validation !== true) {
          // Extract just the error message part if it's a full message
          const errorMessage = typeof validation === 'string' ? validation : 'Unit conversion must be number and unit (e.g., 100ml or 100 ml)'
          notification.error(errorMessage)
          return
        }

        // Add the conversion part to the list to save
        conversionsToSave.push(conversionForValidation)
      }
    }

    try {
      let savedProduct: ProductType

      if (isEditing && product) {
        const updated = await updateProductAction(product.id, {
          name: name.trim(),
          brand: brand.trim(),
          unit: unit.trim(),
          unitBestPrice: price,
          unitConversions: conversionsToSave.length > 0 ? conversionsToSave : undefined,
          remark: remark.trim() || undefined,
        })

        if (!updated) {
          throw new Error('Failed to update product')
        }

        savedProduct = updated
        notification.success('Product updated successfully')
        // Call afterSaved callback to switch to the saved product only on success
        if (afterSaved) {
          afterSaved(savedProduct)
        }
      } else {
        const newProduct = await addProductAction({
          name: name.trim(),
          brand: brand.trim() || undefined,
          unit: unit.trim(),
          unitBestPrice: price,
          unitConversions: conversionsToSave.length > 0 ? conversionsToSave : undefined,
          remark: remark.trim() || undefined,
        })

        if (!newProduct) {
          throw new Error('Failed to create product')
        }

        savedProduct = newProduct
        notification.success('Product created successfully')
        // Call afterSaved callback to switch to the saved product only on success
        if (afterSaved) {
          afterSaved(savedProduct)
        }
        // For new products, clear the form but keep it open only on success
        setName('')
        setBrand('')
        setUnit('')
        setRecommendedPrice('')
        setUnitConversions([''])
        setRemark('')
        setIsUnitDisabled(false)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save product, please try again'
      notification.error(errorMessage)
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
        setUnitConversions([''])
        onCancel()

        notification.success('Product deleted successfully')
      } catch (error) {
        notification.error(`Failed to delete product: ${error}`)
      }
    }
  }

  const handleReset = () => {
    if (product) {
      setName(product.name)
      setBrand(product.brand || '')
      setUnit(product.unit)
      setRecommendedPrice(product.unitBestPrice.toString())
      // unitConversions are stored without = prefix
      const storedConversions = product.unitConversions && product.unitConversions.length > 0 ? [...product.unitConversions] : ['']
      setUnitConversions(storedConversions)
      // Re-enable unit field when editing
      setIsUnitDisabled(false)
      setRemark(product.remark || '')
    } else {
      setName('')
      setBrand('')
      setUnit('')
      setRecommendedPrice('')
      setUnitConversions([''])
      setRemark('')
      setIsUnitDisabled(false)
    }

    formRef.current?.dispatchEvent(new Event('reset'))
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

      <form onSubmit={handleSubmit} className="flex flex-col h-full" ref={formRef}>
        <div className="flex flex-col gap-y-3">
          <ProductFormInput
            label="Product Name"
            value={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
            validator={validateProductName}
            placeholder="e.g. Cola, Vegetables, Meat"
            required
            suggestions={productSuggestions}
          />
          <ProductFormInput
            label="Brand"
            value={brand}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBrand(e.target.value)}
            placeholder="e.g. Coca-Cola, Pepsi (optional)"
          />
          <ProductFormInput
            label="Unit"
            prefix="/"
            value={unit}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUnit(e.target.value)}
            validator={validateUnit}
            placeholder="e.g. kg, 100 ml"
            required
            disabled={isUnitDisabled}
          />
          <ProductFormInput
            label="Unit Price"
            prefix="¥"
            value={unitBestPrice}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRecommendedPrice(e.target.value)}
            validator={validateProductUnitPrice}
            placeholder="0.00"
            required
          />

          <ProductFormInput
            label="Remark"
            value={remark}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRemark(e.target.value)}
            validator={validateRemark}
            placeholder="Additional information (optional)"
          />

          <div className="flex flex-col gap-y-2">
            <label className="text-gray-300 text-sm font-medium">Unit Conversions</label>
            {unitConversions.map((conversion, index) => (
              <div key={index} className="flex items-center gap-x-2">
                <div className="flex-1">
                  <ProductFormInput
                    label=""
                    prefix="="
                    value={conversion}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleUnitConversionChange(index, e.target.value)}
                    validator={unitConversionValidator}
                    placeholder="e.g. 100ml, 1kg"
                    suggestions={unitConversionSuggestions}
                  />
                </div>
                {unitConversions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeUnitConversion(index)}
                    className="h-10 w-10 flex items-center justify-center text-gray-400 hover:text-white transition-colors duration-200"
                    title="Remove"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                )}
              </div>
            ))}
            {unitConversions.length < 5 && (
              <button
                type="button"
                onClick={addUnitConversion}
                className="inline-flex items-center gap-x-2 text-gray-400 hover:text-white transition-colors duration-200 text-sm mt-1 mr-auto"
              >
                <PlusIcon className="h-4 w-4" />
                <span>Add Unit Conversion</span>
              </button>
            )}
          </div>
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

// Factory function that creates a validator for unit conversions
// Prevents common formulas by pre-calculating target units for the given unit
function createProductUnitConversionValidator(currentUnit: string) {
  // Pre-calculate common formula target units for the current unit
  const commonFormulaTargetUnits = new Set<string>()
  COMMON_FORMULAS.forEach(([sourceUnit, formula]) => {
    if (sourceUnit === currentUnit) {
      // Parse the formula to get the target unit
      const formulaContent = formula.substring(1).trim() // Remove the '=' prefix
      const parsedFormula = parseUnit(formulaContent)
      const formulaTargetUnit = parsedFormula.unit
      if (formulaTargetUnit) {
        commonFormulaTargetUnits.add(formulaTargetUnit)
      }
    }
  })

  // Return a validator function that uses the pre-calculated target units
  return (value: string): true | string => {
    // First, validate the format using the existing validateUnitConversion function
    const formatValidation = validateUnitConversion(value)
    if (formatValidation !== true) {
      return formatValidation
    }

    // If format is valid, check if this conversion already exists in common formulas
    const parsedConversion = parseUnitConversion(value)
    const targetUnit = parsedConversion.unit

    // Check if this conversion already exists in common formulas
    if (commonFormulaTargetUnits.has(targetUnit)) {
      return `The conversion to "${targetUnit}" already exists in common formulas. No need to add it again.`
    }

    return true
  }
}

// Generate unit conversion suggestions based on existing products
function generateUnitConversionSuggestions(unit: string, products: ProductType[]) {
  if (!unit) {
    return []
  }

  // Parse the current unit to get the number and unit part (e.g., "2kg" -> { number: 2, unit: "kg" })
  const parsedCurrentUnit = parseUnit(unit)
  const currentUnitNumber = parsedCurrentUnit.number
  const currentUnit = parsedCurrentUnit.unit || unit

  if (!currentUnit) {
    return []
  }

  // Collect all unit conversions that involve the current unit
  const suggestionsMap = new Map<string, string>()

  // Only add suggestions from products, not from common formulas
  products.forEach((product) => {
    if (!(product.unitConversions && product.unitConversions.length > 0)) {
      return
    }

    // Parse the product's base unit
    const productBaseUnitParsed = parseUnit(product.unit)
    const productBaseUnit = productBaseUnitParsed.unit || product.unit
    const productBaseNumber = productBaseUnitParsed.number

    product.unitConversions.forEach((conversionStr) => {
      // Parse the conversion
      const parsed = parseUnitConversion(conversionStr)
      const conversionNumber = parsed.number
      const conversionUnit = parsed.unit

      if (!(conversionUnit && productBaseUnit)) {
        return
      }

      // Create a conversion relationship: productBaseNumber productBaseUnit = conversionNumber conversionUnit
      // For example: 1 kg = 2 斤
      if (productBaseUnit === currentUnit) {
        // Current unit is the base unit
        // Calculate how many conversion units equal currentUnitNumber of current units
        // For example, if we have "1 kg = 2 斤", and current unit is "2 kg",
        // we want to show "4 斤 (Product Name - Brand)" as a suggestion
        if (productBaseNumber > 0) {
          const conversionUnitsForCurrent = (conversionNumber * currentUnitNumber) / productBaseNumber
          const formattedNumber = formatNumber(conversionUnitsForCurrent, 6)
          const productInfo = product.brand ? `${product.name} - ${product.brand}` : product.name
          const key = `${formattedNumber} ${conversionUnit} (${productInfo})`
          suggestionsMap.set(key, key)
        }

        return
      }

      if (conversionUnit === currentUnit) {
        // Current unit is the conversion unit
        // Calculate how many base units equal currentUnitNumber of current units
        // For example, if we have "1 kg = 2 斤", and current unit is "4 斤",
        // we want to show "2 kg (Product Name - Brand)" as a suggestion
        if (conversionNumber > 0) {
          const baseUnitsForCurrent = (productBaseNumber * currentUnitNumber) / conversionNumber
          const formattedNumber = formatNumber(baseUnitsForCurrent, 6)
          const productInfo = product.brand ? `${product.name} - ${product.brand}` : product.name
          const key = `${formattedNumber} ${productBaseUnit} (${productInfo})`
          suggestionsMap.set(key, key)
        }
      }
    })
  })

  // Convert map to array of suggestion objects
  const suggestions = Array.from(suggestionsMap.values()).map((value) => ({
    label: value,
    value: value,
  }))

  // Filter out invalid suggestions (ones that don't parse correctly)
  const validSuggestions = suggestions.filter((suggestion) => {
    try {
      // Extract just the unit part for validation (before the parentheses)
      const unitPart = suggestion.value.split(' (')[0]
      const parsed = parseUnitConversion(unitPart)
      return parsed.unit && parsed.number > 0
    } catch {
      return false
    }
  })

  return validSuggestions
}
