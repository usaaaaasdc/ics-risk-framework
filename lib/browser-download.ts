export function triggerBrowserDownload(filename: string, blob: Blob): void {
    if (typeof document === "undefined") {
        throw new Error("Downloads require a browser document")
    }

    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    link.style.display = "none"
    document.body.appendChild(link)
    link.click()
    link.remove()

    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export function downloadTextFile(filename: string, content: string, type = "text/plain;charset=utf-8"): void {
    triggerBrowserDownload(filename, new Blob([content], { type }))
}

export function downloadJsonFile(filename: string, value: unknown): void {
    downloadTextFile(filename, JSON.stringify(value, null, 2), "application/json;charset=utf-8")
}
