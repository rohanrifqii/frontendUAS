/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Tentukan warna aksen oranye dari desain
        'ftech-orange': '#D96D4B', // Perkiraan warna oranye-merah dari gambar
        'ftech-dark': '#303236',   // Perkiraan warna latar belakang gelap utama
        'ftech-medium': '#525459', // Perkiraan warna latar belakang gelap medium
      },
    },
  },
  plugins: [],
}