"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion } from "framer-motion";

import {
  Microscope,
  FlaskConical,
  ShieldCheck,
  Stethoscope,
  Building2,
  ArrowRight,
  CheckCircle2,
  PhoneCall,
  Mail,
  Wrench,
  Activity,
  Award,
  Clock,
  HeartPulse,
  Sparkles,
  ChevronRight,
  Zap,
} from "lucide-react";

import SectionTitle from "@/components/SectionTitle";
import ServiceCard from "@/components/ServiceCard";
import ProductCard from "@/components/ProductCard";
import ContactForm from "@/components/ContactForm";
import HeroCarousel from "@/components/HeroCarousel";
import { fetchAllDynamicProducts } from "@/lib/fetchProducts";


// ============================================================
// STATIC STATS
// ============================================================

const stats = [
  {
    number: "5,000+",
    title: "Healthcare Partners",
    desc: "Hospitals & labs served nationwide",
    icon: Building2,
  },
  {
    number: "3,500+",
    title: "Products & Kits",
    desc: "Precision diagnostic instruments",
    icon: Microscope,
  },
  {
    number: "10+ Yrs",
    title: "Engineering Excellence",
    desc: "Proven biomedical leadership",
    icon: ShieldCheck,
  },
  {
    number: "99.9%",
    title: "Accuracy SLA",
    desc: "NABL & ISO certified standards",
    icon: Award,
  },
];


// ============================================================
// STATIC PILLARS
// ============================================================

const pillars = [
  {
    title: "Certified Calibration Standards",
    desc: "Every diagnostic analyzer undergoes NABL-traceable calibration to ensure precise patient diagnostics and regulatory safety.",
    icon: Award,
    badge: "ISO 13485 Certified",
  },
  {
    title: "24/7 Emergency AMC Response",
    desc: "Our nationwide team of biomedical engineers delivers rapid on-site maintenance to keep critical ICU and OT gear active.",
    icon: Zap,
    badge: "2-Hour SLA",
  },
  {
    title: "Turnkey Lab Setup & Engineering",
    desc: "From architectural workflow layout to instrument installation and staff certification, we engineer complete pathology labs.",
    icon: Building2,
    badge: "Turnkey Engineering",
  },
  {
    title: "Cold-Chain Reagent Supply",
    desc: "Strictly temperature-monitored distribution of biochemistry reagents, controls, and rapid assay kits with extended shelf life.",
    icon: FlaskConical,
    badge: "Monitored Cold Chain",
  },
];


// ============================================================
// STATIC TESTIMONIALS
// ============================================================

const testimonials = [
  {
    quote:
      "Raj Biosis transformed our central laboratory setup. Their automated analyzers increased our daily sample throughput by 40% with zero downtime.",
    author: "Dr. Arvind Sharma",
    role: "Chief Pathologist",
    institution: "Apollo Diagnostics Center",
    rating: 5,
  },
  {
    quote:
      "The 24/7 AMC response team is outstanding. When our ICU patient monitor system faced a sensor issue, their engineer arrived within 90 minutes.",
    author: "Dr. Meenakshi Sundaram",
    role: "Medical Director",
    institution: "Metro Multispecialty Hospital",
    rating: 5,
  },
  {
    quote:
      "Their cold-chain reagent delivery has never failed us. Quality control results are consistently accurate, month after month.",
    author: "Rajesh Varma",
    role: "Laboratory Operations Manager",
    institution: "LifeCare PathLabs",
    rating: 5,
  },
];


