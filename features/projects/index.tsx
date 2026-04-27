"use client";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";

const PROJECTS = [
  {
    id: "01",
    title: ["NeoAI", "App"],
    category: "AI • Interface",
    image:
      "https://res.cloudinary.com/dk5mfu099/image/upload/v1750670564/Screenshot_of_NeoAI_1_duw3na.jpg",
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "Gsap"],
    description:
      "Developed a responsive AI-powered landing page for Neo AI, showcasing product features, benefits, and integration use cases.",
    github: "https://github.com/Delyte-01/Neo-Ai",
    live: "https://neo-ai-app.vercel.app/",
  },
  {
    id: "02",
    title: ["Playo ", "Gamifi-App"],
    category: "Blockchain • Web3",
    image:
      "https://res.cloudinary.com/dk5mfu099/image/upload/v1750671816/Screenshot_of_GAMI_FI_ah9xgl.jpg",
    tech: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
    description:
      "Implemented modern UI with animations, clean layouts, and optimized performance using React, Tailwind CSS, and Gsap.",
    github: "https://github.com/Delyte-01/gami-fi",
    live: "https://gamifi-net.netlify.app/",
  },
  {
    id: "03",
    title: ["CineMax", "Movie App"],
    category: "SaaS • Education",
    image:
      "https://res.cloudinary.com/dk5mfu099/image/upload/v1753439702/Screenshot_of_CineMax_1_nbbdfd.jpg",
    tech: ["TMDB", "Next.js", "TypeScript", "Tailwind CSS"],
    description:
      "Cinemax is a responsive, full-featured movie and TV discovery platform that lets users explore, search, and filter content from  (TMDB) API.",
    github: "https://github.com/Delyte-01/movie-app",
    live: "https://cinemax-site.vercel.app/",
  },
  {
    id: 4,
    title: ["BOE ASSOCIATES", "LIMITED"],
    category: "Finance",
    image:
      "https://res.cloudinary.com/dk5mfu099/image/upload/v1769495686/Screenshot_of_BOE_Associates_Limited_phnmyf.jpg",
    tech: ["Lenis", "Next.js", "TypeScript", "Tailwind CSS"],
    description:
      "I designed and developed a modern financial website tailored to streamline business operations and enhance client engagement. ",
    github: "https://github.com/Delyte-01/novaClone",
    live: "https://boe-associates-limited.vercel.app/",
  },
];

