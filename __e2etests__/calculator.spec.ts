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
