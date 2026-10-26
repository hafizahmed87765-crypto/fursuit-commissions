import type { Config } from "tailwindcss";
import forms from "@tailwindcss/forms";

// Brand palette taken from the live site's Astra global colours and Elementor
// kit (see docs/DESIGN-SYSTEM.md). Only `ink-muted` and `mint-deep` are new:
// darker shades of existing tokens, added so small text and focus rings meet
// WCAG AA contrast on the mint surfaces.
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        forest: { DEFAULT: "#21463F", 700: "#1a3833", 900: "#122824" }, // e-global primary
        mint: {
          DEFAULT: "#A5D4C4", // ast-global-color-0 / 5 — logo body
          light: "#D1FADF", // ast-global-color-1
          footer: "#D3E9E1", // footer background
          wash: "#F1F8F5", // ast-global-color-7 (5% mint) flattened onto white
          deep: "#3F7F6E", // darker mint for icons / rings
        },
        lavender: { DEFAULT: "#E4D0FF", soft: "#F2E7FF" }, // ast 2 / 8
        blush: { DEFAULT: "#FFCCC9", tongue: "#E8707A" }, // ast 6 / logo tongue
        snow: "#F8FDFF", // ast 3
        petal: "#FFF7FC", // ast 4
        ink: { DEFAULT: "#21463F", muted: "#46625C" },
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-rounded", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      borderRadius: { blob: "2rem" },
      boxShadow: {
        card: "0 1px 2px rgb(33 70 63 / 0.06), 0 8px 24px -12px rgb(33 70 63 / 0.18)",
        lift: "0 2px 4px rgb(33 70 63 / 0.08), 0 18px 40px -16px rgb(33 70 63 / 0.28)",
      },
      keyframes: {
        rise: { from: { opacity: "0", transform: "translateY(14px)" }, to: { opacity: "1", transform: "none" } },
        reveal: { from: { opacity: "0", transform: "scale(1.03)" }, to: { opacity: "1", transform: "none" } },
      },
      animation: {
        rise: "rise .6s cubic-bezier(.2,.7,.2,1) both",
        reveal: "reveal .9s cubic-bezier(.2,.7,.2,1) both",
      },
    },
  },
  plugins: [forms],
};

export default config;
