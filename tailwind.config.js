/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary:   { DEFAULT: "#c6613f", light: "#d4785a", dark: "#a34e30" },
        surface:   "#ffffff",
        bg:        "#faf9f7",
        border:    "#ede9e5",
        muted:     "#9a8a80",
        green:     { DEFAULT: "#2d7a4f", soft: "#eaf4ee", dark: "#1a4d31" },
        orange:    { DEFAULT: "#c6613f", soft: "#fdf0eb", dark: "#7c3825" },
      },
      borderRadius: {
        DEFAULT: "8px",
        lg: "12px",
        xl: "16px",
        full: "9999px",
      },
      boxShadow: {
        soft: "0 1px 4px rgba(0,0,0,0.06)",
        card: "0 2px 8px rgba(0,0,0,0.07)",
      },
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
