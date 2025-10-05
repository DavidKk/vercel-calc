/**
 * Safe division - calculate unit price (total price divided by quantity)
 * @param dividend The dividend (total price)
 * @param divisor The divisor (quantity)
 * @returns The division result
 * @throws Error when divisor is zero
 */
export function safeDivide(dividend: number, divisor: number): number {
  if (divisor === 0) {
    return 0
  }

  return dividend / divisor
}
