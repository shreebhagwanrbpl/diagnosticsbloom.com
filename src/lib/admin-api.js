import "server-only";

import { WEBSITE_ID, COMPANY_ID } from "./catalog-utils";

export const ADMIN_API_BASE_URL = (
  process.env.ADMIN_API_BASE_URL ||
  process.env.ADMIN_API_URL ||
  "https://admin.rajbiosis.app"
).replace(/\/+$/, "");

function buildUrl(pathname, params = {}) {
  const path = String(pathname || "");
  const url = new URL(
    `${ADMIN_API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`
  );

  const query = {
    websiteId: WEBSITE_ID,
    companyId: COMPANY_ID,
    ...params,
  };

  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  }

  return url;
}

// In-memory cache for server-side Admin API requests to make dynamic data blazing fast
const serverCache = new Map();
const inFlightRequests = new Map();
const CACHE_TTL_MS = 60 * 1000; // 60 seconds TTL

export async function adminFetch(pathname, options = {}, params = {}) {
  const isGet = !options.method || options.method.toUpperCase() === "GET";
  const url = buildUrl(pathname, params).toString();
  const cacheKey = `${url}_${JSON.stringify(options.headers || {})}`;

  // Check in-memory cache for GET requests
  if (isGet) {
    const cached = serverCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return cached.data;
    }

    // Reuse in-flight request to avoid duplicate network calls
    if (inFlightRequests.has(cacheKey)) {
      return inFlightRequests.get(cacheKey);
    }
  }

  const fetchPromise = (async () => {
    try {
      const response = await fetch(url, {
        ...options,
        next: { revalidate: 60 },
        headers: {
          Accept: "application/json",
          ...(options.headers || {}),
        },
      });

      const text = await response.text();
      let body = null;

      try {
        body = text ? JSON.parse(text) : null;
      } catch {
        body = text;
      }

      if (
        !response.ok ||
        body?.success === false ||
        body?.ok === false
      ) {
        const message =
          typeof body === "string"
            ? body
            : JSON.stringify(body);
        throw new Error(`Admin API ${response.status}: ${message}`);
      }

      if (isGet && body) {
        serverCache.set(cacheKey, {
          data: body,
          timestamp: Date.now(),
        });
      }

      return body;
    } catch (err) {
      // Fallback to stale cache if external Admin API is temporarily slow/down
      if (isGet && serverCache.has(cacheKey)) {
        console.warn(`[admin-api] Serving stale cache for ${url} due to error:`, err.message);
        return serverCache.get(cacheKey).data;
      }
      throw err;
    } finally {
      if (isGet) {
        inFlightRequests.delete(cacheKey);
      }
    }
  })();

  if (isGet) {
    inFlightRequests.set(cacheKey, fetchPromise);
  }

  return fetchPromise;
}

export async function postAdminQuery(endpoint, payload = {}) {
  return adminFetch(
    endpoint,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        websiteId: WEBSITE_ID,
        companyId: COMPANY_ID,
        ...payload,
      }),
    },
    {}
  );
}

export async function fetchCatalogFromAdmin() {
  const response = await adminFetch("/api/catalog");
  const products =
    response?.products ??
    response?.data?.products ??
    response?.data ??
    response;
  return Array.isArray(products) ? products : [];
}
