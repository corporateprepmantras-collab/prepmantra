"use client";

import { useState, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";

export default function WhatsAppButton() {
  const [isVisible, setIsVisible] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    // Show button after 1.5s
    const timer = setTimeout(() => setIsVisible(true), 1500);
    // Show "Chat with us" popup after 3s
    const popupTimer = setTimeout(() => setShowPopup(true), 3000);
    
    return () => {
      clearTimeout(timer);
      clearTimeout(popupTimer);
    };
  }, []);

  const whatsappUrl =
    "https://wa.me/919871952577?text=Hi%2C%20I%20need%20help%20with%20IT%20certification%20prep%20at%20PrepMantras.";

  return (
    <div 
      className={`fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-3 transition-all duration-500 transform ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0 pointer-events-none"
      }`}
    >
      {/* Chatbot Style Popup */}
      <div 
        className={`bg-white rounded-2xl shadow-2xl p-4 border border-gray-100 max-w-[240px] transition-all duration-300 transform origin-bottom-right ${
          showPopup ? "scale-100 opacity-100" : "scale-90 opacity-0 pointer-events-none"
        }`}
      >
        <button 
          onClick={() => setShowPopup(false)}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={14} />
        </button>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 text-white font-bold text-sm ring-2 ring-blue-100">
            PM
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-gray-900">PrepMantras Support</span>
            <span className="text-[10px] text-green-500 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
              Online to help
            </span>
            <p className="text-[11px] text-gray-600 mt-1 leading-tight">
              Hi! How can we help you today with your IT certification?
            </p>
          </div>
        </div>
      </div>

      {/* Main Floating Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 shadow-blue-500/30"
      >
        {/* Pulse effect */}
        <span className="absolute inset-0 rounded-full bg-blue-600 opacity-30 animate-ping group-hover:hidden" />
        
        <MessageCircle size={28} className="relative z-10" />
        
        {/* Notification Badge */}
        <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 border-2 border-white rounded-full flex items-center justify-center text-[10px] font-bold">1</span>
      </a>
    </div>
  );
}
