import { fetchActiveDistricts, fetchFullCatalog } from "@/lib/data-fetcher-server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function sitemap() {
  const baseUrl = "https://diagnosticsbloom.com";
  const urls = [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/about`, lastModified: new Date() },
    { url: `${baseUrl}/services`, lastModified: new Date() },
    { url: `${baseUrl}/contact`, lastModified: new Date() },
    { url: `${baseUrl}/items`, lastModified: new Date() },
  ];

  try {
    const [districts, products] = await Promise.all([
      fetchActiveDistricts(),
      fetchFullCatalog(),
    ]);

    for (const district of districts) {
      const slug = district?.slug || district?.id;
      if (!slug) continue;
      for (const page of ["", "/about", "/services", "/contact", "/items"]) {
        urls.push({ url: `${baseUrl}/${slug}${page}`, lastModified: new Date() });
      }
    }

    for (const product of products) {
      if (!product?.slug) continue;
      urls.push({ url: `${baseUrl}/items/${product.slug}`, lastModified: new Date() });
      for (const district of districts) {
        const d = district?.slug || district?.id;
        if (d) urls.push({ url: `${baseUrl}/${d}/items/${product.slug}`, lastModified: new Date() });
      }
    }
  } catch (error) {
    console.error("Sitemap error:", error);
  }

  return urls;
}
