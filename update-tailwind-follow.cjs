const fs = require('fs');

const config = `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./client/index.html",
    "./client/src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: { 
    extend: { 
      colors: { 
        primary: "#0F0F0F",
        "on-primary": "#FFFFFF",
        accent: "#F4793A", // Signature Follow.art Orange
        background: "#FAFAFA",
        foreground: "#0F0F0F",
        card: "#FFFFFF",
        border: "#E5E5E5",
        ring: "#F4793A",
        surface: {
          orange: "#F4793A",
          dark: "#0F0F0F"
        }
      }, 
      borderRadius: { DEFAULT: "0px", lg: "0px", xl: "0px", full: "9999px" }, 
      spacing: { "gutter-desktop": "2.5rem", "space-lg": "2rem", "margin-desktop": "3rem", "gutter": "1.5rem", "space-md": "1.5rem", "margin": "1.5rem", "space-2xl": "5rem", "space-xs": "0.5rem", "space-3xl": "8rem", "space-sm": "1rem", "space-xl": "3rem" }, 
      fontFamily: { 
        "headline-md": [ "Anton", "sans-serif" ], 
        "price-currency": [ "Inter", "sans-serif" ], 
        "body-lg": [ "Inter", "sans-serif" ], 
        "label-mono-bold": [ "Inter", "sans-serif" ], 
        "headline-lg-mobile": [ "Anton", "sans-serif" ], 
        "body-md": [ "Inter", "sans-serif" ], 
        "display-xl": [ "Anton", "sans-serif" ], 
        "display-xl-mobile": [ "Anton", "sans-serif" ], 
        "label-technical": [ "Inter", "sans-serif" ], 
        "headline-sm": [ "Anton", "sans-serif" ], 
        "headline-lg": [ "Anton", "sans-serif" ], 
        "body-sm": [ "Inter", "sans-serif" ], 
        "title-editorial": [ "Anton", "sans-serif" ],
        "sans": ["Inter", "sans-serif"],
        "display": ["Anton", "sans-serif"]
      }, 
      fontSize: { 
        "headline-md": [ "32px", { lineHeight: "1", letterSpacing: "0.02em" } ], 
        "price-currency": [ "16px", { lineHeight: "1.4", letterSpacing: "0.02em", fontWeight: "600" } ], 
        "label-mono-bold": [ "12px", { lineHeight: "1", letterSpacing: "0.02em", fontWeight: "600" } ], 
        "body-md": [ "14px", { lineHeight: "1.5", fontWeight: "400" } ], 
        "label-technical": [ "11px", { lineHeight: "1", letterSpacing: "0.05em", fontWeight: "500" } ], 
        "headline-sm": [ "24px", { lineHeight: "1", letterSpacing: "0.02em" } ], 
        "headline-lg": [ "clamp(6rem, 15vw, 15rem)", { lineHeight: "0.85", letterSpacing: "0.01em" } ], 
        "headline-lg-mobile": [ "clamp(3.5rem, 12vw, 5rem)", { lineHeight: "0.9", letterSpacing: "0.01em" } ], 
        "body-sm": [ "12px", { lineHeight: "1.5", fontWeight: "400" } ], 
        "title-editorial": [ "20px", { lineHeight: "1.2", letterSpacing: "0.02em" } ] 
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' },
        }
      },
      animation: {
        marquee: 'marquee 30s linear infinite',
      }
    } 
  },
}
`;

fs.writeFileSync('tailwind.config.js', config);
console.log('tailwind updated to follow.art theme');
