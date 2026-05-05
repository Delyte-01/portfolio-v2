"use client";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Project {
  readonly id: string;
  readonly title: readonly [string, string];
  readonly category: string;
  readonly image: string;
  readonly tech: readonly string[];
  readonly description: string;
  readonly github: string;
  readonly live: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const PROJECTS: readonly Project[] = [
  {
    id: "06",
    title: ["LiteUpper", "App"],
    category: "Smart• Exam • Prep",
    image:
      "https://res.cloudinary.com/dk5mfu099/image/upload/v1777973844/Screenshot_from_2026-05-05_10-37-06_dwluvy.png",
    tech: ["React.js", "Mui Styling", "Framer motion"],
    description:
      "LiteUpper powers digital assessments for institutions and helps students ace JAMB, WAEC, NECO and more — with curated past questions and smart analytics.",
    github: "https://github.com/UC-BLACK1/LiteUpNigeriaFrontEndWeb",
    live: "https://liteupper.com/",
  },
  {
    id: "01",
    title: ["NeoAI", "App"],
    category: "AI • Interface",
    image:
      "https://res.cloudinary.com/dk5mfu099/image/upload/v1750670564/Screenshot_of_NeoAI_1_duw3na.jpg",
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "GSAP"],
    description:
      "Developed a responsive AI-powered landing page for Neo AI, showcasing product features, benefits, and integration use cases.",
    github: "https://github.com/Delyte-01/Neo-Ai",
    live: "https://neo-ai-app.vercel.app/",
  },
  {
    id: "02",
    title: ["Playo", "Gamifi-App"],
    category: "Blockchain • Web3",
    image:
      "https://res.cloudinary.com/dk5mfu099/image/upload/v1750671816/Screenshot_of_GAMI_FI_ah9xgl.jpg",
    tech: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
    description:
      "Implemented modern UI with animations, clean layouts, and optimized performance using React, Tailwind CSS, and GSAP.",
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
      "Full-featured movie and TV discovery platform letting users explore, search, and filter content from the TMDB API.",
    github: "https://github.com/Delyte-01/movie-app",
    live: "https://cinemax-site.vercel.app/",
  },
  {
    id: "04",
    title: ["BOE ASSOCIATES", "LIMITED"],
    category: "Finance",
    image:
      "https://res.cloudinary.com/dk5mfu099/image/upload/v1769495686/Screenshot_of_BOE_Associates_Limited_phnmyf.jpg",
    tech: ["Lenis", "Next.js", "TypeScript", "Tailwind CSS"],
    description:
      "Modern financial website tailored to streamline business operations and enhance client engagement.",
    github: "https://github.com/Delyte-01/novaClone",
    live: "https://boe-associates-limited.vercel.app/",
  },
] as const;

// ─── Sub-components ───────────────────────────────────────────────────────────

