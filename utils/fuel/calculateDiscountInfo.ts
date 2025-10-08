import { add, divide, multiply, subtract } from '@/utils/math'

/**
 * Calculate discount per liter based on recharge amount, gift amount and fuel unit price
 * Example: 1000 recharge + 100 gift with 7.13 fuel price = 0.65 discount per liter
 * @param recharge Recharge amount
 * @param gift Gift amount
 * @param unitPrice Fuel unit price
 * @returns Discount per liter
 */
export function calculateDiscountPerLiter(recharge: number, gift: number, unitPrice: number): number {
  if (recharge <= 0) return 0

  // Calculate how many liters can be purchased with the total amount (recharge + gift)
  const totalAmount = add(recharge, gift)
  // Calculate how many liters can actually be purchased with the total amount
  const actualLiters = divide(totalAmount, unitPrice)
  // Calculate the actual price per liter (recharge / actual liters)
  const finalPricePerLiter = actualLiters > 0 ? divide(recharge, actualLiters) : unitPrice
  // Calculate discount per liter (original price - actual price)
  const discountPerLiter = subtract(unitPrice, finalPricePerLiter)

  return discountPerLiter
}

/**
 * Calculate discount percentage based on original and final price
 * Example: 7.13 original price with 6.48 final price = 9.1 discount percentage
 * @param originalPrice Original price
 * @param finalPrice Final price after discount
 * @returns Discount percentage (0-100)
 */
export function calculateDiscountPercentage(originalPrice: number, finalPrice: number): number {
  if (originalPrice <= 0) return 0
  const discount = multiply(divide(subtract(originalPrice, finalPrice), originalPrice), 100)
  return Math.max(0, Math.min(100, discount)) // Ensure discount is between 0 and 100
}

/**
 * Get discount percentage description (e.g., "9折")
 * @param originalPrice Original price
 * @param finalPrice Final price after discount
 * @returns Chinese discount description (e.g., "9.0折")
 */
export function getDiscountPercentageDescription(originalPrice: number, finalPrice: number): string {
  const discountPercentage = calculateDiscountPercentage(originalPrice, finalPrice)
  // Convert to Chinese discount format (e.g., 90% -> 9折)
  // In Chinese discount system, if you pay 90% of original price, it's called 9折
  const chineseDiscount = divide(subtract(100, discountPercentage), 10).toFixed(1)
  return `${chineseDiscount}折`
}

/**
 * Calculate final price per liter based on discount per liter and unit price
 * Example: 7.13 unit price - 0.65 discount = 6.48 final price per liter
 * @param unitPrice Fuel unit price
 * @param discountPerLiter Discount per liter
 * @returns Final price per liter
 */
export function calculateFinalPricePerLiter(unitPrice: number, discountPerLiter: number): number {
  return subtract(unitPrice, discountPerLiter)
}

/**
 * Get price level description based on discount amount per liter
 * @param discountPerLiter Discount amount per liter
 * @returns Price level description
 */
export function getPriceLevelDescription(discountPerLiter: number) {
  if (discountPerLiter >= 0.7) {
    return 'Excellent Deal'
  }
  if (discountPerLiter >= 0.5) {
    return 'Good Deal'
  }
  if (discountPerLiter >= 0.3) {
    return 'Normal'
  }
  if (discountPerLiter >= 0.1) {
    return 'Low Discount'
  }
  return 'Not Worth'
}

/**
 * Get discount level color based on discount amount per liter
 * Using more detailed colors similar to prices module
 * @param discountPerLiter Discount amount per liter
 * @returns CSS color class name
 */
export function getDiscountLevelColor(discountPerLiter: number) {
  // Excellent Deal (very good discount): blue-400
  if (discountPerLiter >= 0.7) return 'text-blue-400'
  // Good Deal (good discount): green-400
  if (discountPerLiter >= 0.5) return 'text-green-400'
  // Normal (average discount): yellow-500
  if (discountPerLiter >= 0.3) return 'text-yellow-500'
  // Low Discount (poor discount): orange-400
  if (discountPerLiter >= 0.1) return 'text-orange-400'
  // Not Worth (very poor discount): red-500
  return 'text-red-500'
}
