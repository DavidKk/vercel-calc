export enum PriceLevel {
  LOW = 1,
  REASONABLE = 2,
  HIGH = 3,
  FAMILY_TREASURE = 4,
}

/**
 * Formula type - a string that starts with '='
 */
export type Formula = `=${string}`

/**
 * Check if a value is a valid PriceLevel
 * @param value The value to check
 * @returns True if the value is a valid PriceLevel, false otherwise
 */
export function isPriceLevel(value: any): value is PriceLevel {
  return Object.values(PriceLevel).includes(value)
}

/**
 * Check if a value is a formula (starts with '=')
 * @param value The value to check
 * @returns True if the value is a formula, false otherwise
 */
export function isFormula(value: string): value is Formula {
  return value.startsWith('=')
}

/**
 * Convert price level to display text
 * @param level The price level as number
 * @returns The price level text in English
 */
export function getPriceLevelText(level: PriceLevel | null) {
  if (!(level && isPriceLevel(level))) {
    return ''
  }

  switch (level) {
    case PriceLevel.LOW:
      return 'Low'
    case PriceLevel.REASONABLE:
      return 'Reasonable'
    case PriceLevel.HIGH:
      return 'High'
    case PriceLevel.FAMILY_TREASURE:
      return 'Overpriced'
  }
}