export default function Home({ city }) {
  // ============================================================
  // DYNAMIC DATA
  // ============================================================

  // Services are ONLY loaded from Firebase.
  // No static fallback.
  const [services, setServices] = useState([]);

  const [products, setProducts] = useState([]);
  const [homeData, setHomeData] = useState(null);
  const [contactInfo, setContactInfo] = useState([]);
  const [loading, setLoading] = useState(true);


  // ============================================================
  // ROUTE / DISTRICT
  // ============================================================

  const pathname = usePathname();

  const pathParts = pathname.split("/").filter(Boolean);

  const staticRoutes = [
    "about",
    "services",
    "items",
    "contact",
  ];

  const district =
    pathParts.length > 0 &&
      !staticRoutes.includes(pathParts[0])
      ? pathParts[0]
      : "";


  const locationTitle =
    city ||
    (district
      ? district.replace(/-/g, " ")
      : "");


  const makeLink = (path) => {
    if (!district) return path;

    if (path === "/") {
      return `/${district}`;
    }

    return `/${district}${path}`;
  };


  // ============================================================
  // FETCH FIREBASE DATA
  // ============================================================

  useEffect(() => {
    const fetchData = async () => {
      try {

        // ========================================================
        // HOME DATA
        // ========================================================

        try {
          const homeSnap = await getDoc(
            doc(
              db,
              "websites",
              "diagnosticsbloomcom",
              "pages",
              "home"
            )
          );

          if (homeSnap.exists()) {
            setHomeData(homeSnap.data());
          } else {
            setHomeData(null);
          }

        } catch (homeErr) {
          console.error(
            "Error fetching home data:",
            homeErr
          );

          setHomeData(null);
        }


        // ========================================================
        // CONTACT DATA
        // ========================================================

        try {
          const contactSnap = await getDoc(
            doc(
              db,
              "websites",
              "diagnosticsbloomcom",
              "pages",
              "contact"
            )
          );

          if (contactSnap.exists()) {
            const contactData = contactSnap.data();

            setContactInfo(
              Array.isArray(contactData?.contactInfo)
                ? contactData.contactInfo
                : []
            );
          } else {
            setContactInfo([]);
          }

        } catch (contactErr) {
          console.error(
            "Error fetching contact data:",
            contactErr
          );

          setContactInfo([]);
        }


        // ========================================================
        // SERVICES - 100% DYNAMIC
        // ========================================================
        //
        // Admin se currently:
        // title
        // desc
        //
        // save ho rahe hain.
        //
        // Isliye Home page par bhi sirf ye fields dynamic hain.
        //
        // IMPORTANT:
        // Koi fallbackServices nahi.
        // ========================================================

        try {
          const serviceSnap = await getDoc(
            doc(
              db,
              "websites",
              "diagnosticsbloomcom",
              "pages",
              "services"
            )
          );

          if (serviceSnap.exists()) {
            const data = serviceSnap.data();

            const dbServices = Array.isArray(data?.services)
              ? data.services
                .map((service, index) => ({
                  id:
                    service?.id ||
                    `service-${index}`,

                  title:
                    typeof service?.title === "string"
                      ? service.title.trim()
                      : "",

                  desc:
                    typeof service?.desc === "string"
                      ? service.desc.trim()
                      : "",
                }))
                .filter(
                  (service) =>
                    service.title &&
                    service.desc
                )
              : [];

            // Firebase data available
            setServices(dbServices);

          } else {
            // No document = no services
            setServices([]);
          }

        } catch (serviceErr) {
          console.error(
            "Error fetching services:",
            serviceErr
          );

          // Error = no static fallback
          setServices([]);
        }


        // ========================================================
        // PRODUCTS - DYNAMIC
        // ========================================================

        try {
          const fetchedProducts =
            await fetchAllDynamicProducts();

          // Always update, even if empty.
          setProducts(
            Array.isArray(fetchedProducts)
              ? fetchedProducts
              : []
          );

        } catch (productErr) {
          console.error(
            "Error fetching products:",
            productErr
          );

          setProducts([]);
        }

      } catch (err) {
        console.error(
          "Error loading dynamic home data:",
          err
        );

        setServices([]);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };


    fetchData();
  }, []);


  // ============================================================
  // FEATURED PRODUCTS
  // ============================================================

  const featuredProducts = products.slice(0, 3);


  // ============================================================
  // STATIC SERVICE ICONS
  // ============================================================
  // Icon Admin se save nahi ho raha,
  // isliye icon static hai.

  const serviceIcons = [
    <Microscope size={28} key={1} />,
    <Building2 size={28} key={2} />,
    <Wrench size={28} key={3} />,
    <FlaskConical size={28} key={4} />,
    <Stethoscope size={28} key={5} />,
    <Award size={28} key={6} />,
  ];


  // ============================================================
  // DYNAMIC PHONE
  // ============================================================

  const helplinePhone = (() => {
    const item = contactInfo.find(
      (c) => {
        const label =
          c?.label?.toLowerCase() || "";

        return (
          label.includes("phone") ||
          label.includes("mobile") ||
          label.includes("helpline") ||
          label.includes("contact")
        );
      }
    );

    if (!item) return "";

    if (Array.isArray(item.value)) {
      return item.value[0] || "";
    }

    return typeof item.value === "string"
      ? item.value.trim()
      : "";
  })();


  // ============================================================
  // DYNAMIC EMAIL
  // ============================================================

  const supportEmail = (() => {
    const item = contactInfo.find(
      (c) => {
        const label =
          c?.label?.toLowerCase() || "";

        return (
          label.includes("email") ||
          label.includes("mail")
        );
      }
    );

    if (!item) return "";

    if (Array.isArray(item.value)) {
      return item.value[0] || "";
    }

    return typeof item.value === "string"
      ? item.value.trim()
      : "";
  })();


  return (
    <div className="bg-[#F7FBF6]/40 text-[#193522]">

      {/* ========================================================
          HERO
          ======================================================== */}

      <HeroCarousel
        homeData={homeData}
        locationTitle={locationTitle}
        makeLink={makeLink}
      />


      {/* ========================================================
          STATS TICKER
          ======================================================== */}

      <section
        className="stats-section relative overflow-hidden py-10 shadow-inner"
        style={{
          backgroundColor: "#193522",
          color: "#ffffff",
        }}
      >

        <div
          className="stats-background absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, #193522 0%, #2F6B3C 50%, #193522 100%)",
            opacity: 1,
          }}
          aria-hidden="true"
        />

        <div className="container-custom relative z-10">

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">

            {stats.map((item, idx) => {
              const Icon = item.icon;

              return (
                <div
                  key={idx}
                  className="flex items-center gap-4"
                >

                  <div
                    className="stats-icon flex h-14 w-14 shrink-0 items-center justify-center rounded-full"
                    style={{
                      backgroundColor: "#B8D0B5",
                      border: "2px solid #8FB99A",
                    }}
                  >
                    <Icon
                      size={26}
                      strokeWidth={2.5}
                      style={{
                        color: "#2F6B3C",
                        stroke: "#2F6B3C",
                        opacity: 1,
                        visibility: "visible",
                      }}
                    />
                  </div>


                  <div className="min-w-0">

                    <h3
                      className="!m-0 text-2xl sm:text-3xl font-black tracking-tight"
                      style={{
                        color: "#FFFFFF",
                        WebkitTextFillColor: "#FFFFFF",
                        opacity: 1,
                        visibility: "visible",
                      }}
                    >
                      {item.number}
                    </h3>


                    <p
                      className="!m-0 text-xs sm:text-sm font-bold"
                      style={{
                        color: "#FFFFFF",
                        WebkitTextFillColor: "#FFFFFF",
                        opacity: 1,
                        visibility: "visible",
                      }}
                    >
                      {item.title}
                    </p>


                    <p
                      className="!m-0 text-[11px] hidden sm:block"
                      style={{
                        color: "#DDEBDD",
                        WebkitTextFillColor: "#DDEBDD",
                        opacity: 1,
                        visibility: "visible",
                      }}
                    >
                      {item.desc}
                    </p>

                  </div>

                </div>
              );
            })}

          </div>

        </div>
      </section>


      {/* ========================================================
          PILLARS / WHY CHOOSE US
          STATIC
          ======================================================== */}

      <section className="section-padding bg-gradient-to-b from-white via-[#F7FBF6] to-[#EAF4E8]">

        <div className="container-custom">

          <SectionTitle
            badge="Why Modern Labs Choose Us"
            title="Grounded in Accuracy"
            description="A grounded, natural palette paired with robust biomedical functionality."
            center
          />


          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">

            {pillars.map((pillar, index) => {
              const Icon = pillar.icon;

              return (
                <div
                  key={index}
                  className="group relative flex flex-col justify-between rounded-3xl border border-[#CFE1CF] bg-white p-8 shadow-md transition-all duration-300 hover:-translate-y-2 hover:border-[#2F6B3C]/50 hover:shadow-2xl hover:shadow-[#2F6B3C]/15"
                >

                  <div>

                    <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E1EFDF] text-[#2F6B3C] transition-all duration-300 group-hover:bg-[#2F6B3C] group-hover:!text-white group-hover:scale-110 shadow-sm icon-hover-surface">
                      <Icon size={28} />
                    </div>


                    <span className="mb-3 inline-block rounded-full bg-[#F7FBF6] border border-[#CFE1CF] px-3 py-1 text-xs font-bold text-[#193522]">
                      {pillar.badge}
                    </span>


                    <h3 className="mb-3 text-xl font-bold text-[#193522] group-hover:text-[#2F6B3C] transition-colors">
                      {pillar.title}
                    </h3>


                    <p className="text-sm leading-relaxed text-[#657566]">
                      {pillar.desc}
                    </p>

                  </div>


                  <div className="mt-8 pt-4 border-t border-[#CFE1CF]/40 flex items-center gap-2 text-xs font-bold text-[#2F6B3C]">
                    <span>Learn standard</span>
                    <ArrowRight
                      size={14}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </div>

                </div>
              );
            })}

          </div>

        </div>
      </section>


      {/* ========================================================
          FEATURED PRODUCTS
          ======================================================== */}

      <section className="section-padding bg-white border-y border-[#CFE1CF]/50">

        <div className="container-custom">

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">

            <SectionTitle
              badge="Diagnostic Inventory"
              title="Equipment Worth Exploring"
              description="Explore our curated catalog of automated clinical analyzers, PCR units, ICU patient monitors, and laboratory centrifuges."
            />


            <Link
              href={makeLink("/items")}
              className="view-products-btn inline-flex items-center gap-2 rounded-2xl bg-[#2F6B3C] px-6 py-3.5 text-sm font-bold !text-white shadow-md shadow-[#2F6B3C]/20 transition-all hover:bg-[#193522] hover:shadow-lg shrink-0"
              style={{
                backgroundColor: "#2F6B3C",
                color: "#ffffff",
              }}
            >
              <span
                className="!text-white font-bold"
                style={{
                  color: "#ffffff",
                  WebkitTextFillColor: "#ffffff",
                }}
              >
                View All Products
              </span>

              <ArrowRight
                size={16}
                className="!text-white"
                style={{
                  color: "#ffffff",
                  stroke: "#ffffff",
                }}
              />
            </Link>

          </div>


          <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">

            {featuredProducts.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                makeLink={makeLink}
              />
            ))}

          </div>

        </div>
      </section>


      {/* ========================================================
          SERVICES MATRIX
          ========================================================
          SERVICES = FIREBASE ONLY
          NO STATIC FALLBACK
          ======================================================== */}

      <section className="section-padding bg-gradient-to-b from-[#EAF4E8] via-white to-[#F7FBF6]">

        <div className="container-custom">

          <SectionTitle
            badge="Healthcare Solutions"
            title="Support Built Around Your Workflow"
            description="From NABL-certified calibration to 2-hour emergency repair response, our certified engineers support your clinical operations round the clock."
            center
          />


          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">

            {/* ==================================================
                LOADING STATE
                ================================================== */}

            {loading &&
              Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={`service-loading-${index}`}
                  className="rounded-3xl border border-[#CFE1CF] bg-white p-8 shadow-sm animate-pulse"
                >

                  <div className="h-14 w-14 rounded-2xl bg-[#EAF4E8]" />

                  <div className="mt-6 h-6 w-3/4 rounded bg-[#EAF4E8]" />

                  <div className="mt-4 space-y-3">
                    <div className="h-4 w-full rounded bg-[#EAF4E8]" />
                    <div className="h-4 w-5/6 rounded bg-[#EAF4E8]" />
                    <div className="h-4 w-2/3 rounded bg-[#EAF4E8]" />
                  </div>

                </div>
              ))}


            {/* ==================================================
                FIREBASE SERVICES
                ================================================== */}

            {!loading &&
              services.length > 0 &&
              services.map((srv, idx) => (
                <ServiceCard
                  key={srv.id || idx}
                  icon={
                    serviceIcons[
                    idx % serviceIcons.length
                    ]
                  }
                  title={srv.title}
                  description={srv.desc}
                  makeLink={makeLink}
                />
              ))}


            {/* ==================================================
                NO SERVICES FOUND
                ================================================== */}

            {!loading && services.length === 0 && (
              <div className="col-span-full flex justify-center py-2">

                <div className="w-full max-w-2xl rounded-3xl border border-[#CFE1CF] bg-white p-10 sm:p-12 text-center shadow-sm">

                  {/* Icon */}
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[#EAF4E8] text-[#2F6B3C]">
                    <Stethoscope size={36} />
                  </div>


                  {/* Title */}
                  <h3 className="mt-6 text-2xl sm:text-3xl font-black text-[#193522]">
                    No Services Found
                  </h3>


                  {/* Description */}
                  <p className="mx-auto mt-3 max-w-lg text-sm sm:text-base leading-relaxed text-[#657566]">
                    No services are currently available in our
                    service catalog. Please check back later or
                    contact our team for more information.
                  </p>


                  {/* Contact Button */}
                  <Link
                    href={makeLink("/contact")}
                    className="mt-7 inline-flex items-center justify-center rounded-2xl bg-[#2F6B3C] px-7 py-3.5 text-sm font-bold !text-white shadow-lg transition-all duration-300 hover:bg-[#193522] hover:-translate-y-0.5"
                  >
                    Contact Our Team
                  </Link>

                </div>

              </div>
            )}

          </div>

        </div>
      </section>


      {/* ========================================================
          ISO & QUALITY CERTIFICATION BANNER
          STATIC
          ======================================================== */}

      <section className="section-padding bg-[#193522] text-white relative overflow-hidden">

        <div className="pointer-events-none absolute -right-20 -bottom-20 h-96 w-96 rounded-full bg-[#2F6B3C]/20 blur-3xl" />

        <div className="container-custom relative z-10">

          <div className="grid lg:grid-cols-12 gap-12 items-center">

            <div className="lg:col-span-7">

              <span className="inline-flex items-center gap-2 rounded-full bg-[#2F6B3C]/30 border border-[#2F6B3C]/50 px-4 py-1.5 text-xs font-bold text-[#B8D0B5] uppercase tracking-wider">
                <Award size={16} />
                Quality Assurance & Compliance
              </span>


              <h2 className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
                Uncompromised Clinical Accuracy & Regulatory Standards
              </h2>


              <p className="mt-4 text-base sm:text-lg text-[#CFE1CF]/90 leading-relaxed">
                Raj Biosisstrictly adheres to international quality protocols. Every equipment installation comes with complete IQ/OQ/PQ validation documentation and certified calibration reports.
              </p>


              <div className="mt-8 grid sm:grid-cols-2 gap-4">

                <div className="rounded-2xl border border-[#CFE1CF]/20 bg-white/5 p-5 backdrop-blur-sm">

                  <h4 className="text-lg font-bold text-white flex items-center gap-2">
                    <ShieldCheck
                      size={20}
                      className="text-[#2F6B3C]"
                    />
                    ISO 13485 & CE Compliance
                  </h4>


                  <p className="mt-2 text-xs text-[#CFE1CF]/80">
                    Certified medical device quality management system for diagnostic analyzers.
                  </p>

                </div>


                <div className="rounded-2xl border border-[#CFE1CF]/20 bg-white/5 p-5 backdrop-blur-sm">

                  <h4 className="text-lg font-bold text-white flex items-center gap-2">
                    <Clock
                      size={20}
                      className="text-[#2F6B3C]"
                    />
                    2-Hour SLA Maintenance
                  </h4>


                  <p className="mt-2 text-xs text-[#CFE1CF]/80">
                    Dedicated engineer dispatch team ready for emergency hospital repairs.
                  </p>

                </div>

              </div>

            </div>


            <div className="lg:col-span-5">

              <div className="rounded-3xl border border-[#CFE1CF]/30 bg-gradient-to-br from-white/10 to-white/5 p-8 backdrop-blur-md text-center">

                <div className="mx-auto flex h-24 w-24 sm:h-28 sm:w-28 flex-col items-center justify-center rounded-full bg-gradient-to-br from-[#3F7F4D] via-[#2F6B3C] to-[#24572F] text-white shadow-2xl shadow-[#2F6B3C]/50 border-2 border-[#6E9F65]/40 p-2">

                  <span className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-none">
                    100%
                  </span>

                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#EAF4E8] mt-1">
                    Certified
                  </span>

                </div>


                <h3 className="mt-6 text-2xl font-bold text-white">
                  Compliance Guarantee
                </h3>


                <p className="mt-3 text-sm text-[#CFE1CF] leading-relaxed">
                  All instruments tested with traceable reference standards before dispatch to your medical facility.
                </p>


                <Link
                  href={makeLink("/contact")}
                  className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-[#2F6B3C] !text-white px-8 py-3.5 text-sm font-bold shadow-xl shadow-[#2F6B3C]/40 transition-all hover:bg-[#3F7F4D] hover:shadow-2xl hover:-translate-y-0.5 border border-[#6E9F65]/30"
                >
                  <span className="!text-white font-bold">
                    Request Inspection Certificate
                  </span>

                  <ArrowRight
                    size={16}
                    className="!text-white"
                  />
                </Link>

              </div>

            </div>

          </div>

        </div>
      </section>


      {/* ========================================================
          TESTIMONIALS
          STATIC
          ======================================================== */}

      <section className="section-padding bg-gradient-to-b from-white via-[#F7FBF6] to-[#EAF4E8]">

        <div className="container-custom">

          <SectionTitle
            badge="What Our Partners Say"
            title="Chosen by Diagnostic Teams"
            description="Read how healthcare professionals rely onRaj Biosisfor accurate diagnostics and uninterrupted equipment uptime."
            center
          />


          <div className="mt-16 grid gap-8 lg:grid-cols-3">

            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="flex flex-col justify-between rounded-3xl border border-[#CFE1CF] bg-white p-8 shadow-md transition-all hover:-translate-y-1 hover:shadow-xl"
              >

                <div>

                  <div className="flex gap-1 text-[#2F6B3C] mb-4">
                    {Array.from({
                      length: t.rating,
                    }).map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>


                  <p className="text-sm sm:text-base leading-relaxed text-[#657566] italic">
                    "{t.quote}"
                  </p>

                </div>


                <div className="mt-8 border-t border-[#CFE1CF]/60 pt-4 flex items-center gap-3">

                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E1EFDF] text-[#2F6B3C] font-bold text-lg">
                    {t.author.charAt(4) || "D"}
                  </div>


                  <div>

                    <h4 className="text-base font-bold text-[#193522]">
                      {t.author}
                    </h4>

                    <p className="text-xs text-[#657566]">
                      {t.role} —{" "}
                      <span className="text-[#2F6B3C] font-medium">
                        {t.institution}
                      </span>
                    </p>

                  </div>

                </div>

              </div>
            ))}

          </div>

        </div>
      </section>


      {/* ========================================================
          QUICK INQUIRY
          ======================================================== */}

      <section className="section-padding bg-gradient-to-br from-[#EAF4E8] via-white to-[#E1EFDF] border-t border-[#CFE1CF]">

        <div className="container-custom">

          <div className="grid lg:grid-cols-12 gap-12 items-center">

            <div className="lg:col-span-5">

              <SectionTitle
                badge="Direct Consultation"
                title="Planning a Purchase or Need Technical Guidance?"
                description="Our biomedical engineering consultants will analyze your laboratory requirements, recommend optimal instruments, and provide a customized quote."
              />


              <div className="mt-8 space-y-4">

                {helplinePhone && (
                  <a
                    href={`tel:${String(
                      helplinePhone
                    ).replace(/\s+/g, "")}`}
                    className="flex items-center gap-4 rounded-2xl border border-[#CFE1CF] bg-white p-4 shadow-sm hover:border-[#2F6B3C]/40 transition-colors"
                  >

                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E1EFDF] text-[#2F6B3C] shrink-0">
                      <PhoneCall size={22} />
                    </div>


                    <div>
                      <p className="text-xs font-bold text-[#657566]">
                        Direct Helpline
                      </p>

                      <p className="text-base font-bold text-[#193522]">
                        {helplinePhone}
                      </p>
                    </div>

                  </a>
                )}


                {supportEmail && (
                  <a
                    href={`mailto:${supportEmail}`}
                    className="flex items-center gap-4 rounded-2xl border border-[#CFE1CF] bg-white p-4 shadow-sm hover:border-[#2F6B3C]/40 transition-colors"
                  >

                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E1EFDF] text-[#2F6B3C] shrink-0">
                      <Mail size={22} />
                    </div>


                    <div>

                      <p className="text-xs font-bold text-[#657566]">
                        Official Email
                      </p>

                      <p className="text-base font-bold text-[#193522] break-all">
                        {supportEmail}
                      </p>

                    </div>

                  </a>
                )}

              </div>

            </div>


            <div className="lg:col-span-7">

              <ContactForm
                title="Request a Tailored Equipment Plan"
                subtitle="Fill out the form below and our equipment specialist will reach out within 2 hours."
              />

            </div>

          </div>

        </div>
      </section>

    </div>
  );
}