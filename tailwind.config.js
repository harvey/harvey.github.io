/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        base: '#07090f',
        panel: '#101423',
        accent: '#6be8ff',
      },
      boxShadow: {
        soft: '0 15px 60px rgba(107, 232, 255, 0.08)',
      },
      backgroundImage: {
        noise:
          "radial-gradient(circle at 20% 20%, rgba(107, 232, 255, 0.12), transparent 40%), radial-gradient(circle at 80% 0%, rgba(161, 99, 255, 0.16), transparent 35%)",
      },
    },
  },
  plugins: [],
};
