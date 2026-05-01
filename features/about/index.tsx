"use client";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import PageMaxWidth from "@/components/page-max-width";

interface CounterProps {
  to: number;
  suffix?: string;
}

// ─── Magnetic cursor blob ────────────────────────────────────────────────────
const MagneticCursor = () => {
  const blobRef = useRef<HTMLDivElement | null>(null);
  const pos = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const blob = blobRef.current;
    if (!blob) return;

    const onMove = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMove);

    const loop = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.065;
      pos.current.y += (target.current.y - pos.current.y) * 0.065;
      blob.style.transform = `translate(${pos.current.x - 180}px, ${
        pos.current.y - 180
      }px)`;
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMove);
      if (raf.current !== null) cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <div
      ref={blobRef}
      className="pointer-events-none fixed top-0 left-0 z-[999] w-[360px] h-[360px] rounded-full"
      style={{
        background:
          "radial-gradient(circle, oklch(45.54% 0.187 259.01 / 0.2) 0%, transparent 68%)",
        willChange: "transform",
        mixBlendMode: "screen",
      }}
    />
  );
};

// ─── Animated counter ────────────────────────────────────────────────────────
const Counter: React.FC<CounterProps> = ({ to, suffix = "" }) => {
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obj = { val: 0 };
    const anim = gsap.to(obj, {
      val: to,
      duration: 1.6,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 88%" },
      onUpdate: () => {
        el.textContent = Math.round(obj.val) + suffix;
      },
    });
    return () => {
      anim.kill();
    };
  }, [to, suffix]);

  return <span ref={ref}>0{suffix}</span>;
};

