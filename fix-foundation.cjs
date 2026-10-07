const fs = require('fs');

const twConfig = `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './client/index.html',
    './client/src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: { 
    extend: { 
      colors: { 
        'color-1': '#000000',
        'color-2': '#0000FF',
        'color-3': '#808080',
        'color-4': '#8E9487',
        'color-5': '#F4793A',
        'color-6': '#C5939D',
        'color-7': '#FFFFFF',
        
        // Semantic mappings based on the design system
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
        background: 'var(--color-background)',
        foreground: 'var(--color-foreground)',
        'text-light': 'var(--color-text-light)',
        'bg-dark-1': 'var(--color-bg-dark-1)',
        'bg-dark-2': 'var(--color-bg-dark-2)',
        
        card: 'var(--color-card)',
        border: 'var(--color-border)'
      }, 
      borderRadius: { DEFAULT: '0px', lg: '0px', xl: '0px', full: '0px' }, 
      spacing: { 
        'space-1': '7px',
        'space-2': '8px',
        'space-3': '10px',
        'space-4': '16px',
        'space-5': '32px',
        'space-6': '48px',
        'space-7': '60px',
        'space-8': '64px',
        
        // Legacy mappings to preserve functionality
        'space-xs': '8px',
        'space-sm': '16px',
        'space-md': '32px',
        'space-lg': '48px',
        'space-xl': '64px',
        'space-2xl': '64px',
        'space-3xl': '64px',
        'gutter': '16px',
        'gutter-desktop': '32px',
        'margin-desktop': '32px'
      }, 
      fontFamily: { 
        'hardbop': ['Hardbop', 'Inter', 'sans-serif'],
        'heading-now': ['HeadingNow', 'Anton', 'sans-serif'],
        'times': ['"Times New Roman"', 'serif'],
        
        // Semantic Roles
        'sans': ['Hardbop', 'Inter', 'sans-serif'],
        'display': ['HeadingNow', 'Anton', 'sans-serif'],
        'serif': ['"Times New Roman"', 'serif'],

        // Legacy component fonts mapped to standard roles
        'headline-md': ['HeadingNow', 'Anton', 'sans-serif'],
        'price-currency': ['Hardbop', 'Inter', 'sans-serif'],
        'body-lg': ['Hardbop', 'Inter', 'sans-serif'],
        'label-mono-bold': ['Hardbop', 'Inter', 'sans-serif'],
        'headline-lg-mobile': ['HeadingNow', 'Anton', 'sans-serif'],
        'body-md': ['Hardbop', 'Inter', 'sans-serif'],
        'display-xl': ['HeadingNow', 'Anton', 'sans-serif'],
        'display-xl-mobile': ['HeadingNow', 'Anton', 'sans-serif'],
        'label-technical': ['Hardbop', 'Inter', 'sans-serif'],
        'headline-sm': ['HeadingNow', 'Anton', 'sans-serif'],
        'headline-lg': ['HeadingNow', 'Anton', 'sans-serif'],
        'body-sm': ['Hardbop', 'Inter', 'sans-serif'],
        'title-editorial': ['HeadingNow', 'Anton', 'sans-serif'],
      }, 
      fontSize: { 
        'xs': ['10px', { lineHeight: '14px' }],
        'sm': ['11px', { lineHeight: '15px' }],
        'base': ['13px', { lineHeight: '18px' }],
        'lg': ['14px', { lineHeight: '22px' }],
        'xl': ['18px', { lineHeight: '26px' }],
        '2xl': ['23px', { lineHeight: '28px' }],
        '3xl': ['32px', { lineHeight: '36px' }],
        '4xl': ['48px', { lineHeight: '48px' }],
        '5xl': ['64px', { lineHeight: '1' }],
        
        // Display Tokens
        'display-md': ['clamp(48px, 6vw, 72px)', { lineHeight: '0.9' }],
        'display-lg': ['clamp(72px, 12vw, 180px)', { lineHeight: '0.85' }],
        'display-xl': ['clamp(100px, 18vw, 226px)', { lineHeight: '0.8' }],

        // Legacy semantic mappings mapped to new scale
        'label-technical': ['10px', { lineHeight: '14px', fontWeight: '400' }],
        'label-mono-bold': ['11px', { lineHeight: '14px', fontWeight: '700' }],
        'body-sm': ['11px', { lineHeight: '14px', fontWeight: '400' }],
        'body-md': ['13px', { lineHeight: '18px', fontWeight: '400' }],
        'price-currency': ['14px', { lineHeight: '22px', fontWeight: '700' }],
        'title-editorial': ['18px', { lineHeight: '26px', fontWeight: '400' }],
        'headline-sm': ['23px', { lineHeight: '28px', fontWeight: '700' }],
        'headline-md': ['32px', { lineHeight: '36px', fontWeight: '700' }],
        'headline-lg-mobile': ['clamp(3rem, 12vw, 5rem)', { lineHeight: '0.9', fontWeight: '700' }],
        'headline-lg': ['180px', { lineHeight: '0.8', fontWeight: '700' }],
      },
      transitionTimingFunction: {
        'base': 'cubic-bezier(0.25, 0.74, 0.22, 0.99)',
        'slow': 'cubic-bezier(0.55, 0, 0.1, 1)'
      },
      transitionDuration: {
        'fast': '150ms',
        'base': '300ms',
        'slow': '400ms',
        'slower': '1500ms'
      }
    } 
  },
}`;

fs.writeFileSync('tailwind.config.js', twConfig);

const brandColorsCss = `:root {
  /* FOLLOW.ART Strict Palette Map */
  --color-1: #000000;
  --color-2: #0000FF;
  --color-3: #808080;
  --color-4: #8E9487;
  --color-5: #F4793A;
  --color-6: #C5939D;
  --color-7: #FFFFFF;

  /* Semantic Theme Variables used by legacy components */
  --color-primary: var(--color-1);
  --color-on-primary: var(--color-7);
  --color-secondary: var(--color-3);
  --color-accent: var(--color-5);
  --color-on-accent: var(--color-1);
  --color-background: var(--color-7);
  --color-foreground: var(--color-1);
  --color-card: var(--color-7);
  --color-border: var(--color-3);
  --color-text-light: var(--color-7);
  --color-bg-dark-1: var(--color-4);
  --color-bg-dark-2: var(--color-6);
  --color-ring: var(--color-1);

  /* Legacy brand colors used in shop-page.css / style.css */
  --brand-yellow: var(--color-5);
  --brand-yellow-dim: var(--color-5);
  --brand-yellow-ink: var(--color-1);
  --brand-yellow-wash: var(--color-7);
  --lime: var(--color-5);
  --ink: var(--color-1);
  --paper: var(--color-7);
  --muted: var(--color-3);
}

body {
  background-color: var(--color-background);
  color: var(--color-foreground);
  font-family: 'Inter', sans-serif;
}
`;

fs.writeFileSync('client/src/brand-colors.css', brandColorsCss);
console.log('Foundation files updated.');
