"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { slugSegmentForUrl } from "@/lib/productPaths";

export default function ProductsList({ products, coursename }) {
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  // ✅ Price formatter with thousand grouping
  const formatPrice = (value, symbol = "₹") => {
    const num = Number((value || "").toString().replace(/[,\s]/g, ""));
    if (!Number.isFinite(num) || num <= 0) return "—";
    return `${symbol}${num.toLocaleString("en-IN")}`;
  };

  const productHref = (product) =>
    `/itcertifications/${coursename}/${slugSegmentForUrl(product.slug)}`;



  useEffect(() => {
    setMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Show skeleton or nothing during SSR to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="overflow-x-auto shadow-md rounded-xl border border-gray-200 bg-white">
        <div className="p-8 text-center">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  const sortedProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];
    return [...products].sort((a, b) => {
      const ta = (a.title || a.sapExamCode || "").toString().toLowerCase();
      const tb = (b.title || b.sapExamCode || "").toString().toLowerCase();
      if (ta < tb) return -1;
      if (ta > tb) return 1;
      return 0;
    });
  }, [products]);

  // Mobile Card View
  if (isMobile) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {sortedProducts.map((product) => (
          <div
            key={product._id}
            className="group relative w-full bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-5 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 overflow-hidden"
          >
            {/* Content */}
            <div className="relative z-10">
              {/* Exam Code Badge */}
              <div className="mb-4 flex justify-center">
                <div className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-bold rounded-full shadow-sm">
                  <svg
                    className="w-3 h-3 mr-1.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {product.sapExamCode}
                </div>
              </div>

              {/* Title */}
              <div className="mb-4 text-center">
                <h3 className="text-sm sm:text-base font-semibold text-gray-800 line-clamp-2 leading-tight group-hover:text-blue-700 transition-colors">
                  {product.title}
                </h3>
              </div>

              {/* Pricing Section */}
              <div className="mb-5 text-center">
                {product.showWpConnect ? (
                  <a
                    href={`https://wa.me/9891355956?text=Hi%2C%20I'm%20interested%20in%20${encodeURIComponent(product.title || product.sapExamCode)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-xl shadow-sm transition text-sm"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 flex-shrink-0">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    Inquire on WhatsApp
                  </a>
                ) : (
                  <div className="inline-block bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-3 border border-green-100">
                    <p className="text-xs text-green-700 font-medium mb-1">
                      Starting Price
                    </p>
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <span className="text-lg font-bold text-green-600">
                        {formatPrice(product.dumpsPriceInr, "₹")}
                      </span>
                      <span className="text-xs text-gray-500 font-medium">
                        {formatPrice(product.dumpsPriceUsd, "$")}
                      </span>
                    </div>
                    {product.dumpsMrpInr && (
                      <p className="text-xs line-through text-gray-400">
                        MRP: {formatPrice(product.dumpsMrpInr, "₹")}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* CTA Button */}
              <div className="w-full">
                <Link
                  href={productHref(product)}
                  className="block w-full bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 hover:from-orange-600 hover:via-red-600 hover:to-red-600 text-white text-sm font-bold text-center py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95"
                >
                  <span className="flex items-center justify-center gap-2">
                    View Details
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </span>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Desktop Table View
  return (
    <div className="overflow-x-auto shadow-md rounded-xl border border-gray-200 bg-white">

      <table className="min-w-full text-left text-gray-800 text-sm">
        <thead className="bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 uppercase text-xs">
          <tr>
            <th className="px-4 py-3 font-semibold">{coursename} Exam Code</th>
            <th className="px-4 py-3 font-semibold">Name</th>
            <th className="px-4 py-3 font-semibold text-right">Price</th>
            <th className="px-4 py-3 font-semibold text-center w-36">
              Details
            </th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr
              key={product._id}
              className="border-t border-gray-100 hover:bg-blue-50 transition-colors"
            >
              <td className="px-4 py-3 font-semibold text-blue-700 whitespace-nowrap">
                <Link
                  href={productHref(product)}
                  className="text-blue-700 hover:underline"
                >
                  {product.sapExamCode}
                </Link>
              </td>
              <td className="px-4 py-3 align-top">
                <span className="line-clamp-2">{product.title}</span>
              </td>
              <td className="px-4 py-3 text-right align-top space-y-1 whitespace-nowrap">
                {product.showWpConnect ? (
                  <span className="block font-bold text-blue-600 text-sm">
                    <a href={`https://wa.me/9871952577?text=Hi%2C%20I'm%20interested%20in%20${encodeURIComponent(product.title || product.sapExamCode)}`}
                            target="_blank"
                            rel="noopener noreferrer">
Contact for Best Price 
                            </a>
                    
                  </span>
                ) : (
                  <span className="block font-bold gap-1 text-green-600 text-base">
                    {formatPrice(product.dumpsPriceInr, "₹")} /
                    {formatPrice(product.dumpsPriceUsd, "$")}
                  </span>
                )}
              </td>
              <td className="px-4 py-3 text-center">
                <Link
                  href={productHref(product)}
                  className="inline-block bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-5 py-2 rounded-lg shadow-sm font-semibold transition-all text-xs hover:shadow-md"
                >
                  See Details
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
