/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#0b1220",
          900: "#111827",
          800: "#1f2937",
        },
        accent: {
          DEFAULT: "#6366f1",
          soft: "#a5b4fc",
        },
      },
    },
  },
  plugins: [],
};
