import { configDefaults, defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
    plugins: [react()],
    test: {
        exclude: [...configDefaults.exclude, 'e2e/**', 'playwright-report/**', 'test-results/**'],
        environment: 'jsdom',
        globals: true,
        setupFiles: [],
        alias: {
            '@': path.resolve(__dirname, './'),
        },
    },
})
