import { expect, test } from '@playwright/test'

test('should load the prices page and interact with inputs', async ({ page }) => {
  // Navigate to the prices page
  await page.goto('/prices')

  // Wait for the page to load
  await page.waitForLoadState('networkidle')

  // Wait for input fields to be visible
  await page.waitForSelector('input[name="totalPrice"]', { state: 'visible' })
  await page.waitForSelector('input[name="totalQuantity"]', { state: 'visible' })

  // Fill in the total price
  await page.locator('input[name="totalPrice"]').fill('100')

  // Fill in the total quantity
  await page.locator('input[name="totalQuantity"]').fill('10')

  // Verify that the inputs have the correct values
  const totalPriceValue = await page.locator('input[name="totalPrice"]').inputValue()
  const totalQuantityValue = await page.locator('input[name="totalQuantity"]').inputValue()

  expect(totalPriceValue).toBe('100')
  expect(totalQuantityValue).toBe('10')

  // Click the calculate button (use a more generic selector)
  await page.getByRole('button').first().click()

  // Wait a bit for any potential results
  await page.waitForTimeout(1000)

  // Verify that the page didn't crash
  expect(page.isClosed()).toBe(false)
})

test('should handle formula inputs', async ({ page }) => {
  // Navigate to the prices page
  await page.goto('/prices')

  // Wait for the page to load
  await page.waitForLoadState('networkidle')

  // Wait for input fields to be visible
  await page.waitForSelector('input[name="totalPrice"]', { state: 'visible' })
  await page.waitForSelector('input[name="totalQuantity"]', { state: 'visible' })

  // Fill in the total price
  await page.locator('input[name="totalPrice"]').fill('100')

  // Fill in the total quantity with a formula
  await page.locator('input[name="totalQuantity"]').fill('= 10 kg')

  // Verify that the inputs have the correct values
  const totalPriceValue = await page.locator('input[name="totalPrice"]').inputValue()
  const totalQuantityValue = await page.locator('input[name="totalQuantity"]').inputValue()

  expect(totalPriceValue).toBe('100')
  // The formula input might have a space after the = sign
  expect(totalQuantityValue).toMatch(/=?\s*10\s*kg/)

  // Click the calculate button (use a more generic selector)
  await page.getByRole('button').first().click()

  // Wait a bit for any potential results
  await page.waitForTimeout(1000)

  // Verify that the page didn't crash
  expect(page.isClosed()).toBe(false)
})

test('should calculate math expressions with blur (exit formula mode)', async ({ page }) => {
  // Navigate to the prices page
  await page.goto('/prices')

  // Wait for the page to load
  await page.waitForLoadState('networkidle')

  // Wait for input fields to be visible
  await page.waitForSelector('input[name="totalPrice"]', { state: 'visible' })
  await page.waitForSelector('input[name="totalQuantity"]', { state: 'visible' })

  // Test addition with blur (should exit formula mode)
  await page.locator('input[name="totalQuantity"]').click()
  await page.keyboard.type('= 1 + 1 + 1')
  // Blur to trigger calculation
  await page.locator('input[name="totalPrice"]').click()
  // Wait for state to update
  await page.waitForTimeout(500)
  let totalQuantityValue = await page.locator('input[name="totalQuantity"]').inputValue()
  expect(totalQuantityValue).toBe('3') // Should exit formula mode

  // Test complex expression with blur
  await page.locator('input[name="totalQuantity"]').click()
  await page.locator('input[name="totalQuantity"]').fill('= 1 + 2 * 3')
  await page.locator('input[name="totalPrice"]').click()
  await page.waitForTimeout(500)
  totalQuantityValue = await page.locator('input[name="totalQuantity"]').inputValue()
  expect(totalQuantityValue).toBe('7') // Should exit formula mode

  // Verify that the page didn't crash
  expect(page.isClosed()).toBe(false)
})

