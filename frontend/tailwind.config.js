/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        anthracite: "var(--color-anthracite)",
        seam: "var(--color-seam)",
        panel: "var(--color-panel)",
        ember: "var(--color-ember)",
        emberDeep: "#C97430",
        neutral: "var(--color-neutral)",
        neutralDeep: "#3C7B51",
        ash: "var(--color-ash)",
        chalk: "var(--color-chalk)",
        line: "var(--color-line)",
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
      },
    },
  },
  plugins: [],
};