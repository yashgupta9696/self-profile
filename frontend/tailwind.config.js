/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#07070b",
          900: "#0c0d14",
          800: "#141522",
          700: "#1c1e2e",
        },
        accent: {
          DEFAULT: "#5eead4",
          dim: "#2dd4bf",
        },
      },
      fontFamily: {
        sans: ["var(--font-outfit)", "system-ui", "sans-serif"],
        display: ["var(--font-syne)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 80px -20px rgba(45, 212, 191, 0.45)",
      },
    },
  },
  plugins: [],
};
