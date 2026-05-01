"use client";

import Preloader from "@/components/loader";
import About from "@/features/about";
import BentoCertificates from "@/features/certificate";
import ContactSection from "@/features/contact";
import Hero from "@/features/hero";
import Projects from "@/features/projects";
import Testimonials from "@/features/testimonial";


import { useState } from "react";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  return (
    <main>
      {/* 1. The Preloader tells the page when it's done */}
      {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}
      <div>
        <Hero start={!isLoading} />
        <About />
        <Projects />
        <Testimonials />
        <BentoCertificates />
        <ContactSection />
      </div>
    </main>
  );
}
