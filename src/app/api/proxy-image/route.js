const imageMemoryCache = new Map();
const MAX_CACHE_ITEMS = 200;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get("url");

  if (!imageUrl) {
    return new Response("Missing url parameter", { status: 400 });
  }

  // Check in-memory cache
  if (imageMemoryCache.has(imageUrl)) {
    const cached = imageMemoryCache.get(imageUrl);
    return new Response(cached.buffer, {
      status: 200,
      headers: {
        "Content-Type": cached.contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }

  try {
    const response = await fetch(imageUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      next: { revalidate: 86400 },
    });

    if (!response.ok) {
      return new Response("Failed to fetch image", { status: response.status });
    }

    const contentType = response.headers.get("content-type") || "image/jpeg";
    const arrayBuffer = await response.arrayBuffer();

    // Cache in-memory
    if (imageMemoryCache.size > MAX_CACHE_ITEMS) {
      const firstKey = imageMemoryCache.keys().next().value;
      imageMemoryCache.delete(firstKey);
    }
    imageMemoryCache.set(imageUrl, { buffer: arrayBuffer, contentType });

    return new Response(arrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Proxy image error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
