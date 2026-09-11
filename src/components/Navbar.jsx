"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const pathname = usePathname();

  /* =========================================
     DISTRICT ROUTING
  ========================================= */

  const pathParts = pathname
    .split("/")
    .filter(Boolean);

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

  const makeLink = (path) => {
    if (!district) {
      return path;
    }

    if (path === "/") {
      return `/${district}`;
    }

    return `/${district}${path}`;
  };

  /* =========================================
     NAVIGATION LINKS
  ========================================= */

  const navLinks = [
    {
      name: "Home",
      path: "/",
    },
    {
      name: "About",
      path: "/about",
    },
    {
      name: "Services",
      path: "/services",
    },
    {
      name: "Products",
      path: "/items",
    },
    {
      name: "Contact",
      path: "/contact",
    },
  ];

  return (
    <header
      className="
        site-navbar
        sticky
        top-0
        z-50
        w-full
        border-b
        border-[#CFE1CF]
        bg-white/95
        backdrop-blur-xl
        shadow-sm
      "
      style={{
        color: "#193522",
      }}
    >
      {/* =====================================
          DESKTOP / MAIN NAVBAR
      ===================================== */}

      <div
        className="
          container-custom
          flex
          h-20
          items-center
          justify-between
        "
      >
        {/* ===================================
            LOGO
        =================================== */}

        <Link
          href={makeLink("/")}
          className="
            relative
            block
            h-16
            w-48
            shrink-0
            transition-transform
            duration-300
            hover:scale-105
          "
        >
          <Image
            src="/logo.png"
            alt="Raj Biosis Private Limited"
            fill
            priority
            className="
              object-contain
              object-left
            "
          />
        </Link>

        {/* ===================================
            DESKTOP NAVIGATION
        =================================== */}

        <nav
          className="
            hidden
            items-center
            gap-8
            lg:flex
          "
          style={{
            color: "#193522",
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={makeLink(link.path)}
              className="
                navbar-link
                relative
                inline-flex
                items-center
                font-semibold
                transition-all
                duration-300

                !text-[#193522]

                hover:!text-[#2F6B3C]

                after:absolute
                after:left-0
                after:-bottom-1
                after:h-[2px]
                after:w-0
                after:bg-[#2F6B3C]
                after:transition-all
                after:duration-300

                hover:after:w-full
              "
              style={{
                color: "#193522",
                WebkitTextFillColor: "#193522",
                opacity: 1,
                visibility: "visible",
              }}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* ===================================
            DESKTOP GET QUOTE
        =================================== */}

        <div className="hidden lg:block">
          <Link href={makeLink("/contact")}>
            <button
              type="button"
              className="
                rounded-xl
                bg-[#2F6B3C]
                px-6
                py-3
                font-semibold
                !text-white
                shadow-md
                transition-all
                duration-300
                hover:bg-[#193522]
                hover:shadow-xl
                hover:shadow-[#2F6B3C]/20
              "
              style={{
                color: "#ffffff",
                WebkitTextFillColor: "#ffffff",
                opacity: 1,
                visibility: "visible",
              }}
            >
              Get Quote
            </button>
          </Link>
        </div>

        {/* ===================================
            MOBILE MENU BUTTON
        =================================== */}

        <button
          type="button"
          aria-label={
            menuOpen
              ? "Close Menu"
              : "Open Menu"
          }
          aria-expanded={menuOpen}
          onClick={() =>
            setMenuOpen(!menuOpen)
          }
          className="
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-xl
            border
            border-[#CFE1CF]
            bg-[#EAF4E8]
            transition-all
            duration-300
            hover:bg-[#E1EFDF]
            lg:hidden
          "
        >
          {menuOpen ? (
            <X
              size={26}
              style={{
                color: "#2F6B3C",
                stroke: "#2F6B3C",
                opacity: 1,
              }}
            />
          ) : (
            <Menu
              size={26}
              style={{
                color: "#2F6B3C",
                stroke: "#2F6B3C",
                opacity: 1,
              }}
            />
          )}
        </button>
      </div>

      {/* =====================================
          MOBILE MENU
      ===================================== */}

      <div
        className={`
          overflow-hidden
          transition-all
          duration-300
          lg:hidden

          ${menuOpen
            ? "max-h-[500px]"
            : "max-h-0"
          }
        `}
      >
        <div
          className="
            border-t
            border-[#CFE1CF]
            bg-white
            px-6
            py-6
          "
        >
          <nav
            className="
              flex
              flex-col
              gap-5
            "
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={makeLink(link.path)}
                onClick={() =>
                  setMenuOpen(false)
                }
                className="
                  navbar-mobile-link
                  font-semibold
                  transition-all
                  duration-300
                  hover:translate-x-1
                  hover:!text-[#2F6B3C]
                  !text-[#193522]
                "
                style={{
                  color: "#193522",
                  WebkitTextFillColor: "#193522",
                  opacity: 1,
                  visibility: "visible",
                }}
              >
                {link.name}
              </Link>
            ))}

            {/* =============================
                MOBILE GET QUOTE
            ============================= */}

            <Link
              href={makeLink("/contact")}
              onClick={() =>
                setMenuOpen(false)
              }
            >
              <button
                type="button"
                className="
                  mt-2
                  w-full
                  rounded-xl
                  bg-[#2F6B3C]
                  py-3
                  font-semibold
                  !text-white
                  transition-all
                  duration-300
                  hover:bg-[#193522]
                "
                style={{
                  color: "#ffffff",
                  WebkitTextFillColor: "#ffffff",
                  opacity: 1,
                  visibility: "visible",
                }}
              >
                Get Quote
              </button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}