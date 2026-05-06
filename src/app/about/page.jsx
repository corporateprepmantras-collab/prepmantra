"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import AboutContentSection from "./AboutContentSection";
import { slugSegmentForUrl, categoryPathSegment } from "@/lib/productPaths";

/* ---------------- PAGE ---------------- */
export default function AboutUs() {
  const [products, setProducts] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(4);

  /* ---------------- FETCH PRODUCTS ---------------- */
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products?limit=6");
        const data = await res.json();
        setProducts(Array.isArray(data?.data) ? data.data : []);
      } catch {
        setProducts([]);
      }
    }

    fetchProducts();
  }, []);

  /* ---------------- RESPONSIVE ---------------- */
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setVisibleCards(1);
      else if (window.innerWidth < 1024) setVisibleCards(2);
      else setVisibleCards(4);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* ---------------- AUTO SLIDE ---------------- */
  useEffect(() => {
    if (products.length <= visibleCards) return;

    const timer = setInterval(() => {
      setStartIndex((prev) =>
        prev + visibleCards < products.length ? prev + visibleCards : 0,
      );
    }, 5000);

    return () => clearInterval(timer);
  }, [products.length, visibleCards]);

  /* ---------------- NAV ---------------- */
  const next = useCallback(() => {
    setStartIndex((prev) =>
      prev + visibleCards < products.length ? prev + visibleCards : 0,
    );
  }, [products.length, visibleCards]);

  const prev = useCallback(() => {
    setStartIndex((prev) =>
      prev - visibleCards >= 0
        ? prev - visibleCards
        : Math.max(products.length - visibleCards, 0),
    );
  }, [products.length, visibleCards]);

  const visibleProducts = useMemo(
    () => products.slice(startIndex, startIndex + visibleCards),
    [products, startIndex, visibleCards],
  );

  const totalPages = Math.ceil(products.length / visibleCards);
  const currentPage = Math.floor(startIndex / visibleCards);

  return (
    <>
      {/* ================= ABOUT SECTION ================= */}
      <section className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="flex flex-col lg:flex-row items-center gap-6 px-6 py-10 max-w-6xl w-full">
          <div className="lg:w-1/2 w-full">
            <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-800 p-10 sm:p-14 text-center text-white shadow-xl">
              <p className="text-sm uppercase tracking-widest text-blue-100 mb-2">
                PrepMantras
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold leading-tight">
                Your partner for IT certification success
              </h2>
            </div>
          </div>

          <div className="lg:w-1/2 space-y-5">
            <h1 className="text-3xl font-bold text-gray-800">About Us</h1>
            <p className="text-gray-600">
              Prepmantras is your trusted destination for verified IT
              certification exam preparation.
            </p>
            <p className="text-gray-600">
              We specialize in SAP and IT certification exam dumps with high
              first-attempt success.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800">
              Why Choose Prepmantras?
            </h2>
            <ul className="list-disc pl-5 text-gray-600 space-y-2">
              <li>SAP Exam Dumps specialization</li>
              <li>Expert verified content</li>
              <li>Updated & industry focused</li>
              <li>High pass success rate</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ================= INLINE SLIDER ================= */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900">
              Popular IT Certification{" "}
              <span className="text-orange-500">Dumps</span>
            </h2>
            <p className="text-gray-600 mt-2">
              Trusted by professionals worldwide
            </p>
          </div>

          {/* NAV */}
          <div className="flex justify-center gap-4 mb-8">
            <button
              type="button"
              onClick={prev}
              className="slider-btn bg-white hover:bg-orange-50"
              aria-label="Previous products"
            >
              <ChevronLeft className="w-6 h-6 text-gray-800" strokeWidth={2.5} />
            </button>
            <button
              type="button"
              onClick={next}
              className="slider-btn bg-orange-500 hover:bg-orange-600 text-white"
              aria-label="Next products"
            >
              <ChevronRight className="w-6 h-6 text-white" strokeWidth={2.5} />
            </button>
          </div>

          {/* SLIDER */}
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {visibleProducts.map((product) => {
              const cat = categoryPathSegment(product.category);
              const slugSeg = slugSegmentForUrl(product.slug || product.title);

              return (
                <Link
                  key={product._id}
                  href={`/itcertifications/${cat}/${slugSeg}`}
                  className="group bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden flex flex-col"
                >
                  <div className="relative h-52 bg-gradient-to-br from-orange-50 to-blue-50 overflow-hidden">
                    <img
                      src={product.imageUrl || "/placeholder.png"}
                      alt={product.title}
                      className="h-full w-full object-contain p-3 group-hover:scale-105 transition duration-700"
                    />
                  </div>

                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="font-bold text-gray-900 mb-1 line-clamp-2">
                      {product.sapExamCode || product.title}
                    </h3>

                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-orange-400 text-orange-400"
                        />
                      ))}
                      <span className="text-xs text-gray-500">(4.8)</span>
                    </div>

                    <p className="text-lg font-bold text-orange-500 mt-auto">
                      ₹{product.dumpsPriceInr} / ${product.dumpsPriceUsd}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* DOTS */}
          <div className="flex justify-center gap-2 mt-10">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setStartIndex(i * visibleCards)}
                className={`h-2 rounded-full transition ${
                  currentPage === i ? "w-8 bg-orange-500" : "w-2 bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      <AboutContentSection />

      <style jsx>{`
        .slider-btn {
          border: 2px solid #f97316;
          padding: 0.6rem;
          border-radius: 9999px;
          transition: 0.3s;
        }
        .slider-btn:hover {
          transform: scale(1.05);
        }
      `}</style>
    </>
  );
}
