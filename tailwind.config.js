/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',  // <--- agrega esta línea para activar modo oscuro por clase
  theme: {
    extend: {
      colors: {
        'custom-bg': '#13161C',
        'custom-bg-section': '#1A1B25',
      },
    },
  },
  plugins: [],
}
