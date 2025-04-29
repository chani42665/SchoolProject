/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        lg: '900px', // שינוי נקודת השבירה של lg ל-900px
      },
    },
  },
  plugins: [],
}
