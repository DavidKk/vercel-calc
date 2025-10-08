/**
 * Fuel type interface
 */
export interface FuelType {
  id: string
  name: string
  unit: string
  unitPrice: number
}

/**
 * Selected fuel interface
 */
export interface SelectedFuel {
  fuel: FuelType
  rechargeAmount: string
  giftAmount: string
}

/**
 * Province price interface
 */
export interface ProvincePrice {
  province: string
  b92: string // Oil price uses string type as it might be "0"
  b95: string
  b98: string
  b0: string
}
