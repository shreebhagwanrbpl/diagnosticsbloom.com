import { fetchAllDynamicProducts, normalizeProduct } from "@/lib/fetchProducts";

export async function fetchDocCached(path) {
  try {
    const response = await fetch(
      `/api/site-data?path=${encodeURIComponent(path)}`,
      { cache: "no-store" }
    );
    const body = await response.json();
    if (!response.ok || body?.ok === false) {
      throw new Error(body?.error || `API ${response.status}`);
    }
    return body;
  } catch (error) {
    console.error(`[data-fetcher] ${path}`, error);
    return null;
  }
}

export { fetchAllDynamicProducts, normalizeProduct };

export async function fetchHomeData() {
  return fetchDocCached("__website__/pages/home");
}

export async function fetchContactData() {
  return fetchDocCached("__website__/pages/contact");
}

export async function fetchServicesData() {
  return fetchDocCached("__website__/pages/services");
}

export async function fetchDistrictData(district) {
  return fetchDocCached(
    `__website__/districts/${encodeURIComponent(district || "")}`
  );
}

export async function fetchAllDistricts() {
  try {
    const response = await fetch("/api/site-data?districts=1", {
      cache: "no-store",
    });
    const body = await response.json();
    if (!response.ok || body?.ok === false) return [];
    return Array.isArray(body)
      ? body
      : body?.data?.districts ?? body?.districts ?? body?.data ?? [];
  } catch (error) {
    console.error("[data-fetcher] districts", error);
    return [];
  }
}

export const fetchActiveDistricts = fetchAllDistricts;

export function subscribeToCatalog(callback, intervalMs = 60000) {
  let stopped = false;
  let timer = null;

  const load = async () => {
    try {
      const products = await fetchAllDynamicProducts();
      if (!stopped && typeof callback === "function") {
        callback(products);
      }
    } catch (error) {
      console.error("[data-fetcher] catalog sync", error);
    }

    if (!stopped) {
      timer = setTimeout(load, intervalMs);
    }
  };

  load();

  return () => {
    stopped = true;
    if (timer) clearTimeout(timer);
  };
}
