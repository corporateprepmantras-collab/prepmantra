"use client";

import { usePathname } from "next/navigation";
import { FaPhone, FaWhatsapp } from "react-icons/fa";

const PHONE_DISPLAY = "9871952577";
const PHONE_TEL = "+919871952577";
const PHONE_WHATSAPP = "919871952577";

export default function ChatWithUs() {
  const pathname = usePathname();
  if (pathname?.startsWith("/dashboard")) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[60] flex flex-col gap-2 items-end pointer-events-none">
      <a
        href={`https://wa.me/${PHONE_WHATSAPP}?text=${encodeURIComponent("Hi PrepMantras, I need help with certifications.")}`}
        target="_blank"
        rel="noopener noreferrer"
        className="pointer-events-auto flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-white text-sm font-bold shadow-lg hover:bg-[#20bd5a] transition-colors md:px-5 md:text-base"
        aria-label="Chat on WhatsApp"
      >
        <FaWhatsapp className="text-xl flex-shrink-0" />
        <span className="hidden sm:inline">Chat with us</span>
        <span className="sm:hidden">WhatsApp</span>
      </a>
      <a
        href={`tel:${PHONE_TEL}`}
        className="pointer-events-auto flex items-center gap-2 rounded-full bg-blue-600 px-4 py-3 text-white text-sm font-bold shadow-lg hover:bg-blue-700 transition-colors md:px-5 md:text-base"
        aria-label={`Call ${PHONE_DISPLAY}`}
      >
        <FaPhone className="text-lg flex-shrink-0" />
        <span className="hidden sm:inline">Call {PHONE_DISPLAY}</span>
        <span className="sm:hidden">Call</span>
      </a>
    </div>
  );
}
