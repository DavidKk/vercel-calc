import { validateProductName } from '@/utils/validation'

describe('validateProductName', () => {
  it('should validate valid product names as true', () => {
    expect(validateProductName('Product')).toBe(true)
    expect(validateProductName('A product name')).toBe(true)
    expect(validateProductName('Product123')).toBe(true)
    expect(validateProductName('123Product')).toBe(true)
    expect(validateProductName('Product-Name')).toBe(true)
    expect(validateProductName('Product_Name')).toBe(true)
    expect(validateProductName('ab')).toBe(true) // Minimum length
    expect(validateProductName('A'.repeat(50))).toBe(true) // Maximum length
  })

  it('should return error message for empty product names', () => {
    expect(validateProductName('')).toBe('Product name is required')
    expect(validateProductName('   ')).toBe('Product name is required')
    expect(validateProductName(null as any)).toBe('Product name is required')
    expect(validateProductName(undefined as any)).toBe('Product name is required')
  })

  it('should return error message for product names that are too short', () => {
    expect(validateProductName('a')).toBe('Product name must be at least 2 characters')
  })

  it('should return error message for product names that are too long', () => {
    expect(validateProductName('A'.repeat(51))).toBe('Product name must be less than 50 characters')
  })
})