const GithubIcon = () => (
  <svg
    width="18"
    height="18"
    fill="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.92.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

interface ProjectCardProps {
  project: Project;
  index: number;
}

const ProjectCard = ({ project, index }: ProjectCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!cardRef.current) return;
      const card = cardRef.current;

      // ── 3D tilt (desktop only via matchMedia) ──────────────────────────────
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px) and (hover: hover)", () => {
        const handleMove = (e: MouseEvent) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const rotX = ((y - rect.height / 2) / rect.height) * 10;
          const rotY = ((rect.width / 2 - x) / rect.width) * 10;

          gsap.to(card, {
            rotateX: rotX,
            rotateY: rotY,
            scale: 1.015,
            duration: 0.5,
            ease: "power2.out",
            transformPerspective: 1200,
          });
        };

        const handleLeave = () => {
          gsap.to(card, {
            rotateX: 0,
            rotateY: 0,
            scale: 1,
            duration: 1.1,
            ease: "elastic.out(1, 0.4)",
          });
        };

        card.addEventListener("mousemove", handleMove);
        card.addEventListener("mouseleave", handleLeave);

        return () => {
          card.removeEventListener("mousemove", handleMove);
          card.removeEventListener("mouseleave", handleLeave);
        };
      });

      // ── Color bar hover ────────────────────────────────────────────────────
      const bar = card.querySelector<HTMLElement>(".color-bar");
      if (bar) {
        gsap.set(bar, { scaleX: 0, transformOrigin: "left center" });

        card.addEventListener("mouseenter", () => {
          gsap.to(bar, {
            scaleX: 1,
            duration: 0.7,
            ease: "expo.out",
          });
        });
        card.addEventListener("mouseleave", () => {
          gsap.to(bar, {
            scaleX: 0,
            transformOrigin: "right center",
            duration: 0.5,
            ease: "power3.in",
          });
        });
      }
    },
    { scope: cardRef }
  );

  return (
    <div
      id="projects"
      className="project-wrap w-full flex-shrink-0 lg:w-[68vw] lg:px-10 mb-8 lg:mb-0"
      style={{ perspective: "1400px" }}
    >
      <div
        ref={cardRef}
        className="project-card relative bg-[#0f0f0f] border border-white/[0.05] rounded-[1.75rem] md:rounded-[2.5rem] overflow-hidden [transform-style:preserve-3d] will-change-transform"
      >
        {/* Card body */}
        <div className="flex flex-col lg:grid lg:grid-cols-12 min-h-[420px] lg:min-h-[380px]">
          {/* Visual side */}
          <div className="lg:col-span-6 relative overflow-hidden rounded-[1.5rem] md:rounded-[2rem] min-h-[260px] lg:min-h-full">
            <Image
              src={project.image}
              alt={project.title.join(" ")}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]
                         lg:grayscale-[10%] group-hover:grayscale-0 group-hover:scale-[1.04]"
              priority={index === 0}
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/45 transition-colors duration-700 group-hover:bg-transparent rounded-[inherit]" />

            {/* Ambient shimmer on hover */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-[inherit]"
              style={{
                background:
                  "linear-gradient(135deg, transparent 40%, rgba(124,58,237,0.08) 100%)",
              }}
            />

            {/* Ghost number */}
            <span className="absolute top-7 left-7 font-syne text-[5rem] leading-none font-black text-white/[0.04] pointer-events-none select-none">
              {project.id}
            </span>

            {/* Category pill */}
            <div className="absolute bottom-7 left-7">
              <span className="px-4 py-2 bg-black/65 backdrop-blur-md border border-white/10 rounded-full text-[9px] text-white font-bold tracking-[0.18em] uppercase">
                {project.category}
              </span>
            </div>
          </div>

          {/* Content side */}
          <div className="lg:col-span-6 p-8 lg:p-12 xl:p-14 flex flex-col justify-between gap-8">
            <div className="space-y-5">
              <h3 className="font-syne text-[clamp(1.6rem,2.8vw,2.6rem)] font-black text-white uppercase tracking-[-0.04em] leading-[0.88]">
                {project.title[0]}
                <br />
                {project.title[1]}
              </h3>

              <p className="text-zinc-500 text-sm lg:text-[0.9rem] leading-[1.85]">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2 pt-1">
                {project.tech.map((t) => (
                  <span
                    key={t}
                    className="px-3 py-1 bg-white/[0.03] border border-white/[0.06] rounded-full text-[9px] text-zinc-600 font-bold uppercase tracking-[0.1em]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Link
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 h-[52px] bg-white text-black flex items-center justify-center font-bold uppercase text-[10px] tracking-[0.18em] rounded-[1rem]
                           transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
                           hover:bg-[var(--primary)] hover:text-white hover:scale-[1.02] active:scale-[0.98]"
              >
                View Project ↗
              </Link>
              <Link
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View source on GitHub"
                className="w-[52px] h-[52px] border border-white/10 flex items-center justify-center rounded-[1rem] text-white
                           transition-all duration-300 hover:bg-white/[0.06] hover:border-white/20 hover:scale-[1.05] active:scale-[0.95]"
              >
                <GithubIcon />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom accent line */}
        <div
          className="color-bar absolute bottom-0 left-0 right-0 h-[2px] pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, var(--primary), rgba(196,181,253,0.4), transparent)",
          }}
        />
      </div>
    </div>
  );
};

// ─── Projects Section ─────────────────────────────────────────────────────────

