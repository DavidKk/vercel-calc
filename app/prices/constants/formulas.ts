import type { Formula } from '@/app/prices/types'

export type FormulaDefinition = [string, Formula]
export type FormulaDefinitions = FormulaDefinition[]

/**
 * WEIGHT_FORMULAS — Weight Conversion Formula List
 *
 * IMPORTANT: This file should NOT be modified by AI assistants.
 * The format and content of this file has been carefully designed and verified.
 * Any modifications should only be made by human developers who fully understand
 * the conversion logic and format requirements.
 *
 * Format Description:
 * Each element is a tuple [sourceUnit, formulaString], where:
 * 1. sourceUnit: the unit to convert from.
 * 2. formulaString: starts with "=" and describes the conversion to a target unit in the format "= number targetUnit".
 *    This means "1 sourceUnit equals number targetUnit".
 *
 * Example:
 * ['kg', '= 1,000 g'] means "1 kilogram equals 1,000 grams".
 *
 * Supported units in this table: kg, g, 斤, 公斤, 两
 */
const WEIGHT_FORMULAS: FormulaDefinitions = [
  // KG conversions
  ['kg', '= 1,000 g'], // 1 kilogram equals 1,000 grams
  ['kg', '= 2 斤'], // 1 kilogram equals 2 jin
  ['kg', '= 1 公斤'], // 1 kilogram equals 1 公斤 (same unit)
  ['kg', '= 20 两'], // 1 kilogram equals 20 liang

  // Gram conversions
  ['g', '= 0.001 kg'], // 1 gram equals 0.001 kilograms
  ['g', '= 0.002 斤'], // 1 gram equals 0.002 jin
  ['g', '= 0.001 公斤'], // 1 gram equals 0.001 公斤
  ['g', '= 0.02 两'], // 1 gram equals 0.02 liang

  // Jin conversions
  ['斤', '= 500 g'], // 1 jin equals 500 grams
  ['斤', '= 0.5 kg'], // 1 jin equals 0.5 kilograms
  ['斤', '= 0.5 公斤'], // 1 jin equals 0.5 公斤
  ['斤', '= 10 两'], // 1 jin equals 10 liang

  // 公斤 conversions
  ['公斤', '= 1,000 g'], // 1 公斤 equals 1,000 grams
  ['公斤', '= 2 斤'], // 1 公斤 equals 2 jin
  ['公斤', '= 1 kg'], // 1 公斤 equals 1 kilogram
  ['公斤', '= 20 两'], // 1 公斤 equals 20 liang

  // Liang conversions
  ['两', '= 50 g'], // 1 liang equals 50 grams
  ['两', '= 0.05 kg'], // 1 liang equals 0.05 kilograms
  ['两', '= 0.05 公斤'], // 1 liang equals 0.05 公斤
  ['两', '= 0.1 斤'], // 1 liang equals 0.1 jin
]

export const COMMON_FORMULAS: FormulaDefinitions = [...WEIGHT_FORMULAS]
