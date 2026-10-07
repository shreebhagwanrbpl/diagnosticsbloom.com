import { NextResponse } from "next/server";
import { WEBSITE_ID, COMPANY_ID, normalizeWebsiteId, isVisibleForWebsite } from "@/lib/catalog-utils";
import { adminFetch } from "@/lib/admin-api";

export const dynamic = "force-dynamic";
export const revalidate = 60;

const headers = {
  "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
};

function response(data, status = 200) {
  return NextResponse.json(data, { status, headers });
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || searchParams.get("pageType");
    const district = searchParams.get("district") || "";
    const districts = searchParams.get("districts");
    const collection = searchParams.get("collection");
    const path = searchParams.get("path") || "";

    if (districts === "1" || type === "districts") {
      const data = await adminFetch(
        "/api/site-data",
        {},
        { type: "districts", pageType: "districts", websiteId: WEBSITE_ID, companyId: COMPANY_ID }
      );
      const rows = data?.data?.districts ?? data?.districts ?? data?.data ?? data;
      return response(Array.isArray(rows) ? rows : []);
    }

    if (type === "district" || district) {
      const data = await adminFetch(
        "/api/site-data",
        {},
        { type: "district", pageType: "district", district, websiteId: WEBSITE_ID, companyId: COMPANY_ID }
      );
      return response(data?.data ?? data ?? null);
    }

    if (collection) {
      // Product/category collections are served from the central catalog API.
      if (collection.includes("categoryproducts") || collection.includes("products")) {
        const data = await adminFetch(
          "/api/catalog",
          {},
          { websiteId: WEBSITE_ID, companyId: COMPANY_ID }
        );
        const products = data?.products ?? data?.data?.products ?? data?.data ?? data;
        return response(
          Array.isArray(products)
            ? products.filter((item) => isVisibleForWebsite(item, WEBSITE_ID)).map((item, index) => ({
                id: item.id || item.uid || item.productId || `product-${index}`,
                data: item,
              }))
            : []
        );
      }
    }

    let pageType = type;
    if (!pageType && path) {
      const parts = path.split("/").filter(Boolean);
      if (parts[0] === "__website__") pageType = parts[1];
      else if (parts[0] === "websites" && parts[3] === "pages") pageType = parts[4];
    }

    if (pageType) {
      const data = await adminFetch(
        "/api/site-data",
        {},
        { type: pageType, pageType, websiteId: WEBSITE_ID, companyId: COMPANY_ID }
      );
      return response(data?.data ?? data ?? null);
    }

    return response(null);
  } catch (error) {
    return response(
      { ok: false, error: error?.message || "Site data request failed" },
      500
    );
  }
}
