import { NextResponse } from "next/server";

/**
 * Ping Google and Bing with the live Next.js sitemap URL (no file upload required).
 */
export async function POST() {
  try {
    const base = (
      process.env.NEXT_PUBLIC_BASE_URL || "https://www.prepmantras.com"
    ).replace(/\/$/, "");
    const sitemapUrl = `${base}/sitemap.xml`;
    const encoded = encodeURIComponent(sitemapUrl);

    const targets = [
      `https://www.google.com/ping?sitemap=${encoded}`,
      `https://www.bing.com/ping?sitemap=${encoded}`,
    ];

    const results = await Promise.all(
      targets.map(async (url) => {
        try {
          const res = await fetch(url, { method: "GET", cache: "no-store" });
          return { url, ok: res.ok, status: res.status };
        } catch (e) {
          return { url, ok: false, error: e.message };
        }
      }),
    );

    return NextResponse.json({
      message: "Ping requests completed",
      sitemapUrl,
      results,
    });
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Ping failed" },
      { status: 500 },
    );
  }
}
