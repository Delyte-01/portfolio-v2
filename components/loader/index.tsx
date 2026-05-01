"use client";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface PreloaderProps {
  onComplete: () => void;
}

type EaseName =
  | "power4.out"
  | "power4.in"
  | "power4.inOut"
  | "expo.out"
  | "expo.in"
  | "power3.in"
  | "power2.inOut"
  | "power2.out"
  | "power2.in";

interface AnimationPhase {
  label: string;
  offset: string;
}

const PHASES: Record<string, AnimationPhase> = {
  SPLIT: { label: "split", offset: "+=0.35" },
  MORPH: { label: "morph", offset: "split+=0.8" },
  ZOOM: { label: "zoom", offset: "morph+=1.0" },
} as const;

const DELYTE_EXTRA_CHARS: readonly string[] = [
  "e",
  "l",
  "y",
  "t",
  "e",
] as const;
const TECH_EXTRA_CHARS: readonly string[] = ["e", "c", "h"] as const;

// ─── Preloader ────────────────────────────────────────────────────────────────

const Preloader = ({ onComplete }: PreloaderProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const allChars = gsap.utils.toArray<HTMLElement>(".char");
      const extraLetters = gsap.utils.toArray<HTMLElement>(
        ".extra-letters .char"
      );
      const wordTop =
        containerRef.current.querySelector<HTMLElement>(".word-top");
      const wordBottom =
        containerRef.current.querySelector<HTMLElement>(".word-bottom");
      const dtFinal =
        containerRef.current.querySelector<HTMLElement>(".dt-final");
      const dtGlow =
        containerRef.current.querySelector<HTMLElement>(".dt-glow");
      const progressLine =
        containerRef.current.querySelector<HTMLElement>(".progress-line");

      if (!wordTop || !wordBottom || !dtFinal || !dtGlow || !progressLine)
        return;

      // ── Initial state ──────────────────────────────────────────────────────

      gsap.set(allChars, { y: "110%", force3D: true });
      gsap.set(dtFinal, { opacity: 0, scale: 0.82, filter: "blur(10px)" });
      gsap.set(dtGlow, { opacity: 0, scale: 1 });
      gsap.set(progressLine, { scaleX: 0, transformOrigin: "left center" });

      // ── Timeline ───────────────────────────────────────────────────────────

      const tl = gsap.timeline({
        defaults: { ease: "power4.out" as EaseName },
        onComplete,
      });

      // Progress shimmer — runs across the full duration
      tl.to(
        progressLine,
        {
          scaleX: 1,
          opacity: 1,
          duration: 3.8,
          ease: "power2.inOut" as EaseName,
        },
        0
      );

      // PHASE 1 — Masked character rise with organic stagger
      tl.to(
        allChars,
        {
          y: "0%",
          stagger: {
            each: 0.055,
            ease: "power2.out" as EaseName,
          },
          duration: 1.3,
          ease: "expo.out" as EaseName,
          force3D: true,
        },
        0
      );

      // PHASE 2 — Words split apart (tension)
      tl.addLabel(PHASES.SPLIT.label, PHASES.SPLIT.offset)
        .to(
          wordTop,
          {
            y: -32,
            duration: 1.7,
            ease: "expo.inOut" as EaseName,
            force3D: true,
          },
          PHASES.SPLIT.label
        )
        .to(
          wordBottom,
          {
            y: 32,
            duration: 1.7,
            ease: "expo.inOut" as EaseName,
            force3D: true,
          },
          PHASES.SPLIT.label
        );

      // PHASE 3 — Morph: extras dissolve, "DT" crystallises
      tl.addLabel(PHASES.MORPH.label, PHASES.MORPH.offset)
        .to(
          extraLetters,
          {
            opacity: 0,
            filter: "blur(16px)",
            scale: 0.8,
            x: (_index: number, el: HTMLElement) =>
              el.closest(".word-top") ? 14 : -14,
            duration: 0.65,
            ease: "power3.in" as EaseName,
            stagger: { each: 0.035, from: "edges" as const },
          },
          PHASES.MORPH.label
        )
        .to(
          dtGlow,
          {
            opacity: 1,
            scale: 1.5,
            duration: 0.9,
            ease: "power2.out" as EaseName,
          },
          `${PHASES.MORPH.label}+=0.05`
        )
        .to(
          dtFinal,
          {
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
            duration: 0.6,
            ease: "expo.out" as EaseName,
          },
          `${PHASES.MORPH.label}+=0.12`
        );

      // PHASE 4 — Cinematic zoom-through + fade
      tl.addLabel(PHASES.ZOOM.label, PHASES.ZOOM.offset)
        .to(
          dtFinal,
          {
            scale: 220,
            duration: 1.6,
            ease: "power4.in" as EaseName,
            force3D: true,
            onStart: () => {
              // Trigger hero at the exact frame zoom builds momentum
              document.dispatchEvent(new CustomEvent("triggerHeroAnim"));
            },
          },
          PHASES.ZOOM.label
        )
        .to(
          dtGlow,
          {
            opacity: 0,
            scale: 0.4,
            duration: 0.5,
            ease: "power2.in" as EaseName,
          },
          PHASES.ZOOM.label
        )
        .to(progressLine, { opacity: 0, duration: 0.3 }, PHASES.ZOOM.label)
        .to(
          containerRef.current,
          {
            autoAlpha: 0,
            duration: 0.55,
            ease: "power2.inOut" as EaseName,
          },
          `${PHASES.ZOOM.label}+=1.05`
        );
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#060606] overflow-hidden"
    >
      {/* Ambient glow behind DT */}
      <div className="dt-glow absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[40vw] h-[40vw] rounded-full bg-[var(--primary)] opacity-0 blur-[80px]" />
      </div>

      {/* Progress shimmer */}
      <div
        className="progress-line absolute bottom-0 left-0 h-px w-full origin-left opacity-0"
        style={{
          background:
            "linear-gradient(90deg, transparent, var(--primary), #c4b5fd, transparent)",
        }}
      />

      {/* Stage */}
      <div className="relative flex flex-col items-center justify-center gap-5">
        {/* DELYTE — top word */}
        <div className="word-top flex text-[clamp(2.5rem,12vw,10rem)] leading-none text-white tracking-tighter">
          <div className="overflow-hidden flex">
            {/* "D" — anchor, never fades */}
            <span className="char inline-block font-clashDisplay font-black">
              D
            </span>
            {/* "elyte" — morphs away */}
            <div className="extra-letters flex">
              {DELYTE_EXTRA_CHARS.map((letter, i) => (
                <span
                  key={`delyte-${i}`}
                  className="char inline-block text-[#c4c4c4] ml-[0.02em] font-clashDisplay font-black"
                >
                  {letter}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* TECH — bottom word */}
        <div className="word-bottom flex text-[clamp(2rem,10vw,8.5rem)] leading-none tracking-tighter text-[var(--primary)]">
          <div className="overflow-hidden flex">
            {/* "T" — anchor, never fades */}
            <span className="char inline-block font-clashDisplay font-black">
              T
            </span>
            {/* "ech" — morphs away */}
            <div className="extra-letters flex">
              {TECH_EXTRA_CHARS.map((letter, i) => (
                <span
                  key={`tech-${i}`}
                  className="char inline-block font-clashDisplay font-black"
                >
                  {letter}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* DT — the final merged mark */}
        <div className="dt-final absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="font-clashDisplay font-black text-[20vw] text-white tracking-[-0.06em] will-change-transform">
            DT
          </span>
        </div>
      </div>

      {/* Grain texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "url('https://grainy-gradients.vercel.app/noise.svg')",
          backgroundSize: "200px",
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.65) 100%)",
        }}
      />
    </div>
  );
};

export default Preloader;
