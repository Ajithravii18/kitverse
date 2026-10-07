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
        primary: "var(--color-primary)",
        "on-primary": "var(--color-on-primary)",
        accent: "#c1ff38", // True lime
        background: "#ffffff",
        foreground: "#000000",
        card: "#f4f4f4", // Monochrome surface
        border: "#e5e5e5",
        ring: "#000000"
      }, 
      borderRadius: { DEFAULT: "0.25rem", lg: "0.5rem", xl: "0.75rem", full: "9999px" }, 
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
        "label-mono-bold": [ "12px", { lineHeight: "1", letterSpacing: "0.08em", fontWeight: "700" } ], 
        "body-md": [ "14px", { lineHeight: "1.5", fontWeight: "400" } ], 
        "label-technical": [ "10px", { lineHeight: "1", letterSpacing: "0.15em", fontWeight: "600", textTransform: "uppercase" } ], 
        "headline-sm": [ "24px", { lineHeight: "1", letterSpacing: "0.02em" } ], 
        "headline-lg": [ "clamp(6rem, 15vw, 11rem)", { lineHeight: "0.85", letterSpacing: "0.01em" } ], 
        "headline-lg-mobile": [ "clamp(3rem, 12vw, 4.5rem)", { lineHeight: "0.9", letterSpacing: "0.01em" } ], 
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
console.log('tailwind updated');
