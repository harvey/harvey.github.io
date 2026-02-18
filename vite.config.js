import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Relative asset paths avoid broken JS/CSS references on GitHub Pages
  // whether this repo is served as user site or project site.
  base: './',
});
