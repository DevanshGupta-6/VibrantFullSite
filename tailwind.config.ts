import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        base: {
          950: "#07070B",
          900: "#0B0A10",
          850: "#0F0D16",
          800: "#14121C",
        },
        vibeesta: {
          600: "#6D28D9",
          500: "#7C3AED",
          400: "#A855F7",
          300: "#C084FC",
        },
        shrinik: {
          900: "#5A0018",
          800: "#7F1028",
          700: "#9F1239",
          600: "#B91C3D",
          gold: "#C9A24B",
        },
        ink: {
          0: "#F5F3F7",
          300: "#B8B3C4",
          500: "#7C7690",
          700: "#524D63",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      maxWidth: {
        content: "1360px",
      },
      transitionTimingFunction: {
        cinematic: "cubic-bezier(.16,.84,.44,1)",
        soft: "cubic-bezier(.22,.61,.36,1)",
      },
    },
  },
  plugins: [],
};

export default config;