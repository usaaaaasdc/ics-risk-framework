import { afterEach, describe, expect, it, vi } from 'vitest'
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { hydrateRoot } from 'react-dom/client'
import { renderToString } from 'react-dom/server'
import { LanguageProvider, useLanguage } from '@/lib/i18n/language-context'
import { DarkModeToggle } from '@/components/dark-mode-toggle'
import AssessmentPage from '@/app/assessment/page'

vi.mock('next/navigation', () => ({
    useSearchParams: () => new URLSearchParams(),
}))

afterEach(() => {
    cleanup()
    localStorage.clear()
    document.documentElement.classList.remove('dark')
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
})

function LanguageControl() {
    const { language, setLanguage } = useLanguage()
    return <button onClick={() => setLanguage('de')}>{language}</button>
}

describe('Browser state synchronization', () => {
    it('preserves quick-config fields through assessment hydration after a direct load or refresh', async () => {
        // jsdom does not implement the layout observer used by Radix checkboxes.
        vi.stubGlobal('ResizeObserver', class {
            observe() {}
            unobserve() {}
            disconnect() {}
        })
        localStorage.setItem('app-language', 'en')
        localStorage.setItem('quick-config', JSON.stringify({
            deviceType: 'PLC', manufacturer: 'Siemens', model: 'S7-1200',
            protocols: ['Modbus TCP'], interfaces: ['Ethernet'], osVersion: 'V4.5',
            internetConnected: true, connectedToIT: true, isLegacy: true,
        }))
        const view = <LanguageProvider><AssessmentPage /></LanguageProvider>
        const container = document.createElement('div')
        container.innerHTML = renderToString(view)
        document.body.appendChild(container)
        const root = await act(async () => hydrateRoot(container, view))
        try {
            expect(localStorage.getItem('quick-config')).toBeNull()
            await waitFor(() => expect(screen.getByRole('combobox', { name: /device type/i }).textContent).toContain('PLC'))
            expect(screen.getByRole('combobox', { name: /manufacturer/i }).textContent).toContain('Siemens')
            expect(screen.getByRole('combobox', { name: /model/i }).textContent).toContain('S7-1200')
            expect(container.querySelector<HTMLInputElement>('#osVersion')?.value).toBe('V4.5')
            expect(screen.getByRole('checkbox', { name: 'Modbus TCP' }).getAttribute('aria-checked')).toBe('true')
            expect(screen.getByRole('checkbox', { name: /^Ethernet$/ }).getAttribute('aria-checked')).toBe('true')
            for (const id of ['internetConnected', 'connectedToIT', 'isLegacy']) {
                expect(container.querySelector(`#${id}`)?.getAttribute('aria-checked')).toBe('true')
            }
        } finally {
            await act(async () => root.unmount())
            container.remove()
        }
    })

    it('hydrates the saved language without a mismatch and persists user changes', async () => {
        localStorage.setItem('app-language', 'en')
        const view = <LanguageProvider><LanguageControl /></LanguageProvider>
        const container = document.createElement('div')
        container.innerHTML = renderToString(view)
        document.body.appendChild(container)
        expect(container.textContent).toBe('ar')
        const errors = vi.spyOn(console, 'error')
        const root = await act(async () => hydrateRoot(container, view))
        try {
            expect(container.textContent).toBe('en')
            fireEvent.click(screen.getByRole('button', { name: 'en' }))
            expect(container.textContent).toBe('de')
            expect(localStorage.getItem('app-language')).toBe('de')
            expect(errors).not.toHaveBeenCalled()
        } finally {
            await act(async () => root.unmount())
            container.remove()
        }
    })

    it('toggles the current DOM theme and persists it after external changes', async () => {
        render(<DarkModeToggle />)
        await act(async () => { document.documentElement.classList.add('dark') })
        await act(async () => { fireEvent.click(screen.getByRole('button')) })
        expect(document.documentElement.classList.contains('dark')).toBe(false)
        expect(localStorage.getItem('theme')).toBe('light')
        await act(async () => { fireEvent.click(screen.getByRole('button')) })
        expect(document.documentElement.classList.contains('dark')).toBe(true)
        expect(localStorage.getItem('theme')).toBe('dark')
    })
})
