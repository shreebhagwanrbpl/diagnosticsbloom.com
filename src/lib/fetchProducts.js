import { makeSlug } from "@/lib/catalog-utils";

function normalizeProduct(item, defaultCategory = "") {
  if (!item || typeof item !== "object") return null;

  const title = String(
    item.title ||
    item.name ||
    item.productName ||
    item.itemName ||
    ""
  ).trim();

  if (!title) return null;

  const rawSlug =
    item.slug ||
    item.productSlug ||
    item.itemSlug ||
    makeSlug(title);

  const category =
    item.category ||
    item.categoryName ||
    defaultCategory ||
    "";

  const subCategory =
    item.subCategory ||
    item["sub category"] ||
    item.subCategoryName ||
    "";

  const description =
    item.desc ||
    item.description ||
    item.detail ||
    item.summary ||
    "";

  const image =
    item.image ||
    item.imgUrl ||
    item.imageUrl ||
    (Array.isArray(item.images) && item.images[0]) ||
    "";

  const images =
    Array.isArray(item.images) && item.images.length
      ? item.images
      : image
        ? [image]
        : [];

  const features =
    Array.isArray(item.features)
      ? item.features.filter(Boolean)
      : typeof item.features === "string"
        ? item.features.split(",").map((x) => x.trim()).filter(Boolean)
        : [];

  return {
    ...item,
    id: item.uid || item.id || item.categoryProductId || rawSlug,
    uid: item.uid || item.id || rawSlug,
    productId: item.productId || item.uid || item.id || rawSlug,
    categoryProductId: item.categoryProductId || "",
    title,
    name: title,
    slug: rawSlug,
    category,
    subCategory,
    description,
    desc: description,
    price: item.price || "",
    capacity: item.capacity || "",
    throughput: item.throughput || "",
    instrument: item.instrument || "",
    model: item.model || "",
    usage: item.usage || "",
    brand: item.brand || "",
    parameters: item.parameters || "",
    automation: item.automation || "",
    availability: item.availability || item.status || "",
    size: item.size || "",
    features,
    specs: item.specs && typeof item.specs === "object" ? item.specs : null,
    badge: item.badge || item.tag || "",
    status: item.status || item.availability || "",
    image,
    images,
    video: item.video || "",
    pdf: item.pdf || "",
    isPublished: item.isPublished !== false,
  };
}

export { normalizeProduct };

// Client-side cache for dynamic products
let clientProductsCache = null;
let clientProductsCacheTime = 0;
let inFlightCatalogPromise = null;
const CLIENT_CACHE_TTL = 120 * 1000; // 2 minutes

export async function fetchAllDynamicProducts(forceRefresh = false) {
  // 1. Check in-memory cache if not forced
  if (!forceRefresh && clientProductsCache && (Date.now() - clientProductsCacheTime < CLIENT_CACHE_TTL)) {
    return clientProductsCache;
  }

  // 2. Check in-flight promise to avoid duplicate parallel requests
  if (!forceRefresh && inFlightCatalogPromise) {
    return inFlightCatalogPromise;
  }

  // 3. Check sessionStorage for instant first render if available
  if (typeof window !== "undefined" && !clientProductsCache && !forceRefresh) {
    try {
      const stored = window.sessionStorage.getItem("db_catalog_cache");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.data && Date.now() - parsed.time < CLIENT_CACHE_TTL * 2) {
          clientProductsCache = parsed.data;
          clientProductsCacheTime = parsed.time;
          // Trigger background refresh if slightly old
          if (Date.now() - parsed.time > CLIENT_CACHE_TTL) {
            setTimeout(() => fetchAllDynamicProducts(true), 10);
          }
          return clientProductsCache;
        }
      }
    } catch {
      // Ignore storage errors
    }
  }

  inFlightCatalogPromise = (async () => {
    try {
      const response = await fetch("/api/catalog", {
        headers: { Accept: "application/json" },
      });
      const body = await response.json();

      if (!response.ok || body?.ok === false) {
        throw new Error(body?.error || `Catalog API ${response.status}`);
      }

      const products =
        body?.products ??
        body?.data?.products ??
        body?.data ??
        body;

      const normalized = Array.isArray(products)
        ? products.map((item) => normalizeProduct(item)).filter(Boolean)
        : [];

      clientProductsCache = normalized;
      clientProductsCacheTime = Date.now();

      if (typeof window !== "undefined" && normalized.length > 0) {
        try {
          window.sessionStorage.setItem(
            "db_catalog_cache",
            JSON.stringify({ data: normalized, time: Date.now() })
          );
        } catch {
          // Ignore storage quota
        }
      }

      return normalized;
    } catch (error) {
      console.error("[fetchProducts] Admin catalog error:", error);
      // Fallback to cache if available
      if (clientProductsCache) return clientProductsCache;
      return [];
    } finally {
      inFlightCatalogPromise = null;
    }
  })();

  return inFlightCatalogPromise;
}
