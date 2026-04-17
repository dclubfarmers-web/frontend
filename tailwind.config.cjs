/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Fira Sans', 'sans-serif'],
        code: ['Fira Code', 'monospace'],
      },
      colors: {
        primary: {
          light: '#5B8A3F',
          DEFAULT: '#1A3D24',
          dark: '#0F1E12',
        },
        secondary: {
          light: '#F39C12',
          DEFAULT: '#E67E22',
          dark: '#D35400',
        },
        cyan: {
          50: '#ecfeff',
        }
      },
    },
  },
  plugins: [],
}
