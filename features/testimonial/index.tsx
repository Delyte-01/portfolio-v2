"use client";
import { useRef, useState, useCallback, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/* ─── Data ────────────────────────────────────────────────────────────────── */
const testimonials = [
  {
    name: "Alex Rivera",
    role: "CEO @ Nexus",
    company: "Nexus",
    rating: 5,
    text: "David transformed our complex dashboard into a clean, architectural masterpiece. The attention to spatial composition and motion alone made it worth every penny. A true artist of the web.",
  },
  {
    name: "Sarah Chen",
    role: "Design Lead",
    company: "Prismatic",
    rating: 5,
    text: "Working with Delyte Tech was a masterclass in frontend performance. The GSAP integration is buttery smooth — our users noticed the difference immediately.",
  },
  {
    name: "James Knight",
    role: "Product Owner",
    company: "Meridian",
    rating: 5,
    text: "Exceptional motion design sense. He doesn't just build websites; he builds experiences that our customers keep coming back to explore.",
  },
  {
    name: "Mila Osei",
    role: "Lead Developer",
    company: "Volta Labs",
    rating: 5,
    text: "Clean code and incredible attention to detail. The best frontend collaborator we've had. Shipped on time, zero regressions, beautiful output.",
  },
  {
    name: "Tom Hargreaves",
    role: "Founder",
    company: "Stackline",
    rating: 5,
    text: "Brought our brand's personality into every interaction. The hover states and micro-animations feel alive without ever being distracting.",
  },
];

/* ─── Avatar Initials ─────────────────────────────────────────────────────── */
const palette = [
  { bg: "#E8F0FE", fg: "#1D4ED8" },
  { bg: "#FEF3C7", fg: "#D97706" },
  { bg: "#ECFDF5", fg: "#059669" },
  { bg: "#FDF2F8", fg: "#9333EA" },
  { bg: "#FFF7ED", fg: "#EA580C" },
];

function Avatar({ name, index }: { name: string; index: number }) {
  const { bg, fg } = palette[index % palette.length];
  return (
    <div
      style={{ background: bg, color: fg }}
      className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-base flex-shrink-0 select-none"
    >
      {name
        .split(" ")
        .map((n) => n[0])
        .join("")}
    </div>
  );
}

/* ─── Star Rating ─────────────────────────────────────────────────────────── */
function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill={i < count ? "#F59E0B" : "#E5E7EB"}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M7 1l1.545 3.13 3.455.502-2.5 2.437.59 3.44L7 8.885l-3.09 1.624.59-3.44L2 4.632l3.455-.502L7 1z" />
        </svg>
      ))}
    </div>
  );
}

