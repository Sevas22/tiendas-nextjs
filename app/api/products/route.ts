import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get("type") as "catalog" | "store" | null
  if (type !== "catalog" && type !== "store") {
    return NextResponse.json({ error: "Invalid type" }, { status: 400 })
  }
  try {
    const supabase = createServerClient()
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("type", type)
      .order("created_at", { ascending: false })
    if (error) {
      console.error(error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    const products = (data || []).map((row) => ({
      id: row.id,
      name: row.name,
      price: Number(row.price),
      category: row.category,
      description: row.description,
      image: row.image,
      type: row.type,
      specifications: (row.specifications as Record<string, string>) || undefined,
      techSheetUrl: row.tech_sheet_url || undefined,
      createdAt: row.created_at,
    }))
    return NextResponse.json(products)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
