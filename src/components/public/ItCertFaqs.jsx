"use client";

import { useState, useRef, useEffect } from "react";

function Chevron({ open }) {
  return (
    <svg
      className={`w-5 h-5 transform transition-transform duration-300 ${open ? "rotate-180" : "rotate-0"}`}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
    >
      <path
        d="M6 8l4 4 4-4"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ItCertFaqs({ faqs = [] }) {
  const [openId, setOpenId] = useState(null);

  const toggle = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="mt-12 sm:mt-14 md:mt-16 lg:mt-20 px-4 sm:px-6 md:px-8 pb-8 sm:pb-10 md:pb-12">
      <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 md:p-10 lg:p-12 border border-gray-200">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">
          Frequently Asked Questions
        </h2>

        <div className="space-y-3">
          {faqs.map((faq) => (
            <FaqItem
              key={faq._id}
              faq={faq}
              open={openId === faq._id}
              onToggle={() => toggle(faq._id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function FaqItem({ faq, open, onToggle }) {
  const contentRef = useRef(null);
  const [height, setHeight] = useState("0px");

  useEffect(() => {
    if (contentRef.current) {
      setHeight(open ? `${contentRef.current.scrollHeight}px` : "0px");
    }
  }, [open]);

  return (
    <div
      className={`border rounded-lg overflow-hidden transition-shadow duration-300 ${open ? "shadow-md ring-1 ring-indigo-100" : "hover:shadow-sm"}`}
    >
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-white to-gray-50"
        aria-expanded={open}
      >
        <span className="text-left font-medium text-gray-900">
          {faq.question}
        </span>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">
            {open ? "Close" : "Answer"}
          </span>
          <Chevron open={open} />
        </div>
      </button>

      <div
        ref={contentRef}
        style={{ maxHeight: height }}
        className="px-4 transition-all duration-300 ease-[cubic-bezier(.2,.8,.2,1)] overflow-hidden bg-white"
      >
        <div
          className="py-4 text-gray-700"
          dangerouslySetInnerHTML={{ __html: faq.answer }}
        />
      </div>
    </div>
  );
}
