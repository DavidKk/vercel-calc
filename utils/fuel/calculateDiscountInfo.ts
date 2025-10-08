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

/**
 * Calculate discount percentage based on original and final price
 * @param originalPrice Original price
 * @param finalPrice Final price after discount
 * @returns Discount percentage (0-100)
 */
export function calculateDiscountPercentage(originalPrice: number, finalPrice: number) {
  if (originalPrice <= 0) return 0
  const discount = ((originalPrice - finalPrice) / originalPrice) * 100
  return Math.max(0, Math.min(100, discount)) // Ensure discount is between 0 and 100
}

/**
 * Get discount percentage description (e.g., "9折")
 * @param originalPrice Original price
 * @param finalPrice Final price after discount
 * @returns Chinese discount description (e.g., "9.0折")
 */
export function getDiscountPercentageDescription(originalPrice: number, finalPrice: number) {
  const discountPercentage = calculateDiscountPercentage(originalPrice, finalPrice)
  // Convert to Chinese discount format (e.g., 90% -> 9折)
  // In Chinese discount system, if you pay 90% of original price, it's called 9折
  const chineseDiscount = ((100 - discountPercentage) / 10).toFixed(1)
  return `${chineseDiscount}折`
}
