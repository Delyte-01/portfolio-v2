"use client";
import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ExternalLink, X } from "lucide-react";
import Image from "next/image";
import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface certificatesProp {
  title: string;
  issuer: string;
  date: string;
  category: string;
  accentColor: string;
  accentLight: string;
  image: string;
  logo: string;
  span: string;
}

/* ─── Data ──────────────────────────────────────────────────────────────── */
const certificates: certificatesProp[] = [
  {
    title: "Internship Program",
    issuer: "Stanix",
    date: "March 2026",
    category: "Engineering",
    accentColor: "#000000",
    accentLight: "#f0f0f0",
    image:
      "https://res.cloudinary.com/dk5mfu099/image/upload/v1777618185/Maduneche_Samuel_-_Certificate_of_Internship_blyo2t.png",
    logo: "https://res.cloudinary.com/dk5mfu099/image/upload/v1777973126/Screenshot_from_2026-05-05_10-22-46_f3fasg.png",
    span: "large", // 2×2
  },
  {
    title: "Skill Test",
    issuer: "Hacker Rank",
    date: "Nov 2025",
    category: "Cloud",
    accentColor: "#FF9900",
    accentLight: "#fff8ec",
    image:
      "https://res.cloudinary.com/dk5mfu099/image/upload/v1777618442/hackercert_rzditg.png",
    logo: "https://res.cloudinary.com/dk5mfu099/image/upload/v1777973110/Screenshot_from_2026-05-05_10-24-57_dqoi7z.png",
    span: "tall", // 1×2
  },
  {
    title: "Frontend Training",
    issuer: "TECH 365",
    date: "Sep 2025",
    category: "Design Systems",
    accentColor: "#0082FB",
    accentLight: "#EFF6FF",
    image:
      "https://res.cloudinary.com/dk5mfu099/image/upload/v1777620664/WhatsApp_Image_2026-05-01_at_8.01.05_AM_oksehw.jpg",
    logo: "https://res.cloudinary.com/dk5mfu099/image/upload/v1777973126/Screenshot_from_2026-05-05_10-24-12_acqlnt.png",
    span: "wide",
  },
];

/* ─── Magnetic Cursor Hook ───────────────────────────────────────────────── */
function useMagneticCursor(
  ref: React.RefObject<HTMLElement | null>,
  strength = 0.35
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) * strength;
      const dy = (e.clientY - cy) * strength;
      gsap.to(el, { x: dx, y: dy, duration: 0.5, ease: "power3.out" });
    };
    const onLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.4)" });
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [ref, strength]);
}