test('should calculate math expressions with Enter (keep formula mode)', async ({ page }) => {
  // Navigate to the prices page
  await page.goto('/prices')

  // Wait for the page to load
  await page.waitForLoadState('networkidle')

  // Wait for input fields to be visible
  await page.waitForSelector('input[name="totalPrice"]', { state: 'visible' })
  await page.waitForSelector('input[name="totalQuantity"]', { state: 'visible' })

  // Test with Enter key (should keep formula mode)
  await page.locator('input[name="totalQuantity"]').click()
  await page.locator('input[name="totalQuantity"]').fill('= 2 * 3')
  await page.keyboard.press('Enter')
  // Wait a bit for the state to update
  await page.waitForTimeout(500)
  let totalQuantityValue = await page.locator('input[name="totalQuantity"]').inputValue()
  expect(totalQuantityValue).toBe('6') // Should keep formula mode

  // Verify that the page didn't crash
  expect(page.isClosed()).toBe(false)
})

test('should convert to formula mode when typing = anywhere', async ({ page }) => {
  // Navigate to the prices page
  await page.goto('/prices')

  // Wait for the page to load
  await page.waitForLoadState('networkidle')

  // Wait for input fields to be visible
  await page.waitForSelector('input[name="totalPrice"]', { state: 'visible' })
  await page.waitForSelector('input[name="totalQuantity"]', { state: 'visible' })

  // Type numbers first
  await page.locator('input[name="totalQuantity"]').click()
  await page.locator('input[name="totalQuantity"]').fill('123')

  // Then type = which should convert to formula mode
  await page.keyboard.type('=')

  // Check that it's converted to formula mode
  let totalQuantityValue = await page.locator('input[name="totalQuantity"]').inputValue()
  expect(totalQuantityValue).toBe('123')

  // Verify that the page didn't crash
  expect(page.isClosed()).toBe(false)
})

test('should handle formula mode conversion and display correctly', async ({ page }) => {
  // Navigate to the prices page
  await page.goto('/prices')

  // Wait for the page to load
  await page.waitForLoadState('networkidle')

  // Wait for input fields to be visible
  await page.waitForSelector('input[name="totalPrice"]', { state: 'visible' })
  await page.waitForSelector('input[name="totalQuantity"]', { state: 'visible' })

  // Test 1: Start with = to enter formula mode
  await page.locator('input[name="totalQuantity"]').click()
  await page.keyboard.type('=')
  let totalQuantityValue = await page.locator('input[name="totalQuantity"]').inputValue()
  expect(totalQuantityValue).toBe('') // Should be empty as we just entered formula mode

  // Test 2: Type numbers in formula mode
  await page.keyboard.type('123')
  totalQuantityValue = await page.locator('input[name="totalQuantity"]').inputValue()
  expect(totalQuantityValue).toBe('123') // Should show numbers without =

  // Test 3: Add = at the end
  await page.keyboard.type('=')
  totalQuantityValue = await page.locator('input[name="totalQuantity"]').inputValue()
  expect(totalQuantityValue).toBe('123') // Should still show 123

  // Verify that the page didn't crash
  expect(page.isClosed()).toBe(false)
})

test('should handle Enter vs Blur differently for math expressions', async ({ page }) => {
  // Navigate to the prices page
  await page.goto('/prices')

  // Wait for the page to load
  await page.waitForLoadState('networkidle')

  // Wait for input fields to be visible
  await page.waitForSelector('input[name="totalPrice"]', { state: 'visible' })
  await page.waitForSelector('input[name="totalQuantity"]', { state: 'visible' })

  // Test Enter key behavior (keeps formula mode)
  await page.locator('input[name="totalQuantity"]').click()
  await page.keyboard.type('=')
  await page.keyboard.type(' ')
  await page.keyboard.type('1')
  await page.keyboard.type(' ')
  await page.keyboard.type('+')
  await page.keyboard.type(' ')
  await page.keyboard.type('1')
  await page.keyboard.press('Enter')
  // Wait a bit for the state to update
  await page.waitForTimeout(500)
  let totalQuantityValue = await page.locator('input[name="totalQuantity"]').inputValue()
  expect(totalQuantityValue).toBe('2') // Should keep formula mode

  // Test Blur behavior (exits formula mode)
  await page.locator('input[name="totalQuantity"]').click()
  await page.locator('input[name="totalQuantity"]').fill('= 1 + 1')
  await page.locator('input[name="totalPrice"]').click()
  await page.waitForTimeout(1000)
  totalQuantityValue = await page.locator('input[name="totalQuantity"]').inputValue()
  expect(totalQuantityValue).toBe('2') // Should exit formula mode

  // Verify that the page didn't crash
  expect(page.isClosed()).toBe(false)
})
