"use client";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";
import PageMaxWidth from "@/components/page-max-width";

// ─── Custom cursor ───────────────────────────────────────────────────────────
const CustomCursor = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });
  const raf = useRef<number>(0);

  useEffect(() => {
    const dot = dotRef.current;
    const ringEl = ringRef.current;
    if (!dot || !ringEl) return;

    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMove);

    const addHover = () => {
      document.querySelectorAll("a, button, [data-cursor]").forEach((el) => {
        el.addEventListener("mouseenter", () => {
          gsap.to(ringEl, {
            scale: 2.4,
            opacity: 0.4,
            duration: 0.3,
            ease: "power2.out",
          });
          gsap.to(dot, { scale: 0, duration: 0.2 });
        });
        el.addEventListener("mouseleave", () => {
          gsap.to(ringEl, {
            scale: 1,
            opacity: 1,
            duration: 0.4,
            ease: "elastic.out(1,0.5)",
          });
          gsap.to(dot, { scale: 1, duration: 0.3 });
        });
      });
    };
    addHover();

    const loop = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.1;
      ring.current.y += (pos.current.y - ring.current.y) * 0.1;
      dot.style.transform = `translate(${pos.current.x - 4}px, ${
        pos.current.y - 4
      }px)`;
      ringEl.style.transform = `translate(${ring.current.x - 20}px, ${
        ring.current.y - 20
      }px)`;
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className="pointer-events-none fixed top-0 left-0 z-[9999] w-2 h-2 rounded-full bg-[var(--primary)]"
        style={{ willChange: "transform" }}
      />
      <div
        ref={ringRef}
        className="pointer-events-none fixed top-0 left-0 z-[9998] w-10 h-10 rounded-full border border-[var(--primary)]/60"
        style={{ willChange: "transform" }}
      />
    </>
  );
};

