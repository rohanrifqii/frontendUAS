/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ftech-dark': '#2d2d2d',
        'ftech-mid': '#3a3a3a',
        'ftech-card': 'rgba(255,255,255,0.07)',
        'ftech-card2': 'rgba(255,255,255,0.10)',
        'ftech-border': 'rgba(255,255,255,0.12)',
        'ftech-accent': '#e05c2a',
        'ftech-accent-h': '#f06b35',
        'ftech-text': '#f0ece8',
        'ftech-muted': '#b0a89e',
      },
      fontFamily: {
        head: ['Syne', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}