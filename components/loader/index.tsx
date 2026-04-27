"use client";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const Preloader = ({ onComplete }: { onComplete: () => void }) => {
  const containerRef = useRef(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        onComplete: () => onComplete(),
      });

      // Initial State: Bold, Upright, and Hidden
      gsap.set(".char", { y: "110%" });
      gsap.set(".dt-final", { opacity: 0, scale: 0.85 });

      tl
        // PHASE 1: The Reveal (Masked rise - No Italics)
        .to(".char", {
          y: "0%",
          stagger: 0.04,
          duration: 1.4,
          ease: "power4.out",
        })

        // PHASE 2: The "Space to Compression" (Creating the Gap)
        .addLabel("wait", "+=0.3")
        .to(
          ".word-top",
          { y: -20, duration: 1.5, ease: "power2.inOut" },
          "wait"
        )
        .to(
          ".word-bottom",
          { y: 20, duration: 1.5, ease: "power2.inOut" },
          "wait"
        )

        // PHASE 3: THE MORPH
        .addLabel("morph", "-=0.6")
        .to(
          ".extra-letters",
          {
            opacity: 0,
            filter: "blur(12px)",
            scale: 0.9,
            duration: 0.7,
            ease: "power3.in",
          },
          "morph"
        )
        .to(
          ".dt-final",
          {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            ease: "expo.out",
          },
          "morph+=0.1"
        )

        // PHASE 4: THE FRAME-PERFECT SYNC
        // We zoom through, but we trigger the Hero EARLIER
        .to(".dt-final", {
          scale: 160,
          duration: 1.8,
          ease: "power4.in",
          onStart: () => {
            // Trigger Hero EXACTLY when zoom starts to build momentum
            document.dispatchEvent(new CustomEvent("triggerHeroAnim"));
          },
        })
        .to(
          containerRef.current,
          {
            autoAlpha: 0, // Using autoAlpha for better performance than opacity
            duration: 0.6,
          },
          "-=0.4"
        ); // Fade out while the zoom is finishing
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-9999 flex items-center justify-center bg-[#060606] overflow-hidden"
    >
      <div className="relative flex flex-col items-center justify-center gap-6">
        {/* DELYTE - TOP */}
        <div className="word-top flex font-clashDisplay font-bold text-[clamp(2.5rem,10vw,9rem)] leading-none uppercase  text-white">
          <div className="overflow-hidden flex">
            <span className="char inline-block">D</span>
            <div className="extra-letters flex">
              {["E", "L", "Y", "T", "E"].map((l, i) => (
                <span key={i} className="char inline-block text-[#F1F1F1] ml-1">
                  {l}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* TECH - BOTTOM */}
        <div className="word-bottom flex font-clashDisplay font-black text-[clamp(2.5rem,10vw,9rem)] leading-none text-[var(--primary)] uppercase">
          <div className="overflow-hidden flex">
            <div className="extra-letters flex">
              {["T", "E", "C"].map((l, i) => (
                <span key={i} className="char inline-block  mr-1">
                  {l}
                </span>
              ))}
            </div>
            <span className="char inline-block">H</span>
          </div>
        </div>

        {/* SYNCED LOGO */}
        <div className="dt-final absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="font-clashDisplay font-black text-[20vw] text-white tracking-tighter">
            DT
          </span>
        </div>
      </div>

      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </div>
  );
};

export default Preloader;
