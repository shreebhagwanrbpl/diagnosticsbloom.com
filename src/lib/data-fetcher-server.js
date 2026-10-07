import "server-only";

import { cache } from "react";
import {
  COMPANY_ID,
  WEBSITE_ID,
  makeSlug,
  isVisibleForWebsite,
} from "./catalog-utils";
import {
  adminFetch,
  fetchCatalogFromAdmin,
} from "./admin-api";

const unwrap = (response) =>
  response?.data ??
  response?.pages ??
  response ??
  null;

function normalizeProduct(product = {}, index = 0) {
  const title =
    product.title ||
    product.name ||
    product.productName ||
    "Biomedical Equipment";

  const images =
    Array.isArray(product.images) && product.images.length
      ? product.images
      : product.image
        ? [product.image]
        : product.imageUrl
          ? [product.imageUrl]
          : product.imgUrl
            ? [product.imgUrl]
            : [];

  const id =
    product.id ||
    product.uid ||
    product.productId ||
    `${makeSlug(title) || "product"}-${index}`;

  return {
    ...product,
    id,
    uid: product.uid || id,
    productId: product.productId || id,
    title,
    name: title,
    slug: product.slug || makeSlug(title),
    description: product.description ?? product.desc ?? "",
    desc: product.desc ?? product.description ?? "",
    category: product.category || "Diagnostic & Laboratory Equipment",
    categoryId:
      product.categoryId ||
      product.categoryID ||
      makeSlug(product.category || "diagnostic"),
    subCategory:
      product.subCategory ||
      product.subcategory ||
      product.category ||
      "General",
    subcategoryId:
      product.subcategoryId ||
      product.subCategoryId ||
      makeSlug(
        product.subCategory ||
        product.subcategory ||
        product.category ||
        "general"
      ),
    companyId: product.companyId || COMPANY_ID,
    images,
    image: images[0] || product.image || "",
    video: product.video || "",
    pdf: product.pdf || "",
    brand: product.brand || "",
    model: product.model || "",
    capacity: product.capacity || "",
    throughput: product.throughput || "",
    instrument: product.instrument || "",
    usage: product.usage || "",
    parameters: product.parameters || "",
    automation: product.automation || "",
    availability: product.availability || "",
    size: product.size || "",
    isPublished: product.isPublished !== false,
  };
}

export const fetchDocCached = cache(async (path) => {
  const parts = String(path || "").split("/").filter(Boolean);

  if (parts[0] === "__website__") {
    const pageType = parts[1] || "";
    if (pageType) {
      return unwrap(
        await adminFetch(
          "/api/site-data",
          {},
          { type: pageType, pageType }
        )
      );
    }
  }

  if (parts[0] === "websites" && parts[2] === "pages") {
    return unwrap(
      await adminFetch(
        "/api/site-data",
        {},
        { type: parts[3], pageType: parts[3] }
      )
    );
  }

  if (parts[0] === "websites" && parts[2] === "districts") {
    return unwrap(
      await adminFetch(
        "/api/site-data",
        {},
        { type: "district", pageType: "district", district: parts[3] }
      )
    );
  }

  return null;
});

export async function fetchWebsitePage(pageType) {
  return unwrap(
    await adminFetch(
      "/api/site-data",
      {},
      { type: pageType, pageType }
    )
  );
}

export const fetchHomeData = () => fetchWebsitePage("home");
export const fetchContactData = () => fetchWebsitePage("contact");
export const fetchServicesData = () => fetchWebsitePage("services");

export async function fetchDistrictData(district) {
  if (!district) return null;
  return unwrap(
    await adminFetch(
      "/api/site-data",
      {},
      {
        type: "district",
        pageType: "district",
        district,
      }
    )
  );
}

export const fetchFullCatalog = cache(async () => {
  const products = await fetchCatalogFromAdmin();

  return products
    .filter((product) =>
      isVisibleForWebsite(product, WEBSITE_ID)
    )
    .map(normalizeProduct);
});

export async function fetchActiveDistricts() {
  const response = await adminFetch(
    "/api/site-data",
    {},
    { type: "districts", pageType: "districts" }
  );

  const rows =
    response?.data?.districts ??
    response?.districts ??
    response?.data ??
    response;

  return Array.isArray(rows)
    ? rows.map((row, index) => ({
        ...row,
        id: row.id || row.slug || `dist-${index}`,
        slug:
          row.slug ||
          row.id ||
          makeSlug(row.district || row.name || `dist-${index}`),
      }))
    : [];
}

export const fetchAllDistricts = fetchActiveDistricts;
