import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import HeroScene from '../components/HeroScene';
import { personalInfo } from '../lib/content';

export default function HeroSection({ reducedMotion }) {
  const contentRef = useRef(null);

  useEffect(() => {
    if (reducedMotion || !contentRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from('.hero-animate', {
        y: 30,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.12,
      });
    }, contentRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section id="home" className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0">
        <HeroScene reducedMotion={reducedMotion} />
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-base/40 via-base/65 to-base" aria-hidden="true" />

      <div ref={contentRef} className="section-shell relative z-10 flex min-h-screen items-center">
        <div className="glass-panel max-w-3xl p-8 sm:p-12">
          <p className="hero-animate text-xs uppercase tracking-[0.22em] text-accent">Developer Portfolio</p>
          <h1 className="hero-animate mt-4 text-4xl font-semibold leading-tight text-white sm:text-6xl">
            {personalInfo.name}
          </h1>
          <p className="hero-animate mt-4 text-lg font-medium text-slate-200 sm:text-xl">{personalInfo.role}</p>
          <p className="hero-animate mt-6 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
            {personalInfo.tagline}
          </p>
          <div className="hero-animate mt-8 flex flex-wrap gap-4">
            <a href="#projects" className="btn-primary">
              View Projects
            </a>
            <a href="#contact" className="btn-secondary">
              Contact
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
