"use client";

import { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import GraffitiLogo from "../logo";

type SectionKey = "home" | "about" | "projects" | "testimonial" | "contact";

interface NavItem {
  key: SectionKey;
  label: string;
}

const navItems: NavItem[] = [
  { key: "home", label: "Home" },
  { key: "about", label: "About" },
  { key: "projects", label: "Projects" },
  { key: "testimonial", label: "Testimonials" },
  { key: "contact", label: "Contact" },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const container = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const linksRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const tl = useRef<gsap.core.Timeline | null>(null);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  useGSAP(
    () => {
      if (!menuRef.current) return;

      // 1. Initial State: use yPercent for smoother GPU performance
      gsap.set(menuRef.current, { yPercent: -100 });
      gsap.set(linksRef.current, { y: 100, opacity: 0, rotate: 5 });

      tl.current = gsap.timeline({
        paused: true,
        defaults: { ease: "expo.inOut", duration: 0.85 },
      });

      tl.current
        .to(menuRef.current, {
          yPercent: 0,
          force3D: true, // Forces GPU on mobile
        })
        .to(
          linksRef.current,
          {
            y: 0,
            opacity: 1,
            rotate: 0,
            stagger: 0.1,
            duration: 0.8,
            ease: "power4.out",
          },
          "-=0.4"
        );
    },
    { scope: container }
  );

  // Sync timeline with state
  useEffect(() => {
    if (!tl.current) return;
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
      tl.current.play();
    } else {
      document.body.style.overflow = "";
      tl.current.reverse();
    }
  }, [isMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      // Find all sections marked as dark
      const darkSections = document.querySelectorAll('[data-theme="dark"]');
      const navHeight = 80; // Height of your navbar

      let overDark = false;

      darkSections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        // Check if the navbar is within the bounds of a dark section
        if (rect.top <= 40 && rect.bottom >= 40) {
          overDark = true;
        }
      });

      setIsDark(overDark);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div ref={container}>
      <header
        className={`fixed top-0 left-0 w-full z-3500 backdrop-blur-2xl ${
          isDark ? "bg-foreground" : "bg-transparent"
        } `}
      >
        <nav className="max-w-7xl  mx-auto px-6 h-20 flex items-center justify-between relative z-4000">
          {/* Logo */}

          <GraffitiLogo />

          {/* Desktop Nav */}
          <div className="hidden  md:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
            {navItems.map((item) => (
              <a
                key={item.key}
                href={`#${item.key}`}
                className={`text-[16px] uppercase font-bold text-foreground font-syne ${
                  isDark ? "text-white" : "text-foreground"
                }`}
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Hamburger Button - High Z-index & Fixed Position */}
          <button
            type="button"
            onClick={toggleMenu}
            className={`md:hidden w-12 h-12 flex flex-col justify-center items-center gap-1.5 relative z-5000 pointer-events-auto`}
          >
            <span
              className={`block w-7 h-0.5 transition-all duration-500  ${
                isDark ? "bg-white" : "text-[#111111]"
              } ${
                isMenuOpen ? "rotate-45 translate-y-2 bg-white" : "bg-[#111111]"
              }`}
            />
            <span
              className={`block w-7 h-[2px] bg-[#111111] transition-all duration-300 ${
                isMenuOpen ? "opacity-0" : "opacity-100"
              }  ${isDark ? "bg-white" : "text-[#111111]"}`}
            />
            <span
              className={`block w-7 h-[2px] transition-all duration-500 ${
                isMenuOpen
                  ? "-rotate-45 -translate-y-[8px] bg-white"
                  : "bg-[#111111]"
              }  ${isDark ? "bg-white" : "text-[#111111]"}`}
            />
          </button>
        </nav>
      </header>

      {/* Mobile Menu Overlay - Move out of <header> for better mobile stacking */}
      <div
        ref={menuRef}
        className={`md:hidden fixed inset-0 h-dvh w-full bg-[#111111] z-3000 
        flex flex-col justify-center items-center px-5
        ${isMenuOpen ? "pointer-events-auto" : "pointer-events-none"}`}
      >
        <div className="flex flex-col gap-6">
          {navItems.map((item, index) => (
            <div key={item.key} className="overflow-hidden">
              <a
                href={`#${item.key}`}
                ref={(el) => {
                  linksRef.current[index] = el;
                }}
                onClick={closeMenu}
                className="block font-syne text-white uppercase font-black text-[clamp(1.5rem,6vw,5rem)] leading-none"
              >
                {item.label}
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Header;
