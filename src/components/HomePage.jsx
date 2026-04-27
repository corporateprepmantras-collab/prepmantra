"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check, X, AlertCircle, ArrowUp } from "lucide-react";
import Image from "next/image";
import dynamic from "next/dynamic";
import banner from "@/assets/landingassets/img1.webp";

const LoadingBox = () => (
  <div className="py-8 px-4">
    <div
      className="h-48 rounded-2xl animate-pulse max-w-7xl mx-auto"
      style={{
        background: "linear-gradient(135deg, #f0f4f8 0%, #e8f0fe 100%)",
      }}
    ></div>
  </div>
);

const ExamDumpsSlider = dynamic(() => import("@/landingpage/ExamDumpsSlider"), {
  ssr: true,
  loading: () => <LoadingBox />,
});
const BlogSection = dynamic(() => import("@/landingpage/BlogSection"), {
  ssr: true,
});
const UnlockGoals = dynamic(() => import("@/landingpage/UnlockGoals"), {
  ssr: true,
});
const GeneralFAQs = dynamic(() => import("@/landingpage/GeneralFAQs"), {
  ssr: true,
});
const ContentDumpsFirst = dynamic(
  () => import("@/landingpage/ContentBoxFirst"),
  {
    ssr: true,
  },
);
const ContentDumpsSecond = dynamic(
  () => import("@/landingpage/ContentBoxSecond"),
  {
    ssr: true,
  },
);
const Testimonial = dynamic(() => import("@/landingpage/Testimonial"), {
  ssr: true,
});

const BENEFITS = [
  "100% Verified & Up-to-Date Prepmantras",
  "100% Money Back Guarantee",
  "24/7 Expert Support",
  "Free Updates for 3 Months",
  "Realistic Practice Test Interface",
];

const safeStorage = {
  get: (key) => {
    try {
      if (typeof window === "undefined") return null;
      return localStorage.getItem(key);
    } catch (e) {
      console.warn("localStorage.getItem failed:", e);
      return null;
    }
  },
  set: (key, value) => {
    try {
      if (typeof window === "undefined") return false;
      localStorage.setItem(key, value);
      return true;
    } catch (e) {
      console.warn("localStorage.setItem failed:", e);
      return false;
    }
  },
  clear: () => {
    try {
      if (typeof window === "undefined") return false;
      localStorage.clear();
      sessionStorage.clear();
      return true;
    } catch (e) {
      console.warn("Storage clear failed:", e);
      return false;
    }
  },
};

