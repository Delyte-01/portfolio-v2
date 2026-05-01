"use client";
import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight } from "lucide-react";
import { GiThunderBlade } from "react-icons/gi";
import { LiaLinkedin } from "react-icons/lia";
import { BsInstagram } from "react-icons/bs";
import GraffitiLogo from "@/components/logo";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ─── Data ───────────────────────────────────────────────────────────────── */
const navLinks = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Certifications", href: "#certifications" },
  { label: "Process", href: "#process" },
  { label: "Contact", href: "#contact" },
];

const socialLinks = [
  {
    icon: <GiThunderBlade size={16} />,
    label: "GitHub",
    href: "https://github.com/Delyte-01",
  },
  {
    icon: <LiaLinkedin size={18} />,
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/sammy-delyte-0a1224302",
  },
  {
    icon: <BsInstagram size={16} />,
    label: "Instagram",
    href: "https://instagram.com",
  },
];

const marqueeItems = [
  "Let's collaborate",
  "Available for projects",
  "Frontend excellence",
  "Motion & UI",
  "Open to work",
  "Let's collaborate",
  "Available for projects",
  "Frontend excellence",
  "Motion & UI",
  "Open to work",
];

/* ─── Live Lagos Clock ───────────────────────────────────────────────────── */
function LagosTime() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const tick = () =>
      setTime(
        new Date().toLocaleTimeString("en-US", {
          timeZone: "Africa/Lagos",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
      );
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return <>{time}</>;
}

/* ─── Magnetic Hook ──────────────────────────────────────────────────────── */
function useMagnetic(
  ref: React.RefObject<HTMLElement | null>,
  strength = 0.45
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const xTo = gsap.quickTo(el, "x", {
      duration: 0.9,
      ease: "elastic.out(1,0.3)",
    });
    const yTo = gsap.quickTo(el, "y", {
      duration: 0.9,
      ease: "elastic.out(1,0.3)",
    });
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      if (Math.abs(x) < 180 && Math.abs(y) < 180) {
        xTo(x * strength);
        yTo(y * strength);
      } else {
        xTo(0);
        yTo(0);
      }
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [ref, strength]);
}

/* ─── Hover Link ─────────────────────────────────────────────────────────── */
function HoverLink({
  href,
  children,
  style = {},
}: {
  href: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  const lineRef = useRef<HTMLSpanElement>(null);
  return (
    <a
      href={href}
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        ...style,
      }}
      onMouseEnter={() =>
        gsap.to(lineRef.current, {
          scaleX: 1,
          duration: 0.35,
          ease: "power3.out",
          transformOrigin: "left",
        })
      }
      onMouseLeave={() =>
        gsap.to(lineRef.current, {
          scaleX: 0,
          duration: 0.28,
          ease: "power3.in",
          transformOrigin: "right",
        })
      }
    >
      {children}
      <span
        ref={lineRef}
        style={{
          position: "absolute",
          bottom: -2,
          left: 0,
          right: 0,
          height: 1,
          background: "#0066FF",
          transform: "scaleX(0)",
          transformOrigin: "left",
          display: "block",
        }}
      />
    </a>
  );
}

