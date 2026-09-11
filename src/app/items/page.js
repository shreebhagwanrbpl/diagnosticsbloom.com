"use client";

import { useEffect, useState, useMemo, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import PageBanner from "@/components/PageBanner";
import SectionTitle from "@/components/SectionTitle";
import ProductCard from "@/components/ProductCard";
import ContactForm from "@/components/ContactForm";
import { fetchAllDynamicProducts, normalizeProduct } from "@/lib/fetchProducts";
import { subscribeToCatalog } from "@/lib/data-fetcher";
import { Search, X, Filter, Package, ShieldCheck, ArrowRight, Loader2 } from "lucide-react";

function ProductsContent({ city }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlCategory = searchParams ? (searchParams.get("category") || searchParams.get("cat")) : null;

  const pathParts = pathname.split("/").filter(Boolean);
  const staticRoutes = ["about", "services", "items", "contact", "products"];
  const district =
    pathParts.length > 0 && !staticRoutes.includes(pathParts[0])
      ? pathParts[0]
      : null;

  const makeLink = (path) => {
    if (!district) return path;
    if (path === "/") return `/${district}`;
    if (path.startsWith("/items?")) {
      return `/${district}${path}`;
    }
    return `/${district}${path.startsWith("/") ? path : `/${path}`}`;
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }

    let isMounted = true;

    const loadInitialProducts = async () => {
      try {
        const fetched = await fetchAllDynamicProducts();
        if (isMounted && fetched && fetched.length > 0) {
          setProducts(fetched);
        }
      } catch (err) {
        console.error("Error loading dynamic products:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadInitialProducts();

    // Subscribe to real-time catalog changes from Firestore
    const unsubscribe = subscribeToCatalog((updatedCatalog) => {
      if (isMounted && Array.isArray(updatedCatalog) && updatedCatalog.length > 0) {
        const normalized = updatedCatalog
          .map((item) => normalizeProduct(item))
          .filter(Boolean);

        if (normalized.length > 0) {
          setProducts(normalized);
        }
      }
    });

    return () => {
      isMounted = false;
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const categoriesList = useMemo(() => {
    const setCat = new Set(["All Categories"]);
    products.forEach((p) => {
      if (p.category && String(p.category).trim()) {
        setCat.add(String(p.category).trim());
      }
    });
    return Array.from(setCat);
  }, [products]);

  // Sync category from URL search params when changed
  useEffect(() => {
    if (urlCategory && typeof urlCategory === "string" && urlCategory.trim()) {
      const decoded = decodeURIComponent(urlCategory.trim());
      setSelectedCategory(decoded);
    }
  }, [urlCategory]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === "All Categories" ||
        (product.category && product.category.toLowerCase().trim() === selectedCategory.toLowerCase().trim()) ||
        (product.subCategory && product.subCategory.toLowerCase().trim() === selectedCategory.toLowerCase().trim());

      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        (product.title && product.title.toLowerCase().includes(q)) ||
        (product.description && product.description.toLowerCase().includes(q)) ||
        (product.category && product.category.toLowerCase().includes(q)) ||
        (product.brand && product.brand.toLowerCase().includes(q)) ||
        (product.model && product.model.toLowerCase().includes(q));

      return matchesCategory && matchesQuery;
    });
  }, [products, selectedCategory, searchQuery]);

  return (
    <div className="bg-[#F7FBF6]/40 text-[#193522]">
      {/* Banner */}
      <PageBanner
        badge="Product Inventory"
        title={city ? `Diagnostic Equipment Collection in ${city}` : "Diagnostic Equipment Collection"}
        subtitle="Explore our certified catalog of clinical chemistry analyzers, hematology counters, PCR systems, patient monitors, and laboratory consumables."
      />

      {/* Main Catalog Section */}
      <section className="section-padding bg-gradient-to-b from-white via-[#F7FBF6] to-[#EAF4E8]">
        <div className="container-custom">
          {/* Controls Bar - Sticky directly below Navbar */}
          <div className="sticky top-20 z-40 rounded-2xl sm:rounded-3xl border border-[#CFE1CF] bg-white/95 backdrop-blur-xl p-4 sm:p-5 shadow-lg shadow-black/5 transition-all">
            <div className="grid gap-4 md:grid-cols-12 items-center">
              {/* Search Box */}
              <div className="md:col-span-5 relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2F6B3C]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by equipment name, model, or parameter..."
                  className="w-full rounded-xl border border-[#CFE1CF] bg-[#F7FBF6]/60 pl-10 pr-10 py-2.5 sm:py-3 text-xs sm:text-sm text-[#193522] transition-all focus:border-[#2F6B3C] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2F6B3C]/20"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#657566] hover:text-[#2F6B3C]"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* Category Filter Pills */}
              <div className="md:col-span-7 flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
                <Filter size={16} className="text-[#2F6B3C] shrink-0 mr-1" />
                {categoriesList.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`whitespace-nowrap rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                      selectedCategory.toLowerCase().trim() === cat.toLowerCase().trim()
                        ? "bg-[#2F6B3C] !text-white shadow-md shadow-[#2F6B3C]/30"
                        : "bg-[#F7FBF6] border border-[#CFE1CF] text-[#657566] hover:bg-[#E1EFDF]"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Results Count & Clear Button */}
            <div className="mt-3 flex items-center justify-between border-t border-[#CFE1CF]/40 pt-3 text-xs font-semibold text-[#657566]">
              <span>
                Showing <strong className="text-[#2F6B3C] font-bold">{filteredProducts.length}</strong> of {products.length} instruments
                {selectedCategory !== "All Categories" && (
                  <span className="ml-1 text-[#2F6B3C]">in &ldquo;{selectedCategory}&rdquo;</span>
                )}
              </span>

              {(selectedCategory !== "All Categories" || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedCategory("All Categories");
                    setSearchQuery("");
                  }}
                  className="text-[#2F6B3C] font-bold hover:underline"
                >
                  Reset all filters
                </button>
              )}
            </div>
          </div>

          {/* Grid of Products */}
          {filteredProducts.length === 0 ? (
            <div className="mt-16 text-center rounded-3xl border border-[#CFE1CF] bg-white p-16 shadow-sm">
              <Package size={48} className="mx-auto text-[#2F6B3C]/60 mb-4 animate-bounce" />
              <h3 className="text-2xl font-bold text-[#193522]">No Instruments Found</h3>
              <p className="mt-2 text-sm text-[#657566]">
                Try adjusting your search keyword or selecting a different equipment category.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory("All Categories");
                  setSearchQuery("");
                }}
                className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-[#2F6B3C] px-6 py-3 text-sm font-bold !text-white shadow-md hover:bg-[#193522]"
              >
                Clear Search Filters
              </button>
            </div>
          ) : (
            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id || product.slug}
                  product={product}
                  makeLink={makeLink}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Bulk Procurement Banner */}
      <section className="section-padding bg-white border-t border-[#CFE1CF]/60">
        <div className="container-custom">
          <div className="rounded-3xl border border-[#CFE1CF] bg-gradient-to-r from-[#F7FBF6] via-[#EAF4E8] to-[#E1EFDF] p-8 sm:p-12 shadow-lg">
            <div className="grid lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#2F6B3C]/30 bg-white px-4 py-1.5 text-xs font-bold text-[#193522] uppercase tracking-wider">
                  <ShieldCheck size={16} className="text-[#2F6B3C]" /> Bulk Hospital Orders & Tenders
                </span>

                <h3 className="mt-4 text-3xl font-black text-[#193522]">
                  Procuring Equipment for New Hospital Blocks or Diagnostics Chains?
                </h3>

                <p className="mt-3 text-base text-[#657566] leading-relaxed">
                  We offer institutional discounts, customized equipment leasing plans, and complete turnkey lab setup packages with extended AMC warranties.
                </p>
              </div>

              <div className="lg:col-span-4 flex items-center justify-end">
                <a
                  href={makeLink("/contact")}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-[#2F6B3C] px-8 py-4 text-base font-bold !text-white shadow-lg transition-all hover:bg-[#193522]"
                >
                  <span className="!text-white font-bold">Request Bulk Tender Quote</span>
                  <ArrowRight size={18} className="!text-white" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function ProductsPage({ city }) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center bg-[#F7FBF6]">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-10 w-10 animate-spin text-[#2F6B3C]" />
            <p className="text-sm font-bold text-[#193522]">Loading Medical Equipment Catalog...</p>
          </div>
        </div>
      }
    >
      <ProductsContent city={city} />
    </Suspense>
  );
}