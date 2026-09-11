"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import { usePathname } from "next/navigation";
import PageBanner from "@/components/PageBanner";
import SectionTitle from "@/components/SectionTitle";
import ServiceCard from "@/components/ServiceCard";

import {
  Microscope,
  FlaskConical,
  ShieldCheck,
  Stethoscope,
  Wrench,
  Activity,
  Award,
  Zap,
  CheckCircle2,
  FileCheck,
  Cpu,
} from "lucide-react";


// ============================================================
// STATIC WORKFLOW DATA
// ============================================================

const workflowSteps = [
  {
    step: "01",
    title: "Diagnostic Audit & Consultation",
    desc: "We analyze your hospital sample load, space constraints, and technical requirements to select the exact analyzer configuration.",
    icon: FileCheck,
  },
  {
    step: "02",
    title: "Precision Solution Engineering",
    desc: "Custom lab layout designs, power backup specifications, and reagent supply schedule formulation.",
    icon: Cpu,
  },
  {
    step: "03",
    title: "Installation & NABL Calibration",
    desc: "Certified engineers perform physical installation, IQ/OQ/PQ protocols, and NABL-traceable reference calibration.",
    icon: Award,
  },
  {
    step: "04",
    title: "24/7 SLA Field Maintenance",
    desc: "Round-the-clock technical emergency support, scheduled preventive maintenance visits, and automated reagent restocking.",
    icon: Zap,
  },
];


