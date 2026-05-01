"use client";
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ReactLenis from "lenis/react";

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Optimization: Sync Lenis with GSAP ScrollTrigger
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const update = (_time: number) => {
      ScrollTrigger.update();
    };

    gsap.ticker.add(update);

    return () => {
      gsap.ticker.remove(update);
    };
  }, []);

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1, // Intensity of smoothing (0.1 is standard)
        duration: 1.5, // How long the scroll lasts
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
        infinite: false,
        anchors: {
          offset: -80,
          onComplete: () => {
            console.log("scrolled to anchor");
          },
        },
      }}
    >
      {children}
    </ReactLenis>
  );
}
