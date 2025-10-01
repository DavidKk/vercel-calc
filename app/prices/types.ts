export enum PriceLevel {
  LOW = 1,
  REASONABLE = 2,
  HIGH = 3,
  FAMILY_TREASURE = 4,
}

/**
 * Check if a value is a valid PriceLevel
 * @param value The value to check
 * @returns True if the value is a valid PriceLevel, false otherwise
 */
export function isPriceLevel(value: any): value is PriceLevel {
  return Object.values(PriceLevel).includes(value)
}

/**
 * Convert price level to Chinese display text
 * @param level The price level as number
 * @returns The price level in Chinese
 * @throws Error if the price level is invalid
 */
export function getPriceLevelText(level: PriceLevel | null) {
  if (!(level && isPriceLevel(level))) {
    return ''
  }

  switch (level) {
    case PriceLevel.LOW:
      return '低价'
    case PriceLevel.REASONABLE:
      return '合适'
    case PriceLevel.HIGH:
      return '高价'
    case PriceLevel.FAMILY_TREASURE:
      return '全家宝'
  }
}
