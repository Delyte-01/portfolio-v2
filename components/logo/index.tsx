"use client";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const GraffitiLogo = () => {
  const container = useRef(null);
  const logoRef = useRef(null);

  useGSAP(
    () => {
      gsap.to(logoRef.current, {
        y: -3,
        repeat: -1,
        yoyo: true,
        duration: 2,
        ease: "sine.inOut",
      });
    },
    { scope: container }
  );

  const handleHover = () => {
    gsap.to(logoRef.current, {
      x: "random(-2, 2)",
      y: "random(-2, 2)",
      repeat: 5,
      duration: 0.05,
      onComplete: () => gsap.to(logoRef.current, { x: 0, y: 0 }),
    });
  };

  return (
    <div
      ref={container}
      onMouseEnter={handleHover}
      className="relative flex items-center justify-center p-4 cursor-pointer group mt-2 "
    >
      <svg
        ref={logoRef}
        width="200"
        height="100"
        viewBox="0 0 680 340"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="group-hover:drop-shadow-[0_0_20px_rgba(0,102,255,0.5)] transition-all duration-300"
      >
        {/* ── Subtle background grid texture ── */}
        <g opacity="0.04" stroke="#88AAFF" strokeWidth="1">
          <line x1="0" y1="80" x2="680" y2="80" />
          <line x1="0" y1="160" x2="680" y2="160" />
          <line x1="0" y1="240" x2="680" y2="240" />
          <line x1="160" y1="0" x2="160" y2="340" />
          <line x1="340" y1="0" x2="340" y2="340" />
          <line x1="520" y1="0" x2="520" y2="340" />
        </g>

        <defs>
          {/* D — blue body gradient */}
          <linearGradient id="blueBody" x1="0%" y1="0%" x2="30%" y2="100%">
            <stop offset="0%" stopColor="#5BB8FF" />
            <stop offset="40%" stopColor="#1A8FFF" />
            <stop offset="100%" stopColor="#003D99" />
          </linearGradient>

          {/* T — white/light body gradient */}
          <linearGradient id="whiteBody" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="50%" stopColor="#D0D8E8" />
            <stop offset="100%" stopColor="#9AAAC8" />
          </linearGradient>

          {/* Soft glow blur */}
          <filter id="blur2">
            <feGaussianBlur stdDeviation="2" />
          </filter>
        </defs>

        {/* ── Spray halo behind D (blue) ── */}
        <ellipse
          cx="218"
          cy="175"
          rx="108"
          ry="98"
          fill="#1A8FFF"
          opacity="0.06"
          filter="url(#blur2)"
        />

        {/* ── Spray halo behind T (white) ── */}
        <ellipse
          cx="456"
          cy="170"
          rx="108"
          ry="98"
          fill="#FFFFFF"
          opacity="0.05"
          filter="url(#blur2)"
        />

        {/* ════════════════════════════ */}
        {/*           THE "D"           */}
        {/* ════════════════════════════ */}

        {/* D shadow offset */}
        <path
          d="M152 88 C152 88 148 88 146 92 L136 265 C136 265 135 270 140 270 L185 270 C185 270 252 269 264 209 C270 180 266 148 252 124 C238 100 218 88 195 88 Z"
          fill="#001A66"
          opacity="0.6"
          transform="translate(8,8)"
        />

        {/* D body */}
        <path
          d="M152 88 C152 88 148 88 146 92 L136 265 C136 265 135 270 140 270 L185 270 C185 270 252 269 264 209 C270 180 266 148 252 124 C238 100 218 88 195 88 Z"
          fill="url(#blueBody)"
        />

        {/* D inner counter (black cutout) */}
        <path
          d="M163 113 L163 245 L184 245 C184 245 228 244 237 205 C242 185 239 158 228 140 C217 122 202 113 184 113 Z"
          fill="#050A14"
        />

        {/* D top-left shine streak */}
        <path
          d="M152 90 C152 90 148 90 147 95 L139 200"
          fill="none"
          stroke="#8ED6FF"
          strokeWidth="3.5"
          strokeLinecap="round"
          opacity="0.65"
        />

        {/* D inner highlight arc */}
        <path
          d="M170 118 C185 112 202 116 215 128"
          fill="none"
          stroke="#5BB8FF"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.5"
        />

        {/* D outline */}
        <path
          d="M152 88 C152 88 148 88 146 92 L136 265 C136 265 135 270 140 270 L185 270 C185 270 252 269 264 209 C270 180 266 148 252 124 C238 100 218 88 195 88 Z"
          fill="none"
          stroke="#5BB8FF"
          strokeWidth="2.5"
          strokeLinejoin="round"
          opacity="0.75"
        />

        {/* D stencil cut lines */}
        <line
          x1="140"
          y1="188"
          x2="160"
          y2="188"
          stroke="#050A14"
          strokeWidth="6"
          opacity="0.9"
        />
        <line
          x1="140"
          y1="196"
          x2="160"
          y2="196"
          stroke="#050A14"
          strokeWidth="4"
          opacity="0.6"
        />

        {/* D drip 1 */}
        <path
          d="M148 268 Q147 285 150 295 Q152 300 148 306 Q145 312 149 318"
          fill="none"
          stroke="#1A8FFF"
          strokeWidth="5"
          strokeLinecap="round"
          opacity="0.85"
        />
        <ellipse
          cx="149"
          cy="322"
          rx="5"
          ry="7"
          fill="#1A8FFF"
          opacity="0.75"
        />

        {/* D drip 2 */}
        <path
          d="M178 270 Q177 282 180 290 Q182 295 178 300"
          fill="none"
          stroke="#1A8FFF"
          strokeWidth="3.5"
          strokeLinecap="round"
          opacity="0.6"
        />
        <ellipse
          cx="178.5"
          cy="304"
          rx="3.5"
          ry="5"
          fill="#1A8FFF"
          opacity="0.5"
        />

        {/* ════════════════════════════ */}
        {/*           THE "T"           */}
        {/* ════════════════════════════ */}

        {/* T shadow offset */}
        <g transform="translate(8,8)" opacity="0.45">
          <path
            d="M346 88 L556 88 L556 126 C556 126 540 132 528 128 L466 128 L466 268 L434 272 L424 268 L424 128 L362 128 C350 130 342 126 346 108 Z"
            fill="#001033"
          />
        </g>

        {/* T body */}
        <path
          d="M346 88 L556 88 L556 126 C556 126 540 132 528 128 L466 128 L466 268 L434 272 L424 268 L424 128 L362 128 C350 130 342 126 346 108 Z"
          fill="url(#whiteBody)"
        />

        {/* T top edge highlight */}
        <path
          d="M350 92 L552 92"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.65"
        />

        {/* T vertical left edge highlight */}
        <path
          d="M428 130 L428 262"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.4"
        />

        {/* T outline */}
        <path
          d="M346 88 L556 88 L556 126 C556 126 540 132 528 128 L466 128 L466 268 L434 272 L424 268 L424 128 L362 128 C350 130 342 126 346 108 Z"
          fill="none"
          stroke="#CCDDFF"
          strokeWidth="2.5"
          strokeLinejoin="round"
          opacity="0.65"
        />

        {/* T stencil cut lines */}
        <line
          x1="428"
          y1="178"
          x2="464"
          y2="178"
          stroke="#050A14"
          strokeWidth="6"
          opacity="0.8"
        />
        <line
          x1="430"
          y1="187"
          x2="462"
          y2="187"
          stroke="#050A14"
          strokeWidth="3.5"
          opacity="0.5"
        />

        {/* T drip — crossbar left */}
        <path
          d="M365 126 Q364 140 367 152 Q369 158 364 166 Q360 172 365 178"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="5"
          strokeLinecap="round"
          opacity="0.8"
        />
        <ellipse
          cx="365"
          cy="182"
          rx="5"
          ry="7"
          fill="#FFFFFF"
          opacity="0.65"
        />

        {/* T drip — stem bottom */}
        <path
          d="M445 270 Q444 284 447 296 Q449 303 445 310"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="4"
          strokeLinecap="round"
          opacity="0.7"
        />
        <ellipse
          cx="445.5"
          cy="314"
          rx="4"
          ry="6"
          fill="#FFFFFF"
          opacity="0.55"
        />

        {/* ── Corner accent splashes ── */}
        {/* D corner — blue */}
        <circle cx="264" cy="88" r="7" fill="#1A8FFF" opacity="0.95" />
        <circle
          cx="264"
          cy="88"
          r="13"
          fill="none"
          stroke="#1A8FFF"
          strokeWidth="1.5"
          opacity="0.35"
        />

        {/* T corner right — white/blue */}
        <circle cx="556" cy="88" r="7" fill="#FFFFFF" opacity="0.9" />
        <circle
          cx="556"
          cy="88"
          r="13"
          fill="none"
          stroke="#AACCFF"
          strokeWidth="1.5"
          opacity="0.35"
        />

        {/* T stem bottom dot */}
        <circle cx="466" cy="268" r="5" fill="#FFFFFF" opacity="0.55" />

        {/* ── Spray scatter — D side (blue dots) ── */}
        <circle cx="120" cy="105" r="2.5" fill="#1A8FFF" opacity="0.5" />
        <circle cx="113" cy="118" r="1.5" fill="#1A8FFF" opacity="0.35" />
        <circle cx="128" cy="95" r="1.5" fill="#1A8FFF" opacity="0.4" />
        <circle cx="107" cy="155" r="2" fill="#1A8FFF" opacity="0.3" />
        <circle cx="125" cy="250" r="2" fill="#1A8FFF" opacity="0.4" />
        <circle cx="110" cy="270" r="1.5" fill="#1A8FFF" opacity="0.25" />
        <circle cx="270" cy="268" r="2" fill="#1A8FFF" opacity="0.4" />
        <circle cx="276" cy="250" r="1.5" fill="#1A8FFF" opacity="0.3" />

        {/* ── Spray scatter — T side (white dots) ── */}
        <circle cx="570" cy="105" r="2.5" fill="#FFFFFF" opacity="0.45" />
        <circle cx="577" cy="120" r="1.5" fill="#FFFFFF" opacity="0.3" />
        <circle cx="564" cy="95" r="1.5" fill="#FFFFFF" opacity="0.35" />
        <circle cx="472" cy="278" r="2" fill="#FFFFFF" opacity="0.3" />
        <circle cx="437" cy="282" r="1.5" fill="#FFFFFF" opacity="0.25" />
        <circle cx="344" cy="140" r="2" fill="#AACCFF" opacity="0.4" />
        <circle cx="336" cy="125" r="1.5" fill="#AACCFF" opacity="0.3" />

        {/* ── Tag underlines ── */}
        <line
          x1="136"
          y1="300"
          x2="264"
          y2="300"
          stroke="#1A8FFF"
          strokeWidth="1.5"
          opacity="0.3"
          strokeDasharray="4 3"
        />
        <line
          x1="345"
          y1="300"
          x2="556"
          y2="300"
          stroke="#FFFFFF"
          strokeWidth="1.5"
          opacity="0.2"
          strokeDasharray="4 3"
        />
      </svg>

      {/* Blue aura on hover */}
      <div className="absolute inset-0 bg-[#0066FF]/5 blur-2xl rounded-full scale-0 group-hover:scale-100 transition-transform duration-500" />
    </div>
  );
};

export default GraffitiLogo;
