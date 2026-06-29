import { NextRequest, NextResponse } from 'next/server'

const PCAP_SERVICE_URL = 'http://localhost:8000'

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData()
        const file = formData.get('file') as File | null

        if (!file) {
            return NextResponse.json(
                { error: 'No file uploaded.' },
                { status: 400 }
            )
        }

        const pythonFormData = new FormData()
        pythonFormData.append('file', file)

        const response = await fetch(`${PCAP_SERVICE_URL}/analyze`, {
            method: 'POST',
            body: pythonFormData,
        })

        if (!response.ok) {
            const errorText = await response.text()
            return NextResponse.json(
                { error: `PCAP service error: ${errorText}` },
                { status: response.status }
            )
        }

        const analysisResult = await response.json()

        return NextResponse.json({
            ...analysisResult,
            analyzed_at: new Date().toISOString(),
            filename: file.name,
        })

    } catch (error) {
        return NextResponse.json(
            { error: 'Python service is offline. Run: uvicorn main:app --port 8000' },
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

