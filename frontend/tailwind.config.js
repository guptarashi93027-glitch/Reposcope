/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#F7F8FC",
        card: "#FFFFFF",
        ink: "#1B1E2B",
        "ink-soft": "#6B7080",
        line: "#E8E9F1",
        primary: {
          50: "#F2F1FC",
          100: "#E4E2F8",
          200: "#C7C3EE",
          300: "#A79FE1",
          400: "#8A7FD3",
          500: "#6E62C4",
          600: "#5A4EAD",
          700: "#48408A",
        },
        teal: {
          50: "#EBF7F3",
          100: "#CFEEE3",
          400: "#4FAF93",
          500: "#3B9A7E",
          600: "#2E7C65",
        },
        amber: {
          50: "#FBF2E6",
          100: "#F3DFBB",
          400: "#D99A45",
          500: "#C48431",
        },
        coral: {
          50: "#FBEEEC",
          100: "#F3D4CE",
          400: "#D97D6C",
          500: "#C15F4E",
          600: "#A84B3B",
        },
        blue: {
          400: "#5C87B0",
          500: "#4A729B",
        },
      },
      fontFamily: {
        display: ["'Newsreader'", "serif"],
        sans: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      borderRadius: {
        card: "14px",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(27,30,43,0.04), 0 4px 16px rgba(27,30,43,0.04)",
        lift: "0 2px 4px rgba(27,30,43,0.05), 0 12px 28px rgba(27,30,43,0.08)",
      },
    },
  },
  plugins: [],
}
