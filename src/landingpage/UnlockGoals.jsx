"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";

import downloadable from "@/assets/unlockGoalsAssets/downloadable.jpg";
import affordable from "@/assets/unlockGoalsAssets/affordable.webp";
import moneyBack from "@/assets/unlockGoalsAssets/moneyBack.webp";
import support from "@/assets/unlockGoalsAssets/support.jpg";
import freeUpdate from "@/assets/unlockGoalsAssets/freeUpdate.webp";
import validDumps from "@/assets/unlockGoalsAssets/validDumps.webp";
import freesample from "@/assets/unlockGoalsAssets/freesample.webp";
import specialDiscount from "@/assets/unlockGoalsAssets/specialDiscount.webp";

const cardData = [
  {
    icon: downloadable,
    title: "Downloadable PDF",
    subtitle: "Questions & Answers",
    description: "100% original and verified IT Certification Prep for all exams. Download and study offline anytime.",
    badge: "PDF Download",
    accent: "#2563eb",
    accentLight: "#eff6ff",
    number: "01",
  },
  {
    icon: affordable,
    title: "Affordable Price",
    subtitle: "Best Value Guaranteed",
    description: "Premium exam materials at prices that never break the bank. Reasonable and accessible for everyone.",
    badge: "Budget Friendly",
    accent: "#059669",
    accentLight: "#ecfdf5",
    number: "02",
  },
  {
    icon: moneyBack,
    title: "Money Back",
    subtitle: "100% Guarantee",
    description: "Zero risk to you. If our resources don't meet expectations, claim a full refund — no questions asked.",
    badge: "Risk Free",
    accent: "#dc2626",
    accentLight: "#fff1f2",
    number: "03",
  },
  {
    icon: support,
    title: "24/7 Support",
    subtitle: "Always Here for You",
    description: "Live customer support to keep your learning smooth and effortless, any hour of the day.",
    badge: "Always On",
    accent: "#7c3aed",
    accentLight: "#f5f3ff",
    number: "04",
  },
  {
    icon: freeUpdate,
    title: "Free Updates",
    subtitle: "Up to 90 Days",
    description: "Stay current with free updates on all certification materials for a full 90 days post-purchase.",
    badge: "90 Days Free",
    accent: "#ea580c",
    accentLight: "#fff7ed",
    number: "05",
  },
  {
    icon: validDumps,
    title: "100% Valid Prep",
    subtitle: "Verified & Accurate",
    description: "Every question and answer is validated by industry experts for guaranteed certification success.",
    badge: "100% Valid",
    accent: "#0891b2",
    accentLight: "#ecfeff",
    number: "06",
  },
  {
    icon: freesample,
    title: "Free Sample",
    subtitle: "Try Before You Buy",
    description: "Test drive our materials completely free before committing. Quality you can verify upfront.",
    badge: "Try Free",
    accent: "#0d9488",
    accentLight: "#f0fdfa",
    number: "07",
  },
  {
    icon: specialDiscount,
    title: "Special Discounts",
    subtitle: "Limited Time Offers",
    description: "Exclusive deals on top-selling certification prep. Save big on the materials you need most.",
    badge: "Limited Offer",
    accent: "#d97706",
    accentLight: "#fffbeb",
    number: "08",
  },
];

const stats = [
  { value: "100%", label: "Verified Content", icon: "✓" },
  { value: "24/7", label: "Expert Support", icon: "◎" },
  { value: "90d", label: "Free Updates", icon: "↻" },
  { value: "50K+", label: "Professionals", icon: "◈" },
];

