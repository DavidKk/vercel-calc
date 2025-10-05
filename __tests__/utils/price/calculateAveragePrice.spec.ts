import { calculateAveragePrice } from '@/utils/price'
import type { ProductType } from '@/app/actions/prices/product'

describe('calculateAveragePrice', () => {
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
    const result = calculateAveragePrice('0', '0', mockProducts, 'kg')
    expect(result).toEqual([])
  })

  it('should return empty array when totalQuantity is invalid', () => {
    const result = calculateAveragePrice('100', 'abc', mockProducts, 'kg')
    expect(result).toEqual([])
  })

  it('should return empty array when totalQuantity is zero', () => {
    const result = calculateAveragePrice('100', '0', mockProducts, 'kg')
    expect(result).toEqual([])
  })

  it('should return empty array when totalQuantity is zero', () => {
    const result = calculateAveragePrice('100', '0', mockProducts, 'kg')
    expect(result).toEqual([])
  })

  it('should calculate average price correctly for valid inputs', () => {
    const result = calculateAveragePrice('100', '10', mockProducts, 'kg')

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
    const { calculateAveragePrice: calculateAveragePriceWithMock } = require('@/utils/price')

    const result = calculateAveragePriceWithMock('100', '= 10 kg', mockProducts, 'kg')
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

    const result = calculateAveragePrice('80', '10', productsWithoutConversions, 'kg')
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

    const result = calculateAveragePrice('60', '10', productsWithDifferentUnits, 'kg')
    expect(result).toHaveLength(2)

    // Both products should be processed
    expect(result[0].name).toBe('Banana')
    expect(result[1].name).toBe('Banana')
  })
})