const Projects = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      const mm = gsap.matchMedia();

      // ── Desktop: horizontal scroll ─────────────────────────────────────────
      mm.add("(min-width: 1024px)", () => {
        const section = sectionRef.current;
        const track = trackRef.current;
        if (!section || !track) return;

        const getLength = () => track.scrollWidth - window.innerWidth;

        const horizontalTween = gsap.to(track, {
          x: () => -getLength(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${track.scrollWidth}`,
            pin: true,
            scrub: 1.2,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // Intro text staggered reveal
        gsap.from(".reveal-word", {
          y: 80,
          rotateZ: 4,
          opacity: 0,
          duration: 1.4,
          stagger: 0.08,
          ease: "expo.out",
          scrollTrigger: {
            trigger: section,
            start: "top 70%",
          },
        });

        // Card entrance on horizontal progress
        gsap.utils.toArray<HTMLElement>(".project-wrap").forEach((wrap, i) => {
          gsap.from(wrap, {
            opacity: 0,
            y: 40,
            duration: 1.2,
            ease: "expo.out",
            scrollTrigger: {
              trigger: wrap,
              containerAnimation: horizontalTween,
              start: "left 90%",
              toggleActions: "play none none none",
            },
            delay: i * 0.05,
          });
        });

        // Velocity-based skew
        const proxy = { skew: 0 };
        const skewSetter = gsap.quickSetter(".project-card", "skewX", "deg");
        const clamp = gsap.utils.clamp(-6, 6);

        ScrollTrigger.create({
          onUpdate: (self) => {
            const target = clamp(self.getVelocity() / -400);
            if (Math.abs(target) > Math.abs(proxy.skew)) {
              proxy.skew = target;
              gsap.to(proxy, {
                skew: 0,
                duration: 0.9,
                ease: "power3",
                overwrite: true,
                onUpdate: () => skewSetter(proxy.skew),
              });
            }
          },
        });
      });

      // ── Mobile: vertical scroll entrance animations ────────────────────────
      mm.add("(max-width: 1023px)", () => {
        // Header words
        gsap.from(".reveal-word", {
          y: 60,
          opacity: 0,
          duration: 1.2,
          stagger: 0.07,
          ease: "expo.out",
          scrollTrigger: {
            trigger: ".projects-header",
            start: "top 80%",
          },
        });

        // Each card fades + slides up as it enters viewport
        gsap.utils.toArray<HTMLElement>(".project-wrap").forEach((wrap) => {
          gsap.fromTo(
            wrap,
            { opacity: 0, y: 60 },
            {
              opacity: 1,
              y: 0,
              duration: 1.1,
              ease: "expo.out",
              scrollTrigger: {
                trigger: wrap,
                start: "top 88%",
                toggleActions: "play none none none",
              },
            }
          );
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
        className="flex flex-col lg:flex-row lg:h-screen w-full lg:w-fit
                   items-start lg:items-center
                   px-[6vw] py-20 lg:py-0 gap-0 lg:gap-0"
      >
        {/* ── Intro panel ───────────────────────────────────────────────────── */}
        <div className="projects-header flex-shrink-0 w-full lg:w-[36vw] mb-16 lg:mb-0 lg:pr-[3vw]">
          {/* Eyebrow */}
          <div className="overflow-hidden mb-5">
            <span className="reveal-word block text-[var(--primary)] text-[10px] font-bold tracking-[0.5em] uppercase">
              Selected Works
            </span>
          </div>

          {/* Headline */}
          <div className="overflow-hidden">
            <h2 className="reveal-word font-syne text-[clamp(2.5rem,5.5vw,6.5rem)] font-black uppercase leading-[0.86] tracking-[-0.03em] text-white">
              Digital
            </h2>
          </div>
          <div className="overflow-hidden">
            <h2 className="reveal-word font-syne text-[clamp(2.5rem,5.5vw,6.5rem)] font-black uppercase leading-[0.86] tracking-[-0.03em] text-zinc-800">
              Archive
            </h2>
          </div>

          {/* Body */}
          <div className="overflow-hidden mt-8">
            <p className="reveal-word text-zinc-500 text-sm md:text-[0.9rem] max-w-[300px] leading-[1.85]">
              Curating high-performance interfaces where every pixel is
              intentional and motion defines the experience.
            </p>
          </div>

          {/* Count */}
          <div className="overflow-hidden mt-10">
            <p className="reveal-word text-[10px] text-zinc-700 tracking-[0.3em] uppercase font-bold">
              {PROJECTS.length.toString().padStart(2, "0")} Projects
            </p>
          </div>
        </div>

        {/* ── Project cards ──────────────────────────────────────────────────── */}
        {PROJECTS.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} />
        ))}

        {/* Desktop end spacer */}
        <div className="hidden lg:block w-[8vw] shrink-0" aria-hidden="true" />
      </div>
    </section>
  );
};

export default Projects;