const WhyChooseSection = () => {
  const [revealed, setRevealed] = useState(new Set());
  const cardEls = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const i = parseInt(entry.target.dataset.cardindex);
            setRevealed((prev) => new Set([...prev, i]));
          }
        });
      },
      { threshold: 0.12 }
    );
    cardEls.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

        .wcs2-root * { box-sizing: border-box; }
        .wcs2-root { font-family: 'DM Sans', sans-serif; }
        .wcs2-serif { font-family: 'DM Serif Display', serif; }

        /* ── Card base ── */
        .wcs2-card {
          background: #ffffff;
          border: 1px solid #eef1f5;
          border-radius: 24px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          position: relative;
          transition: transform 0.3s cubic-bezier(.4,0,.2,1), box-shadow 0.3s cubic-bezier(.4,0,.2,1), border-color 0.3s;
          opacity: 0;
          transform: translateY(28px);
        }
        .wcs2-card.revealed {
          opacity: 1;
          transform: translateY(0);
          transition: opacity 0.55s ease, transform 0.55s ease,
                      box-shadow 0.3s cubic-bezier(.4,0,.2,1),
                      border-color 0.3s;
        }
        .wcs2-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 48px rgba(0,0,0,0.09);
        }

        /* ── Image area ── */
        .wcs2-img-wrap {
          position: relative;
          width: 100%;
          height: 160px;
          overflow: hidden;
          flex-shrink: 0;
        }
        .wcs2-img-wrap img { transition: transform 0.55s cubic-bezier(.4,0,.2,1); }
        .wcs2-card:hover .wcs2-img-wrap img { transform: scale(1.07); }

        .wcs2-img-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.1) 50%, transparent 100%);
        }

        /* Number stamp on image */
        .wcs2-num-stamp {
          position: absolute;
          top: 12px;
          left: 14px;
          font-family: 'DM Serif Display', serif;
          font-size: 13px;
          font-weight: 400;
          color: rgba(255,255,255,0.75);
          letter-spacing: 0.04em;
          line-height: 1;
          z-index: 2;
        }

        /* Badge on image */
        .wcs2-img-badge {
          position: absolute;
          bottom: 12px;
          left: 14px;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 3px 10px;
          border-radius: 100px;
          color: #fff;
          z-index: 2;
        }

        /* ── Card body ── */
        .wcs2-body {
          padding: 18px 20px 20px;
          display: flex;
          flex-direction: column;
          flex: 1;
          position: relative;
        }

        /* Top accent bar that slides in on hover */
        .wcs2-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: var(--card-accent, #2563eb);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.35s cubic-bezier(.4,0,.2,1);
          z-index: 3;
        }
        .wcs2-card:hover::before { transform: scaleX(1); }

        .wcs2-titles {
          margin-bottom: 10px;
        }
        .wcs2-title {
          font-size: 15px;
          font-weight: 600;
          color: #0f172a;
          line-height: 1.3;
          margin: 0 0 2px;
        }
        .wcs2-subtitle {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.02em;
          margin: 0;
        }

        .wcs2-desc {
          font-size: 12.5px;
          color: #94a3b8;
          line-height: 1.65;
          margin: 0;
          flex: 1;
        }

        /* ── Hero stat strip ── */
        .wcs2-stat {
          background: #fff;
          border: 1px solid #eef1f5;
          border-radius: 18px;
          padding: 16px 12px;
          text-align: center;
          transition: box-shadow 0.2s, transform 0.2s;
        }
        .wcs2-stat:hover { box-shadow: 0 6px 20px rgba(0,0,0,0.07); transform: translateY(-2px); }

        .wcs2-stat-val {
          font-family: 'DM Serif Display', serif;
          font-size: 22px;
          color: #0f172a;
          line-height: 1;
          margin-bottom: 4px;
        }
        .wcs2-stat-label {
          font-size: 10px;
          font-weight: 500;
          color: #94a3b8;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        /* ── Grid ── */
        .wcs2-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 18px;
        }
        @media (max-width: 1024px) {
          .wcs2-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        @media (max-width: 640px) {
          .wcs2-grid { grid-template-columns: minmax(0, 1fr); gap: 14px; }
          .wcs2-img-wrap { height: 140px; }
        }

        .wcs2-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 12px;
          margin-bottom: 40px;
        }
        @media (max-width: 640px) {
          .wcs2-stats-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }

        /* ── Section header ── */
        .wcs2-header {
          display: flex;
          flex-direction: row;
          align-items: flex-end;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 40px;
          flex-wrap: wrap;
        }

        /* Decorative corner dots on card */
        .wcs2-corner-dot {
          position: absolute;
          bottom: 18px;
          right: 18px;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transform: scale(0.7);
          transition: opacity 0.25s, transform 0.25s;
        }
        .wcs2-card:hover .wcs2-corner-dot { opacity: 1; transform: scale(1); }
      `}</style>

      <section className="wcs2-root w-full bg-[#f8f9fb] py-16 px-4 sm:px-8 lg:px-16">
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>

          {/* ── Section Header ── */}
          <div className="wcs2-header">
            <div>
              <p style={{
                fontSize: 11, fontWeight: 700, letterSpacing: "0.1em",
                textTransform: "uppercase", color: "#94a3b8",
                margin: "0 0 8px", display: "flex", alignItems: "center", gap: 8,
              }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#13677c", display: "inline-block" }} />
                Why choose us
              </p>
              <h2 className="wcs2-serif" style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)", color: "#0f172a", lineHeight: 1.15, margin: "0 0 8px" }}>
                Why Choose <em>Prepmantras?</em>
              </h2>
              <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>
                Everything you need to pass your certification — the first time.
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#94a3b8", flexShrink: 0 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#34d399", display: "inline-block" }} />
              {cardData.length} reasons to trust us
            </div>
          </div>

          {/* ── Stat Strip ── */}
          <div className="wcs2-stats-grid">
            {stats.map((s) => (
              <div key={s.label} className="wcs2-stat">
                <div className="wcs2-stat-val">{s.value}</div>
                <div className="wcs2-stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          {/* ── Cards Grid ── */}
          <div className="wcs2-grid">
            {cardData.map((card, i) => (
              <div
                key={i}
                ref={(el) => (cardEls.current[i] = el)}
                data-cardindex={i}
                className={`wcs2-card${revealed.has(i) ? " revealed" : ""}`}
                style={{
                  "--card-accent": card.accent,
                  transitionDelay: revealed.has(i) ? `${(i % 4) * 70}ms` : "0ms",
                }}
              >
                {/* Image */}
                <div className="wcs2-img-wrap">
                  <Image
                    src={card.icon}
                    alt={card.title}
                    fill
                    style={{ objectFit: "contain", padding: "15px", backgroundColor: "#ffffff" }}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="wcs2-img-overlay" />
                  <span className="wcs2-num-stamp">{card.number}</span>
                  <span
                    className="wcs2-img-badge"
                    style={{ background: card.accent + "cc" }}
                  >
                    {card.badge}
                  </span>
                </div>

                {/* Body */}
                <div className="wcs2-body">
                  <div className="wcs2-titles">
                    <p className="wcs2-title">{card.title}</p>
                    <p className="wcs2-subtitle" style={{ color: card.accent }}>{card.subtitle}</p>
                  </div>

                  <p className="wcs2-desc">{card.description}</p>

                  {/* Hover corner dot */}
                  <div
                    className="wcs2-corner-dot"
                    style={{ background: card.accentLight }}
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6h8M7 3l3 3-3 3" stroke={card.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>
    </>
  );
};

export default WhyChooseSection;