import { NextResponse } from "next/server";
import { postAdminQuery } from "@/lib/admin-api";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export async function POST(request) {
  try {
    const body = await request.json();
    const result = await postAdminQuery("/api/product-query", body);
    return NextResponse.json(
      { ok: true, ...(result || {}) },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error?.message || "Product query failed" },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}
