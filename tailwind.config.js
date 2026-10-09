/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./*.html",
    "./*.js"
  ],
  theme: {
    extend: {
      colors: {
        "surface-dim": "#090d18",
        "surface": "#0e1424",
        "surface-container-lowest": "#060912",
        "surface-container-low": "#11182c",
        "surface-container": "#151f38",
        "surface-container-high": "#1c2848",
        "primary": "#0066ff",
        "primary-container": "#0066ff",
        "primary-bright": "#5aa9ff",
        "on-primary-container": "#ffffff",
        "secondary": "#00d2ff",
        "tertiary": "#10b981",
        "accent-red": "#ff3b30",
        "on-surface": "#ffffff",
        "on-surface-variant": "#94a3b8",
        "outline": "#334155"
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Space Grotesk", "sans-serif"]
      },
      screens: {
        xs: "420px"
      }
    }
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/container-queries")
  ]
};
