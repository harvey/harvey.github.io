import { timeline } from '../lib/content';

export default function TimelineSection() {
  return (
    <section id="experience" className="section-shell pt-8">
      <h2 className="section-title">Experience & Timeline</h2>
      <p className="section-copy">Readable, structured, and scannable on any screen size.</p>

      <div className="mt-10 space-y-8 border-l border-white/15 pl-6 sm:pl-10">
        {timeline.map((item) => (
          <article key={item.title} className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <span className="absolute -left-[2.15rem] top-6 h-3 w-3 rounded-full bg-accent shadow-[0_0_20px_rgba(107,232,255,0.8)]" />
            <p className="text-xs uppercase tracking-[0.16em] text-slate-400">{item.period}</p>
            <h3 className="mt-2 text-lg font-semibold text-white">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
