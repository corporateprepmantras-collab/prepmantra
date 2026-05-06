"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import heading from "@/assets/landingassets/testimonial.webp";

const testimonials = [
  {
    name: "Yogesh Upadhyay",
    role: "Cloud Architect",
    feedback:
      "This platform changed my life. The support and resources are unmatched. I passed my AWS cert on the first attempt!",
    image: "https://randomuser.me/api/portraits/men/75.jpg",
    rating: 5,
    cert: "AWS Certified",
  },
  {
    name: "Priya Sharma",
    role: "IT Manager",
    feedback:
      "Highly recommended! The courses are comprehensive and easy to follow. The practice tests are incredibly realistic.",
    image: "https://randomuser.me/api/portraits/women/65.jpg",
    rating: 5,
    cert: "Azure Expert",
  },
  {
    name: "Amit Verma",
    role: "Network Engineer",
    feedback:
      "A fantastic learning experience with great community support. Worth every rupee. My salary doubled post-certification.",
    image: "https://randomuser.me/api/portraits/men/76.jpg",
    rating: 5,
    cert: "CCNA Certified",
  },
];

const stats = [
  { value: "50K+", label: "Certified Professionals" },
  { value: "98%", label: "Pass Rate" },
  { value: "200+", label: "Exam Guides" },
  { value: "4.9★", label: "Average Rating" },
];

