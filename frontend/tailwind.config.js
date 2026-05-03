/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",  // 👈 반드시 이거
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}