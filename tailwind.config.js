/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./client/index.html",
    "./client/src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: { 
    extend: { 
      "colors": { 
        "primary": "var(--color-primary)",
        "on-primary": "var(--color-on-primary)",
        "accent": "var(--color-accent)",
        "background": "var(--color-background)",
        "foreground": "var(--color-foreground)",
        "card": "var(--color-card)",
        "border": "var(--color-border)",
        "ring": "var(--color-ring)"
      }, 
      "borderRadius": { "DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "full": "9999px" }, 
      "spacing": { "gutter-desktop": "2.5rem", "space-lg": "2rem", "margin-desktop": "3rem", "gutter": "1.5rem", "space-md": "1.5rem", "margin": "1.5rem", "space-2xl": "5rem", "space-xs": "0.5rem", "space-3xl": "8rem", "space-sm": "1rem", "space-xl": "3rem" }, 
      "fontFamily": { 
        "headline-md": [ "Cormorant", "serif" ], 
        "price-currency": [ "Montserrat", "sans-serif" ], 
        "body-lg": [ "Montserrat", "sans-serif" ], 
        "label-mono-bold": [ "Montserrat", "sans-serif" ], 
        "headline-lg-mobile": [ "Cormorant", "serif" ], 
        "body-md": [ "Montserrat", "sans-serif" ], 
        "display-xl": [ "Cormorant", "serif" ], 
        "display-xl-mobile": [ "Cormorant", "serif" ], 
        "label-technical": [ "Montserrat", "sans-serif" ], 
        "headline-sm": [ "Cormorant", "serif" ], 
        "headline-lg": [ "Cormorant", "serif" ], 
        "body-sm": [ "Montserrat", "sans-serif" ], 
        "title-editorial": [ "Cormorant", "serif" ],
        "sans": ["Montserrat", "sans-serif"],
        "serif": ["Cormorant", "serif"]
      }, 
      "fontSize": { "headline-md": [ "32px", { "lineHeight": "36px", "letterSpacing": "-0.02em", "fontWeight": "700" } ], "price-currency": [ "16px", { "lineHeight": "20px", "letterSpacing": "0.02em", "fontWeight": "600" } ], "body-lg": [ "16px", { "lineHeight": "24px", "letterSpacing": "-0.01em", "fontWeight": "400" } ], "label-mono-bold": [ "12px", { "lineHeight": "14px", "letterSpacing": "0.08em", "fontWeight": "700" } ], "headline-lg-mobile": [ "40px", { "lineHeight": "44px", "letterSpacing": "-0.02em", "fontWeight": "800" } ], "body-md": [ "14px", { "lineHeight": "22px", "letterSpacing": "0em", "fontWeight": "400" } ], "display-xl": [ "112px", { "lineHeight": "96px", "letterSpacing": "-0.04em", "fontWeight": "800" } ], "display-xl-mobile": [ "56px", { "lineHeight": "52px", "letterSpacing": "-0.03em", "fontWeight": "800" } ], "label-technical": [ "10px", { "lineHeight": "12px", "letterSpacing": "0.15em", "fontWeight": "500" } ], "headline-sm": [ "24px", { "lineHeight": "28px", "letterSpacing": "-0.01em", "fontWeight": "700" } ], "headline-lg": [ "72px", { "lineHeight": "68px", "letterSpacing": "-0.03em", "fontWeight": "800" } ], "body-sm": [ "12px", { "lineHeight": "18px", "letterSpacing": "0.02em", "fontWeight": "400" } ], "title-editorial": [ "20px", { "lineHeight": "24px", "letterSpacing": "0.05em", "fontWeight": "600" } ] },
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