export default function TestimonialSection() {
  const [current, setCurrent] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const total = testimonials.length;

  useEffect(() => {
    if (!autoplay) return;
    const t = setInterval(() => setCurrent((p) => (p + 1) % total), 4500);
    return () => clearInterval(t);
  }, [autoplay, total]);

  const next = () => {
    setAutoplay(false);
    setCurrent((p) => (p + 1) % total);
  };
  const prev = () => {
    setAutoplay(false);
    setCurrent((p) => (p - 1 + total) % total);
  };

  return (
    <>
      <style>{`
        .ts-root { font-family: 'DM Sans', sans-serif; }
        .ts-serif { font-family: 'DM Serif Display', serif; }

        .ts-card {
          background: #fff;
          border: 1px solid #eef1f5;
          border-radius: 28px;
          padding: 32px 28px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 4px 24px rgba(0,0,0,0.05);
        }

        .ts-quote-mark {
          font-family: 'DM Serif Display', serif;
          font-size: 120px;
          line-height: 1;
          color: #f1f5f9;
          position: absolute;
          top: -10px;
          left: 20px;
          pointer-events: none;
          user-select: none;
          z-index: 0;
        }

        .ts-avatar {
          width: 64px; height: 64px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid #fff;
          box-shadow: 0 4px 14px rgba(0,0,0,0.12);
          flex-shrink: 0;
        }

        .ts-cert-badge {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          padding: 3px 10px;
          border-radius: 100px;
          background: #f0fdf4;
          color: #16a34a;
          border: 1px solid #bbf7d0;
        }

        .ts-nav-btn {
          width: 42px; height: 42px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          border: 1.5px solid #e2e8f0;
          background: #fff;
          color: #64748b;
          transition: all 0.2s ease;
        }
        .ts-nav-btn:hover { border-color: #13677c; color: #13677c; transform: scale(1.08); }

        .ts-dot {
          height: 6px; border-radius: 3px;
          cursor: pointer;
          transition: all 0.35s ease;
          background: #e2e8f0;
          border: none;
        }
        .ts-dot.active { background: #13677c; }

        .ts-stat {
          border-right: 1px solid #f0f2f5;
          padding: 0 28px;
          text-align: center;
        }
        .ts-stat:first-child { padding-left: 0; }
        .ts-stat:last-child { border-right: none; padding-right: 0; }

        .ts-left-panel {
          background: #0c1523;
          border-radius: 28px;
          padding: 40px 36px;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 420px;
        }
        .ts-left-panel::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse at 20% 40%, rgba(19,103,124,0.3) 0%, transparent 60%),
            radial-gradient(ellipse at 80% 80%, rgba(122,169,60,0.12) 0%, transparent 50%);
        }
        .ts-grid-bg {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 36px 36px;
        }

        .ts-heading-img {
          position: absolute;
          bottom: 0; right: 0;
          width: 55%;
          opacity: 0.12;
          pointer-events: none;
        }

        .ts-section-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 28px;
          align-items: center;
        }
        @media (max-width: 900px) {
          .ts-section-layout { grid-template-columns: 1fr; }
          .ts-left-panel { min-height: auto; }
          .ts-stats-row { flex-wrap: wrap; gap: 20px; }
          .ts-stat { border-right: none; padding: 0; }
        }
        @media (max-width: 480px) {
          .ts-left-panel { padding: 28px 24px; }
          .ts-card { padding: 24px 20px; }
        }

        .ts-stars { display: flex; gap: 3px; margin-bottom: 14px; }
        .ts-star { color: #f59e0b; font-size: 15px; }
      `}</style>

      <section className="ts-root w-full bg-[#f8f9fb] py-16 sm:py-20 px-4 sm:px-8 lg:px-16">
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          {/* ── Section Header ── */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: 16,
              marginBottom: 40,
              flexWrap: "wrap",
            }}
          >
            <div>
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#94a3b8",
                  margin: "0 0 8px",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#13677c",
                    display: "inline-block",
                  }}
                />
                Student Stories
              </p>
              <h2
                className="ts-serif"
                style={{
                  fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
                  color: "#0f172a",
                  lineHeight: 1.15,
                  margin: 0,
                }}
              >
                Why Students <em>Love Us</em>
              </h2>
            </div>
            {/* Stats row */}
            <div
              className="ts-stats-row"
              style={{ display: "flex", alignItems: "center" }}
            >
              {stats.map((s) => (
                <div key={s.label} className="ts-stat">
                  <div
                    className="ts-serif"
                    style={{
                      fontSize: 22,
                      fontWeight: 400,
                      color: "#0f172a",
                      lineHeight: 1,
                      marginBottom: 4,
                    }}
                  >
                    {s.value}
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      color: "#94a3b8",
                    }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Main Grid ── */}
          <div className="ts-section-layout">
            {/* LEFT — Dark brand panel */}
            <div className="ts-left-panel">
              <div className="ts-grid-bg" />

              {/* Heading image watermark */}
              <div className="ts-heading-img">
                <Image
                  src={heading}
                  alt=""
                  style={{
                    width: "100%",
                    height: "auto",
                    objectFit: "contain",
                  }}
                />
              </div>

              <div style={{ position: "relative", zIndex: 2 }}>
                <p
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.35)",
                    marginBottom: 16,
                  }}
                >
                  Testimonials
                </p>
                <h3
                  className="ts-serif"
                  style={{
                    fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
                    color: "#fff",
                    lineHeight: 1.2,
                    marginBottom: 18,
                  }}
                >
                  Trusted by <em>50,000+</em>
                  <br /> Certified Pros
                </h3>
                <p
                  style={{
                    fontSize: 13,
                    color: "rgba(255,255,255,0.5)",
                    lineHeight: 1.75,
                    maxWidth: 340,
                    marginBottom: 32,
                  }}
                >
                  Our learners don't just pass exams — they transform careers.
                  Every testimonial represents a real milestone in someone's
                  professional journey.
                </p>

                {/* Mini avatar stack */}
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ display: "flex" }}>
                    {testimonials.map((t, i) => (
                      <img
                        key={i}
                        src={t.image}
                        alt={t.name}
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: "50%",
                          border: "2px solid #0c1523",
                          marginLeft: i > 0 ? -10 : 0,
                          objectFit: "cover",
                        }}
                      />
                    ))}
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        background: "rgba(255,255,255,0.1)",
                        border: "2px solid #0c1523",
                        marginLeft: -10,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 10,
                        fontWeight: 700,
                        color: "rgba(255,255,255,0.6)",
                      }}
                    >
                      +49K
                    </div>
                  </div>
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
                    and thousands more
                  </p>
                </div>
              </div>

              {/* Bottom trust badges */}
              <div
                style={{
                  position: "relative",
                  zIndex: 2,
                  display: "flex",
                  gap: 10,
                  marginTop: 32,
                  flexWrap: "wrap",
                }}
              >
                {["98% Pass Rate", "Money Back", "24/7 Support"].map((b) => (
                  <span
                    key={b}
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      letterSpacing: "0.06em",
                      padding: "5px 13px",
                      borderRadius: 100,
                      background: "rgba(255,255,255,0.07)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      color: "rgba(255,255,255,0.55)",
                    }}
                  >
                    {b}
                  </span>
                ))}
              </div>
            </div>

            {/* RIGHT — Testimonial carousel */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {/* Card */}
              <div style={{ position: "relative", minHeight: 280 }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current}
                    initial={{ opacity: 0, y: 20, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.98 }}
                    transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                  >
                    <div className="ts-card">
                      {/* Giant quote */}
                      <div className="ts-quote-mark" aria-hidden>
                        "
                      </div>

                      <div style={{ position: "relative", zIndex: 1 }}>
                        {/* Stars */}
                        <div className="ts-stars">
                          {[...Array(testimonials[current].rating)].map(
                            (_, i) => (
                              <span key={i} className="ts-star">
                                ★
                              </span>
                            ),
                          )}
                        </div>

                        {/* Feedback */}
                        <p
                          style={{
                            fontSize: "clamp(1rem, 2.2vw, 1.15rem)",
                            color: "#1e293b",
                            lineHeight: 1.75,
                            fontWeight: 400,
                            marginBottom: 28,
                            fontStyle: "italic",
                          }}
                        >
                          "{testimonials[current].feedback}"
                        </p>

                        {/* Author */}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 14,
                          }}
                        >
                          <img
                            src={testimonials[current].image}
                            alt={testimonials[current].name}
                            className="ts-avatar"
                          />
                          <div>
                            <p
                              style={{
                                fontSize: 14,
                                fontWeight: 600,
                                color: "#0f172a",
                                margin: "0 0 2px",
                              }}
                            >
                              {testimonials[current].name}
                            </p>
                            <p
                              style={{
                                fontSize: 12,
                                color: "#94a3b8",
                                margin: "0 0 6px",
                              }}
                            >
                              {testimonials[current].role}
                            </p>
                            <span className="ts-cert-badge">
                              {testimonials[current].cert}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Controls */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                {/* Dots */}
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      className={`ts-dot${i === current ? " active" : ""}`}
                      style={{ width: i === current ? 28 : 8 }}
                      onClick={() => {
                        setAutoplay(false);
                        setCurrent(i);
                      }}
                      aria-label={`Go to testimonial ${i + 1}`}
                    />
                  ))}
                </div>

                {/* Prev / Next */}
                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    className="ts-nav-btn"
                    onClick={prev}
                    aria-label="Previous"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M19 12H5M11 6l-6 6 6 6" />
                    </svg>
                  </button>
                  <button
                    className="ts-nav-btn"
                    onClick={next}
                    aria-label="Next"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Other testimonial previews */}
              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                {testimonials.map((t, i) => {
                  if (i === current) return null;
                  return (
                    <button
                      key={i}
                      onClick={() => {
                        setAutoplay(false);
                        setCurrent(i);
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 14,
                        background: "#fff",
                        border: "1px solid #eef1f5",
                        borderRadius: 16,
                        padding: "12px 16px",
                        cursor: "pointer",
                        textAlign: "left",
                        transition: "border-color 0.2s, box-shadow 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "#13677c";
                        e.currentTarget.style.boxShadow =
                          "0 4px 16px rgba(19,103,124,0.08)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "#eef1f5";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      <img
                        src={t.image}
                        alt={t.name}
                        style={{
                          width: 38,
                          height: 38,
                          borderRadius: "50%",
                          objectFit: "cover",
                          flexShrink: 0,
                        }}
                      />
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <p
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: "#0f172a",
                            margin: 0,
                          }}
                        >
                          {t.name}
                        </p>
                        <p
                          style={{
                            fontSize: 11,
                            color: "#94a3b8",
                            margin: 0,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {t.feedback.slice(0, 55)}…
                        </p>
                      </div>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#cbd5e1"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ flexShrink: 0 }}
                      >
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