export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [contactInfo, setContactInfo] = useState([]);
  const [loading, setLoading] = useState(true);

  // ============================================================
  // DISTRICT / ROUTE HANDLING
  // ============================================================

  const pathname = usePathname();

  const pathParts = pathname.split("/").filter(Boolean);

  const staticRoutes = [
    "about",
    "services",
    "products",
    "contact",
    "items",
  ];

  const district =
    pathParts.length > 0 && !staticRoutes.includes(pathParts[0])
      ? pathParts[0]
      : "";

  const makeLink = (path) => {
    if (!district) return path;

    if (path === "/") {
      return `/${district}`;
    }

    return `/${district}${path}`;
  };


  // ============================================================
  // STATIC SERVICE ICONS
  // ============================================================

  const icons = [
    <Microscope size={28} key={1} />,
    <FlaskConical size={28} key={2} />,
    <ShieldCheck size={28} key={3} />,
    <Stethoscope size={28} key={4} />,
    <Wrench size={28} key={5} />,
    <Activity size={28} key={6} />,
  ];


  // ============================================================
  // FIREBASE DATA
  // ============================================================

  useEffect(() => {
    const fetchServicesAndContact = async () => {
      try {
        const [servicesSnap, contactSnap] = await Promise.all([
          getDoc(
            doc(
              db,
              "websites",
              "diagnosticsbloomcom",
              "pages",
              "services"
            )
          ),

          getDoc(
            doc(
              db,
              "websites",
              "diagnosticsbloomcom",
              "pages",
              "contact"
            )
          ),
        ]);


        // ========================================================
        // SERVICES - 100% DYNAMIC
        // ========================================================

        if (servicesSnap.exists()) {
          const data = servicesSnap.data();

          const dbServices = Array.isArray(data?.services)
            ? data.services
              .map((service, index) => ({
                id: service?.id || `service-${index}`,
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
                  service.title && service.desc
              )
            : [];

          setServices(dbServices);
        } else {
          // Firebase document nahi hai
          setServices([]);
        }


        // ========================================================
        // CONTACT - DYNAMIC
        // ========================================================

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

      } catch (error) {
        console.error(
          "Error loading services/contact data:",
          error
        );

        // Error par bhi koi static service fallback nahi
        setServices([]);
        setContactInfo([]);
      } finally {
        setLoading(false);
      }
    };

    fetchServicesAndContact();
  }, []);


  // ============================================================
  // DYNAMIC EMERGENCY PHONE
  // ============================================================

  const emergencyPhone = (() => {
    const item = contactInfo.find((c) => {
      const label = (c?.label || "").toLowerCase();

      return (
        label.includes("phone") ||
        label.includes("mobile") ||
        label.includes("helpline") ||
        label.includes("emergency") ||
        label.includes("tel") ||
        label.includes("contact")
      );
    });

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
          BANNER - STATIC
          ======================================================== */}

      <PageBanner
        badge="Technical Services"
        title="Biomedical Support From Setup to Service"
        subtitle="NABL-certified calibration, 2-hour emergency repair SLAs, cold-chain reagent distribution, and turnkey pathology setup."
      />


      {/* ========================================================
          SERVICES SECTION
          ======================================================== */}

      <section className="section-padding bg-gradient-to-b from-white via-[#F7FBF6] to-[#EAF4E8]">
        <div className="container-custom">

          <SectionTitle
            badge="Full Service Catalog"
            title="Designed Around Reliable Operations"
            description="Explore our specialized services designed to keep clinical laboratories and hospital departments operating at peak accuracy."
            center
          />


          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">

            {/* ==================================================
                LOADING
                ================================================== */}

            {loading &&
              Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={`loading-${index}`}
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
              services.map((service, index) => (
                <ServiceCard
                  key={service.id || index}
                  icon={icons[index % icons.length]}
                  title={service.title}
                  description={service.desc}
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
                    No services are currently available in our service
                    catalog. Please check back later or contact our
                    team for more information.
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
          WORKFLOW PROCESS
          STATIC - ADMIN ME SAVE NAHI HO RAHA
          ======================================================== */}

      <section className="section-padding bg-white border-y border-[#CFE1CF]/60">
        <div className="container-custom">

          <SectionTitle
            badge="Execution Framework"
            title="Our 4-Step Engineering Workflow"
            description="A systematic process ensuring seamless integration, rapid compliance, and long-term instrument reliability."
            center
          />


          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">

            {workflowSteps.map((step, index) => {
              const Icon = step.icon;

              return (
                <div
                  key={index}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-[#CFE1CF] bg-[#F7FBF6] p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-[#2F6B3C] hover:shadow-xl"
                >

                  <div>

                    <div className="flex items-center justify-between">

                      <span className="text-4xl font-black text-[#2F6B3C]/40 group-hover:text-[#2F6B3C] transition-colors">
                        {step.step}
                      </span>

                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#2F6B3C] shadow-sm">
                        <Icon size={24} />
                      </div>

                    </div>


                    <h3 className="mt-6 text-xl font-bold text-[#193522] group-hover:text-[#2F6B3C] transition-colors">
                      {step.title}
                    </h3>


                    <p className="mt-3 text-sm leading-relaxed text-[#657566]">
                      {step.desc}
                    </p>

                  </div>


                  <div className="mt-6 pt-4 border-t border-[#CFE1CF]/40">
                    <span className="text-xs font-bold text-[#193522]">
                      Phase {index + 1} Milestone
                    </span>
                  </div>

                </div>
              );
            })}

          </div>

        </div>
      </section>


      {/* ========================================================
          BREAKDOWN SLA
          STATIC CONTENT + DYNAMIC PHONE
          ======================================================== */}

      <section className="section-padding bg-gradient-to-b from-[#EAF4E8] via-white to-[#F7FBF6]">
        <div className="container-custom">

          <div className="rounded-3xl border border-[#CFE1CF] bg-gradient-to-br from-[#193522] via-[#24572F] to-[#193522] p-8 sm:p-12 text-white shadow-2xl">

            <div className="grid lg:grid-cols-12 gap-8 items-center">

              <div className="lg:col-span-8">

                <span className="inline-flex items-center gap-2 rounded-full bg-[#2F6B3C] border border-[#6E9F65]/40 px-4 py-1.5 text-xs font-bold !text-white uppercase tracking-wider">
                  <Zap size={14} className="text-[#B8D0B5]" />
                  Emergency Breakdown Helpline
                </span>


                <h3
                  className="mt-4 text-3xl font-black !text-white sm:text-4xl"
                  style={{
                    color: "#ffffff",
                    WebkitTextFillColor: "#ffffff",
                  }}
                >
                  Facing an Equipment Emergency in ICU or Lab?
                </h3>


                <p
                  className="mt-3 text-base !text-[#DDEBDD] leading-relaxed"
                  style={{
                    color: "#DDEBDD",
                    WebkitTextFillColor: "#DDEBDD",
                  }}
                >
                  Our certified field engineers are equipped with OEM
                  diagnostic kits and genuine spare parts for instant
                  on-site restoration.
                </p>


                <div className="mt-6 flex flex-wrap items-center gap-6 text-sm font-semibold !text-white">

                  <div className="flex items-center gap-2">
                    <CheckCircle2
                      size={18}
                      className="text-[#6E9F65]"
                    />

                    <span
                      className="!text-white font-medium"
                      style={{
                        color: "#ffffff",
                        WebkitTextFillColor: "#ffffff",
                      }}
                    >
                      2-Hour On-Site SLA
                    </span>
                  </div>


                  <div className="flex items-center gap-2">
                    <CheckCircle2
                      size={18}
                      className="text-[#6E9F65]"
                    />

                    <span
                      className="!text-white font-medium"
                      style={{
                        color: "#ffffff",
                        WebkitTextFillColor: "#ffffff",
                      }}
                    >
                      Loaner Analyzer Option
                    </span>
                  </div>


                  <div className="flex items-center gap-2">
                    <CheckCircle2
                      size={18}
                      className="text-[#6E9F65]"
                    />

                    <span
                      className="!text-white font-medium"
                      style={{
                        color: "#ffffff",
                        WebkitTextFillColor: "#ffffff",
                      }}
                    >
                      NABL Re-calibration Included
                    </span>
                  </div>

                </div>

              </div>


              {/* ==================================================
                  EMERGENCY DISPATCH
                  ================================================== */}

              <div className="lg:col-span-4 flex flex-col items-center justify-center text-center border-t lg:border-t-0 lg:border-l border-[#CFE1CF]/20 pt-6 lg:pt-0 lg:pl-8">

                <p className="text-xs font-bold uppercase tracking-wider !text-[#B8D0B5]">
                  Emergency Dispatch
                </p>


                {emergencyPhone ? (
                  <a
                    href={`tel:${emergencyPhone.replace(/\s+/g, "")}`}
                    className="mt-2 text-2xl font-black !text-white hover:text-[#6E9F65] transition-colors inline-block"
                    style={{
                      color: "#ffffff",
                      WebkitTextFillColor: "#ffffff",
                    }}
                  >
                    {emergencyPhone}
                  </a>
                ) : (
                  <p className="mt-2 text-sm !text-[#CFE1CF]">
                    24/7 Field Dispatch Active
                  </p>
                )}


                <Link
                  href={makeLink("/contact")}
                  className="mt-5 w-full rounded-2xl bg-[#2F6B3C] py-3.5 text-center text-sm font-bold !text-white shadow-lg transition-all hover:bg-[#193522] border border-[#6E9F65]/40"
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
                    Book Priority Repair
                  </span>
                </Link>

              </div>

            </div>

          </div>

        </div>
      </section>

    </div>
  );
}