// ─── Hero ────────────────────────────────────────────────────────────────────
const Hero = () => {
  const container = useRef<HTMLElement>(null);
  const scrollLineRef = useRef<HTMLDivElement>(null);
  const noiseRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(SplitText);

      const splits = gsap.utils
        .toArray<HTMLElement>(".hero-word")
        .map(
          (el) => new SplitText(el, { type: "chars", charsClass: "hero-char" })
        );
      const allChars = splits.flatMap((s) => s.chars);

      gsap.set(allChars, { yPercent: 105, rotate: 4, opacity: 0 });
      gsap.set(".hud-top", { opacity: 0, y: -14 });
      gsap.set(".hero-para", { opacity: 0, y: 18 });
      gsap.set(".resume-btn", { scale: 0.6, opacity: 0 });
      gsap.set(".scroll-ind", { opacity: 0, y: 10 });
      gsap.set(".hero-index", { opacity: 0, x: 10 });
      gsap.set(".hero-divider", { scaleX: 0, transformOrigin: "left" });

      const tl = gsap.timeline({
        defaults: { ease: "power4.out" },
        delay: 0.15,
      });

      tl.fromTo(
        noiseRef.current,
        { opacity: 0.15 },
        { opacity: 0.025, duration: 0.6, ease: "power2.in" }
      );
      tl.to(
        ".hud-top",
        { opacity: 1, y: 0, stagger: 0.06, duration: 0.7 },
        "<0.2"
      );
      tl.to(
        allChars,
        {
          yPercent: 0,
          rotate: 0,
          opacity: 1,
          stagger: { amount: 0.55, from: "start" },
          duration: 1.0,
          ease: "circ.out",
        },
        "-=0.4"
      );
      tl.to(
        ".hero-divider",
        { scaleX: 1, stagger: 0.08, duration: 0.7, ease: "circ.out" },
        "-=0.5"
      );
      tl.to(
        ".hero-index",
        { opacity: 1, x: 0, stagger: 0.05, duration: 0.5 },
        "-=0.5"
      );
      tl.to(".hero-para", { opacity: 1, y: 0, duration: 0.8 }, "-=0.4");
      tl.to(
        ".resume-btn",
        { scale: 1, opacity: 1, duration: 0.7, ease: "back.out(1.6)" },
        "-=0.55"
      );
      tl.to(".scroll-ind", { opacity: 1, y: 0, duration: 0.5 }, "-=0.3");

      gsap.fromTo(
        scrollLineRef.current,
        { yPercent: -100 },
        { yPercent: 200, duration: 1.4, ease: "none", repeat: -1 }
      );

      const btn = document.querySelector<HTMLElement>(".resume-btn");
      btn?.addEventListener("mousemove", (e: MouseEvent) => {
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - (r.left + r.width / 2)) * 0.45;
        const y = (e.clientY - (r.top + r.height / 2)) * 0.45;
        gsap.to(btn, { x, y, duration: 0.25, ease: "power2.out" });
      });
      btn?.addEventListener("mouseleave", () => {
        gsap.to(btn, {
          x: 0,
          y: 0,
          duration: 0.6,
          ease: "elastic.out(1, 0.35)",
        });
      });

      const onParallax = (e: MouseEvent) => {
        const xNorm = (e.clientX / window.innerWidth - 0.5) * 14;
        const yNorm = (e.clientY / window.innerHeight - 0.5) * 8;
        gsap.to(".parallax-slow", {
          x: xNorm * 0.5,
          y: yNorm * 0.5,
          duration: 1.2,
          ease: "power1.out",
        });
        gsap.to(".parallax-fast", {
          x: xNorm * 1.4,
          y: yNorm,
          duration: 0.9,
          ease: "power1.out",
        });
      };
      window.addEventListener("mousemove", onParallax);
      return () => window.removeEventListener("mousemove", onParallax);
    },
    { scope: container }
  );

  return (
    <>
      <CustomCursor />

      {/*
        Desktop layout strategy:
        ┌─ TOP BAR (HUD left, index right) ──────────────────────────────────┐
        │                                                                     │
        ├─ HEADING (Crafting / Digital / Motion.) ────────────────────────── │
        │                                                                     │
        ├─ BOTTOM ROW (para · stack label · resume btn) ─────────────────── │
        │                                                                     │
        └─ FOOT BAR (scroll indicator left, stack label right) ─────────────┘
        h-screen + flex-col, sections grow/shrink to fit exactly one viewport.
      */}
      <section
        ref={container}
        className="relative w-full h-screen flex flex-col overflow-hidden bg-[#f5f3ef] cursor-none"
      >
        {/* Grain */}
        <div
          ref={noiseRef}
          aria-hidden
          className="pointer-events-none absolute inset-0 z-50"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: "180px 180px",
            mixBlendMode: "multiply",
            opacity: 0.025,
          }}
        />

        {/* ── TOP BAR ────────────────────────────────────────────────────── */}
        <div className="relative z-10 flex items-start justify-between px-6 md:px-12 pt-8 shrink-0">
          {/* Left: HUD */}
          <div className="flex flex-col gap-1">
            <p className="hud-top text-[9px] uppercase tracking-[0.38em] font-bold text-black/35">
              Creative Frontend Eng.
            </p>
            <p className="hud-top text-[9px] uppercase tracking-[0.3em] font-bold text-[var(--primary)]/60">
              Available for work
            </p>
          </div>

          {/* Right: ghost index — sits in corner, bleeds up, no layout push */}
          <div className="hero-index flex flex-col items-end select-none pointer-events-none">
            <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-black/20">
              Selected Work
            </span>
            <span
              className="hidden lg:block font-syne font-black leading-none text-black/[0.038] tracking-tighter -mt-1"
              style={{ fontSize: "clamp(5rem, 9vw, 9rem)" }}
            >
              01
            </span>
          </div>
        </div>

        {/* ── HEADING — flex-1 centres vertically between top/foot bars ─── */}
        <div className="relative z-10 flex-1 flex flex-col justify-center min-h-0 px-6 md:px-12 lg:px-16 xl:px-20">
          <div className="flex flex-col parallax-slow">
            {/* Row 1 — Crafting */}
            <div className="flex items-end gap-3 md:gap-4">
              <div className="hero-divider w-6 md:w-10 h-[1.5px] bg-black/15 mb-[0.35em] shrink-0" />
              <div style={{ overflow: "clip" }}>
                <h1
                  className="hero-word font-syne font-black uppercase tracking-tighter leading-[0.85] text-black"
                  style={{ fontSize: "clamp(2.4rem, 8.8vw, 9rem)" }}
                >
                  Crafting
                </h1>
              </div>
              <span className="hero-index self-start text-[8px] font-bold uppercase tracking-[0.3em] text-black/22 hidden lg:block shrink-0 mt-1">
                2024
              </span>
            </div>

            {/* Row 2 — Digital (offset) */}
            <div style={{ overflow: "clip" }} className="md:pl-[11%]">
              <h1
                className="hero-word font-syne font-black uppercase tracking-tighter leading-[0.85] text-[var(--primary)]"
                style={{ fontSize: "clamp(2.4rem, 9.2vw, 9.5rem)" }}
              >
                Digital
              </h1>
            </div>

            {/* Row 3 — Motion (right-align + outline) */}
            <div className="flex items-end justify-end gap-3 md:gap-4 parallax-fast">
              <div className="hero-divider w-10 md:w-16 h-[1.5px] bg-black/10 mb-[0.35em] shrink-0" />
              <div style={{ overflow: "clip" }}>
                <h1
                  className="hero-word font-syne font-black uppercase tracking-tighter leading-[0.85] text-transparent"
                  style={{
                    fontSize: "clamp(2.4rem, 9.2vw, 9.5rem)",
                    WebkitTextStroke: "1.5px rgba(0,0,0,0.28)",
                  }}
                >
                  Motion.
                </h1>
              </div>
            </div>
          </div>
        </div>

        {/* ── BOTTOM ROW ─────────────────────────────────────────────────── */}
        <div className="relative z-10 shrink-0 px-6 md:px-12 lg:px-16 xl:px-20 pb-4 md:pb-6">
          <div className="grid grid-cols-1 md:grid-cols-12 items-end gap-4 md:gap-6">
            {/* Para */}
            <div className="md:col-span-5 lg:col-span-4 hero-para">
              <div className="h-px w-6 bg-[var(--primary)] mb-3" />
              <p className="text-[13px] md:text-sm leading-relaxed text-black/45 font-medium max-w-[280px] md:max-w-none">
                Focused on the intersection of{" "}
                <span className="text-black font-bold">
                  design and performance
                </span>
                . I build immersive, animation-driven experiences that tell
                compelling stories through clean technical execution.
              </p>
            </div>

            {/* Centre label — desktop only */}
            <div className="hidden lg:flex md:col-span-4 justify-center items-end pb-0.5">
              <p className="hero-index text-[8px] uppercase tracking-[0.32em] font-bold text-black/18 leading-loose text-center select-none">
                React · Next.js · GSAP · TypeScript
              </p>
            </div>

            {/* Resume button */}
            <div className="md:col-span-7 lg:col-span-4 flex items-end justify-start md:justify-end">
              <a
                href="/resume.pdf"
                data-cursor
                className="resume-btn relative rounded-full flex items-center justify-center group overflow-hidden border border-black/10 bg-white/60 backdrop-blur-sm shrink-0"
                style={{
                  width: "clamp(7rem,9vw,9rem)",
                  height: "clamp(7rem,9vw,9rem)",
                }}
              >
                <div className="absolute inset-0 bg-[var(--primary)] scale-0 group-hover:scale-100 transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] rounded-full" />
                <svg
                  className="absolute inset-0 w-full h-full animate-spin-slow opacity-25 group-hover:opacity-0 transition-opacity duration-300"
                  viewBox="0 0 100 100"
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="46"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.6"
                    strokeDasharray="4 6"
                    className="text-black/35"
                  />
                </svg>
                <span className="relative z-10 text-[8px] uppercase tracking-[0.22em] font-black text-black group-hover:text-white transition-colors duration-300 text-center leading-loose">
                  View
                  <br />
                  Resume
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* ── FOOT BAR ───────────────────────────────────────────────────── */}
        <div className="relative z-10 shrink-0 flex items-end justify-between px-6 md:px-12 lg:px-16 xl:px-20 pb-7 md:pb-9">
          {/* Scroll indicator */}
          <div className="scroll-ind flex items-center gap-3">
            <div className="relative w-px h-12 bg-black/10 overflow-hidden">
              <div
                ref={scrollLineRef}
                className="absolute top-0 left-0 w-full h-1/2 bg-[var(--primary)]"
              />
            </div>
            <span className="text-[8px] uppercase tracking-[0.45em] font-bold text-black/28">
              Scroll
            </span>
          </div>

          {/* Stack label mobile only (desktop shows it in centre col above) */}
          <div className="hero-index text-right select-none pointer-events-none lg:hidden">
            <p className="text-[8px] uppercase tracking-[0.3em] font-bold text-black/20 leading-loose">
              React · Next.js
              <br />
              GSAP · TypeScript
            </p>
          </div>
        </div>
      </section>

      <style jsx global>{`
        @keyframes spin-slow {
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        .hero-char {
          display: inline-block;
        }
      `}</style>
    </>
  );
};

export default Hero;
