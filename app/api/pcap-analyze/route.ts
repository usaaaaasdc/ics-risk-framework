import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

const PCAP_SERVICE_URL = process.env.PCAP_SERVICE_URL ?? 'http://127.0.0.1:8000'
const MAX_UPLOAD_BYTES = Number(process.env.PCAP_MAX_UPLOAD_BYTES ?? 100 * 1024 * 1024)
const MULTIPART_OVERHEAD_BYTES = 1024 * 1024
const ANALYSIS_TIMEOUT_MS = Number(process.env.PCAP_ANALYSIS_TIMEOUT_MS ?? 30_000)
const RATE_LIMIT_WINDOW_MS = Number(process.env.PCAP_RATE_LIMIT_WINDOW_MS ?? 60_000)
const RATE_LIMIT_MAX_REQUESTS = Number(process.env.PCAP_RATE_LIMIT_MAX_REQUESTS ?? 10)
const RATE_LIMIT_MAX_CLIENTS = Number(process.env.PCAP_RATE_LIMIT_MAX_CLIENTS ?? 10_000)
const ALLOWED_EXTENSIONS = new Set(['.pcap', '.pcapng', '.cap'])

const rateLimitStore = new Map<string, { count: number; resetAt: number }>()

function getClientId(request: NextRequest) {
    const forwardedFor = request.headers.get('x-forwarded-for')
    return forwardedFor?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'local'
}

function checkRateLimit(clientId: string) {
    const now = Date.now()
    const existing = rateLimitStore.get(clientId)

    if (!existing || existing.resetAt <= now) {
        if (rateLimitStore.size >= RATE_LIMIT_MAX_CLIENTS) {
            for (const [key, entry] of rateLimitStore) {
                if (entry.resetAt <= now) rateLimitStore.delete(key)
            }

            while (rateLimitStore.size >= RATE_LIMIT_MAX_CLIENTS) {
                const oldestKey = rateLimitStore.keys().next().value
                if (oldestKey === undefined) break
                rateLimitStore.delete(oldestKey)
            }
        }

        rateLimitStore.set(clientId, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
        return true
    }

    if (existing.count >= RATE_LIMIT_MAX_REQUESTS) {
        return false
    }

    existing.count += 1
    return true
}

function isAllowedFilename(filename: string) {
    const lowerName = filename.toLowerCase()
    return [...ALLOWED_EXTENSIONS].some((ext) => lowerName.endsWith(ext))
}

function safeFilename(filename: string) {
    return filename.replace(/[^\w.\- ]+/g, '_').slice(0, 160)
}

function getContentLength(request: NextRequest) {
    const value = request.headers.get('content-length')
    if (!value) return null

    const parsed = Number(value)
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : null
}

function jsonError(message: string, status: number) {
    return NextResponse.json({ error: message }, { status })
}

export async function POST(request: NextRequest) {
    const clientId = getClientId(request)
    if (!checkRateLimit(clientId)) {
        return jsonError('Too many PCAP analysis requests. Please try again later.', 429)
    }

    const contentLength = getContentLength(request)
    if (contentLength !== null && contentLength > MAX_UPLOAD_BYTES + MULTIPART_OVERHEAD_BYTES) {
        return jsonError('Uploaded request is too large.', 413)
    }

    try {
        const formData = await request.formData()
        const file = formData.get('file') as File | null

        if (!file) {
            return NextResponse.json(
                { error: 'No file uploaded.' },
                { status: 400 }
            )
        }

        if (!file.name || !isAllowedFilename(file.name)) {
            return jsonError('Unsupported file type. Accepted: .pcap, .pcapng, .cap', 400)
        }

        if (file.size > MAX_UPLOAD_BYTES) {
            return jsonError('File too large.', 413)
        }

        const pythonFormData = new FormData()
        pythonFormData.append('file', file, safeFilename(file.name))

        const controller = new AbortController()
        const timeout = setTimeout(() => controller.abort(), ANALYSIS_TIMEOUT_MS)

        let response: Response
        try {
            response = await fetch(`${PCAP_SERVICE_URL}/analyze`, {
                method: 'POST',
                body: pythonFormData,
                signal: controller.signal,
            })
        } finally {
            clearTimeout(timeout)
        }

        if (!response.ok) {
            return NextResponse.json(
                { error: 'PCAP analysis failed or the file is not supported.' },
                { status: response.status }
            )
        }

        const analysisResult = await response.json()

        return NextResponse.json({
            ...analysisResult,
            analyzed_at: new Date().toISOString(),
            filename: safeFilename(file.name),
        })

    } catch {
        return NextResponse.json(
            { error: 'PCAP analysis service is unavailable.' },
            { status: 503 }
        )
    }
}

export async function GET() {
    try {
        const health = await fetch(`${PCAP_SERVICE_URL}/health`)
        const data = await health.json()
        return NextResponse.json({ frontend: 'online', python_service: data })
    } catch {
        return NextResponse.json(
            { frontend: 'online', python_service: 'offline' },
            { status: 503 }
        )
    }
}
