"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    try {
      console.error("Global error caught:", error);
    } catch (e) {
      // swallow
    }
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
          <div className="max-w-md w-full bg-white rounded-xl shadow-md border border-gray-100 p-6 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Something went wrong
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              We're sorry — an unexpected error occurred.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => reset()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium"
              >
                Try again
              </button>
              <Link
                href="/"
                className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg text-sm font-medium"
              >
                Go Home
              </Link>
            </div>
            <details className="mt-4 text-left text-xs text-gray-500">
              <summary className="cursor-pointer">Error details</summary>
              <pre className="whitespace-pre-wrap break-words">
                {String(error?.message || error)}
              </pre>
            </details>
          </div>
        </div>
      </body>
    </html>
  );
}
