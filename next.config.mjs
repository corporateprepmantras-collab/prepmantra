import bundleAnalyzer from "@next/bundle-analyzer";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  compress: true,
  optimizeFonts: true,
  swcMinify: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,

  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000,
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "prepmantras.com" },
      { protocol: "https", hostname: "www.prepmantras.com" },
      { protocol: "https", hostname: "via.placeholder.com" },
    ],
  },

  experimental: {
    optimizeCss: true,
    optimizePackageImports: [
      "lucide-react",
      "@/components/ui",
      "framer-motion",
      "react-icons",
    ],
    optimizeServerReact: true,
  },

  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "prepmantras.com" }],
        destination: "https://www.prepmantras.com/:path*",
        permanent: true,
      },
    ];
  },

  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        moduleIds: "deterministic",
        runtimeChunk: "single",
        splitChunks: {
          chunks: "all",
          cacheGroups: {
            default: false,
            vendors: false,
            framework: {
              name: "framework",
              chunks: "all",
              test: /[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types)[\\/]/,
              priority: 40,
              enforce: true,
            },
            commons: {
              name: "commons",
              minChunks: 2,
              priority: 20,
            },
            lib: {
              test: /[\\/]node_modules[\\/]/,
              name(module) {
                const packageName = module.context.match(
                  /[\\/]node_modules[\\/](.*?)([\\/]|$)/,
                )?.[1];
                return `npm.${packageName?.replace("@", "")}`;
              },
              priority: 30,
              minChunks: 1,
              reuseExistingChunk: true,
            },
            styles: {
              name: "styles",
              test: /\.css$/,
              chunks: "all",
              enforce: true,
            },
          },
        },
      };
    }
    return config;
  },

  async headers() {
    return [
      // ✅ Static assets - aggressive caching
      {
        source: "/:all*(svg|jpg|jpeg|png|webp|avif|ico|woff|woff2|ttf|otf|eot)",
        locale: false,
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/_next/image/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },

      // ✅ API routes - no cache
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Cache-Control",
            value:
              "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
          },
          { key: "Pragma", value: "no-cache" },
          { key: "Expires", value: "0" },
        ],
      },

      // ✅ Global security + CSP headers
      {
        source: "/:path*",
        headers: [
          { key: "X-DNS-Prefetch-Control", value: "on" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",

              // ✅ FIXED: Added googletagmanager + google-analytics
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://ssl.google-analytics.com https://accounts.google.com https://apis.google.com https://checkout.razorpay.com https://*.razorpay.com https://js.razorpay.com https://www.paypal.com https://*.paypal.com https://www.paypalobjects.com https://vercel.live https://*.vercel.app https://va.vercel-scripts.com https://*.vercel-scripts.com",

              "script-src-elem 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://ssl.google-analytics.com https://accounts.google.com https://checkout.razorpay.com https://*.razorpay.com https://js.razorpay.com https://www.paypal.com https://*.paypal.com https://vercel.live https://*.vercel.app https://*.vercel-scripts.com",

              "style-src 'self' 'unsafe-inline' https://accounts.google.com https://*.vercel.app https://www.prepmantras.com",

              "img-src 'self' data: https: blob:",

              "font-src 'self' data:",

              // ✅ FIXED: Added all Google Analytics connect domains
              "connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://stats.g.doubleclick.net https://region1.google-analytics.com https://region1.analytics.google.com https://accounts.google.com https://oauth2.googleapis.com https://www.googleapis.com https://ipapi.co https://*.razorpay.com https://api.razorpay.com https://lumberjack.razorpay.com https://*.paypal.com https://vercel.live https://*.vercel.app https://vitals.vercel-insights.com https://*.vercel-insights.com",

              "frame-src 'self' https://accounts.google.com https://checkout.razorpay.com https://*.razorpay.com https://api.razorpay.com https://www.paypal.com https://*.paypal.com https://vercel.live",

              "worker-src 'self' blob:",
              "base-uri 'self'",
              "form-action 'self' https://accounts.google.com https://checkout.razorpay.com https://www.paypal.com",
            ].join("; "),
          },
        ],
      },

      // ✅ Cart page specific CSP
      {
        source: "/cart",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",

              // ✅ FIXED: Added googletagmanager here too
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://ssl.google-analytics.com https://checkout.razorpay.com https://*.razorpay.com https://js.razorpay.com https://www.paypal.com https://*.paypal.com https://www.paypalobjects.com https://vercel.live https://*.vercel.app https://*.vercel-scripts.com",

              "script-src-elem 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://ssl.google-analytics.com https://checkout.razorpay.com https://*.razorpay.com https://js.razorpay.com https://www.paypal.com https://*.paypal.com https://vercel.live https://*.vercel.app https://*.vercel-scripts.com",

              "style-src 'self' 'unsafe-inline' https://*.vercel.app https://www.prepmantras.com",
              "img-src 'self' data: https: blob:",
              "font-src 'self' data:",

              // ✅ FIXED: Added GA connect domains here too
              "connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://stats.g.doubleclick.net https://region1.google-analytics.com https://ipapi.co https://*.razorpay.com https://api.razorpay.com https://lumberjack.razorpay.com https://*.paypal.com https://vercel.live https://*.vercel.app https://vitals.vercel-insights.com https://*.vercel-insights.com",

              "frame-src 'self' https://checkout.razorpay.com https://*.razorpay.com https://api.razorpay.com https://www.paypal.com https://*.paypal.com https://vercel.live",
              "frame-ancestors 'self' https://checkout.razorpay.com https://*.razorpay.com https://api.razorpay.com",
              "worker-src 'self' blob:",
              "base-uri 'self'",
              "form-action 'self' https://checkout.razorpay.com https://www.paypal.com",
            ].join("; "),
          },
        ],
      },
    ];
  },

  output: process.env.BUILD_STANDALONE === "true" ? "standalone" : undefined,

  async generateBuildId() {
    return process.env.BUILD_ID || `build-${Date.now()}`;
  },
};

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

export default withBundleAnalyzer(nextConfig);