const GithubIcon = () => (
  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.92.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const Projects = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        if (!sectionRef.current || !trackRef.current) return;

        const track = trackRef.current;
        const horizontalLength = track.scrollWidth - window.innerWidth;

        // 1. Horizontal Scroll & Pinning
        gsap.to(track, {
          x: -horizontalLength,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: () => `+=${track.scrollWidth}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });

        // 2. Intro Text Animation (Words slide up)
        gsap.from(".reveal-text", {
          y: 100,
          rotate: 5,
          opacity: 0,
          duration: 1.2,
          stagger: 0.1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
          },
        });

        // 3. Card Skew on Scroll
        const proxy = { skew: 0 },
          skewSetter = gsap.quickSetter(".project-card", "skewX", "deg"),
          clamp = gsap.utils.clamp(-8, 8);

        ScrollTrigger.create({
          onUpdate: (self) => {
            const skew = clamp(self.getVelocity() / -300);
            if (Math.abs(skew) > Math.abs(proxy.skew)) {
              proxy.skew = skew;
              gsap.to(proxy, {
                skew: 0,
                duration: 0.8,
                ease: "power3",
                overwrite: true,
                onUpdate: () => skewSetter(proxy.skew),
              });
            }
          },
        });

        // 4. 3D Tilt for Cards
        gsap.utils.toArray<HTMLElement>(".project-card").forEach((card) => {
          card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const rotateX = (y - rect.height / 2) / 20;
            const rotateY = (rect.width / 2 - x) / 20;

            gsap.to(card, {
              rotateX,
              rotateY,
              scale: 1.02,
              duration: 0.5,
              ease: "power2.out",
            });
          });

          card.addEventListener("mouseleave", () => {
            gsap.to(card, {
              rotateX: 0,
              rotateY: 0,
              scale: 1,
              duration: 1,
              ease: "elastic.out(1, 0.3)",
            });
          });
        });
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#060606] overflow-hidden lg:min-h-screen"
      data-theme="dark" // Add this attribute
    >
      <div
        ref={trackRef}
        className="flex flex-col lg:flex-row lg:h-screen w-full lg:w-fit items-center px-[6vw] py-20 lg:py-0"
      >
        {/* DESKTOP INTRO SLIDE */}
        <div className="flex-shrink-0 w-full lg:w-[35vw] mb-20 lg:mb-0 lg:pr-[2vw]">
          <div className="overflow-hidden mb-4">
            <span className="reveal-text block text-[var(--primary)] text-[10px] font-bold tracking-[0.5em] uppercase">
              Selected Works
            </span>
          </div>

          <div className="overflow-hidden">
            <h2 className="reveal-text font-syne text-[clamp(2.5rem,5vw,6rem)] font-black uppercase leading-[0.85] text-white">
              Digital <br />
              <span className="text-zinc-800">Archive</span>
            </h2>
          </div>

          <div className="overflow-hidden mt-8">
            <p className="reveal-text body-font text-zinc-500 text-sm md:text-base max-w-xs leading-relaxed">
              Curating high-performance interfaces where every pixel is
              intentional and motion defines the experience.
            </p>
          </div>
        </div>

        {/* PROJECTS */}
        {PROJECTS.map((project) => (
          <div
            key={project.id}
            className="project-wrap flex-shrink-0 w-full lg:w-[65vw]  lg:px-12 mb-10 lg:mb-0"
            style={{ perspective: "1500px" }}
          >
            <div className="project-card relative bg-[#111] border border-white/5 rounded-2xl md:rounded-[2.5rem] overflow-hidden group [transform-style:preserve-3d]">
              <div className="lg:grid flex flex-col  lg:grid-cols-12 gap-0">
                {/* Visual Side */}
                <div className="lg:col-span-6  w-full   relative aspect-video lg:aspect-auto overflow-hidden h-[300px] md:h-full">
                  <Image
                    width={600}
                    height={400}
                    src={project.image}
                    alt={project.title.join(" ")}
                    className="w-full h-full object-cover lg:grayscale-50 transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-700" />

                  {/* Floating Tags */}
                  <span className="absolute top-8 left-8 font-syne text-5xl font-black text-white/5 pointer-events-none">
                    {project.id}
                  </span>
                  <div className="absolute bottom-8 left-8">
                    <span className="px-4 py-2 bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-[10px] text-white font-bold tracking-widest uppercase">
                      {project.category}
                    </span>
                  </div>
                </div>

                {/* Content Side */}
                <div className="lg:col-span-5 p-8 lg:p-14 flex flex-col justify-between space-y-10">
                  <div className="space-y-6">
                    <h3 className="font-syne text-2xl md:text-4xl  font-black text-white uppercase tracking-tighter leading-none">
                      {project.title[0]} <br /> {project.title[1]}
                    </h3>
                    <p className="body-font text-zinc-400 text-sm lg:text-base leading-relaxed">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((t) => (
                        <span
                          key={t}
                          className="px-3 py-1 bg-white/[0.03] border border-white/5 rounded-full text-[9px] text-zinc-500 font-bold uppercase tracking-tighter"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Link
                      href={project.live}
                      target="_blank"
                      className="flex-1 h-14 bg-white text-black flex items-center justify-center font-bold uppercase text-[11px] tracking-widest rounded-2xl hover:bg-[var(--primary)] hover:text-white transition-colors"
                    >
                      View Project ↗
                    </Link>
                    <Link
                      href={project.github}
                      target="_blank"
                      className="w-14 h-14 border border-white/10 flex items-center justify-center rounded-2xl hover:bg-white/5 transition-colors"
                    >
                      <GithubIcon />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* END SPACER */}
        <div className="hidden lg:block w-[10vw] shrink-0" />
      </div>
    </section>
  );
};

export default Projects;
