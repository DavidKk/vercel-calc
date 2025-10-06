import { add, divide, multiply, subtract } from './math'

/**
 * 安全计算数学表达式
 * 支持加减乘除运算
 * @param expression 数学表达式字符串，例如 "1 + 2 * 3"
 * @returns 计算结果或 NaN（如果表达式无效）
 */
export function calculateMathExpression(expression: string): number {
  // 移除所有空格
  const cleanExpression = expression.replace(/\s+/g, '')

  // 检查表达式是否只包含数字、小数点和运算符
  if (!/^-?[\d.+*/-]+$/.test(cleanExpression)) {
    return NaN
  }

  // 检查是否有连续的运算符（允许负号）
  if (/[+*/]{2,}|[+*/]-[+*/]|[+*/]-$/.test(cleanExpression)) {
    return NaN
  }

  // 检查是否以运算符结尾（除了负号）
  if (/[+*/]$/.test(cleanExpression)) {
    return NaN
  }

  try {
    // 使用函数式方法处理运算，确保精度
    return evaluateExpression(cleanExpression)
  } catch (error) {
    return NaN
  }
}

/**
 * 计算表达式的值
 * @param expression 清理后的表达式
 * @returns 计算结果
 */
function evaluateExpression(expression: string): number {
  // 处理负号：如果表达式以负号开头，先处理它
  let expr = expression
  if (expr.startsWith('-')) {
    // 找到第一个数字并将其变为负数
    expr = expr.replace(/^-?(\d+\.?\d*)/, (match, number) => {
      return (-parseFloat(number)).toString()
    })
  }

  // 处理乘法和除法（从左到右）
  let result = expr
  while (result.includes('*') || result.includes('/')) {
    result = result.replace(/(-?\d+\.?\d*)([*/])(-?\d+\.?\d*)/, (match, a, operator, b) => {
      const numA = parseFloat(a)
      const numB = parseFloat(b)
      if (isNaN(numA) || isNaN(numB)) return match

      if (operator === '*') {
        return multiply(numA, numB).toString()
      } else {
        if (numB === 0) throw new Error('Division by zero')
        return divide(numA, numB).toString()
      }
    })
  }

  // 处理加法和减法（从左到右）
  while (result.includes('+') || (result.includes('-') && !/^-/.test(result))) {
    result = result.replace(/(-?\d+\.?\d*)([+-])(-?\d+\.?\d*)/, (match, a, operator, b) => {
      const numA = parseFloat(a)
      const numB = parseFloat(b)
      if (isNaN(numA) || isNaN(numB)) return match

      if (operator === '+') {
        return add(numA, numB).toString()
      } else {
        return subtract(numA, numB).toString()
      }
    })
  }

  const finalResult = parseFloat(result)
  return isNaN(finalResult) ? NaN : finalResult
}
