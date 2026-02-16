import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { fullName, email, phone, company, country, productInterest, quantity, message } = body

    // Validate required fields
    if (!fullName || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 })
    }

    // Log the request (in production, send email via service like Resend, SendGrid, etc.)
    console.log("=== NEW PRODUCT REQUEST ===")
    console.log(`Name: ${fullName}`)
    console.log(`Email: ${email}`)
    console.log(`Phone: ${phone || "N/A"}`)
    console.log(`Company: ${company || "N/A"}`)
    console.log(`Country: ${country || "N/A"}`)
    console.log(`Product: ${productInterest || "N/A"}`)
    console.log(`Quantity: ${quantity || "N/A"}`)
    console.log(`Message: ${message}`)
    console.log("===========================")

    // In production, integrate an email service here, e.g.:
    // await resend.emails.send({
    //   from: 'CHINA Trading <noreply@chinatrading.com>',
    //   to: ['sales@chinatrading.com'],
    //   subject: `New Product Request from ${fullName}`,
    //   html: `...email template...`,
    // })

    return NextResponse.json({ success: true, message: "Request submitted successfully" })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
