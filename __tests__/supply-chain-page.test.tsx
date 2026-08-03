import React from "react"
import { fireEvent, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { LanguageProvider } from "@/lib/i18n/language-context"
import SupplyChainPage from "@/app/supply-chain/page"

vi.mock("recharts", () => ({
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div data-testid="responsive-container">{children}</div>,
    BarChart: ({ children }: { children: React.ReactNode }) => <div data-testid="bar-chart">{children}</div>,
    Bar: () => <div data-testid="bar" />,
    XAxis: () => <div data-testid="x-axis" />,
    YAxis: () => <div data-testid="y-axis" />,
    CartesianGrid: () => <div data-testid="grid" />,
    Tooltip: () => <div data-testid="tooltip" />,
    Legend: () => <div data-testid="legend" />,
}))

function renderPage() {
    return render(
        <LanguageProvider>
            <SupplyChainPage />
        </LanguageProvider>,
    )
}

describe("Supply Chain page", () => {
    beforeEach(() => {
        localStorage.setItem("app-language", "en")
    })

    it("shows a single-vendor profile when one vendor is selected", async () => {
        renderPage()

        fireEvent.click(await screen.findByRole("button", { name: "Siemens" }))

        expect(await screen.findByRole("heading", { name: "Siemens" })).toBeTruthy()
        expect(screen.getByText("Trust Score")).toBeTruthy()
        expect(screen.getByText("CVE History")).toBeTruthy()
        expect(screen.getByText("Major Security Incidents")).toBeTruthy()
        expect(screen.queryByText("Select one vendor to view its profile, or select two or more vendors to compare.")).toBeNull()
    })

    it("allows comparison after selecting two vendors", async () => {
        renderPage()

        fireEvent.click(await screen.findByRole("button", { name: "Siemens" }))
        fireEvent.click(screen.getByRole("button", { name: "Rockwell Automation" }))
        fireEvent.click(screen.getByRole("button", { name: "Compare (2)" }))

        expect(await screen.findByText("Comparison Results")).toBeTruthy()
        expect(screen.getByText("Trust Score Comparison")).toBeTruthy()
    })

    it("returns to the empty state after reset", async () => {
        renderPage()

        fireEvent.click(await screen.findByRole("button", { name: "Siemens" }))
        fireEvent.click(screen.getByRole("button", { name: "Reset" }))

        expect(await screen.findByText("Select one vendor to view its profile, or select two or more vendors to compare.")).toBeTruthy()
    })
})