// ─── Main ────────────────────────────────────────────────────────────────────
const About = () => {
  const container = useRef<HTMLElement | null>(null);
  const maskRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const lineRef1 = useRef<HTMLDivElement | null>(null);
  const lineRef2 = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger, SplitText);

      const isDesktop = window.matchMedia("(min-width: 1024px)").matches;

      // ── SplitText ─────────────────────────────────────────────────────────
      const split1 = new SplitText(".about-word-1", {
        type: "chars",
        charsClass: "char-el",
      });
      const split2 = new SplitText(".about-word-2", {
        type: "chars",
        charsClass: "char-el",
      });
      const chars1 = split1.chars;
      const chars2 = split2.chars;

      // ── Lines ─────────────────────────────────────────────────────────────
      gsap.set([lineRef1.current, lineRef2.current], {
        scaleX: 0,
        transformOrigin: "left center",
      });

      // ─────────────────────────────────────────────────────────────────────
      if (isDesktop) {
        // Initial states
        gsap.set(maskRef.current, { clipPath: "circle(0% at 15% 85%)" });
        gsap.set([...chars1, ...chars2], { yPercent: 115 });
        gsap.set(".bio-item", { opacity: 0, y: 28 });
        gsap.set(".stat-item", { opacity: 0, y: 22, scale: 0.94 });
        gsap.set(".tag-item", { opacity: 0, x: -10 });
        gsap.set(".label-item", { opacity: 0, y: 10 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: container.current,
            start: "top top",
            end: "+=2400",
            pin: true,
            scrub: 0.3, // snappy
            anticipatePin: 1,
          },
          defaults: { ease: "power4.out" },
        });

        // 1 ─ Mask wipe from bottom-left (dramatic, directional)
        tl.to(maskRef.current, {
          clipPath: "circle(170% at 15% 85%)",
          duration: 1.8,
          ease: "power4.inOut",
        });

        // 2 ─ Image parallax (same start)
        tl.to(
          imageRef.current,
          { y: "-10%", ease: "none", duration: 1.8 },
          "<"
        );

        // 3 ─ Label fades up
        tl.to(
          ".label-item",
          { opacity: 1, y: 0, stagger: 0.06, duration: 0.5 },
          "-=1.1"
        );

        // 4 ─ Line 1 draws
        tl.to(
          lineRef1.current,
          { scaleX: 1, duration: 0.5, ease: "circ.out" },
          "<0.1"
        );

        // 5 ─ Chars burst in — tighter stagger for speed
        tl.to(
          chars1,
          { yPercent: 0, stagger: 0.018, duration: 0.65, ease: "circ.out" },
          "-=0.2"
        );
        tl.to(
          chars2,
          { yPercent: 0, stagger: 0.018, duration: 0.65, ease: "circ.out" },
          "<0.08"
        );

        // 6 ─ Bio
        tl.to(
          ".bio-item",
          { opacity: 1, y: 0, stagger: 0.12, duration: 0.55 },
          "-=0.25"
        );

        // 7 ─ Stats
        tl.to(
          ".stat-item",
          {
            opacity: 1,
            y: 0,
            scale: 1,
            stagger: 0.08,
            duration: 0.45,
            ease: "back.out(1.5)",
          },
          "-=0.3"
        );

        // 8 ─ Tags
        tl.to(
          ".tag-item",
          { opacity: 1, x: 0, stagger: 0.05, duration: 0.35 },
          "-=0.25"
        );

        // 9 ─ Bottom line
        tl.to(
          lineRef2.current,
          { scaleX: 1, duration: 0.5, ease: "circ.out" },
          "-=0.2"
        );
      } else {
        // ──────────────────────────────────────────────────────────────────
        // MOBILE — no pin, no mask, scroll-triggered reveals
        // ──────────────────────────────────────────────────────────────────
        gsap.set(maskRef.current, { clipPath: "none" });

        const base = { trigger: ".about-content", start: "top 80%" };

        gsap.from(".label-item", {
          opacity: 0,
          y: 10,
          stagger: 0.07,
          duration: 0.5,
          ease: "power3.out",
          scrollTrigger: base,
        });

        gsap.to(lineRef1.current, {
          scaleX: 1,
          duration: 0.7,
          ease: "circ.out",
          delay: 0.15,
          scrollTrigger: base,
        });

        // Chars or fallback
        if (chars1.length) {
          gsap.from(chars1, {
            yPercent: 110,
            stagger: 0.015,
            duration: 0.6,
            ease: "circ.out",
            scrollTrigger: base,
          });
          gsap.from(chars2, {
            yPercent: 110,
            stagger: 0.015,
            duration: 0.6,
            ease: "circ.out",
            delay: 0.08,
            scrollTrigger: base,
          });
        } else {
          gsap.from([".about-word-1", ".about-word-2"], {
            yPercent: 100,
            opacity: 0,
            stagger: 0.1,
            duration: 0.6,
            ease: "circ.out",
            scrollTrigger: base,
          });
        }

        gsap.from(".bio-item", {
          opacity: 0,
          y: 20,
          stagger: 0.1,
          duration: 0.55,
          ease: "power3.out",
          scrollTrigger: { trigger: ".bio-section", start: "top 85%" },
        });

        gsap.from(".stat-item", {
          opacity: 0,
          y: 18,
          scale: 0.93,
          stagger: 0.08,
          duration: 0.45,
          ease: "back.out(1.4)",
          scrollTrigger: { trigger: ".stats-section", start: "top 88%" },
        });

        gsap.from(".tag-item", {
          opacity: 0,
          x: -8,
          stagger: 0.05,
          duration: 0.35,
          ease: "power2.out",
          scrollTrigger: { trigger: ".tags-section", start: "top 90%" },
        });

        gsap.to(lineRef2.current, {
          scaleX: 1,
          duration: 0.6,
          ease: "circ.out",
          scrollTrigger: { trigger: ".tags-section", start: "top 88%" },
        });
      }
    },
    { scope: container }
  );

  return (
    <>
      <MagneticCursor />

      <section
        ref={container}
        className="relative min-h-screen bg-[#080808] overflow-hidden"
        data-theme="dark" // Add this attribute
      >
        {/* Grain */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-50 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: "180px 180px",
            mixBlendMode: "overlay",
          }}
        />

        {/* Mask container */}
        <div
          ref={maskRef}
          className="lg:absolute inset-0 z-10 w-full h-full bg-[#0a0a0a]"
          style={{ clipPath: "circle(0% at 15% 85%)", willChange: "clip-path" }}
          id="about"
        >
          {/* Bg image */}
          {/* <div className="absolute inset-0 z-0 overflow-hidden">
            <img
              ref={imageRef}
              src="https://res.cloudinary.com/dk5mfu099/image/upload/v1777145352/680754071_980627184707260_1530088102711139995_n_u7yoxt.jpg"
              alt="samuel"
              className="w-full h-full object-cover object-top opacity-[0.6] grayscale brightness-50 scale-[1.12]"
              loading="lazy"
              style={{ willChange: "transform" }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/50 via-transparent to-[#0a0a0a]/80" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/80 via-transparent to-[#0a0a0a]/70" />
          </div> */}

          <PageMaxWidth>
            <div className="relative z-10 about-content min-h-screen flex flex-col justify-center px-4 md:px-0 py-20 lg:py-0 gap-8 md:gap-10">
              {/* ── Label ─────────────────────────────────────────────────── */}
              <div className="flex items-center gap-3">
                <span className="label-item text-[var(--primary)] font-bold tracking-[0.45em] text-[8px] uppercase whitespace-nowrap">
                  The Story
                </span>
                <div
                  ref={lineRef1}
                  className="h-px w-20 bg-[var(--primary)]/35"
                  style={{ transformOrigin: "left center" }}
                />
                <span className="label-item text-zinc-600 font-bold tracking-[0.35em] text-[8px] uppercase">
                  02 / 03
                </span>
              </div>

              {/* ── Heading ───────────────────────────────────────────────── */}
              <h2
                className="font-syne font-black text-[var(--primary)] uppercase leading-[0.85] tracking-tight "
                style={{ fontSize: "clamp(1.7rem,6.6vw,7rem)" }}
              >
                {/* overflow:clip clips chars without affecting layout */}
                <span
                  className="about-word-1 block"
                  style={{ overflow: "clip" }}
                >
                  Architecting
                </span>
                <span
                  className="about-word-2 block mt-1 text-transparent"
                  style={{
                    overflow: "clip",
                    WebkitTextStroke: "1.2px rgba(255,255,255,0.45)",
                  }}
                >
                  Motion.
                </span>
              </h2>

              {/* ── Bio ───────────────────────────────────────────────────── */}
              <div className="bio-section grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-14">
                <div className="md:col-span-6 bio-item">
                  <p className="text-lg md:text-xl text-zinc-200 leading-snug font-light">
                    I&apos;m a front-end developer with{" "}
                    <span className="text-white font-semibold">
                      2+ years of experience
                    </span>{" "}
                    building modern, responsive web apps with a relentless focus
                    on{" "}
                    <em className="text-[var(--primary)] not-italic font-semibold">
                      performance
                    </em>
                    .
                  </p>
                </div>

                <div className="md:col-span-6 bio-item border-l border-white/8 pl-6 md:pl-10">
                  <p className="text-[17px] text-zinc-400 leading-relaxed">
                    When I&apos;m not coding, you&apos;ll find me exploring new
                    technologies, contributing to open source projects, or
                    mentoring fellow developers. I believe in writing clean,
                    maintainable code and staying up-to-date with the latest
                    industry trends.
                  </p>
                </div>
              </div>

              {/* ── Stats ─────────────────────────────────────────────────── */}
              <div className="stats-section grid grid-cols-3 gap-3 md:gap-6">
                {[
                  { value: 2, suffix: "+", label: "Years exp." },
                  { value: 30, suffix: "+", label: "Projects shipped" },
                  { value: 100, suffix: "%", label: "Perf. driven" },
                ].map(({ value, suffix, label }) => (
                  <div
                    key={label}
                    className="stat-item group relative p-4 md:p-5 border border-white/[0.06] rounded-sm overflow-hidden cursor-default select-none transition-colors duration-300 hover:border-[var(--primary)]/25"
                  >
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-[var(--primary)]/[0.04] to-transparent" />
                    <p className="font-syne text-[clamp(1.6rem,4vw,3rem)] font-black text-white mb-0.5 leading-none">
                      <Counter to={value} suffix={suffix} />
                    </p>
                    <p className="text-[9px] text-zinc-600 uppercase tracking-[0.28em] font-bold leading-tight">
                      {label}
                    </p>
                  </div>
                ))}
              </div>

              {/* ── Tags ──────────────────────────────────────────────────── */}
              <div className="tags-section">
                <div
                  ref={lineRef2}
                  className="h-px w-full bg-white/[0.05] mb-5"
                  style={{ transformOrigin: "left center" }}
                />
                <div className="flex flex-wrap gap-2">
                  {[
                    "React",
                    "Next.js",
                    "GSAP",
                    "TypeScript",
                    "Framer Motion",
                    "Tailwind",
                  ].map((s) => (
                    <span
                      key={s}
                      className="tag-item px-3 py-1.5 bg-white/[0.025] border border-white/[0.06] rounded-sm text-[8px] text-zinc-500 font-bold uppercase tracking-[0.22em] hover:border-[var(--primary)]/35 hover:text-[var(--primary)] transition-colors duration-250 cursor-default"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </PageMaxWidth>
        </div>
      </section>
    </>
  );
};

export default About;
