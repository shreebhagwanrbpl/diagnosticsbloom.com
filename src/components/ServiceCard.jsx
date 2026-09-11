import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function ServiceCard({
  icon,
  title,
  description,
  badge,
  turnaround,
  highlights = [],
  loading = false,
  makeLink = (p) => p,
}) {
  if (loading) {
    return (
      <div className="animate-pulse rounded-3xl border border-[#CFE1CF] bg-white p-8 shadow-md">
        <div className="mb-6 h-14 w-14 rounded-2xl bg-[#E1EFDF]" />
        <div className="mb-4 h-7 w-3/4 rounded bg-[#D8EAD5]" />
        <div className="space-y-3">
          <div className="h-4 rounded bg-[#E1EFDF]" />
          <div className="h-4 w-11/12 rounded bg-[#E1EFDF]" />
          <div className="h-4 w-8/12 rounded bg-[#E1EFDF]" />
        </div>
      </div>
    );
  }

  return (
    <div className="group relative flex flex-col justify-between rounded-3xl border border-[#CFE1CF] bg-white p-8 shadow-md transition-all duration-300 hover:-translate-y-2 hover:border-[#2F6B3C]/50 hover:shadow-2xl hover:shadow-[#2F6B3C]/15">
      <div>
        {/* Top bar with Icon & Badge */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#E1EFDF] to-[#EAF4E8] text-[#2F6B3C] transition-all duration-300 group-hover:bg-[#2F6B3C] group-hover:!text-white group-hover:scale-105 icon-hover-surface shadow-sm">
            {icon}
          </div>

          {badge && (
            <span className="rounded-full border border-[#2F6B3C]/20 bg-[#EAF4E8] px-3 py-1 text-xs font-bold text-[#193522]">
              {badge}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="mb-3 text-2xl font-bold text-[#193522] transition-colors duration-300 group-hover:text-[#2F6B3C]">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm sm:text-base leading-relaxed text-[#657566]">
          {description}
        </p>

        {/* Highlights List if present */}
        {highlights && highlights.length > 0 && (
          <ul className="mt-6 space-y-2.5 border-t border-[#CFE1CF]/60 pt-5 text-sm text-[#657566]">
            {highlights.map((item, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#2F6B3C] shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Footer Link */}
      <div className="mt-8 flex items-center justify-between border-t border-[#CFE1CF]/40 pt-4">
        {turnaround ? (
          <span className="text-xs font-semibold text-[#193522]">
            SLA: <strong className="text-[#2F6B3C]">{turnaround}</strong>
          </span>
        ) : (
          <span className="text-xs font-semibold text-[#657566]">Certified Quality</span>
        )}

        <Link
          href={makeLink("/contact")}
          className="inline-flex items-center gap-1.5 text-sm font-bold text-[#2F6B3C] transition-all group-hover:translate-x-1 group-hover:text-[#193522]"
        >
          <span>Book Service</span>
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}