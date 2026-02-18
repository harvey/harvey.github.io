import { useMemo, useState } from 'react';
import { projectCategories, projects } from '../lib/content';

export default function ProjectsSection() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredProjects = useMemo(() => {
    if (activeCategory === 'All') return projects;
    return projects.filter((project) => project.category === activeCategory);
  }, [activeCategory]);

  return (
    <section id="projects" className="section-shell pt-8">
      <h2 className="section-title">Featured Projects</h2>
      <p className="section-copy">Award-site energy with practical product storytelling: clean cards, smooth depth, clear outcomes.</p>

      <div className="mt-8 flex flex-wrap gap-3">
        {projectCategories.map((category) => {
          const isActive = activeCategory === category;
          return (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`rounded-full px-4 py-2 text-xs font-medium transition ${
                isActive ? 'bg-accent text-slate-950' : 'border border-white/15 bg-white/5 text-slate-300 hover:border-accent/70'
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {filteredProjects.map((project) => (
          <article
            key={project.title}
            className="group glass-panel relative overflow-hidden p-6 transition hover:-translate-y-1 hover:border-accent/40"
          >
            <div className="pointer-events-none absolute -inset-px bg-gradient-to-br from-accent/0 via-accent/0 to-accent/30 opacity-0 transition group-hover:opacity-100" />
            <div className="relative">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-400">{project.category}</p>
              <h3 className="mt-2 text-xl font-semibold text-white">{project.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">{project.summary}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.tech.map((item) => (
                  <span key={item} className="rounded-full border border-white/15 px-3 py-1 text-xs text-slate-300">
                    {item}
                  </span>
                ))}
              </div>
              <div className="mt-6 flex gap-4 text-sm font-medium">
                <a className="text-accent hover:underline" href={project.live}>
                  Live
                </a>
                <a className="text-slate-200 hover:text-accent" href={project.github}>
                  GitHub
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
