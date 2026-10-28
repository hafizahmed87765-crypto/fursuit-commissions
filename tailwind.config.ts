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
        card: "0 1px 2px rgb(38 48 45 / 0.04), 0 4px 16px -8px rgb(38 48 45 / 0.10)",
        lift: "0 2px 4px rgb(38 48 45 / 0.05), 0 20px 40px -20px rgb(38 48 45 / 0.25)",
        // Hard "toony" offset shadows that echo cartoon linework.
        "toon-sm": "3px 3px 0 0 #21463F",
        toon: "6px 6px 0 0 #21463F",
        "toon-lg": "10px 10px 0 0 #21463F",
      },
      keyframes: {
        rise: { from: { opacity: "0", transform: "translateY(22px)" }, to: { opacity: "1", transform: "none" } },
        reveal: { from: { opacity: "0", transform: "scale(1.04)" }, to: { opacity: "1", transform: "none" } },
        page: { from: { opacity: "0", transform: "translateY(8px)" }, to: { opacity: "1", transform: "none" } },
        "soft-pulse": { "0%, 100%": { opacity: "1" }, "50%": { opacity: ".35" } },
        float: { "0%, 100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-8px)" } },
        marquee: { from: { transform: "translateX(0)" }, to: { transform: "translateX(-50%)" } },
        draw: { from: { strokeDashoffset: "320" }, to: { strokeDashoffset: "0" } },
        "paw-step": { "0%, 100%": { opacity: "0", transform: "scale(.6)" }, "8%, 55%": { opacity: "1", transform: "scale(1)" }, "70%": { opacity: "0" } },
        wiggle: { "0%, 100%": { transform: "rotate(-3deg)" }, "50%": { transform: "rotate(3deg)" } },
        peek: { from: { transform: "translateY(40%) rotate(-8deg)" }, to: { transform: "translateY(0) rotate(-8deg)" } },
      },
      transitionTimingFunction: { smooth: "cubic-bezier(.16,1,.3,1)" },
      animation: {
        rise: "rise .9s cubic-bezier(.16,1,.3,1) both",
        reveal: "reveal 1.1s cubic-bezier(.16,1,.3,1) both",
        page: "page .5s cubic-bezier(.16,1,.3,1) both",
        "soft-pulse": "soft-pulse 2.4s ease-in-out infinite",
        float: "float 5s ease-in-out infinite",
        marquee: "marquee 28s linear infinite",
        draw: "draw 1.2s .6s cubic-bezier(.16,1,.3,1) both",
        "paw-step": "paw-step 4.8s ease-in-out infinite both",
        wiggle: "wiggle 2.8s ease-in-out infinite",
        peek: "peek 1s cubic-bezier(.16,1,.3,1) both",
      },
    },
  },
  plugins: [forms],
};

export default config;
