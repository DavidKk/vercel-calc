export enum PriceLevel {
  EXCELLENT = 1,
  GOOD = 2,
  ACCEPTABLE = 3,
  HIGH = 4,
  EXPENSIVE = 5,
  FAMILY_TREASURE = 6,
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
    case PriceLevel.EXCELLENT:
      return 'Excellent'
    case PriceLevel.GOOD:
      return 'Good'
    case PriceLevel.ACCEPTABLE:
      return 'Acceptable'
    case PriceLevel.HIGH:
      return 'High'
    case PriceLevel.EXPENSIVE:
      return 'Expensive'
    case PriceLevel.FAMILY_TREASURE:
      return 'Overpriced'
  }
}