/* ─── Component ──────────────────────────────────────────────────────────── */
const ContactSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLAnchorElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);

  useMagnetic(btnRef as React.RefObject<HTMLElement | null>, 0.42);

  useGSAP(
    () => {
      /* 1 — per-char title reveal */
      const chars = titleRef.current?.querySelectorAll(".ch") ?? [];
      gsap.from(chars, {
        y: "105%",
        rotateX: -80,
        opacity: 0,
        transformOrigin: "50% 0%",
        stagger: 0.04,
        duration: 1.15,
        ease: "expo.out",
        scrollTrigger: { trigger: titleRef.current, start: "top 82%" },
      });

      /* 2 — velocity-responsive marquee */
      const tl = gsap.to(marqueeRef.current, {
        x: "-50%",
        duration: 18,
        ease: "none",
        repeat: -1,
      });
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate(self) {
          gsap.to(tl, {
            timeScale: 1 + self.getVelocity() / 1200,
            overwrite: true,
            ease: "power2.out",
          });
          gsap.delayedCall(0.4, () =>
            gsap.to(tl, { timeScale: 1, overwrite: true, ease: "power2.out" })
          );
        },
      });

      /* 3 — CTA elastic scale-in */
      gsap.from(btnRef.current, {
        scale: 0,
        opacity: 0,
        duration: 1.1,
        ease: "elastic.out(1, 0.5)",
        scrollTrigger: { trigger: btnRef.current, start: "top 88%" },
      });

      /* 4 — footer stagger */
      gsap.from(footerRef.current?.querySelectorAll(".f-item") ?? [], {
        y: 24,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: footerRef.current, start: "top 90%" },
      });

      /* 5 — divider expand */
      gsap.from(dividerRef.current, {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 1.4,
        ease: "expo.out",
        scrollTrigger: { trigger: dividerRef.current, start: "top 92%" },
      });
    },
    { scope: sectionRef }
  );

  const makeChars = (word: string) =>
    word.split("").map((ch, i) => (
      <span key={i} className="ch" style={{ display: "inline-block" }}>
        {ch === " " ? "\u00A0" : ch}
      </span>
    ));

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Mono:wght@400;500&family=Outfit:wght@400;500;600&display=swap');

        /* ── light design tokens ── */
        :root {
          --ct-bg:           #F4F6F9;
          --ct-surface:      #FFFFFF;
          --ct-border:       rgba(15,23,42,0.09);
          --ct-border-md:    rgba(15,23,42,0.14);
          --ct-text:         #0C1628;
          --ct-muted:        rgba(12,22,40,0.45);
          --ct-faint:        rgba(12,22,40,0.25);
          --ct-accent:       #0066FF;
          --ct-accent-pale:  #EFF6FF;
          --ct-green:        #16a34a;
        }

        .ct-wrap { font-family:'Outfit',sans-serif; background:var(--ct-bg); position:relative; overflow:hidden; }

        /* paper grain */
        .ct-wrap::before {
          content:''; position:absolute; inset:0; pointer-events:none; z-index:0;
          background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='250' height='250'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='250' height='250' filter='url(%23n)' opacity='0.022'/%3E%3C/svg%3E");
        }

        /* dot grid */
        .ct-wrap::after {
          content:''; position:absolute; inset:0; pointer-events:none;
          background-image:radial-gradient(rgba(12,22,40,0.055) 1px, transparent 1px);
          background-size:28px 28px;
        }

        /* glow blobs */
        .ct-glow {
          position:absolute; width:560px; height:560px; border-radius:50%;
          pointer-events:none;
          background:radial-gradient(circle, rgba(0,102,255,0.055) 0%, transparent 68%);
        }

        .ct-mono    { font-family:'DM Mono',monospace; }
        .ct-display { font-family:'Syne',sans-serif; }

        .ct-label {
          font-family:'DM Mono',monospace; font-size:0.62rem;
          letter-spacing:0.2em; text-transform:uppercase; color:var(--ct-faint);
        }

        .ct-ruled {
          height:1px;
          background:linear-gradient(90deg, var(--ct-border-md), var(--ct-border), transparent);
        }

        /* top bar */
        .ct-topbar { border-bottom:1px solid var(--ct-border); padding:18px 24px; }

        /* marquee strip */
        .marquee-strip {
          border-top:1px solid var(--ct-border);
          border-bottom:1px solid var(--ct-border);
          padding:18px 0; overflow:hidden;
          background:var(--ct-surface);
          box-shadow:0 1px 0 var(--ct-border), 0 -1px 0 var(--ct-border);
        }
        .marquee-track { display:flex; white-space:nowrap; will-change:transform; }
        .marquee-item {
          display:inline-flex; align-items:center; gap:24px; padding:0 32px;
          font-family:'Syne',sans-serif; font-weight:900;
          font-size:clamp(0.95rem,3vw,1.4rem); text-transform:uppercase;
          letter-spacing:-0.01em; color:var(--ct-faint);
        }
        .marquee-dot { width:5px; height:5px; border-radius:50%; background:var(--ct-accent); flex-shrink:0; opacity:0.45; }

        /* CTA */
        .cta-circle {
          position:relative; width:152px; height:152px; border-radius:50%;
          background:var(--ct-accent); display:flex; align-items:center;
          justify-content:center; flex-direction:column;
          color:#fff; text-decoration:none; will-change:transform;
          box-shadow:0 12px 40px rgba(0,102,255,0.22);
          transition:background 0.3s, box-shadow 0.3s;
        }
        .cta-circle:hover { background:#0052cc; box-shadow:0 16px 52px rgba(0,102,255,0.32); }
        .cta-ring {
          position:absolute; inset:-10px; border-radius:50%;
          border:1px solid rgba(0,102,255,0.2);
          animation:ring-pulse 3s ease-in-out infinite;
        }
        .cta-ring-2 { inset:-22px; border-color:rgba(0,102,255,0.09); animation-delay:0.8s; }
        @keyframes ring-pulse {
          0%,100% { transform:scale(1); opacity:1; }
          50%      { transform:scale(1.06); opacity:0.35; }
        }

        /* social */
        .social-btn {
          display:inline-flex; align-items:center; gap:8px;
          color:var(--ct-muted); text-decoration:none;
          font-family:'DM Mono',monospace; font-size:0.68rem; font-weight:500;
          letter-spacing:0.15em; text-transform:uppercase;
          transition:color 0.25s; position:relative;
        }
        .social-btn:hover { color:var(--ct-accent); }
        .social-btn .sline {
          position:absolute; bottom:-3px; left:0; width:100%; height:1px;
          background:var(--ct-accent); transform:scaleX(0); transform-origin:left;
          transition:transform 0.3s cubic-bezier(0.22,1,0.36,1);
        }
        .social-btn:hover .sline { transform:scaleX(1); }

        /* nav links */
        .nav-link-ct {
          display:inline-block; font-family:'DM Mono',monospace;
          font-size:0.7rem; letter-spacing:0.12em; text-transform:uppercase;
          color:var(--ct-muted); text-decoration:none; transition:color 0.25s; position:relative;
        }
        .nav-link-ct::after {
          content:''; position:absolute; bottom:-2px; left:0; width:100%; height:1px;
          background:var(--ct-accent); transform:scaleX(0); transform-origin:right;
          transition:transform 0.3s cubic-bezier(0.22,1,0.36,1);
        }
        .nav-link-ct:hover { color:var(--ct-accent); }
        .nav-link-ct:hover::after { transform:scaleX(1); transform-origin:left; }

        /* status */
        .status-dot {
          width:7px; height:7px; border-radius:50%;
          background:var(--ct-green); box-shadow:0 0 8px rgba(22,163,74,0.35);
          display:inline-block; animation:ring-pulse 2s ease-in-out infinite;
        }

        .ch { display:inline-block; }

        @media (max-width:768px) {
          .footer-grid { flex-direction:column !important; align-items:flex-start !important; gap:28px !important; }
          .footer-nav  { display:none !important; }
        }
      `}</style>

      <section ref={sectionRef} className="ct-wrap" id="contact">
        {/* glow blobs */}
        <div className="ct-glow" style={{ top: -180, left: -80 }} />
        <div
          className="ct-glow"
          style={{
            bottom: -180,
            right: -80,
            background:
              "radial-gradient(circle, rgba(0,102,255,0.035) 0%, transparent 68%)",
          }}
        />

        <div style={{ position: "relative", zIndex: 1 }}>
          {/* ── TOP BAR ──────────────────────────────────────────────────── */}
          <div className="ct-topbar">
            <div
              style={{
                maxWidth: 1160,
                margin: "0 auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span
                className="ct-label"
                style={{ display: "flex", alignItems: "center", gap: 8 }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "var(--ct-accent)",
                    display: "inline-block",
                  }}
                />
                Available for projects
              </span>
              <span className="ct-label ct-mono">
                Lagos, NG — <LagosTime />
              </span>
            </div>
          </div>

          {/* ── MAIN CTA AREA ────────────────────────────────────────────── */}
          <div
            style={{ maxWidth: 1160, margin: "0 auto", padding: "80px 24px 0" }}
          >
            {/* eyebrow */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 28,
              }}
            >
              <div className="ct-ruled" style={{ width: 32 }} />
              <span className="ct-label">Get in touch</span>
            </div>

            {/* heading */}
            <h2
              ref={titleRef}
              className="ct-display"
              style={{
                fontSize: "clamp(2.5rem, 8vw, 8rem)",
                fontWeight: 900,
                lineHeight: 0.92,
                letterSpacing: "-0.04em",
                color: "var(--ct-text)",
                margin: 0,
              }}
            >
              <div style={{ overflow: "hidden" }}>
                {makeChars("Let's Build")}
              </div>
              <div style={{ overflow: "hidden" }}>
                <span
                  style={{
                    WebkitTextStroke: "1.5px rgba(12,22,40,0.14)",
                    color: "transparent",
                    display: "block",
                  }}
                >
                  {makeChars("The Future")}
                </span>
              </div>
            </h2>

            {/* copy + button */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 40,
                marginTop: 64,
                paddingBottom: 80,
              }}
            >
              <div style={{ maxWidth: 380 }}>
                <p
                  style={{
                    color: "var(--ct-muted)",
                    fontSize: "clamp(0.9rem,1.5vw,1.05rem)",
                    lineHeight: 1.75,
                    margin: 0,
                  }}
                >
                  Building precision-crafted frontend experiences with obsessive
                  attention to motion, performance, and detail. Open to
                  freelance, full-time, and creative collabs.
                </p>
                <div style={{ marginTop: 28 }}>
                  <HoverLink
                    href="mailto:madunecheezechukwu@gmail.com"
                    style={{
                      color: "var(--ct-muted)",
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.75rem",
                      letterSpacing: "0.1em",
                    }}
                  >
                    madunecheezechukwu@gmail.com
                  </HoverLink>
                  <p>08139760048</p>
                </div>
              </div>

              {/* magnetic CTA */}
              <div
                style={{
                  position: "relative",
                  width: 180,
                  height: 180,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <a
                  ref={btnRef}
                  href="mailto:madunecheezechukwu@gmail.com"
                  className="cta-circle"
                >
                  <div className="cta-ring" />
                  <div className="cta-ring cta-ring-2" />
                  <span
                    className="ct-display"
                    style={{
                      fontSize: "1rem",
                      fontWeight: 900,
                      textTransform: "uppercase",
                      letterSpacing: "-0.01em",
                      lineHeight: 1.2,
                      textAlign: "center",
                    }}
                  >
                    Email
                    <br />
                    Me
                  </span>
                  <ArrowUpRight size={18} style={{ marginTop: 4 }} />
                </a>
              </div>
            </div>
          </div>

          {/* ── MARQUEE ──────────────────────────────────────────────────── */}
          <div className="marquee-strip">
            <div ref={marqueeRef} className="marquee-track">
              {[...marqueeItems, ...marqueeItems].map((item, i) => (
                <span key={i} className="marquee-item">
                  <span className="marquee-dot" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* ── FOOTER ───────────────────────────────────────────────────── */}
          <div
            ref={footerRef}
            style={{ maxWidth: 1160, margin: "0 auto", padding: "0 24px" }}
          >
            {/* nav row */}
            <div
              className="footer-nav f-item"
              style={{
                display: "flex",
                gap: 32,
                padding: "40px 0 28px",
                borderBottom: "1px solid var(--ct-border)",
                flexWrap: "wrap",
              }}
            >
              {navLinks.map((l, i) => (
                <a key={i} href={l.href} className="nav-link-ct">
                  {l.label}
                </a>
              ))}
            </div>

            {/* bottom bar */}
            <div
              ref={dividerRef}
              className="footer-grid"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "32px 0 48px",
                gap: 24,
                flexWrap: "wrap",
              }}
            >
              {/* wordmark */}
              <div
                className="f-item"
                style={{ display: "flex", flexDirection: "column", gap: 4 }}
              >
                <GraffitiLogo />
                <span className="ct-label" style={{ marginTop: 4 }}>
                  Frontend Engineer & Motion Designer
                </span>
              </div>

              {/* socials */}
              <div
                className="f-item"
                style={{
                  display: "flex",
                  gap: 24,
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                {socialLinks.map((s, i) => (
                  <a
                    key={i}
                    href={s.href}
                    className="social-btn"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {s.icon}
                    {s.label}
                    <span className="sline" />
                  </a>
                ))}
              </div>

              {/* copyright */}
              <div
                className="f-item"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  gap: 8,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span className="status-dot" />
                  <span
                    className="ct-label"
                    style={{
                      color: "var(--ct-green)",
                      letterSpacing: "0.15em",
                    }}
                  >
                    Open to work
                  </span>
                </div>
                <span
                  className="ct-label"
                  style={{ textAlign: "right", lineHeight: 1.6 }}
                >
                  © {new Date().getFullYear()} David — Design & Dev
                  <br />
                  <span style={{ opacity: 0.5 }}>
                    Built with Next.js & GSAP
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactSection;