export default function HomePage({
  seo = {},
  dumps = [],
  categories = [],
  blogs = [],
  faqs = [],
  content1 = "",
  content2 = "",
  products = [],
  announcement = null,
}) {
  const [showModal, setShowModal] = useState(false);
  const [showDebugInfo, setShowDebugInfo] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [trendingItems, setTrendingItems] = useState([]);
  const [trendingCategories, setTrendingCategories] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);

  // Use server-provided props for trending lists when available
  useEffect(() => {
    if (Array.isArray(dumps) && dumps.length > 0) setTrendingItems(dumps);
    if (Array.isArray(categories) && categories.length > 0)
      setTrendingCategories(categories);
    if (Array.isArray(products) && products.length > 0)
      setTrendingProducts(products);
  }, [dumps, categories, products]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleScroll = () => setShowScrollTop(window.pageYOffset > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !announcement?.active) return;
    const lastShown = safeStorage.get("announcementShownAt");
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;
    const shouldShow = !lastShown || now - parseInt(lastShown, 10) > oneHour;
    if (shouldShow) {
      const delay = parseFloat(announcement.delay || "1.00") * 1000;
      const timer = setTimeout(() => {
        setShowModal(true);
        safeStorage.set("announcementShownAt", now.toString());
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [announcement]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleKeyPress = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "B") {
        e.preventDefault();
        setShowDebugInfo((prev) => !prev);
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "D") {
        e.preventDefault();
        if (confirm("Clear all cached data and reload?")) {
          const cleared = safeStorage.clear();
          if (cleared) window.location.reload();
          else
            alert(
              "Failed to clear cache. Please clear manually via browser settings.",
            );
        }
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  const closeModal = useCallback(() => setShowModal(false), []);
  const handleClearCache = useCallback(() => {
    if (confirm("Clear all cache and reload?")) {
      const cleared = safeStorage.clear();
      if (cleared) window.location.reload();
      else
        alert(
          "Failed to clear cache. Please clear manually via browser settings.",
        );
    }
  }, []);
  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const hasDataIssues = dumps.length === 0 || faqs.length === 0;

  return (
    <>
      {/* ─── Warning Banner ─── */}
      {hasDataIssues && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-amber-500 text-white px-5 py-2.5 rounded-full shadow-xl flex items-center gap-2 text-sm font-medium animate-pulse">
          <AlertCircle size={15} />
          Some content may be incomplete
        </div>
      )}

      {/* ─── Debug Panel ─── */}
      {showDebugInfo && (
        <div className="fixed top-20 right-4 z-50 bg-slate-900 text-white p-5 rounded-2xl shadow-2xl max-w-xs text-xs font-mono border border-slate-700">
          <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-700">
            <h3 className="font-bold text-sm tracking-wide">Debug</h3>
            <button
              onClick={() => setShowDebugInfo(false)}
              className="text-slate-400 hover:text-white"
            >
              <X size={15} />
            </button>
          </div>
          <div className="space-y-1.5">
            {[
              [
                "SEO Data",
                Object.keys(seo).length > 0,
                `${Object.keys(seo).length} keys`,
              ],
              ["Dumps", dumps?.length > 0, dumps?.length],
              ["Blogs", blogs?.length > 0, blogs?.length],
              ["FAQs", faqs?.length > 0, faqs?.length],
              ["Products", products?.length > 0, products?.length],
              ["Categories", categories?.length > 0, categories?.length],
              ["Mounted", true, "Yes"],
            ].map(([label, ok, val]) => (
              <div key={label} className="flex justify-between">
                <span className="text-slate-400">{label}:</span>
                <span className={ok ? "text-emerald-400" : "text-red-400"}>
                  {ok ? `✓ ${val}` : "✗ Empty"}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-slate-700 text-slate-500 text-[10px] space-y-0.5">
            <div>Ctrl+Shift+B — close</div>
            <div>Ctrl+Shift+D — clear cache</div>
          </div>
        </div>
      )}

      {/* ─── Dev Floating Buttons ─── */}
      {process.env.NODE_ENV === "development" && (
        <div className="fixed bottom-24 right-5 z-50 flex flex-col gap-2">
          <button
            onClick={() => setShowDebugInfo(!showDebugInfo)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl shadow-lg text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <AlertCircle size={13} /> Debug
          </button>
          <button
            onClick={handleClearCache}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl shadow-lg text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <X size={13} /> Clear Cache
          </button>
        </div>
      )}

      {/* ─── Scroll To Top ─── */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-40 text-white rounded-2xl p-3.5 shadow-xl transition-all duration-300 hover:scale-110 focus:outline-none"
          style={{
            background: "linear-gradient(135deg, #0f7ea8, #0a5c7d)",
            animation: "fadeInUp 0.3s ease-out",
          }}
          aria-label="Scroll to top"
        >
          <ArrowUp size={20} strokeWidth={2.5} />
        </button>
      )}

      {/* ─── Announcement Modal ─── */}
      {showModal && announcement?.active && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            background: "rgba(10,20,40,0.65)",
            backdropFilter: "blur(6px)",
          }}
          onClick={closeModal}
        >
          <div
            className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 border border-slate-100"
            style={{ animation: "scaleIn 0.25s ease-out" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-slate-300 hover:text-slate-600 transition-colors bg-slate-50 rounded-full p-1.5"
              aria-label="Close"
            >
              <X size={18} />
            </button>
            {announcement?.imageUrl && (
              <img
                src={announcement.imageUrl}
                alt="Announcement"
                className="w-full h-auto rounded-2xl mb-5"
                loading="lazy"
              />
            )}
            {announcement?.message && (
              <p className="text-slate-700 text-center text-lg leading-relaxed">
                {announcement.message}
              </p>
            )}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════ MAIN CONTENT ════ */}
      <div className="bg-[#f8f9fb] font-[system-ui]">
        {/* ─── HERO ─── */}
        <section className="relative overflow-hidden">
          {/* Background decorative blobs */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div
              className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full opacity-[0.07]"
              style={{
                background: "radial-gradient(circle, #13677c, transparent 70%)",
              }}
            ></div>
            <div
              className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full opacity-[0.05]"
              style={{
                background: "radial-gradient(circle, #7aa93c, transparent 70%)",
              }}
            ></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-16 pt-20 pb-16 flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-16">
            {/* Left Content */}
            <div className="w-full lg:w-[52%]">
              {/* Eyebrow pill */}
              <div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-3 border"
                style={{
                  background: "rgba(19,103,124,0.07)",
                  color: "#13677c",
                  borderColor: "rgba(19,103,124,0.15)",
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#13677c] animate-pulse inline-block"></span>
                Trusted by 50,000+ professionals
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-[1.12] mb-5 tracking-tight">
                Pass Your IT Certification{" "}
                <span className="relative inline-block">
                  <span className="relative z-10" style={{ color: "#13677c" }}>
                    On the First Try
                  </span>
                  <span
                    className="absolute -bottom-1 left-0 w-full h-3 opacity-20 rounded-sm"
                    style={{ background: "#13677c" }}
                  ></span>
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-500 mb-4 leading-relaxed max-w-xl">
                Prepmantras offers industry-validated study materials, real exam
                prep, and browser-based practice tests to help you get certified
                faster — and smarter.
              </p>

              {/* Benefits */}
              <ul className="space-y-3 mb-8">
                {BENEFITS.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 text-slate-700 text-sm sm:text-base"
                  >
                    <div
                      className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
                      style={{ background: "#7aa93c" }}
                    >
                      <Check className="text-white" size={11} strokeWidth={3} />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-3">
                <Link href="/itcertifications">
                  <button
                    className="px-7 py-3.5 rounded-2xl text-white text-sm font-bold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 active:translate-y-0"
                    style={{
                      background:
                        "linear-gradient(135deg, #13677c 0%, #0e4f5e 100%)",
                    }}
                  >
                    Browse All Exams →
                  </button>
                </Link>
                <Link href="#trending">
                  <button className="px-7 py-3.5 rounded-2xl text-sm font-bold border-2 border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-all">
                    View Trending
                  </button>
                </Link>
              </div>
            </div>

            {/* Right Image */}
            <div className="w-full lg:w-[48%] flex justify-center">
              <div className="relative w-full max-w-[480px]">
                {/* Image card with layered shadow */}
                <div
                  className="absolute inset-0 rounded-3xl translate-x-3 translate-y-3"
                  style={{ background: "rgba(19,103,124,0.1)" }}
                ></div>
                <div className="relative rounded-3xl overflow-hidden bg-white border border-slate-100 shadow-xl p-2">
                  <Image
                    src={banner}
                    alt="Professional IT certification preparation"
                    className="w-full h-auto object-contain rounded-2xl"
                    placeholder="blur"
                    priority
                    quality={80}
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 480px"
                  />
                </div>
                {/* Floating stat badges */}
                <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl px-4 py-2.5 shadow-lg border border-slate-100 flex items-center gap-2.5">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-lg"
                    style={{ background: "rgba(122,169,60,0.12)" }}
                  >
                    ✅
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 leading-tight">
                      Money-back
                    </p>
                    <p className="text-xs font-bold text-slate-800">
                      Guarantee
                    </p>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 bg-white rounded-2xl px-4 py-2.5 shadow-lg border border-slate-100 flex items-center gap-2.5">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-lg"
                    style={{ background: "rgba(19,103,124,0.1)" }}
                  >
                    🎯
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 leading-tight">
                      Success Rate
                    </p>
                    <p className="text-xs font-bold text-slate-800">98%+</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── TRENDING CERTIFICATIONS ─── */}
        <section id="trending" className="py-10 sm:py-10 px-5 sm:px-8 lg:px-16">
          <div className="max-w-7xl mx-auto">
            {/* Section header */}
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "flex-end",
                justifyContent: "space-between",
                marginBottom: "2.5rem",
                gap: "1rem",
                flexWrap: "wrap",
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "#e07b39",
                    marginBottom: "6px",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <span
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: "#e07b39",
                      display: "inline-block",
                      animation: "pulse 2s infinite",
                    }}
                  />
                  Trending Now
                </p>
                <h2
                  style={{
                    fontSize: "clamp(1.5rem, 3vw, 2rem)",
                    fontWeight: 900,
                    color: "#0f172a",
                    lineHeight: 1.2,
                    margin: 0,
                  }}
                >
                  Popular Certification Exams
                </h2>
                <p
                  style={{
                    fontSize: "13px",
                    color: "#94a3b8",
                    marginTop: "6px",
                    margin: "6px 0 0",
                  }}
                >
                  Most-pursued by professionals this month
                </p>
              </div>

              {trendingItems?.length > 0 && (
                <Link href="/itcertifications" style={{ flexShrink: 0 }}>
                  <button
                    style={{
                      fontSize: "12px",
                      fontWeight: 600,
                      padding: "9px 20px",
                      borderRadius: "12px",
                      border: "1.5px solid #e07b39",
                      color: "#e07b39",
                      background: "rgba(224,123,57,0.05)",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      transition: "background 0.2s, transform 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(224,123,57,0.1)";
                      e.currentTarget.style.transform = "translateY(-1px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background =
                        "rgba(224,123,57,0.05)";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    View All
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </button>
                </Link>
              )}
            </div>

            {/* Grid */}
            {trendingItems?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {trendingItems.map((item, index) => (
                  <button
                    key={item._id}
                    onClick={() => {
                      if (item.link) window.location.href = `/${item.link}`;
                    }}
                    className="group relative bg-white rounded-2xl p-4 text-left border border-slate-100 hover:border-orange-200 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1 active:translate-y-0 cursor-pointer overflow-hidden"
                  >
                    {/* Accent line on hover */}
                    <div
                      className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{
                        background: "linear-gradient(90deg, #e07b39, #f59e0b)",
                      }}
                    ></div>

                    {/* Rank badge */}
                    <div
                      className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black"
                      style={{
                        background: index < 3 ? "#e07b39" : "#f1f5f9",
                        color: index < 3 ? "white" : "#64748b",
                      }}
                    >
                      {index + 1}
                    </div>

                    <div className="flex items-start gap-3">
                      {item.categoryImage && (
                        <div className="w-14 h-10 rounded-xl overflow-hidden flex-shrink-0 bg-slate-50 border border-slate-100">
                          <img
                            src={item.categoryImage}
                            alt={item.categoryName || item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0 pr-6">
                        <h3 className="text-sm font-bold text-slate-800 group-hover:text-orange-600 transition-colors leading-snug">
                          {item.categoryName || item.title || "Certification"}
                        </h3>
                        {item.text && (
                          <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                            {item.text}
                          </p>
                        )}
                        <p
                          className="text-xs font-semibold mt-2"
                          style={{ color: "#e07b39" }}
                        >
                          View Details →
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200">
                <p className="text-slate-400 text-sm font-medium">
                  No trending certifications available
                </p>
                <p className="text-slate-300 text-xs mt-1">Check back soon</p>
              </div>
            )}
          </div>
        </section>

        {/* ─── TRENDING CATEGORIES & PRODUCTS ─── */}
        {(() => {
          const visibleCategories = (trendingCategories || []).filter(
            (category) =>
              (trendingProducts || []).some(
                (p) => p.trendingCategoryId === category._id,
              ),
          );
          if (visibleCategories.length === 0) return null;

          return (
            <>
              <section className="py-10 sm:py-10 px-5 sm:px-8 lg:px-16 bg-[#f8f9fb]">
                <div className="tc-root max-w-7xl mx-auto">
                  {/* Section Header */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "flex-end",
                      justifyContent: "space-between",
                      gap: "1rem",
                      marginBottom: "3rem",
                      flexWrap: "wrap",
                    }}
                  >
                    <div>
                      <p
                        style={{
                          fontSize: "11px",
                          fontWeight: 700,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          color: "#94a3b8",
                          marginBottom: "6px",
                          margin: "0 0 6px",
                        }}
                      >
                        Browse by category
                      </p>
                      <h2
                        className="tc-display"
                        style={{
                          fontSize: "clamp(1.75rem, 4vw, 2.25rem)",
                          color: "#0f172a",
                          lineHeight: 1.2,
                          margin: "0 0 6px",
                        }}
                      >
                        Trending <em>Categories</em>
                      </h2>
                      <p
                        style={{
                          fontSize: "13px",
                          color: "#94a3b8",
                          margin: 0,
                        }}
                      >
                        Top-rated products across the most popular
                        certifications
                      </p>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        fontSize: "12px",
                        color: "#94a3b8",
                        flexShrink: 0,
                      }}
                    >
                      <span
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: "#34d399",
                          display: "inline-block",
                          animation:
                            "pulse 2s cubic-bezier(0.4,0,0.6,1) infinite",
                        }}
                      />
                      {visibleCategories.length} active{" "}
                      {visibleCategories.length === 1
                        ? "category"
                        : "categories"}
                    </div>
                  </div>

                  {/* Category Blocks */}
                  <div className="flex flex-col gap-6">
                    {visibleCategories.map((category, catIndex) => {
                      const categoryProducts = trendingProducts.filter(
                        (p) => p.trendingCategoryId === category._id,
                      );

                      // Consistent, alternating accent palette — teal & indigo
                      const palette = [
                        { accent: "#0f7ea8", light: "#e8f6fb", mid: "#0e6b8f" },
                        { accent: "#4f46e5", light: "#eef2ff", mid: "#4338ca" },
                        { accent: "#0d9488", light: "#f0fdfa", mid: "#0f766e" },
                        { accent: "#7c3aed", light: "#f5f3ff", mid: "#6d28d9" },
                      ];
                      const { accent, light, mid } =
                        palette[catIndex % palette.length];

                      return (
                        <div key={category._id} className="tc-block">
                          <div className="flex flex-col lg:flex-row">
                            {/* ── Left Panel ── */}
                            <div
                              className="tc-left lg:w-[26%]"
                              style={{
                                background: `linear-gradient(160deg, ${light} 0%, #fff 100%)`,
                              }}
                            >
                              {/* Blob */}
                              <div
                                className="tc-left-blob"
                                style={{ background: accent }}
                              />

                              {/* Logo */}
                              {category.image && (
                                <div className="tc-logo-wrap">
                                  <img
                                    src={category.image}
                                    alt={category.title}
                                    style={{
                                      width: 40,
                                      height: 40,
                                      objectFit: "contain",
                                    }}
                                  />
                                </div>
                              )}

                              {/* Count pill */}
                              <div
                                className="tc-count-badge"
                                style={{
                                  background: light,
                                  color: mid,
                                  border: `1px solid ${accent}30`,
                                }}
                              >
                                <svg
                                  width="8"
                                  height="8"
                                  viewBox="0 0 8 8"
                                  fill={accent}
                                >
                                  <circle cx="4" cy="4" r="4" />
                                </svg>
                                {categoryProducts.length} product
                                {categoryProducts.length !== 1 ? "s" : ""}
                              </div>

                              {/* Title & desc */}
                              <h3 className="tc-cat-title">{category.title}</h3>
                              {category.description && (
                                <p className="tc-cat-desc">
                                  {category.description}
                                </p>
                              )}

                              {/* CTA */}
                              <Link href={`/${category.redirectLink}`}>
                                <span
                                  className="tc-view-btn"
                                  style={{
                                    background: `linear-gradient(135deg, ${accent}, ${mid})`,
                                  }}
                                >
                                  Explore all
                                  <svg
                                    className="tc-arrow-icon"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2.5}
                                      d="M5 12h14M13 6l6 6-6 6"
                                    />
                                  </svg>
                                </span>
                              </Link>
                            </div>

                            {/* Divider */}
                            <div className="tc-divider hidden lg:block" />

                            {/* ── Right Products Panel ── */}
                            <div className="flex-1 min-w-0">
                              {categoryProducts.length > 0 ? (
                                <div className="tc-products-wrap">
                                  <p className="tc-products-label">
                                    Popular products
                                  </p>

                                  <div
                                    style={{
                                      display: "grid",
                                      gridTemplateColumns:
                                        "repeat(auto-fill, minmax(110px, 1fr))",
                                      gap: "10px",
                                    }}
                                  >
                                    {categoryProducts
                                      .slice(0, 10)
                                      .map((product) => (
                                        <Link
                                          key={product._id}
                                          href={`/${product.redirectLink}`}
                                        >
                                          <div className="tc-product-card">
                                            <div className="tc-product-img">
                                              {product.image ? (
                                                <img
                                                  src={product.image}
                                                  alt={product.title}
                                                  style={{
                                                    width: "100%",
                                                    height: "100%",
                                                    objectFit: "contain",
                                                  }}
                                                />
                                              ) : (
                                                <svg
                                                  style={{
                                                    width: 22,
                                                    height: 22,
                                                    color: "#cbd5e1",
                                                  }}
                                                  fill="none"
                                                  stroke="currentColor"
                                                  viewBox="0 0 24 24"
                                                >
                                                  <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={1.5}
                                                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                                                  />
                                                </svg>
                                              )}
                                            </div>
                                            <p className="tc-product-title">
                                              {product.title}
                                            </p>
                                          </div>
                                        </Link>
                                      ))}
                                  </div>
                                </div>
                              ) : (
                                <div className="tc-empty">
                                  <svg
                                    style={{ width: 36, height: 36 }}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={1.2}
                                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5"
                                    />
                                  </svg>
                                  <p style={{ fontSize: 12 }}>
                                    No products yet
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>
            </>
          );
        })()}

        {/* ─── Lazy-loaded Sections (unchanged) ─── */}
        {/* {blogs.length > 0 && <BlogSection blogs={blogs} categories={categories} />} */}
        {products.length > 0 && <ExamDumpsSlider products={products} />}
        {content1 && <ContentDumpsFirst content={content1} />}
        <UnlockGoals />
        {/* {content2 && <ContentDumpsSecond content={content2} />} */}
        <Testimonial />
        {faqs.length > 0 && <GeneralFAQs faqs={faqs} />}
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>

      <style jsx>{`
        .tc-root {
          font-family: "DM Sans", sans-serif;
        }
        .tc-display {
          font-family: "DM Serif Display", serif;
        }

        .tc-block {
          background: #fff;
          border-radius: 28px;
          border: 1px solid #eef0f3;
          overflow: hidden;
          transition: box-shadow 0.3s ease;
        }
        .tc-block:hover {
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.07);
        }

        .tc-left {
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
          padding: 2.5rem 2rem;
        }

        .tc-left-blob {
          position: absolute;
          width: 220px;
          height: 220px;
          border-radius: 50%;
          opacity: 0.12;
          top: -60px;
          right: -60px;
          pointer-events: none;
        }

        .tc-logo-wrap {
          width: 64px;
          height: 64px;
          border-radius: 18px;
          background: #fff;
          border: 1px solid #eef0f3;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.25rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
          flex-shrink: 0;
        }

        .tc-cat-title {
          font-family: "DM Serif Display", serif;
          font-size: 1.5rem;
          line-height: 1.25;
          color: #0f172a;
          margin-bottom: 0.5rem;
        }

        .tc-cat-desc {
          font-size: 0.78rem;
          color: #94a3b8;
          line-height: 1.65;
          margin-bottom: 1.5rem;
          max-width: 220px;
        }

        .tc-count-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.04em;
          padding: 4px 11px;
          border-radius: 100px;
          margin-bottom: 1.5rem;
        }

        .tc-view-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 600;
          padding: 9px 18px;
          border-radius: 12px;
          color: #fff;
          cursor: pointer;
          transition:
            transform 0.18s ease,
            box-shadow 0.18s ease;
          text-decoration: none;
          border: none;
        }
        .tc-view-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
        }
        .tc-view-btn:active {
          transform: translateY(0);
        }

        .tc-divider {
          width: 1px;
          background: #f0f2f5;
          flex-shrink: 0;
          align-self: stretch;
        }

        .tc-products-wrap {
          padding: 1.75rem 1.5rem;
          overflow-y: auto;
          max-height: 420px;
          flex: 1;
        }
        .tc-products-wrap::-webkit-scrollbar {
          width: 4px;
        }
        .tc-products-wrap::-webkit-scrollbar-track {
          background: transparent;
        }
        .tc-products-wrap::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 2px;
        }

        .tc-products-label {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.09em;
          text-transform: uppercase;
          color: #cbd5e1;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .tc-products-label::after {
          content: "";
          flex: 1;
          height: 1px;
          background: #f1f5f9;
        }

        .tc-product-card {
          background: #f8f9fb;
          border: 1px solid transparent;
          border-radius: 16px;
          padding: 10px;
          transition:
            background 0.2s,
            border-color 0.2s,
            transform 0.2s,
            box-shadow 0.2s;
          cursor: pointer;
          display: flex;
          flex-direction: column;
        }
        .tc-product-card:hover {
          background: #fff;
          border-color: #e8edf3;
          transform: translateY(-2px);
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.06);
        }

        .tc-product-img {
          width: 100%;
          aspect-ratio: 1;
          background: #fff;
          border: 1px solid #f0f2f5;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          margin-bottom: 8px;
          padding: 8px;
        }

        .tc-product-title {
          font-size: 11px;
          font-weight: 600;
          color: #334155;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          min-height: 30px;
          transition: color 0.2s;
        }
        .tc-product-card:hover .tc-product-title {
          color: #0f172a;
        }

        .tc-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          min-height: 200px;
          gap: 10px;
          color: #cbd5e1;
        }

        .tc-arrow-icon {
          width: 14px;
          height: 14px;
          flex-shrink: 0;
        }
      `}</style>
    </>
  );
}
