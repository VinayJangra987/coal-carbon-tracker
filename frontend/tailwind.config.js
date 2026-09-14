/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        anthracite: "#14181C",
        seam: "#0F1215",
        panel: "#1B2126",
        ember: "#E8964A",
        emberDeep: "#C97430",
        neutral: "#4F9D69",
        neutralDeep: "#3C7B51",
        ash: "#8B95A1",
        chalk: "#EDEFF2",
        line: "#2A3138",
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
