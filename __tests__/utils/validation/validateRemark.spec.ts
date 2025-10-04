import { validateRemark } from '../../../utils/validation'

describe('validateRemark', () => {
  it('should validate empty remark as valid', () => {
    expect(validateRemark('')).toBe(true)
    expect(validateRemark(undefined as any)).toBe(true)
    expect(validateRemark(null as any)).toBe(true)
  })

  it('should validate valid remarks', () => {
    expect(validateRemark('This is a valid remark')).toBe(true)
    expect(validateRemark('Another remark with numbers 123')).toBe(true)
    expect(validateRemark('Special characters !@#$%^&*()')).toBe(true)
  })

  it('should trim whitespace from remarks', () => {
    expect(validateRemark('  Valid remark with spaces  ')).toBe(true)
  })

  it('should reject remarks that are too long', () => {
    const longRemark = 'a'.repeat(201)
    expect(validateRemark(longRemark)).toBe('Remark must be less than 200 characters')

    const validRemark = 'a'.repeat(200)
    expect(validateRemark(validRemark)).toBe(true)
  })
})
