import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
    testDir: './e2e',
    testMatch: '**/*.spec.ts',
    forbidOnly: !!process.env.CI,
    workers: process.env.CI ? 1 : undefined,
    reporter: [['list'], ['html', { open: 'never' }]],
    use: {
        baseURL: 'http://127.0.0.1:3137',
        trace: 'retain-on-failure',
        screenshot: 'only-on-failure',
    },
    projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
    webServer: {
        command: 'npm run start -- --hostname 127.0.0.1 --port 3137',
        url: 'http://127.0.0.1:3137',
        reuseExistingServer: false,
        timeout: 60_000,
    },
})
