import { validateRequired } from '@/utils/validation'

describe('validateRequired', () => {
  it('should validate non-empty values as true', () => {
    expect(validateRequired('test', 'Field')).toBe(true)
    expect(validateRequired('123', 'Field')).toBe(true)
    expect(validateRequired('0', 'Field')).toBe(true)
  })

  it('should return error message for empty values', () => {
    expect(validateRequired('', 'Product Name')).toBe('Product Name is required')
    expect(validateRequired(null as any, 'Product Name')).toBe('Product Name is required')
    expect(validateRequired(undefined as any, 'Product Name')).toBe('Product Name is required')
  })

  it('should return error message for whitespace-only values when trimmed', () => {
    expect(validateRequired('   ', 'Product Name')).toBe('Product Name is required')
  })

  it('should use the correct field name in error messages', () => {
    expect(validateRequired('', 'Unit Price')).toBe('Unit Price is required')
    expect(validateRequired('', 'Description')).toBe('Description is required')
  })
})
