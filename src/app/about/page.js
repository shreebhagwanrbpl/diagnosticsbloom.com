"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import PageBanner from "@/components/PageBanner";
import SectionTitle from "@/components/SectionTitle";
import {
  ShieldCheck,
  Building2,
  Award,
  Users,
  CheckCircle2,
  ArrowRight,
  Target,
  Eye,
  Heart,
  Activity,
  Microscope,
} from "lucide-react";

const values = [
  {
    title: "Uncompromising Accuracy",
    desc: "We adhere strictly to NABL and ISO 13485 calibration guidelines so healthcare providers can diagnose patients with absolute confidence.",
    icon: Award,
  },
  {
    title: "24/7 Rapid Field Support",
    desc: "Our nationwide network of factory-trained biomedical engineers ensures zero diagnostic downtime for hospitals and ICUs.",
    icon: ShieldCheck,
  },
  {
    title: "Innovation & Technology",
    desc: "We partner with leading global medical device manufacturers to bring automated, AI-assisted diagnostic analyzers to Indian laboratories.",
    icon: Microscope,
  },
  {
    title: "Customer-Centric Integrity",
    desc: "Transparent pricing, comprehensive AMC warranty terms, and dedicated after-sales support form the cornerstone of our long-term client relationships.",
    icon: Heart,
  },
];

const milestones = [
  { year: "2014", title: "Company Foundation", desc: "Started operations as a specialized medical equipment supplier in Jaipur, India." },
  { year: "2017", title: "NABL Calibration Unit", desc: "Expanded into certified calibration & testing services for pathology analyzers." },
  { year: "2020", title: "Cold-Chain Reagent Logistics", desc: "Launched dedicated temperature-monitored reagent distribution across North India." },
  { year: "2024+", title: "5,000+ Healthcare Partners", desc: "Serving top multispecialty hospitals, diagnostic chains, and medical institutions." },
];