/* ─── Single Card ────────────────────────────────────────────────────────── */
function CertCard({
  cert,
  index,
  handlePreview,
}: {
  cert: (typeof certificates)[0];
  index: number;
  handlePreview: (certImage: string) => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [hovered, setHovered] = useState(false);

  useMagneticCursor(btnRef as React.RefObject<HTMLElement | null>, 0.5);

  // Image parallax on hover
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current!.getBoundingClientRect();
    const rx = ((e.clientY - rect.top) / rect.height - 0.5) * 8;
    const ry = -((e.clientX - rect.left) / rect.width - 0.5) * 8;
    gsap.to(cardRef.current, {
      rotateX: rx,
      rotateY: ry,
      duration: 0.6,
      ease: "power2.out",
      transformPerspective: 1000,
    });
    gsap.to(imgRef.current, {
      scale: 1.08,
      x: (e.clientX - rect.left - rect.width / 2) * 0.04,
      y: (e.clientY - rect.top - rect.height / 2) * 0.04,
      duration: 0.6,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.8,
      ease: "elastic.out(1, 0.5)",
    });
    gsap.to(imgRef.current, {
      scale: 1,
      x: 0,
      y: 0,
      duration: 0.8,
      ease: "elastic.out(1, 0.5)",
    });
    setHovered(false);
  };

  const isLarge = cert.span === "large";
  const isTall = cert.span === "tall";
  const isWide = cert.span === "wide";

  const gridClass = isLarge
    ? "md:col-span-2 md:row-span-2"
    : isTall
    ? "md:col-span-1 md:row-span-2"
    : isWide
    ? "md:col-span-2 md:row-span-1"
    : "md:col-span-1 md:row-span-1";

  return (
    <div
      ref={cardRef}
      className={`bento-card ${gridClass} group relative rounded-[20px] overflow-hidden cursor-none`}
      style={{ transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      {/* ── Background image ── */}
      <div ref={imgRef} className="absolute inset-0 w-full h-full">
        <Image
          width={500}
          height={500}
          src={cert.image}
          alt={cert.title}
          className="w-full h-full object-cover"
          style={{ transform: "scale(1.05)" }}
        />
        {/* Dark overlay */}
        <div
          className="absolute inset-0 transition-opacity duration-700"
          style={{
            background: `linear-gradient(
              160deg,
              rgba(8,8,12,0.82) 0%,
              rgba(8,8,12,0.55) 45%,
              rgba(8,8,12,0.78) 100%
            )`,
          }}
        />
        {/* Accent color wash on hover */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-[0.12] transition-opacity duration-700"
          style={{ background: cert.accentColor }}
        />
      </div>

      {/* ── Noise texture ── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* ── Border glow ── */}
      <div
        className="absolute inset-0 rounded-[20px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          boxShadow: `inset 0 0 0 1px ${cert.accentColor}55`,
        }}
      />

      {/* ── Index number ── */}
      <div
        className="absolute top-5 right-6 font-mono text-xs font-bold tracking-widest opacity-30 text-white select-none"
        style={{ fontSize: "0.65rem", letterSpacing: "0.18em" }}
      >
        {String(index + 1).padStart(2, "0")} /{" "}
        {String(certificates.length).padStart(2, "0")}
      </div>

      {/* ── Category pill ── */}
      <div className="absolute top-5 left-5">
        <span
          className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full backdrop-blur-sm border"
          style={{
            color: cert.accentColor,
            background: `${cert.accentColor}18`,
            borderColor: `${cert.accentColor}35`,
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ background: cert.accentColor }}
          />
          {cert.category}
        </span>
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 flex flex-col justify-end h-full p-6">
        {/* Issuer logo + name */}
        <div className="flex items-center gap-2.5 mb-4">
          <img
            src={cert.logo}
            alt={cert.issuer}
            className="w-8 h-8 rounded-lg"
            style={{ imageRendering: "auto" }}
          />
          <span className="text-white/50 text-xs font-semibold tracking-wide uppercase">
            {cert.issuer}
          </span>
        </div>

        {/* Title */}
        <h4
          className="text-white font-black leading-[1.15] mb-3 title-text"
          style={{
            fontSize: isLarge
              ? "clamp(1.4rem, 2.5vw, 2rem)"
              : "clamp(1rem, 1.8vw, 1.25rem)",
            fontFamily: "'Syne', 'DM Serif Display', serif",
            letterSpacing: "-0.02em",
          }}
        >
          {cert.title}
        </h4>

        {/* Bottom row */}
        <div className="flex items-center justify-between mt-1">
          <div className="flex flex-col gap-0.5">
            <span
              className="h-px w-8 transition-all duration-500 group-hover:w-14"
              style={{ background: cert.accentColor }}
            />
            <span className="text-white/40 text-[11px] font-mono tracking-wider mt-1">
              {cert.date}
            </span>
          </div>

          {/* Magnetic CTA button */}
          <button
            onClick={() => handlePreview(cert.image)}
            ref={btnRef}
            className="btn-cta w-9 h-9 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 relative overflow-hidden"
            style={{
              background: cert.accentColor,
              boxShadow: `0 4px 20px ${cert.accentColor}60`,
            }}
          >
            <ExternalLink size={14} color="#fff" strokeWidth={2.5} />
            {/* Ripple on hover */}
            <span
              className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-20 scale-0 group-hover:scale-150 transition-all duration-700"
              style={{ background: "#fff" }}
            />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Section ────────────────────────────────────────────────────────────── */
const BentoCertificates = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [selectedCert, setSelectedCert] = useState<string>("");

  useGSAP(
    () => {
      /* ── Heading split reveal ── */
      const chars = headingRef.current?.querySelectorAll(".char") ?? [];
      gsap.from(chars, {
        y: "110%",
        opacity: 0,
        rotateX: -90,
        transformOrigin: "0% 50%",
        stagger: 0.04,
        duration: 1.1,
        ease: "expo.out",
        scrollTrigger: {
          trigger: headingRef.current,
          start: "top 85%",
        },
      });

      /* ── Ruled line expand ── */
      gsap.from(lineRef.current, {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 1.4,
        ease: "expo.out",
        delay: 0.2,
        scrollTrigger: {
          trigger: headingRef.current,
          start: "top 85%",
        },
      });

      /* ── Bento cards — clip-path curtain reveal ── */
      const cards = gridRef.current?.querySelectorAll(".bento-card") ?? [];
      gsap.from(cards, {
        clipPath: "inset(100% 0% 0% 0%)",
        opacity: 0,
        y: 30,
        stagger: {
          amount: 0.7,
          from: "start",
        },
        duration: 1.1,
        ease: "expo.out",
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 80%",
        },
      });

      /* ── Counter animate ── */
      const obj = { val: 0 };
      gsap.to(obj, {
        val: certificates.length,
        duration: 1.6,
        ease: "power2.out",
        delay: 0.5,
        onUpdate() {
          if (counterRef.current)
            counterRef.current.textContent = String(
              Math.round(obj.val)
            ).padStart(2, "0");
        },
        scrollTrigger: {
          trigger: headingRef.current,
          start: "top 85%",
        },
      });
    },
    { scope: sectionRef }
  );

  /* ── Render heading with per-char spans ── */
  const headingWord = "Certifications";
  const chars = headingWord.split("").map((ch, i) => (
    <span
      key={i}
      className="char inline-block"
      style={{ display: "inline-block" }}
    >
      {ch}
    </span>
  ));

  const handlePreview = (certImage: string) => {
    setSelectedCert(certImage);
    setOpen(true);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Mono:wght@400;500&family=Outfit:wght@400;500;600&display=swap');

        .cert-section * { box-sizing: border-box; }

        .cert-section {
          font-family: 'Outfit', sans-serif;
          background: #08080C;
          position: relative;
          overflow: hidden;
        }

        /* Global grain overlay */
        .cert-section::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 0;
        }

        /* Radial ambient glow */
        .cert-section::after {
          content: '';
          position: absolute;
          top: -200px;
          right: -200px;
          width: 700px;
          height: 700px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%);
          pointer-events: none;
        }

        .cert-label {
          font-family: 'DM Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
        }

        .cert-heading {
          font-family: 'Syne', sans-serif;
          font-weight: 900;
          line-height: 1;
          letter-spacing: -0.04em;
          color: #fff;
          overflow: hidden;
        }

        .char { display: inline-block; }

        .ruled-line {
          height: 1px;
          background: linear-gradient(90deg, rgba(255,255,255,0.15), rgba(255,255,255,0.04), transparent);
          transform-origin: left center;
        }

        .bento-card {
          transform-style: preserve-3d;
          will-change: transform;
          min-height: 220px;
        }

        @media (max-width: 768px) {
          .bento-card { min-height: 260px !important; }
        }
      `}</style>

      <section
        ref={sectionRef}
        className="cert-section py-28 relative z-10"
        id="certifications"
        data-theme="dark"
      >
        <div
          style={{
            maxWidth: 1160,
            margin: "0 auto",
            padding: "0 24px",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* ── Header ─────────────────────────────────────────────────── */}
          <div ref={headingRef} style={{ marginBottom: 56 }}>
            {/* top meta row */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 20,
              }}
            >
              <span className="cert-label">Selected credentials</span>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                <span
                  ref={counterRef}
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontWeight: 500,
                    fontSize: "2rem",
                    color: "#fff",
                    lineHeight: 1,
                  }}
                >
                  00
                </span>
                <span className="cert-label" style={{ marginBottom: 4 }}>
                  certifications
                </span>
              </div>
            </div>

            {/* ruled line */}
            <div
              ref={lineRef}
              className="ruled-line"
              style={{ marginBottom: 20 }}
            />

            {/* heading */}
            <h2
              className="cert-heading"
              style={{ fontSize: "clamp(2rem, 6vw, 7rem)", overflow: "hidden" }}
            >
              {chars}
            </h2>
          </div>

          {/* ── Bento Grid ────────────────────────────────────────────── */}
          <div
            ref={gridRef}
            className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-3"
            style={{ gridAutoRows: "240px" }}
          >
            {certificates.map((cert, i) => (
              <CertCard
                key={i}
                cert={cert}
                index={i}
                handlePreview={handlePreview}
              />
            ))}
          </div>

          {/* ── Footer note ───────────────────────────────────────────── */}
          <div
            style={{
              marginTop: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <div className="ruled-line" style={{ flex: 1, minWidth: 60 }} />
            <span className="cert-label" style={{ padding: "0 16px" }}>
              Verified · Industry Recognized
            </span>
            <div className="ruled-line" style={{ flex: 1, minWidth: 60 }} />
          </div>
        </div>
      </section>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[98vw] w-[120vw] max-h-[98vh] p-0 bg-transparent border-none shadow-none [&>button]:hidden">
          <div className="relative flex items-center justify-center w-full h-full">
            <div className="relative w-full max-w-7xl mx-auto">
              <DialogClose className="absolute -top-12 right-0 z-20 flex items-center gap-1.5 text-white/70 hover:text-white transition-all duration-200 group">
                <span className="text-xs font-medium tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  Close
                </span>
                <div className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 flex items-center justify-center transition-all duration-200 hover:scale-110">
                  <X size={16} />
                </div>
              </DialogClose>

              {selectedCert && (
                <div className="relative group">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 blur-2xl scale-105 pointer-events-none" />

                  <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-[0_32px_80px_rgba(0,0,0,0.8)]">
                    <Image
                      width={1600} // increased width
                      height={1000} // increased height
                      src={selectedCert}
                      alt="Certificate"
                      className="w-full h-full object-cover block object-center" // bigger height
                      priority
                    />
                    <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10 pointer-events-none" />
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-5 py-3.5 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-b-2xl">
                    <span className="text-white/60 text-xs tracking-widest uppercase font-medium">
                      Certificate
                    </span>
                    <a
                      href={selectedCert}
                      download
                      className="flex items-center gap-2 text-xs font-semibold text-white/80 hover:text-white bg-white/10 hover:bg-white/20 px-3.5 py-1.5 rounded-full border border-white/20 backdrop-blur-sm transition-all duration-200"
                    >
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                      Download
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BentoCertificates;
