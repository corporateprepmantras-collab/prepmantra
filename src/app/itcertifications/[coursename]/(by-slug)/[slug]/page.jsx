import ProductDetail from "./ProductDetail";
import { Suspense } from "react";
import ProductPageLoading from "./loading";

function stripHtml(html) {
  if (!html) return "";
  return String(html)
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export async function generateMetadata({ params }) {
  const { coursename, slug } = await params;
  const base = (
    process.env.NEXT_PUBLIC_BASE_URL || "https://www.prepmantras.com"
  ).replace(/\/$/, "");
  const canonical = `${base}/itcertifications/${coursename}/${slug}`;

  try {
    const res = await fetch(
      `${base}/api/products/get-by-slug/${encodeURIComponent(slug)}`,
      { cache: "no-store" },
    );
    if (!res.ok) {
      return { title: "Product | PrepMantras", alternates: { canonical } };
    }
    const json = await res.json();
    const p = json?.data;
    if (!p) {
      return { title: "Product | PrepMantras", alternates: { canonical } };
    }

    const metaTitle = (p.metaTitle || "").trim();
    const metaDescription = (p.metaDescription || "").trim();

    const fallbackTitle = [p.sapExamCode, p.title].filter(Boolean).join(" ");
    const title =
      metaTitle ||
      (fallbackTitle ? `${fallbackTitle} | PrepMantras` : "PrepMantras");

    const fromBody = stripHtml(p.longDescription || p.Description || "");
    const description =
      metaDescription ||
      (fromBody ? fromBody.slice(0, 160) : "") ||
      (p.title ? String(p.title).slice(0, 160) : `Certification prep: ${slug}`);

    return {
      title,
      description,
      alternates: { canonical },
    };
  } catch {
    return { title: "PrepMantras", alternates: { canonical } };
  }
}

export default function ProductPage() {
  return (
    <Suspense fallback={<ProductPageLoading />}>
      <ProductDetail />
    </Suspense>
  );
}

export const dynamic = "force-dynamic";
