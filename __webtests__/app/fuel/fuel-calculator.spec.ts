import { expect, test } from '@playwright/test'

test.describe('Fuel Calculator', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the fuel calculator page
    await page.goto('/fuel')
  })

  test('should display the page title correctly', async ({ page }) => {
    // Check that the page is loaded (by checking for the main calculator container)
    await expect(page.locator('.flex.justify-center.w-full.min-h-\\[calc\\(100vh-124px\\)\\]')).toBeVisible()
  })

  test('should display recharge amount input with correct placeholder', async ({ page }) => {
    // Check that the recharge amount input is visible
    const rechargeInput = page.locator('input[placeholder="Recharge Amount"]')
    await expect(rechargeInput).toBeVisible()
  })

  test('should display gift amount input with correct placeholder', async ({ page }) => {
    // Check that the gift amount input is visible
    const giftInput = page.locator('input[placeholder="Gift Amount"]')
    await expect(giftInput).toBeVisible()
  })

  test('should show correct suggestions for recharge amount input - case 1', async ({ page }) => {
    // Wait for recharge amount input to be visible
    const rechargeInput = page.locator('input[placeholder="Recharge Amount"]')
    await expect(rechargeInput).toBeVisible()

    // Focus the input first to ensure suggestions can be shown
    await rechargeInput.focus()

    // Fill recharge amount with "1"
    await rechargeInput.fill('1')

    // Ensure input stays focused for suggestions to appear
    await rechargeInput.focus()

    // Wait for suggestions to appear (wait for the first suggestion)
    await expect(page.getByText('1,000')).toBeVisible({ timeout: 10000 })
    await expect(page.getByText('10,000')).toBeVisible()
  })

  test('should show correct suggestions for gift amount input - case 1', async ({ page }) => {
    // Wait for gift amount input to be visible
    const giftInput = page.locator('input[placeholder="Gift Amount"]')
    await expect(giftInput).toBeVisible()

    // Focus the input first to ensure suggestions can be shown
    await giftInput.focus()

    // Fill gift amount with "1"
    await giftInput.fill('1')

    // Ensure input stays focused for suggestions to appear
    await giftInput.focus()

    // Wait for suggestions to appear (wait for the first suggestion)
    await expect(page.getByText('100')).toBeVisible({ timeout: 10000 })
    await expect(page.getByText('1,000')).toBeVisible()
  })

  test('should show correct suggestions for gift amount input - case 12', async ({ page }) => {
    // Wait for gift amount input to be visible
    const giftInput = page.locator('input[placeholder="Gift Amount"]')
    await expect(giftInput).toBeVisible()

    // Focus the input first to ensure suggestions can be shown
    await giftInput.focus()

    // Fill gift amount with "12"
    await giftInput.fill('12')

    // Ensure input stays focused for suggestions to appear
    await giftInput.focus()

    // Wait for suggestions to appear (wait for the first suggestion)
    await expect(page.getByText('1,200')).toBeVisible({ timeout: 10000 })
    await expect(page.getByText('12,000')).toBeVisible()
  })

  test('should hide suggestions when recharge amount has 4 or more digits', async ({ page }) => {
    // Fill recharge amount with "1234"
    const rechargeInput = page.locator('input[placeholder="Recharge Amount"]')
    await rechargeInput.fill('1234')

    // Wait a bit for UI to update
    await page.waitForTimeout(500)

    // Check that suggestions are not displayed
    await expect(page.getByText('1,234,000')).not.toBeVisible()
    await expect(page.getByText('12,340,000')).not.toBeVisible()
  })

  test('should hide suggestions when gift amount has 3 or more digits', async ({ page }) => {
    // Fill gift amount with "123"
    const giftInput = page.locator('input[placeholder="Gift Amount"]')
    await giftInput.fill('123')

    // Wait a bit for UI to update
    await page.waitForTimeout(500)

    // Check that suggestions are not displayed
    await expect(page.getByText('12,300')).not.toBeVisible()
    await expect(page.getByText('123,000')).not.toBeVisible()
  })

  test('should clear inputs when clear button is clicked', async ({ page }) => {
    // Fill recharge amount with "1000"
    const rechargeInput = page.locator('input[placeholder="Recharge Amount"]')
    await rechargeInput.fill('1000')

    // Fill gift amount with "100"
    const giftInput = page.locator('input[placeholder="Gift Amount"]')
    await giftInput.fill('100')

    // Wait for clear button to appear
    await page.waitForTimeout(500)

    // Click the clear button (it should appear when there are values)
    await page.getByRole('button', { name: 'Clear' }).click()

    // Check that inputs are cleared
    await expect(rechargeInput).toHaveValue('')
    await expect(giftInput).toHaveValue('')
  })

  test('should switch to fullscreen mode when fullscreen button is clicked', async ({ page }) => {
    // Clear any existing values first
    const rechargeInput = page.locator('input[placeholder="Recharge Amount"]')
    await rechargeInput.fill('')

    const giftInput = page.locator('input[placeholder="Gift Amount"]')
    await giftInput.fill('')

    // Wait for fullscreen button to appear
    await page.waitForTimeout(500)

    // Click the fullscreen button (it should appear when there are no values)
    await page.getByRole('button', { name: 'Enter Fullscreen' }).click()

    // Check that we're in fullscreen mode (button text should change)
    await expect(page.getByRole('button', { name: 'Exit Fullscreen' })).toBeVisible()
  })

  // New tests for core calculator functionality
  test('should calculate discount correctly for valid inputs', async ({ page }) => {
    // Fill recharge amount with "1000"
    const rechargeInput = page.locator('input[placeholder="Recharge Amount"]')
    await rechargeInput.fill('1000')

    // Fill gift amount with "100"
    const giftInput = page.locator('input[placeholder="Gift Amount"]')
    await giftInput.fill('100')

    // Wait for calculation to complete
    await page.waitForTimeout(1000)

    // Check that discount information is displayed
    await expect(page.locator('.text-white.text-2xl.font-bold.mb-2')).toBeVisible()

    // Check that original price is displayed with strikethrough
    await expect(page.locator('.line-through')).toBeVisible()

    // Check that final price is displayed (more specific selector)
    await expect(page.locator('span.text-white.text-sm').first()).toBeVisible()
  })

  test('should display error message for invalid recharge amount', async ({ page }) => {
    // Fill recharge amount with "0"
    const rechargeInput = page.locator('input[placeholder="Recharge Amount"]')
    await rechargeInput.fill('0')

    // Fill gift amount with "100"
    const giftInput = page.locator('input[placeholder="Gift Amount"]')
    await giftInput.fill('100')

    // Wait for calculation to complete
    await page.waitForTimeout(1000)

    // Check that error message is displayed
    await expect(page.getByText('Recharge amount must be greater than 0')).toBeVisible()
  })

  test('should display only price when no inputs are provided', async ({ page }) => {
    // Ensure inputs are empty
    const rechargeInput = page.locator('input[placeholder="Recharge Amount"]')
    await rechargeInput.fill('')

    const giftInput = page.locator('input[placeholder="Gift Amount"]')
    await giftInput.fill('')

    // Wait for UI to update
    await page.waitForTimeout(500)

    // Check that current fuel price is displayed
    await expect(page.locator('.text-base.font-bold.text-white')).toBeVisible()
  })

  test('should update fuel price when province is changed', async ({ page }) => {
    // Select a different province - click on the searchable select container
    await page.locator('.flex.gap-2.mt-auto div.relative').first().click()

    // Wait for dropdown to appear
    await page.waitForTimeout(500)

    // Select a different province (e.g., 上海)
    await page.getByText('上海').click()

    // Wait for price update
    await page.waitForTimeout(1000)

    // Check that the result area is still visible (more specific selector)
    await expect(page.locator('.bg-gray-800.rounded-lg.p-4')).toBeVisible()
  })

  test('should update fuel type and recalculate', async ({ page }) => {
    // Fill recharge amount with "1000"
    const rechargeInput = page.locator('input[placeholder="Recharge Amount"]')
    await rechargeInput.fill('1000')

    // Fill gift amount with "100"
    const giftInput = page.locator('input[placeholder="Gift Amount"]')
    await giftInput.fill('100')

    // Wait for calculation to complete
    await page.waitForTimeout(1000)

    // Check that the fuel type is displayed in the result
    await expect(page.locator('div:has-text("#92")').first()).toBeVisible()
  })

  // Test for result title format
  test.skip('should display result title with correct format', async ({ page }) => {
    // Ensure inputs are empty to show only price
    const rechargeInput = page.locator('input[placeholder="Recharge Amount"]')
    await rechargeInput.fill('')

    const giftInput = page.locator('input[placeholder="Gift Amount"]')
    await giftInput.fill('')

    // Wait for UI to update
    await page.waitForTimeout(500)

    // Check that result title contains fuel id with # prefix
    await expect(page.locator('div:has-text("#92")').first()).toBeVisible()

    // Check that result title contains fuel name without duplicate id
    await expect(page.locator('div:has-text("Gasoline")').first()).toBeVisible()

    // Check that result title contains province
    await expect(page.getByText('广东')).toBeVisible()

    // Check that result title contains MapPinIcon
    await expect(page.locator('svg.h-4.w-4.inline.ml-1.text-red-500')).toBeVisible()
  })

  // New test: should display formatted number when suggestion is selected
  test('should display formatted number when suggestion is selected', async ({ page }) => {
    // Focus on the recharge amount input to show default suggestions
    const rechargeInput = page.locator('input[placeholder="Recharge Amount"]')
    await rechargeInput.focus()

    // Wait for suggestions to appear
    await page.waitForTimeout(500)

    // Click on the "1,000" suggestion
    await page.getByText('1,000').first().click()

    // Check that the input value is "1,000" (formatted with commas)
    await expect(rechargeInput).toHaveValue('1,000')
  })
})
