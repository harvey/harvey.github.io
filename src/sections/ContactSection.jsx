import { useState } from 'react';
import { personalInfo, socials } from '../lib/content';

const initialForm = { name: '', email: '', message: '' };

export default function ContactSection() {
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
    setForm(initialForm);
  };

  return (
    <section id="contact" className="section-shell">
      <div className="glass-panel relative overflow-hidden p-8 sm:p-10">
        <div className="absolute inset-0 bg-noise opacity-70" aria-hidden="true" />
        <div className="relative grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="section-title">Contact</h2>
            <p className="section-copy">
              Let&apos;s build something polished, useful, and memorable. This form is frontend-only and ready for your preferred backend.
            </p>
            <a href={`mailto:${personalInfo.email}`} className="mt-6 inline-block text-accent hover:underline">
              {personalInfo.email}
            </a>
            <div className="mt-6 flex flex-wrap gap-3">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="rounded-full border border-white/20 px-4 py-2 text-sm text-slate-200 transition hover:border-accent/60 hover:text-accent"
                >
                  {social.label}
                </a>
              ))}
            </div>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <label className="block text-sm text-slate-300">
              Name
              <input
                required
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                className="mt-2 w-full rounded-xl border border-white/15 bg-black/20 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-accent"
                placeholder="Your name"
              />
            </label>
            <label className="block text-sm text-slate-300">
              Email
              <input
                required
                type="email"
                value={form.email}
                onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                className="mt-2 w-full rounded-xl border border-white/15 bg-black/20 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-accent"
                placeholder="you@company.com"
              />
            </label>
            <label className="block text-sm text-slate-300">
              Message
              <textarea
                required
                rows={4}
                value={form.message}
                onChange={(event) => setForm((prev) => ({ ...prev, message: event.target.value }))}
                className="mt-2 w-full rounded-xl border border-white/15 bg-black/20 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-accent"
                placeholder="Tell me about your project"
              />
            </label>
            <button type="submit" className="btn-primary">
              Send Message
            </button>
            {submitted && <p className="text-sm text-green-300">Thanks! Hook this form to Formspree, Resend, or your API route.</p>}
          </form>
        </div>
      </div>
    </section>
  );
}