export default function AboutPage() {
  const pathname = usePathname();
  const pathParts = pathname.split("/").filter(Boolean);
  const staticRoutes = ["about", "services", "products", "contact", "items"];
  const district =
    pathParts.length > 0 && !staticRoutes.includes(pathParts[0])
      ? pathParts[0]
      : "";

  const makeLink = (path) => {
    if (!district) return path;
    if (path === "/") return `/${district}`;
    return `/${district}${path}`;
  };
  return (
    <div className="bg-[#F7FBF6]/40 text-[#193522]">
      {/* Banner */}
      <PageBanner
        badge="Who We Are"
        title="Building Better Diagnostic Workflows"
        subtitle="Empowering healthcare professionals through state-of-the-art biomedical instruments, NABL-traceable calibration, and 24/7 technical engineering support."
      />

      {/* Main Story Section */}
      <section className="section-padding bg-gradient-to-b from-white via-[#F7FBF6] to-[#EAF4E8]">
        <div className="container-custom">
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            {/* Left Image Graphic */}
            <div className="lg:col-span-6 relative">
              <div className="relative overflow-hidden rounded-[36px] border border-[#CFE1CF] bg-gradient-to-br from-[#EAF4E8] via-white to-[#E1EFDF] p-2.5 sm:p-3 shadow-2xl shadow-[#2F6B3C]/15">
                <Image
                  src="/diagnostic-machine.jpg"
                  alt="State-of-the-art automated clinical chemistry analyzer and medical laboratory diagnostic machine"
                  width={1000}
                  height={750}
                  priority
                  className="w-full h-auto rounded-[28px] object-cover transition duration-500 hover:scale-[1.02]"
                />
              </div>

              {/* Floating Stat Badge */}
              <div className="absolute -bottom-6 -right-6 hidden sm:flex items-center gap-4 rounded-3xl border border-[#CFE1CF] bg-white p-6 shadow-2xl">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#2F6B3C] text-white font-black text-2xl">
                  10+
                </div>
                <div>
                  <h4 className="text-lg font-bold text-[#193522]">Years Experience</h4>
                  <p className="text-xs text-[#657566]">Trusted Biomedical Partner</p>
                </div>
              </div>
            </div>

            {/* Right Story Text */}
            <div className="lg:col-span-6">
              <SectionTitle
                badge="Our Legacy"
                title="Trusted Partner in Medical & Diagnostic Engineering"
                description="Raj Biosis Private Limited  was founded with a singular mission: to provide Indian hospitals and laboratories with reliable, world-class diagnostic technology backed by instant field service."
              />

              <div className="mt-8 space-y-4 text-base sm:text-lg leading-relaxed text-[#657566]">
                <p>
                  Over the past decade, we have grown from a regional equipment supplier into a nationwide biomedical solution provider. We specialize in fully automated clinical chemistry analyzers, hematology counters, PCR systems, and ICU patient monitoring setups.
                </p>

                <p>
                  Our strength lies not only in our high-precision product portfolio, but in our certified engineering team. We ensure that every instrument delivered operates at peak calibration accuracy and complies with international medical safety standards.
                </p>
              </div>

              <div className="mt-8 grid sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 rounded-2xl border border-[#CFE1CF] bg-white p-4 shadow-sm">
                  <CheckCircle2 size={20} className="text-[#2F6B3C] shrink-0" />
                  <span className="text-sm font-bold text-[#193522]">NABL Traceable QC</span>
                </div>
                <div className="flex items-center gap-3 rounded-2xl border border-[#CFE1CF] bg-white p-4 shadow-sm">
                  <CheckCircle2 size={20} className="text-[#2F6B3C] shrink-0" />
                  <span className="text-sm font-bold text-[#193522]">2-Hour SLA Maintenance</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="section-padding bg-white border-y border-[#CFE1CF]/60">
        <div className="container-custom">
          <SectionTitle
            badge="Strategic Purpose"
            title="Driven by Purpose, Guided by Science"
            description="Our organizational commitment is built upon clear diagnostic benchmarks and patient-first engineering."
            center
          />

          <div className="mt-16 grid gap-8 md:grid-cols-2">
            <div className="rounded-3xl border border-[#CFE1CF] bg-gradient-to-br from-[#F7FBF6] to-white p-8 sm:p-10 shadow-md">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#2F6B3C] !text-white shadow-md icon-hover-surface">
                <Target size={28} />
              </div>

              <h3 className="text-2xl font-bold text-[#193522]">Our Mission</h3>

              <p className="mt-4 text-base leading-relaxed text-[#657566]">
                To empower healthcare facilities with state-of-the-art diagnostic tools, zero-downtime maintenance contracts, and continuous technical training—ensuring every patient receives accurate, timely lab results.
              </p>

              <ul className="mt-6 space-y-2.5 text-sm text-[#657566]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-[#2F6B3C]" />
                  <span>Deliver certified automated analyzers nationwide</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-[#2F6B3C]" />
                  <span>Maintain guaranteed 24/7 service response SLAs</span>
                </li>
              </ul>
            </div>

            <div className="rounded-3xl border border-[#CFE1CF] bg-gradient-to-br from-[#EAF4E8] to-white p-8 sm:p-10 shadow-md">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#193522] !text-white shadow-md icon-hover-surface">
                <Eye size={28} />
              </div>

              <h3 className="text-2xl font-bold text-[#193522]">Our Vision</h3>

              <p className="mt-4 text-base leading-relaxed text-[#657566]">
                To be recognized as India's premier biomedical technology and calibration infrastructure company, setting the benchmark for precision, innovation, and customer support in diagnostic healthcare.
              </p>

              <ul className="mt-6 space-y-2.5 text-sm text-[#657566]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-[#2F6B3C]" />
                  <span>Expand cold-chain distribution to every tier-2 & tier-3 city</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-[#2F6B3C]" />
                  <span>Pioneer AI-assisted remote analyzer diagnostics</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Grid */}
      <section className="section-padding bg-gradient-to-b from-[#EAF4E8] via-white to-[#F7FBF6]">
        <div className="container-custom">
          <SectionTitle
            badge="Our Foundation"
            title="Core Values That Drive Our Engineering"
            description="Every instrument we calibrate and every hospital we support reflects our dedication to these four pillars."
            center
          />

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {values.map((val, idx) => {
              const Icon = val.icon;
              return (
                <div
                  key={idx}
                  className="group rounded-3xl border border-[#CFE1CF] bg-white p-8 shadow-md transition-all duration-300 hover:-translate-y-2 hover:border-[#2F6B3C]/40 hover:shadow-xl"
                >
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E1EFDF] text-[#2F6B3C] transition-colors group-hover:bg-[#2F6B3C] group-hover:!text-white icon-hover-surface">
                    <Icon size={28} />
                  </div>

                  <h4 className="text-xl font-bold text-[#193522] group-hover:text-[#2F6B3C] transition-colors">
                    {val.title}
                  </h4>

                  <p className="mt-3 text-sm leading-relaxed text-[#657566]">
                    {val.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Growth Milestones Timeline */}
      <section className="section-padding bg-white border-t border-[#CFE1CF]/60">
        <div className="container-custom">
          <SectionTitle
            badge="Company Timeline"
            title="Milestones in Biomedical Excellence"
            description="A journey of constant expansion, technological upgrades, and unwavering customer satisfaction."
            center
          />

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {milestones.map((m, idx) => (
              <div
                key={idx}
                className="relative overflow-hidden rounded-3xl border border-[#CFE1CF] bg-[#F7FBF6] p-8 shadow-sm transition-all hover:border-[#2F6B3C]/50 hover:shadow-md"
              >
                <span className="text-4xl font-black text-[#2F6B3C]">
                  {m.year}
                </span>
                <h4 className="mt-4 text-xl font-bold text-[#193522]">{m.title}</h4>
                <p className="mt-2 text-xs sm:text-sm text-[#657566] leading-relaxed">
                  {m.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-[#193522] via-[#24572F] to-[#193522] py-16 text-white text-center shadow-xl">
        <div className="container-custom max-w-4xl">
          <h2
            className="text-3xl sm:text-4xl font-black !text-white"
            style={{
              color: "#ffffff",
              WebkitTextFillColor: "#ffffff",
            }}
          >
            Ready to Upgrade Your Laboratory Technology?
          </h2>
          <p
            className="mt-4 text-base sm:text-lg !text-[#DDEBDD]"
            style={{
              color: "#DDEBDD",
              WebkitTextFillColor: "#DDEBDD",
            }}
          >
            Consult with our biomedical engineering specialists for custom equipment recommendations and instant pricing.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href={makeLink("/contact")}
              className="inline-flex items-center gap-2 rounded-2xl bg-[#2F6B3C] px-8 py-4 text-base font-bold !text-white shadow-xl shadow-[#2F6B3C]/30 transition-all hover:bg-[#193522] border border-[#6E9F65]/40"
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
                Contact Engineering Team
              </span>
              <ArrowRight
                size={18}
                className="!text-white"
                style={{
                  color: "#ffffff",
                  stroke: "#ffffff",
                }}
              />
            </Link>

            <Link
              href={makeLink("/items")}
              className="inline-flex items-center gap-2 rounded-2xl border border-white/40 bg-white/15 backdrop-blur-md px-8 py-4 text-base font-bold !text-white shadow-md transition-all hover:bg-white/25"
              style={{
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
                Browse Equipment Catalog
              </span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}