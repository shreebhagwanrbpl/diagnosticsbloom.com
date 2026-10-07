/* Client-side compatibility API backed by the central Admin MongoDB API. */
const json = async (response) => {
  const text = await response.text();
  let body = null;
  try { body = text ? JSON.parse(text) : null; } catch { body = text; }
  if (!response.ok || body?.ok === false || body?.success === false) {
    throw new Error(
      `API ${response.status}: ${
        typeof body === "string" ? body : JSON.stringify(body)
      }`
    );
  }
  return body;
};

export const db = { __adminApi: true };

export function doc(...segments) {
  return { __type: "doc", segments };
}

export function collection(...segments) {
  return { __type: "collection", segments };
}

function pageFromDocSegments(segments = []) {
  const parts = segments.filter(Boolean).map(String);
  const pagesIndex = parts.indexOf("pages");
  if (pagesIndex >= 0 && parts[pagesIndex + 1]) return {
    type: parts[pagesIndex + 1],
    pageType: parts[pagesIndex + 1],
  };

  const districtsIndex = parts.indexOf("districts");
  if (districtsIndex >= 0 && parts[districtsIndex + 1]) return {
    type: "district",
    pageType: "district",
    district: parts[districtsIndex + 1],
  };

  return {};
}

const clientDocCache = new Map();
const clientInFlight = new Map();
const CLIENT_DOC_TTL = 120 * 1000; // 2 minutes

export async function getDoc(ref) {
  const params = pageFromDocSegments(ref?.segments || []);
  const queryString = new URLSearchParams(params).toString();
  const url = `/api/site-data?${queryString}`;

  // Check cache
  const cached = clientDocCache.get(url);
  if (cached && Date.now() - cached.timestamp < CLIENT_DOC_TTL) {
    return {
      exists: () => cached.data !== null && cached.data !== undefined,
      data: () => cached.data,
    };
  }

  // Check in-flight
  if (clientInFlight.has(url)) {
    const data = await clientInFlight.get(url);
    return {
      exists: () => data !== null && data !== undefined,
      data: () => data,
    };
  }

  const promise = (async () => {
    try {
      const response = await json(
        await fetch(url, {
          headers: { Accept: "application/json" },
        })
      );
      const data = response?.data ?? response ?? null;
      clientDocCache.set(url, { data, timestamp: Date.now() });
      return data;
    } finally {
      clientInFlight.delete(url);
    }
  })();

  clientInFlight.set(url, promise);
  const data = await promise;

  return {
    exists: () => data !== null && data !== undefined,
    data: () => data,
  };
}

export async function getDocs(ref) {
  const segments = ref?.segments || [];
  const parts = segments.filter(Boolean).map(String);

  if (parts.includes("districts")) {
    const url = "/api/site-data?districts=1";
    let rows = [];

    const cached = clientDocCache.get(url);
    if (cached && Date.now() - cached.timestamp < CLIENT_DOC_TTL) {
      rows = cached.data;
    } else {
      if (clientInFlight.has(url)) {
        rows = await clientInFlight.get(url);
      } else {
        const promise = (async () => {
          try {
            const response = await json(
              await fetch(url, { headers: { Accept: "application/json" } })
            );
            const res = Array.isArray(response)
              ? response
              : response?.data?.districts ?? response?.districts ?? response?.data ?? [];
            clientDocCache.set(url, { data: res, timestamp: Date.now() });
            return res;
          } finally {
            clientInFlight.delete(url);
          }
        })();
        clientInFlight.set(url, promise);
        rows = await promise;
      }
    }

    return {
      empty: !rows || rows.length === 0,
      docs: (rows || []).map((row, index) => ({
        id: row?.id || row?.slug || `dist-${index}`,
        data: () => row,
      })),
    };
  }

  const url = "/api/catalog";
  let products = [];
  const cached = clientDocCache.get(url);
  if (cached && Date.now() - cached.timestamp < CLIENT_DOC_TTL) {
    products = cached.data;
  } else {
    if (clientInFlight.has(url)) {
      products = await clientInFlight.get(url);
    } else {
      const promise = (async () => {
        try {
          const response = await json(
            await fetch(url, { headers: { Accept: "application/json" } })
          );
          const rows =
            response?.products ?? response?.data?.products ?? response?.data ?? response;
          const res = Array.isArray(rows) ? rows : [];
          clientDocCache.set(url, { data: res, timestamp: Date.now() });
          return res;
        } finally {
          clientInFlight.delete(url);
        }
      })();
      clientInFlight.set(url, promise);
      products = await promise;
    }
  }

  return {
    empty: !products || products.length === 0,
    docs: (products || []).map((row, index) => ({
      id: row?.id || row?.uid || row?.productId || `product-${index}`,
      data: () => row,
    })),
  };
}

export async function addDoc(ref, payload = {}) {
  const parts = ref?.segments || [];
  const joined = parts.map(String).join("/");
  const endpoint = joined.includes("contactQueries")
    ? "/api/contact-query"
    : "/api/product-query";

  const response = await json(
    await fetch(endpoint, {
      method: "POST",
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
  );

  return response;
}
