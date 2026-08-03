import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { downloadJsonFile, downloadTextFile, triggerBrowserDownload } from "@/lib/browser-download"

describe("browser download helper", () => {
    let clickSpy: ReturnType<typeof vi.spyOn>
    let createObjectUrlSpy: ReturnType<typeof vi.spyOn>
    let revokeObjectUrlSpy: ReturnType<typeof vi.spyOn>

    beforeEach(() => {
        vi.useFakeTimers()
        Object.defineProperty(URL, "createObjectURL", { value: vi.fn(), configurable: true })
        Object.defineProperty(URL, "revokeObjectURL", { value: vi.fn(), configurable: true })
        clickSpy = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => undefined)
        createObjectUrlSpy = vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:test-url")
        revokeObjectUrlSpy = vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => undefined)
    })

    afterEach(() => {
        vi.useRealTimers()
        vi.restoreAllMocks()
        document.body.innerHTML = ""
    })

    it("appends an anchor, clicks it, removes it, and revokes the object URL", () => {
        triggerBrowserDownload("report.csv", new Blob(["a,b"], { type: "text/csv" }))

        expect(createObjectUrlSpy).toHaveBeenCalledOnce()
        expect(clickSpy).toHaveBeenCalledOnce()
        expect(document.querySelector("a[download='report.csv']")).toBeNull()

        vi.advanceTimersByTime(1000)
        expect(revokeObjectUrlSpy).toHaveBeenCalledWith("blob:test-url")
    })

    it("supports text and JSON exports", () => {
        downloadTextFile("summary.csv", "metric,value", "text/csv;charset=utf-8")
        downloadJsonFile("summary.json", { ok: true })

        expect(clickSpy).toHaveBeenCalledTimes(2)
        expect(createObjectUrlSpy).toHaveBeenCalledTimes(2)
    })
})
