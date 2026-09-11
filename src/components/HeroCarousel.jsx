"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  ArrowRight,
  PhoneCall,
  Sparkles,
  CheckCircle2,
  Image as ImageIcon,
  Film,
} from "lucide-react";

/* =========================================================
   HERO IMAGE FALLBACK ONLY
   ---------------------------------------------------------
   IMPORTANT:
   No static text fallback is used anywhere.
   These images are ONLY used when Firebase media is empty
   or a Firebase image fails to load.
========================================================= */

const FALLBACK_SLIDES = [
  {
    id: "fallback-1",
    type: "image",
    url: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1900&q=80",
  },
  {
    id: "fallback-2",
    type: "image",
    url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1900&q=80",
  },
  {
    id: "fallback-3",
    type: "image",
    url: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1900&q=80",
  },
];

/* =========================================================
   HERO CAROUSEL
========================================================= */

export default function HeroCarousel({
  homeData = null,
  locationTitle = "",
  makeLink = (path) => path,
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const [imageErrors, setImageErrors] = useState({});

  const videoRefs = useRef({});

  /* =======================================================
     PARSE DYNAMIC MEDIA
  ======================================================= */

  const parseMediaList = (data) => {
    if (!data) return [];

    const list = [];

    /* -------------------------------------------------------
       Dynamic media array
    ------------------------------------------------------- */

    if (
      Array.isArray(data.media) &&
      data.media.length > 0
    ) {
      data.media.forEach((item, idx) => {
        const url =
          typeof item === "string"
            ? item.trim()
            : item?.url?.trim?.() || item?.url;

        const type =
          item?.type ||
          (url?.match(
            /\.(mp4|webm|ogg|mov)(\?.*)?$/i
          )
            ? "video"
            : "image");

        if (url) {
          list.push({
            id: `media-${idx}`,
            type,
            url,
          });
        }
      });
    }

    /* -------------------------------------------------------
       Dynamic images array
    ------------------------------------------------------- */

    if (
      list.length === 0 &&
      Array.isArray(data.images) &&
      data.images.length > 0
    ) {
      data.images.forEach((item, idx) => {
        const url =
          typeof item === "string"
            ? item.trim()
            : item?.url?.trim?.() || item?.url;

        if (url) {
          list.push({
            id: `img-${idx}`,
            type: "image",
            url,
          });
        }
      });
    }

    /* -------------------------------------------------------
       Dynamic single image
    ------------------------------------------------------- */

    if (
      list.length === 0 &&
      (data.imageUrl || data.image)
    ) {
      const url =
        data.imageUrl?.trim?.() ||
        data.imageUrl ||
        data.image?.trim?.() ||
        data.image;

      if (url) {
        list.push({
          id: "single-img",
          type: "image",
          url,
        });
      }
    }

    /* -------------------------------------------------------
       Dynamic videos array
    ------------------------------------------------------- */

    if (
      Array.isArray(data.videos) &&
      data.videos.length > 0
    ) {
      data.videos.forEach((item, idx) => {
        const url =
          typeof item === "string"
            ? item.trim()
            : item?.url?.trim?.() || item?.url;

        if (
          url &&
          !list.some(
            (existing) =>
              existing.url === url
          )
        ) {
          list.push({
            id: `vid-${idx}`,
            type: "video",
            url,
          });
        }
      });
    }

    /* -------------------------------------------------------
       Dynamic single video
    ------------------------------------------------------- */

    if (data.videoUrl) {
      const videoUrl =
        data.videoUrl?.trim?.() ||
        data.videoUrl;

      if (
        videoUrl &&
        !list.some(
          (item) =>
            item.url === videoUrl
        )
      ) {
        list.push({
          id: "single-vid",
          type: "video",
          url: videoUrl,
        });
      }
    }

    /* -------------------------------------------------------
       Remove duplicate media
    ------------------------------------------------------- */

    const unique = [];
    const seen = new Set();

    list.forEach((item) => {
      if (!item?.url) return;

      if (seen.has(item.url)) return;

      seen.add(item.url);
      unique.push(item);
    });

    return unique;
  };

  /* =======================================================
     SLIDES
     -------------------------------------------------------
     Dynamic Firebase media first.
     Static fallback ONLY for images.
  ======================================================= */

  const dbSlides =
    parseMediaList(homeData);

  const slides =
    dbSlides.length > 0
      ? dbSlides
      : FALLBACK_SLIDES;

  /* =======================================================
     DYNAMIC HERO TEXT
     -------------------------------------------------------
     NO STATIC FALLBACKS.
     
     If Firebase field is empty:
     → empty string
     → element will not render.
  ======================================================= */

  const heroTitle =
    typeof homeData?.title === "string"
      ? homeData.title.trim()
      : "";

  const heroDescription =
    typeof homeData?.description === "string"
      ? homeData.description.trim()
      : "";

  const btn1Text =
    typeof homeData?.button1Text === "string"
      ? homeData.button1Text.trim()
      : "";

  const btn2Text =
    typeof homeData?.button2Text === "string"
      ? homeData.button2Text.trim()
      : "";

  /* =======================================================
     BUTTON LINKS
     -------------------------------------------------------
     IMPORTANT:
     Links remain STATIC.
  ======================================================= */

  const btn1Href =
    makeLink("/items");

  const btn2Href =
    makeLink("/contact");

  /* =======================================================
     AUTO PLAY
  ======================================================= */

  useEffect(() => {
    if (
      !isPlaying ||
      slides.length <= 1
    ) {
      return;
    }

    const timer = setInterval(() => {
      setCurrentSlide(
        (prev) =>
          (prev + 1) %
          slides.length
      );
    }, 5500);

    return () =>
      clearInterval(timer);
  }, [
    isPlaying,
    slides.length,
  ]);

  /* =======================================================
     SLIDE INDEX SAFETY
  ======================================================= */

  useEffect(() => {
    if (
      currentSlide >= slides.length &&
      slides.length > 0
    ) {
      setCurrentSlide(
        slides.length - 1
      );
    }
  }, [
    slides.length,
    currentSlide,
  ]);

  /* =======================================================
     VIDEO PLAY
  ======================================================= */

  useEffect(() => {
    const media =
      slides[currentSlide];

    if (
      media?.type === "video"
    ) {
      const video =
        videoRefs.current[
        currentSlide
        ];

      if (video) {
        video.currentTime = 0;

        video
          .play()
          .catch(() => { });
      }
    }
  }, [
    currentSlide,
    slides,
  ]);

  /* =======================================================
     PREVIOUS
  ======================================================= */

  const handlePrev = () => {
    if (!slides.length) return;

    setCurrentSlide(
      (prev) =>
        (prev - 1 + slides.length) %
        slides.length
    );
  };

  /* =======================================================
     NEXT
  ======================================================= */

  const handleNext = () => {
    if (!slides.length) return;

    setCurrentSlide(
      (prev) =>
        (prev + 1) %
        slides.length
    );
  };

  /* =======================================================
     TOUCH START
  ======================================================= */

  const onTouchStart = (e) => {
    setTouchEnd(null);

    setTouchStart(
      e.targetTouches[0].clientX
    );
  };

  /* =======================================================
     TOUCH MOVE
  ======================================================= */

  const onTouchMove = (e) => {
    setTouchEnd(
      e.targetTouches[0].clientX
    );
  };

  /* =======================================================
     TOUCH END
  ======================================================= */

  const onTouchEnd = () => {
    if (
      touchStart == null ||
      touchEnd == null
    ) {
      return;
    }

    const distance =
      touchStart - touchEnd;

    if (distance > 50) {
      handleNext();
    }

    if (distance < -50) {
      handlePrev();
    }
  };

  /* =======================================================
     IMAGE ERROR → FALLBACK IMAGE
  ======================================================= */

  const handleImageError = (
    event,
    slideIndex
  ) => {
    const fallback =
      FALLBACK_SLIDES[
      slideIndex %
      FALLBACK_SLIDES.length
      ];

    setImageErrors((prev) => ({
      ...prev,
      [slideIndex]: true,
    }));

    if (
      event.currentTarget.src !==
      fallback.url
    ) {
      event.currentTarget.src =
        fallback.url;
    }
  };

  /* =======================================================
     ACTIVE MEDIA
  ======================================================= */

  const activeMedia =
    slides[currentSlide] ||
    FALLBACK_SLIDES[0];

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <section
      className="
        hero-editorial
        relative
        overflow-hidden
        bg-[#F7FBF6]
        py-3
        sm:py-4
        lg:py-5
      "
    >
      <div className="container-custom">

        {/* =================================================
            HERO CARD
        ================================================= */}

        <div
          className="
            relative
            overflow-hidden
            rounded-[28px]
            border
            border-[#CFE1CF]
            bg-white
            shadow-[0_24px_70px_rgba(47,107,60,0.14)]
            sm:rounded-[36px]
          "
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >

          {/* =================================================
              HERO GRID
          ================================================= */}

          <div
            className="
              grid
              min-h-[340px]
              md:min-h-[400px]
              lg:min-h-[455px]
              xl:min-h-[480px]
              lg:grid-cols-[1.05fr_0.95fr]
            "
          >

            {/* ===============================================
                LEFT CONTENT
            =============================================== */}

            <div
              className="
                order-2
                flex
                items-center
                p-5
                sm:p-7
                md:p-8
                lg:order-1
                lg:p-9
                xl:p-10
              "
            >
              <div className="max-w-2xl">

                {/* ===========================================
                    LOCATION BADGE
                    Static UI text — NOT hero content fallback.
                =========================================== */}

                {locationTitle && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: -12,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    className="
                      mb-4
                      inline-flex
                      items-center
                      gap-2
                      rounded-full
                      border
                      border-[#CFE1CF]
                      bg-[#EAF4E8]
                      px-3.5
                      py-1.5
                      text-[11px]
                      font-extrabold
                      uppercase
                      tracking-wider
                      text-[#193522]
                    "
                  >
                    <Sparkles
                      size={14}
                      className="text-[#2F6B3C]"
                    />

                    Leading Biomedical Supplier
                    in {locationTitle}
                  </motion.div>
                )}

                {/* ===========================================
                    DYNAMIC HERO TITLE
                    Firebase ONLY
                =========================================== */}

                {heroTitle && (
                  <motion.h1
                    key={`title-${currentSlide}-${heroTitle}`}
                    initial={{
                      opacity: 0,
                      y: 18,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    className="
                      hero-editorial-title
                      text-3xl
                      font-black
                      leading-[1.05]
                      tracking-tight
                      !text-[#193522]
                      sm:text-4xl
                      md:text-5xl
                      lg:text-[52px]
                      xl:text-[56px]
                    "
                  >
                    {heroTitle}
                  </motion.h1>
                )}

                {/* ===========================================
                    DYNAMIC DESCRIPTION
                    Firebase ONLY
                =========================================== */}

                {heroDescription && (
                  <motion.p
                    key={`desc-${currentSlide}-${heroDescription}`}
                    initial={{
                      opacity: 0,
                      y: 18,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    className="
                      hero-editorial-description
                      mt-4
                      max-w-xl
                      text-sm
                      font-medium
                      leading-6
                      !text-[#657566]
                      sm:text-base
                      md:text-lg
                    "
                  >
                    {heroDescription}
                  </motion.p>
                )}

                {/* ===========================================
                    BUTTONS
                    Text = Firebase
                    Link = Static
                =========================================== */}

                {(btn1Text ||
                  btn2Text) && (
                    <motion.div
                      initial={{
                        opacity: 0,
                        y: 18,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      className="
                      mt-5
                      flex
                      flex-wrap
                      gap-3
                    "
                    >

                      {/* PRIMARY BUTTON */}

                      {btn1Text && (
                        <Link
                          href={btn1Href}
                          className="
                          hero-editorial-btn
                          inline-flex
                          items-center
                          justify-center
                          gap-2
                          rounded-2xl
                          bg-[#2F6B3C]
                          px-6
                          py-3.5
                          text-sm
                          font-bold
                          !text-white
                          shadow-lg
                          shadow-[#2F6B3C]/25
                          transition-all
                          duration-300
                          hover:-translate-y-1
                          hover:bg-[#24572F]
                          hover:shadow-xl
                        "
                        >
                          <span className="!text-white">
                            {btn1Text}
                          </span>

                          <ArrowRight
                            size={16}
                            className="!text-white"
                          />
                        </Link>
                      )}

                      {/* SECONDARY BUTTON */}

                      {btn2Text && (
                        <Link
                          href={btn2Href}
                          className="
                          hero-editorial-secondary
                          inline-flex
                          items-center
                          justify-center
                          gap-2
                          rounded-2xl
                          border
                          border-[#CFE1CF]
                          bg-[#F7FBF6]
                          px-6
                          py-3.5
                          text-sm
                          font-bold
                          !text-[#193522]
                          transition-all
                          duration-300
                          hover:-translate-y-1
                          hover:bg-[#EAF4E8]
                        "
                        >
                          <PhoneCall
                            size={16}
                            className="text-[#2F6B3C]"
                          />

                          <span className="!text-[#193522]">
                            {btn2Text}
                          </span>
                        </Link>
                      )}

                    </motion.div>
                  )}

                {/* ===========================================
                    TRUST FEATURES
                =========================================== */}

                <div
                  className="
                    mt-5
                    flex
                    flex-wrap
                    gap-x-5
                    gap-y-2
                    border-t
                    border-[#CFE1CF]
                    pt-4
                    text-xs
                    font-bold
                    text-[#657566]
                  "
                >
                  <span className="inline-flex items-center gap-1.5">
                    <CheckCircle2
                      size={15}
                      className="text-[#2F6B3C]"
                    />
                    ISO 13485 Certified
                  </span>

                  <span className="inline-flex items-center gap-1.5">
                    <CheckCircle2
                      size={15}
                      className="text-[#2F6B3C]"
                    />
                    24/7 SLA Field Support
                  </span>

                  <span className="inline-flex items-center gap-1.5">
                    <CheckCircle2
                      size={15}
                      className="text-[#2F6B3C]"
                    />
                    NABL Traceable QC
                  </span>
                </div>

              </div>
            </div>

            {/* ===============================================
                RIGHT MEDIA
            =============================================== */}

            <div
              className="
                relative
                order-1
                min-h-[220px]
                overflow-hidden
                bg-[#EAF4E8]
                lg:order-2
                lg:min-h-full
              "
            >

              <AnimatePresence mode="wait">

                <motion.div
                  key={currentSlide}
                  initial={{
                    opacity: 0,
                    scale: 1.03,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                  }}
                  transition={{
                    duration: 0.6,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0"
                >

                  {/* =========================================
                      VIDEO
                  ========================================= */}

                  {activeMedia?.type ===
                    "video" ? (
                    <video
                      ref={(el) => {
                        videoRefs.current[
                          currentSlide
                        ] = el;
                      }}
                      src={
                        activeMedia.url
                      }
                      className="
                        h-full
                        w-full
                        object-cover
                      "
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="auto"
                      onError={() => {
                        setImageErrors(
                          (prev) => ({
                            ...prev,
                            [currentSlide]:
                              true,
                          })
                        );
                      }}
                    />
                  ) : (

                    /* =======================================
                       IMAGE
                       Dynamic Firebase image with fallback.
                    ======================================= */

                    <img
                      src={
                        imageErrors[
                          currentSlide
                        ]
                          ? FALLBACK_SLIDES[
                            currentSlide %
                            FALLBACK_SLIDES.length
                          ].url
                          : activeMedia?.url ||
                          FALLBACK_SLIDES[
                            currentSlide %
                            FALLBACK_SLIDES.length
                          ].url
                      }
                      alt={`Hero Slide ${currentSlide + 1
                        }`}
                      className="
                        h-full
                        w-full
                        object-cover
                      "
                      onError={(event) =>
                        handleImageError(
                          event,
                          currentSlide
                        )
                      }
                    />
                  )}

                </motion.div>

              </AnimatePresence>

              {/* =============================================
                  MEDIA OVERLAY
                  Light overlay so image remains clearly visible.
              ============================================= */}

              <div
                className="
                  pointer-events-none
                  absolute
                  inset-0
                  bg-gradient-to-r
                  from-white/10
                  via-transparent
                  to-black/10
                "
              />

              {/* =============================================
                  SLIDE CONTROLS
              ============================================= */}

              {slides.length > 1 && (
                <div
                  className="
                    absolute
                    bottom-4
                    right-4
                    z-20
                    flex
                    items-center
                    gap-2
                    rounded-2xl
                    border
                    border-white/40
                    bg-black/45
                    p-2
                    backdrop-blur-md
                  "
                >

                  {/* PLAY / PAUSE */}

                  <button
                    type="button"
                    onClick={() =>
                      setIsPlaying(
                        !isPlaying
                      )
                    }
                    className="
                      hidden
                      h-9
                      w-9
                      items-center
                      justify-center
                      rounded-xl
                      bg-white/15
                      text-white
                      transition
                      hover:bg-[#2F6B3C]
                      sm:flex
                    "
                    title={
                      isPlaying
                        ? "Pause Slideshow"
                        : "Play Slideshow"
                    }
                  >
                    {isPlaying ? (
                      <Pause
                        size={14}
                      />
                    ) : (
                      <Play
                        size={14}
                      />
                    )}
                  </button>

                  {/* PREVIOUS */}

                  <button
                    type="button"
                    onClick={
                      handlePrev
                    }
                    className="
                      flex
                      h-9
                      w-9
                      items-center
                      justify-center
                      rounded-xl
                      bg-white/15
                      text-white
                      transition
                      hover:bg-[#2F6B3C]
                    "
                    title="Previous Slide"
                  >
                    <ChevronLeft
                      size={18}
                    />
                  </button>

                  {/* SLIDE COUNTER */}

                  <div
                    className="
                      flex
                      items-center
                      gap-1.5
                      px-1
                      text-[11px]
                      font-bold
                      text-white
                    "
                  >
                    {activeMedia?.type ===
                      "video" ? (
                      <Film size={12} />
                    ) : (
                      <ImageIcon
                        size={12}
                      />
                    )}

                    {currentSlide + 1} /{" "}
                    {slides.length}
                  </div>

                  {/* NEXT */}

                  <button
                    type="button"
                    onClick={
                      handleNext
                    }
                    className="
                      flex
                      h-9
                      w-9
                      items-center
                      justify-center
                      rounded-xl
                      bg-white/15
                      text-white
                      transition
                      hover:bg-[#2F6B3C]
                    "
                    title="Next Slide"
                  >
                    <ChevronRight
                      size={18}
                    />
                  </button>

                </div>
              )}

              {/* =============================================
                  DOT INDICATORS
              ============================================= */}

              {slides.length > 1 && (
                <div
                  className="
                    absolute
                    bottom-5
                    left-5
                    z-20
                    flex
                    items-center
                    gap-1.5
                  "
                >
                  {slides.map(
                    (slide, idx) => (
                      <button
                        key={
                          slide.id ||
                          idx
                        }
                        type="button"
                        onClick={() =>
                          setCurrentSlide(
                            idx
                          )
                        }
                        aria-label={`Go to slide ${idx + 1
                          }`}
                        className={`
                          h-2
                          rounded-full
                          transition-all
                          duration-300
                          ${currentSlide ===
                            idx
                            ? "w-8 bg-[#2F6B3C]"
                            : "w-2 bg-white/75 hover:bg-white"
                          }
                        `}
                      />
                    )
                  )}
                </div>
              )}

            </div>

          </div>
        </div>
      </div>
    </section>
  );
}