/* ─── Component ───────────────────────────────────────────────────────────── */
const Testimonials = () => {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const authorRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const progressTweenRef = useRef<gsap.core.Tween | null>(null);
  const goToRef = useRef<
    ((newIndex: number, dir: "next" | "prev") => void) | null
  >(null);


  // Use a ref for current so startProgress/navigate always read the latest value
  const currentRef = useRef(0);
  const isAnimatingRef = useRef(false);
  const total = testimonials.length;

  /* ── enter animation (runs after state has updated & DOM reflects new content) ── */
  const playEnter = useCallback((xIn: number) => {
    gsap.set([quoteRef.current, textRef.current, authorRef.current], {
      x: xIn,
      opacity: 0,
    });
    gsap.to([quoteRef.current, textRef.current, authorRef.current], {
      opacity: 1,
      x: 0,
      duration: 0.45,
      ease: "power3.out",
      stagger: 0.07,
      onComplete: () => {
        isAnimatingRef.current = false;
        setIsAnimating(false);
      },
    });
  }, []);

  /* ── progress bar ──────────────────────────────────────────────────────────── */
  const startProgress = useCallback(() => {
    if (progressTweenRef.current) progressTweenRef.current.kill();
    gsap.set(progressRef.current, { scaleX: 0 });
    progressTweenRef.current = gsap.to(progressRef.current, {
      scaleX: 1,
      duration: 5,
      ease: "none",
      transformOrigin: "left center",
      onComplete: () => {
        // Read latest index from ref — avoids stale closure
        const newIndex = (currentRef.current + 1) % total;
        goToRef.current?.(newIndex, "next"); // call via ref
      },
    });
  }, [total]); 

  /* ── core navigation ───────────────────────────────────────────────────────── */
  const goTo = useCallback(
    (newIndex: number, direction: "next" | "prev") => {
      if (isAnimatingRef.current) return;
      isAnimatingRef.current = true;
      setIsAnimating(true);

      if (progressTweenRef.current) progressTweenRef.current.kill();

      const xOut = direction === "next" ? -40 : 40;
      const xIn = direction === "next" ? 40 : -40;

      const exitTl = gsap.timeline({
        onComplete: () => {
          currentRef.current = newIndex;
          setCurrent(newIndex);

          gsap.to(cardRef.current, {
            backgroundColor: "#F8FAFF",
            duration: 0.12,
            ease: "power1.in",
            onComplete: () => {
              gsap.to(cardRef.current, {
                backgroundColor: "#FFFFFF",
                duration: 0.22,
                ease: "power1.out",
              });
              requestAnimationFrame(() => {
                playEnter(xIn);
                startProgress(); // safe, because startProgress doesn’t depend on goTo
              });
            },
          });
        },
      });

      exitTl.to([quoteRef.current, textRef.current, authorRef.current], {
        opacity: 0,
        x: xOut,
        duration: 0.28,
        ease: "power2.in",
        stagger: 0.04,
      });
    },
    [playEnter] // only depends on playEnter
  );

  // assign to ref so startProgress can use it
 useEffect(() => {
   goToRef.current = goTo;
 }, [goTo]);


  /* ── public navigate (by direction) ─────────────────────────────────────── */
  const navigate = useCallback(
    (direction: "next" | "prev") => {
      const newIndex =
        direction === "next"
          ? (currentRef.current + 1) % total
          : (currentRef.current - 1 + total) % total;
      goTo(newIndex, direction);
    },
    [goTo, total]
  );

  /* ── initial mount ───────────────────────────────────────────────────────── */
  useGSAP(() => {
    const tl = gsap.timeline({ onComplete: startProgress });
    tl.fromTo(
      quoteRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }
    )
      .fromTo(
        textRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
        "-=0.4"
      )
      .fromTo(
        authorRef.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" },
        "-=0.35"
      );
  }, []);


  const t = testimonials[current];

  return (
    <>
      {/* ── Google Fonts ─────────────────────────────────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=Outfit:wght@400;500;600;700&display=swap');

        .testi-section { font-family: 'Outfit', sans-serif; }
 

        .testi-card {
          background: #ffffff;
          border-radius: 24px;
          border: 1px solid #E8ECF2;
          box-shadow: 0 2px 8px rgba(15,23,42,0.04), 0 12px 40px rgba(15,23,42,0.06);
          position: relative;
          overflow: hidden;
        }

        .testi-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
          pointer-events: none;
          border-radius: inherit;
        }

        .testi-nav-btn {
          width: 48px; height: 48px;
          border-radius: 50%;
          border: 1.5px solid #E2E8F0;
          background: #ffffff;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          color: #64748B;
          transition: all 0.25s cubic-bezier(0.22,1,0.36,1);
          box-shadow: 0 1px 4px rgba(15,23,42,0.06);
        }
        .testi-nav-btn:hover {
          border-color: #1D4ED8;
          color: #1D4ED8;
          background: #EFF6FF;
          box-shadow: 0 4px 16px rgba(29,78,216,0.15);
          transform: scale(1.06);
        }
        .testi-nav-btn:active { transform: scale(0.95); }

        .dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #CBD5E1;
          transition: all 0.35s cubic-bezier(0.22,1,0.36,1);
          cursor: pointer;
        }
        .dot.active {
          width: 24px;
          border-radius: 99px;
          background: #1D4ED8;
        }

        .progress-track {
          height: 2px;
          background: #E2E8F0;
          border-radius: 99px;
          overflow: hidden;
          position: relative;
        }
        .progress-fill {
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, #1D4ED8, #60A5FA);
          transform: scaleX(0);
          transform-origin: left center;
          border-radius: 99px;
        }

        .giant-quote {
          font-family: 'Playfair Display', serif;
          font-size: clamp(80px, 14vw, 160px);
          line-height: 0.75;
          color: #EFF6FF;
          font-style: italic;
          font-weight: 700;
          user-select: none;
          pointer-events: none;
          position: absolute;
          top: 24px;
          left: 28px;
        }

        @media (max-width: 640px) {
          .testi-card { padding: 32px 24px 28px; }
        }
      `}</style>

      <section
        id="testimonial"
        className="testi-section py-20 md:py-28 overflow-hidden"
        style={{
          background:
            "linear-gradient(160deg, #F8FAFF 0%, #FFFFFF 50%, #F1F5F9 100%)",
        }}
      >
        <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 20px" }}>
          {/* ── Header ───────────────────────────────────────────────────── */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: "#EFF6FF",
                  border: "1px solid #DBEAFE",
                  borderRadius: 99,
                  padding: "4px 14px",
                  marginBottom: 14,
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#1D4ED8",
                    display: "inline-block",
                  }}
                />
                <span
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    color: "#1D4ED8",
                    letterSpacing: "1.2px",
                    textTransform: "uppercase",
                  }}
                >
                  Testimonials
                </span>
              </div>
              <h2
                className="testi-display font-syne"
                style={{
                  fontSize: "clamp(2rem, 5vw, 3rem)",
                  fontWeight: 700,
                  color: "#0F172A",
                  lineHeight: 1.15,
                  letterSpacing: "-0.5px",
                  margin: 0,
                }}
              >
                What people say.
              </h2>
            </div>

            {/* Nav controls */}
            <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
              <button
                className="testi-nav-btn"
                onClick={() => navigate("prev")}
                aria-label="Previous"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                className="testi-nav-btn"
                onClick={() => navigate("next")}
                aria-label="Next"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* ── Card ─────────────────────────────────────────────────────── */}
          <div
            ref={cardRef}
            className="testi-card"
            style={{ padding: "52px 48px 44px" }}
          >
            {/* Decorative giant quote mark */}
            <div className="giant-quote" aria-hidden="true">
              &ldquo;
            </div>

            {/* Stars */}
            <div
              ref={quoteRef}
              style={{ marginBottom: 24, position: "relative", zIndex: 1 }}
            >
              <Stars count={t.rating} />
            </div>

            {/* Quote text */}
            <p
              ref={textRef}
              className="testi-display"
              style={{
                fontStyle: "italic",
                fontWeight: 400,
                fontSize: "clamp(1.15rem, 2.5vw, 1.5rem)",
                lineHeight: 1.65,
                color: "#1E293B",
                marginBottom: 36,
                position: "relative",
                zIndex: 1,
                maxWidth: "90%",
              }}
            >
              &ldquo;{t.text}&rdquo;
            </p>

            {/* Divider */}
            <div
              style={{
                height: 1,
                background: "linear-gradient(90deg, #E2E8F0, transparent)",
                marginBottom: 28,
              }}
            />

            {/* Author */}
            <div
              ref={authorRef}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 16,
                position: "relative",
                zIndex: 1,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <Avatar name={t.name} index={current} />
                <div>
                  <p
                    style={{
                      fontWeight: 700,
                      color: "#0F172A",
                      fontSize: "0.95rem",
                      margin: 0,
                      lineHeight: 1.2,
                    }}
                  >
                    {t.name}
                  </p>
                  <p
                    style={{
                      color: "#94A3B8",
                      fontSize: "0.8rem",
                      margin: "4px 0 0",
                      fontWeight: 500,
                    }}
                  >
                    {t.role}
                  </p>
                </div>
              </div>

              {/* Counter badge */}
              <div
                style={{
                  background: "#F8FAFF",
                  border: "1px solid #E2E8F0",
                  borderRadius: 99,
                  padding: "6px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <span
                  style={{
                    fontSize: "0.92rem",
                    fontWeight: 800,
                    color: "#1D4ED8",
                  }}
                >
                  {String(current + 1).padStart(2, "0")}
                </span>
                <span style={{ color: "#CBD5E1", fontSize: "0.8rem" }}>/</span>
                <span
                  style={{
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    color: "#94A3B8",
                  }}
                >
                  {String(total).padStart(2, "0")}
                </span>
              </div>
            </div>
          </div>

          {/* ── Progress + Dots ───────────────────────────────────────────── */}
          <div
            style={{
              marginTop: 28,
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            {/* Auto-progress bar */}
            <div className="progress-track">
              <div ref={progressRef} className="progress-fill" />
            </div>

            {/* Dot indicators */}
            <div
              style={{
                display: "flex",
                gap: 8,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  className={`dot${i === current ? " active" : ""}`}
                  onClick={() => {
                    if (i === current || isAnimating) return;
                    navigate(i > current ? "next" : "prev");
                  }}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Testimonials;
