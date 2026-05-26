import { NextResponse } from "next/server"
import { getPublicProductDetail } from "@/lib/supabase/public-product-detail"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const product = await getPublicProductDetail(id)
    if (!product) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }
    return NextResponse.json(product)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
