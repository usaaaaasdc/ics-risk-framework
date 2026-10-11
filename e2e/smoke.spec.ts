import { test, expect, type Page } from '@playwright/test'

const quickConfig = {
    deviceType: 'PLC', manufacturer: 'Siemens', model: 'S7-1200',
    protocols: ['Modbus TCP'], interfaces: ['Ethernet'], osVersion: 'V4.5',
    internetConnected: true, connectedToIT: true, isLegacy: true,
}

test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('app-language', 'en'))
})

test('home page loads and the quick-start link opens the guided assessment', async ({ page }) => {
    const response = await page.goto('/')
    expect(response?.ok()).toBe(true)
    await expect(page).toHaveTitle(/ICS-Risk Framework/)
    await expect(page.getByRole('heading', { level: 1 })).toContainText('ICS-Risk')
    await page.getByRole('link', { name: /Quick Start Guide/ }).click()
    await expect(page).toHaveURL(/\/simple-mode$/)
    await expect(page.getByRole('heading', { name: 'Simple Mode for Managers' })).toBeVisible()
})

async function expectQuickConfig(page: Page) {
    await expect(page.getByRole('heading', { name: 'Security Risk Assessment' })).toBeVisible()
    await expect(page.getByRole('combobox', { name: /Device Type/ })).toContainText('PLC')
    await expect(page.getByRole('combobox', { name: /Manufacturer/ })).toContainText('Siemens')
    await expect(page.getByRole('combobox', { name: /Model/ })).toContainText('S7-1200')
    await expect(page.locator('#osVersion')).toHaveValue('V4.5')
    await expect(page.getByRole('checkbox', { name: 'Modbus TCP', exact: true })).toBeChecked()
    await expect(page.getByRole('checkbox', { name: 'Ethernet', exact: true })).toBeChecked()
    for (const id of ['internetConnected', 'connectedToIT', 'isLegacy']) {
        await expect(page.locator(`#${id}`)).toBeChecked()
    }
    expect(await page.evaluate(() => localStorage.getItem('quick-config'))).toBeNull()
    await expect(page.getByRole('button', { name: 'Analyze Security' })).toBeEnabled()
}

for (const refresh of [false, true]) {
    test(`quick-config survives ${refresh ? 'a page refresh' : 'a direct page load'} and produces an assessment`, async ({ page }) => {
        const errors: string[] = []
        page.on('pageerror', error => errors.push(error.message))
        // Seed the handoff on every new document, including the refresh.
        await page.addInitScript(config => localStorage.setItem('quick-config', JSON.stringify(config)), quickConfig)
        const response = await page.goto('/assessment')
        expect(response?.ok()).toBe(true)
        await expectQuickConfig(page)
        if (refresh) {
            const reloaded = await page.reload()
            expect(reloaded?.ok()).toBe(true)
            await expectQuickConfig(page)
        }
        await page.getByRole('button', { name: 'Analyze Security' }).click()
        await expect(page.getByRole('heading', { name: 'Risk Score', exact: true })).toBeVisible()
        const assessment = await page.evaluate(() => JSON.parse(localStorage.getItem('lastAssessment') || 'null'))
        expect(assessment.config).toEqual(quickConfig)
        expect(assessment.result.riskScore).toEqual(expect.any(Number))
        expect(errors).toEqual([])
    })
}
