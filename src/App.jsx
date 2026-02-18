import { useEffect, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import HeroSection from './sections/HeroSection';
import AboutSection from './sections/AboutSection';
import ProjectsSection from './sections/ProjectsSection';
import TimelineSection from './sections/TimelineSection';
import ContactSection from './sections/ContactSection';
import { personalInfo } from './lib/content';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const reducedMotion = useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, []);

  useEffect(() => {
    if (reducedMotion) return undefined;

    const sections = gsap.utils.toArray('section[id]:not(#home)');
    const animations = sections.map((section) =>
      gsap.from(section, {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      })
    );

    return () => {
      animations.forEach((animation) => animation.kill());
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [reducedMotion]);

  return (
    <div className="relative overflow-hidden bg-base text-slate-100">
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-base/70 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <a href="#home" className="text-sm font-semibold tracking-[0.16em] text-white">
            {personalInfo.name}
          </a>
          <div className="hidden gap-6 text-sm text-slate-300 md:flex">
            <a href="#about" className="hover:text-accent">About</a>
            <a href="#projects" className="hover:text-accent">Projects</a>
            <a href="#experience" className="hover:text-accent">Experience</a>
            <a href="#contact" className="hover:text-accent">Contact</a>
          </div>
        </nav>
      </header>

      <main>
        <HeroSection reducedMotion={reducedMotion} />
        <AboutSection />
        <ProjectsSection />
        <TimelineSection />
        <ContactSection />
      </main>

      <footer className="border-t border-white/10 px-4 py-6 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} {personalInfo.name}. Crafted for clarity, performance, and cinematic depth.
      </footer>
    </div>
  );
}
