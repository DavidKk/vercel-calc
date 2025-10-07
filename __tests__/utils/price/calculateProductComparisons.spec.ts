import type { ProductType } from '@/app/actions/prices/product'
import { calculateProductComparisons } from '@/utils/price/calculateProductComparisons'

describe('calculateProductComparisons', () => {
  const mockProducts: ProductType[] = [
    {
      id: '1',
      name: 'Apple',
      unit: 'kg',
      unitBestPrice: 5,
      unitConversions: ['2 斤'],
      brand: 'Brand A',
      remark: 'Test apple',
    },
    {
      id: '2',
      name: 'Apple',
      unit: 'kg',
      unitBestPrice: 6,
      unitConversions: ['2 斤'],
      brand: 'Brand B',
      remark: 'Another apple',
    },
  ]

  it('should return empty array when totalPrice and totalQuantity are both zero', () => {
    const result = calculateProductComparisons('0', '0', mockProducts, 'kg')
    expect(result).toEqual([])
  })

  it('should return empty array when totalQuantity is invalid', () => {
    const result = calculateProductComparisons('100', 'abc', mockProducts, 'kg')
    expect(result).toEqual([])
  })

  it('should return empty array when totalQuantity is zero', () => {
    const result = calculateProductComparisons('100', '0', mockProducts, 'kg')
    expect(result).toEqual([])
  })

  it('should calculate comparisons correctly for valid inputs', () => {
    const result = calculateProductComparisons('100', '10', mockProducts, 'kg')
    expect(result).toHaveLength(2)

    expect(result[0]).toMatchObject({
      name: 'Apple',
      brand: 'Brand A',
      unitBestPrice: 5,
      unit: 'kg',
      quantity: 10,
      unitCurrentPrice: 10, // 100 / 10
    })

    // Check that price level is calculated correctly
    expect(result[0].level).toBeDefined()
  })

  it('should handle formula quantities correctly', () => {
    // Mock the isFormula function to return true for this test
    jest.mock('@/app/prices/types', () => ({
      ...jest.requireActual('@/app/prices/types'),
      isFormula: (value: string) => value.startsWith('='),
    }))

    // Need to re-import after mock
    jest.resetModules()
    const { calculateProductComparisons: calculateProductComparisonsWithMock } = require('@/utils/price/calculateProductComparisons')

    const result = calculateProductComparisonsWithMock('100', '= 10 kg', mockProducts, 'kg')
    expect(result).toHaveLength(2)
  })

  it('should handle products with no unit conversions', () => {
    const productsWithoutConversions: ProductType[] = [
      {
        id: '3',
        name: 'Orange',
        unit: 'kg',
        unitBestPrice: 4,
        unitConversions: [],
        brand: 'Brand C',
      },
    ]

    const result = calculateProductComparisons('80', '10', productsWithoutConversions, 'kg')
    expect(result).toHaveLength(1)
    expect(result[0]).toMatchObject({
      name: 'Orange',
      brand: 'Brand C',
      unitBestPrice: 4,
      unit: 'kg',
      quantity: 10,
      unitCurrentPrice: 8, // 80 / 10
    })
  })

  it('should handle products with different units', () => {
    const productsWithDifferentUnits: ProductType[] = [
      {
        id: '4',
        name: 'Banana',
        unit: 'kg',
        unitBestPrice: 3,
        unitConversions: ['2 斤'],
        brand: 'Brand D',
      },
      {
        id: '5',
        name: 'Banana',
        unit: '斤',
        unitBestPrice: 1.5,
        unitConversions: ['0.5 kg'],
        brand: 'Brand E',
      },
    ]

    const result = calculateProductComparisons('60', '10', productsWithDifferentUnits, 'kg')
    expect(result).toHaveLength(2)

    // Both products should be processed
    expect(result[0].name).toBe('Banana')
    expect(result[1].name).toBe('Banana')
  })

  // New test case based on user provided data
  it('should calculate comparisons correctly for formula quantity with unit conversion', () => {
    const products: ProductType[] = [
      {
        id: '10',
        name: '乐事薯片',
        brand: '',
        unit: '100g',
        unitBestPrice: 5.04,
        unitConversions: [], // Empty array as in the test data
      },
    ]

    const result = calculateProductComparisons('1', '=1g', products, 'g')

    // Should return one comparison item
    expect(result).toHaveLength(1)

    // Check the properties of the result
    expect(result[0]).toMatchObject({
      id: '10',
      name: '乐事薯片',
      brand: '',
      unit: '100g',
      unitBestPrice: 5.04,
    })

    // For "=1g" with product unit "100g", the quantity should be 0.01 (1g / 100g)
    expect(result[0].quantity).toBeCloseTo(0.01)

    // Unit current price should be 1 / 0.01 = 100
    expect(result[0].unitCurrentPrice).toBeCloseTo(100)

    // Check that price level is calculated
    expect(result[0].level).toBeDefined()
  })
})
