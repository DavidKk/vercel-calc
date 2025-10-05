/**
 * 校验必填字段
 * @param value 输入值
 * @param fieldName 字段名称（用于错误消息）
 * @returns true 表示校验通过，字符串表示错误消息
 */
export function validateRequired(value: string, fieldName: string): true | string {
  if (!value || value.trim() === '') {
    return `${fieldName} is required`
  }
  return true
}

/**
 * 校验数字格式
 * @param value 输入值
 * @returns true 表示校验通过，字符串表示错误消息
 */
export function validateNumber(value: string | number): true | string {
  if (typeof value === 'number') {
    return true
  }

  if (!value || value.trim() === '') {
    return 'Value is required'
  }

  // 检查负数
  if (value.startsWith('-')) {
    return 'Value cannot be negative'
  }

  // 只允许数字、逗号和句号
  if (!/^[\d.,]+$/.test(value)) {
    return 'Value can only contain numbers, commas, and periods'
  }

  // 特殊检查：验证逗号和小数点的使用是否正确
  const dotCount = (value.match(/\./g) || []).length
  const commaCount = (value.match(/,/g) || []).length

  // 检查无效的组合
  if ((dotCount > 0 && commaCount > 0 && value.indexOf(',') > value.indexOf('.')) || dotCount > 1 || commaCount > 1 || (commaCount > 0 && value.indexOf(',') === 0)) {
    // 逗号不能在开头
    return 'Value can only contain numbers, commas, and periods'
  }

  // 移除逗号以便解析
  const cleanValue = value.replace(/,/g, '')

  // 检查是否只有小数点
  if (cleanValue === '.') {
    return 'Value can only contain numbers, commas, and periods'
  }

  const numericValue = parseFloat(cleanValue)
  if (isNaN(numericValue)) {
    return 'Value can only contain numbers, commas, and periods'
  }

  // 不能是负数
  if (numericValue < 0) {
    return 'Value cannot be negative'
  }

  // 不能超过 JavaScript 最大安全整数
  if (numericValue > Number.MAX_SAFE_INTEGER) {
    return 'Value is too large'
  }

  return true
}

/**
 * 校验产品名称
 * @param name 产品名称
 * @returns true 表示校验通过，字符串表示错误消息
 */
export function validateProductName(name: string): true | string {
  if (!name || name.trim() === '') {
    return 'Product name is required'
  }

  if (name.trim().length < 2) {
    return 'Product name must be at least 2 characters'
  }

  if (name.trim().length > 50) {
    return 'Product name must be less than 50 characters'
  }

  return true
}

/**
 * 校验产品单价
 * @param price 产品单价
 * @returns true 表示校验通过，字符串表示错误消息
 */
export function validateProductUnitPrice(price: string): true | string {
  const numberValidation = validateNumber(price)
  if (numberValidation !== true) {
    // 特殊处理：为价格字段提供更具体的错误消息
    if (numberValidation === 'Value is required') {
      return 'Unit price is required'
    }
    if (numberValidation === 'Value cannot be negative') {
      return 'Price cannot be negative'
    }
    if (numberValidation === 'Value is too large') {
      return 'Price is too high'
    }
    if (numberValidation === 'Value can only contain numbers, commas, and periods') {
      return 'Price can only contain numbers, commas, and periods'
    }
    return numberValidation
  }

  // 移除逗号以便解析
  const cleanPrice = price.replace(/,/g, '')

  // 检查小数位数，最多三位小数
  const parts = cleanPrice.split('.')
  if (parts.length > 1 && parts[1].length > 3) {
    return 'Price can have at most 3 decimal places'
  }

  return true
}

/**
 * Validate unit format
 * @param unit The unit string to validate (e.g. "ml", "kg", "10 ml", "1,000.00 ml")
 * @returns True if the format is valid, string with error message otherwise
 */
