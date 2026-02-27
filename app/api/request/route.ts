import { NextResponse } from "next/server"

// API route kept for validation/alternative integrations.
// Form submits directly to Web3Forms from client (recommended for free tier).
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { fullName, email, message } = body
    if (!fullName || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 })
    }
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
