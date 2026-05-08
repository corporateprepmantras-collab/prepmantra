"use client";

import React from "react"; // Ensure React is imported for Fragment
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, ChevronRight } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from "@/components/ui/breadcrumb";

export default function Breadcrumbs() {
  const pathname = usePathname();
  const skipSegments = ["by-slug"];

  const segments = pathname
    .split("/")
    .filter(Boolean)
    .filter((segment) => !skipSegments.includes(segment));

  const buildHref = (index) => {
    const allSegments = pathname.split("/").filter(Boolean);
    return (
      "/" +
      allSegments.slice(0, allSegments.indexOf(segments[index]) + 1).join("/")
    );
  };

  const shouldCollapse = segments.length > 2;

  return (
    <div className="w-full overflow-x-auto scrollbar-hide">
      <Breadcrumb className="py-2 px-1 sm:px-0">
        <BreadcrumbList className="flex items-center flex-nowrap"> {/* Added items-center */}
          {/* Home Link */}
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link
                href="/"
                className="text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-1"
              >
                <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline text-xs sm:text-sm">Home</span>
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>

          {segments.map((segment, index) => {
            const isLast = index === segments.length - 1;
            const hideClass = shouldCollapse && index < segments.length - 1 ? "hidden sm:flex" : "flex";

            return (
              <React.Fragment key={index}> {/* Replaced div with Fragment */}
                <BreadcrumbSeparator className={`${hideClass} items-center`}>
                  <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
                </BreadcrumbSeparator>

                {/* Only show ellipsis on mobile (hidden on sm and up) */}
{/* {shouldCollapse && index === segments.length - 1 && (
  <React.Fragment>
    <BreadcrumbItem className="flex items-center md:hidden">
      <BreadcrumbEllipsis className="w-4 h-4" />
    </BreadcrumbItem>
    <BreadcrumbSeparator className="flex items-center md:hidden">
      <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
    </BreadcrumbSeparator>
  </React.Fragment>
)} */}

                <BreadcrumbItem className={`${hideClass} items-center`}>
                  <BreadcrumbLink asChild>
                    <Link
                      href={buildHref(index)}
                      className={`transition-colors text-xs sm:text-sm max-w-[200px] sm:max-w-[300px] md:max-w-none overflow-hidden whitespace-nowrap text-ellipsis flex items-center ${
                        isLast
                          ? "text-gray-900 font-medium"
                          : "text-gray-600 hover:text-gray-900 capitalize"
                      }`}
                    >
                      {isLast
                        ? decodeURIComponent(segment).toUpperCase()
                        : decodeURIComponent(segment.replace(/-/g, " "))}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </React.Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}