export function validateUnit(unit: string): true | string {
  if (!unit || unit.trim() === '') {
    return 'Unit is required' // Empty values are invalid for unit
  }

  // Check if the unit has any leading or trailing whitespace
  if (unit !== unit.trim()) {
    return 'Unit cannot have leading or trailing whitespace' // Units with leading or trailing whitespace are invalid
  }

  // Split by spaces to handle formats like "10 kg", "1,000.00 kg"
  const parts = unit.trim().split(/\s+/)

  // If we have more than 2 parts, it's invalid
  if (parts.length > 2) {
    return 'Invalid unit format'
  }

  // If we have two parts (number and unit separated by space)
  if (parts.length === 2) {
    // First part should be a number (with optional commas and decimal)
    const numberPart = parts[0]
    // Check if it's a valid number format
    if (!validateNumberFormat(numberPart)) {
      return 'Invalid number format in unit'
    }

    // Second part should be the unit
    const unitPart = parts[1]
    // Validate the unit part - it should be a single word starting with a letter
    if (!/^\p{L}[\p{L}\p{N}]*$/u.test(unitPart)) {
      return 'Invalid unit format'
    }

    return true
  } else {
    // If no space, the whole thing should be either:
    // 1. A unit (e.g. "ml", "kg")
    // 2. A number followed by a unit (e.g. "100ml", "1,000.00kg")

    const trimmedUnit = parts[0]

    // First, try to validate as a number+unit format
    // We'll delegate to validateUnitConversion for these cases
    const conversionValidation = validateUnitConversion(trimmedUnit)
    if (conversionValidation === true) {
      return true
    }

    // Check if it's just a unit (starts with a letter)
    if (/^\p{L}[\p{L}\p{N}]*$/u.test(trimmedUnit)) {
      return true
    }

    return 'Invalid unit format'
  }
}

/**
 * Validate number format helper function
 * @param value The string to validate as a number
 * @returns True if the format is valid, false otherwise
 */
function validateNumberFormat(value: string): boolean {
  if (!value || value.trim() === '') {
    return false
  }

  // Remove commas for validation - different countries use different comma placements
  const cleanValue = value.replace(/,/g, '')
  // Check if it's a valid number after removing commas
  return /^\d+(\.\d+)?$/.test(cleanValue)
}

/**
 * Validate unit conversion format
 * @param conversion The unit conversion string to validate (e.g. "100ml" or "100 ml")
 * @returns True if the format is valid, string with error message otherwise
 */
export function validateUnitConversion(conversion: string): true | string {
  if (!conversion || conversion.trim() === '') {
    return true // Empty values are valid
  }

  const trimmed = conversion.trim()

  // Split by spaces
  const parts = trimmed.split(/\s+/)

  // If we have more than 2 parts, it's invalid
  if (parts.length > 2) {
    return 'Invalid unit conversion format'
  }

  // If we have two parts (number and unit separated by space)
  if (parts.length === 2) {
    // First part should be a number (with optional commas and decimal)
    const numberPart = parts[0]
    // Remove commas for validation - different countries use different comma placements
    const cleanNumber = numberPart.replace(/,/g, '')
    // Check if it's a valid number after removing commas
    if (!/^\d+(\.\d+)?$/.test(cleanNumber)) {
      return 'Invalid number in unit conversion'
    }

    // Second part should be the unit
    const unitPart = parts[1]
    // Use validateUnit function to validate the unit
    const unitValidation = validateUnit(unitPart)
    if (unitValidation !== true) {
      return unitValidation
    }

    return true
  } else {
    // If no space, the whole thing should be number + unit
    // Find where number ends and unit begins
    const numberAndUnit = parts[0]

    // Remove commas from the string for processing
    const cleanInput = numberAndUnit.replace(/,/g, '')

    // Find the boundary between number and unit
    let i = 0
    // Skip digits and decimal point
    while (i < cleanInput.length && (/^\d$/.test(cleanInput[i]) || cleanInput[i] === '.')) {
      i++
    }

    // The rest should be the unit
    const unitPart = cleanInput.substring(i)
    const numberPart = cleanInput.substring(0, i)

    // Validate number part - check if it's a valid number
    if (!/^\d+(\.\d+)?$/.test(numberPart)) {
      return 'Invalid number in unit conversion'
    }

    // Validate unit part
    if (unitPart.length === 0) {
      return 'Unit is required in unit conversion' // No unit
    }

    // Use validateUnit function to validate the unit
    const unitValidation = validateUnit(unitPart)
    if (unitValidation !== true) {
      return unitValidation
    }

    return true
  }
}

/**
 * Validate remark field
 * @param remark The remark string to validate
 * @returns True if the format is valid, string with error message otherwise
 */
export function validateRemark(remark: string): true | string {
  if (!remark) {
    return true // remark is optional
  }

  // Trim the remark
  const trimmedRemark = remark.trim()

  // Check length - max 200 characters
  if (trimmedRemark.length > 200) {
    return 'Remark must be less than 200 characters'
  }

  return true
}
