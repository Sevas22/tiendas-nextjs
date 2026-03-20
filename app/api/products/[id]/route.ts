import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { rowToProduct } from "@/lib/supabase/products"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const supabase = createServerClient()
    const { data, error } = await supabase.from("products").select("*").eq("id", id).maybeSingle()
    if (error) {
      console.error(error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    if (!data) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }
    return NextResponse.json(rowToProduct(data as Parameters<typeof rowToProduct>[0]))
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
