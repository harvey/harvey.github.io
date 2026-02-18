# Harvey Chandler Portfolio (React + Vite + Three.js)

A cinematic, premium-feeling developer portfolio built with modern frontend tooling and optimized for static deployment to GitHub Pages.

## Tech Stack

- React + Vite
- Tailwind CSS
- Three.js via `@react-three/fiber` + `@react-three/drei`
- GSAP + ScrollTrigger
- `@react-three/postprocessing` for subtle bloom/vignette/noise

## Quick Start

```bash
npm install
npm run dev
```

Open the local URL shown by Vite.

## Project Structure

```text
src/
  components/
    HeroScene.jsx          # Main cinematic 3D hero canvas
  sections/
    HeroSection.jsx
    AboutSection.jsx
    ProjectsSection.jsx
    TimelineSection.jsx
    ContactSection.jsx
  lib/
    content.js             # Main content/config (edit this first)
  App.jsx
  main.jsx
  styles.css
```

## How to Edit Content

### 1) Personal Details
Edit `src/lib/content.js`:
- `personalInfo` for name, role, tagline, contact details.
- `socials` for social links.

### 2) Projects
Edit `projects` in `src/lib/content.js`:
- `title`
- `category` (`Web`, `AI`, `Tools`, etc.)
- `summary`
- `tech`
- `live` and `github` links

### 3) Timeline / Experience
Edit `timeline` in `src/lib/content.js`.

### 4) Accent Color / Theme
Edit `tailwind.config.js` (`accent`, `base`, `panel`) and `src/styles.css` utility classes.

## Build for Production

```bash
npm run build
npm run preview
```

## GitHub Pages Deployment

> Important: Do **not** publish the raw source branch directly. GitHub Pages cannot execute `.jsx` entry files (`/src/main.jsx`) and will show MIME errors/blank page.

This repo includes `.github/workflows/deploy-pages.yml` which builds the app with Vite and deploys the generated `dist/` output to Pages.

### Recommended setup (GitHub Actions)
1. Push this repository to GitHub.
2. In **Settings → Pages**, set **Source** to **GitHub Actions**.
3. Push to `main` (or run the workflow manually).
4. Wait for the **Deploy Vite site to GitHub Pages** workflow to finish.

### Manual local deployment (optional)
You can still deploy manually with:
```bash
npm run build
npm run deploy
```
Then set Pages source to the `gh-pages` branch.

## Performance Tips

- Keep 3D geometry simple and avoid large texture downloads.
- Keep post-processing subtle (already tuned for readability/perf).
- Prefer SVG/icon fonts over large image assets.
- Use short project summaries to reduce layout shifts.
- Respect reduced-motion users (`prefers-reduced-motion` is supported).
- Keep dependency list lean and avoid multiple animation libraries doing the same thing.

## Accessibility and UX Notes

- Dark-mode-first palette with high contrast text.
- Reduced-motion preference handling included.
- Clear section hierarchy and readable typography.
- Contact form is frontend-only placeholder by design.

## 10-Minute Customization Checklist

- [ ] Update name, role, tagline in `src/lib/content.js`.
- [ ] Replace project cards and links in `src/lib/content.js`.
- [ ] Add real LinkedIn URL and social links.
- [ ] Tune accent color in `tailwind.config.js`.
- [ ] Adjust hero intro copy and CTA text in `src/sections/HeroSection.jsx`.
- [ ] Update timeline entries.
- [ ] Run `npm run build` and deploy.

## Optional Upgrades

- Blog section (MDX or headless CMS)
- CMS-backed projects (Sanity, Contentful, Strapi)
- Dark/light theme toggle with persisted preference
- Analytics (Plausible, Umami, or GA4)
- Contact form backend (Resend/Formspree/Netlify Functions)
- Case study pages with route-based transitions
- i18n multi-language support
- OpenGraph image generation automation
