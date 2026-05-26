import { NextResponse } from "next/server"
import { createAnonymousServerClient } from "@/lib/supabase/server"
import { mapPublicProduct } from "@/lib/supabase/mappers"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get("type") as "catalog" | "store" | null
  if (type !== "catalog" && type !== "store") {
    return NextResponse.json({ error: "Invalid type" }, { status: 400 })
  }
  try {
    const supabase = createAnonymousServerClient()
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("type", type)
      .eq("status", "active")
      .is("deleted_at", null)
      .order("created_at", { ascending: false })
    if (error) {
      console.error(error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    const products = (data || []).map(mapPublicProduct)
    return NextResponse.json(products)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
