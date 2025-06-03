/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,ts,tsx,vue,svelte,md,mdx}"],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: '#000000',
      white: '#ffffff',
    },
    spacing: {
      // Grid-based spacing system - all measurements are multiples of 4px (1 grid unit)
      '0': '0px',
      'px': '1px',
      '0.5': '2px',   // 0.5 grid units
      '1': '4px',     // 1 grid unit
      '1.5': '6px',   // 1.5 grid units
      '2': '8px',     // 2 grid units
      '2.5': '10px',  // 2.5 grid units
      '3': '12px',    // 3 grid units
      '3.5': '14px',  // 3.5 grid units
      '4': '16px',    // 4 grid units
      '5': '20px',    // 5 grid units
      '6': '24px',    // 6 grid units
      '7': '28px',    // 7 grid units
      '8': '32px',    // 8 grid units
      '9': '36px',    // 9 grid units
      '10': '40px',   // 10 grid units
      '11': '44px',   // 11 grid units
      '12': '48px',   // 12 grid units
      '14': '56px',   // 14 grid units
      '16': '64px',   // 16 grid units (4rem)
      '18': '72px',   // 18 grid units
      '20': '80px',   // 20 grid units (5rem)
      '24': '96px',   // 24 grid units (6rem)
      '28': '112px',  // 28 grid units (7rem)
      '32': '128px',  // 32 grid units (8rem)
      '36': '144px',  // 36 grid units (9rem)
      '40': '160px',  // 40 grid units (10rem)
      '44': '176px',  // 44 grid units (11rem)
      '48': '192px',  // 48 grid units (12rem)
      '52': '208px',  // 52 grid units (13rem)
      '56': '224px',  // 56 grid units (14rem)
      '60': '240px',  // 60 grid units (15rem)
      '64': '256px',  // 64 grid units (16rem)
      '72': '288px',  // 72 grid units (18rem)
      '80': '320px',  // 80 grid units (20rem)
      '96': '384px',  // 96 grid units (24rem)
    },
    extend: {
      fontFamily: {
        mono: ['JetBrains Mono', 'Monaco', 'Cascadia Code', 'Segoe UI Mono', 'Roboto Mono', 'Oxygen Mono', 'Ubuntu Monospace', 'SF Mono', 'Consolas', 'Liberation Mono', 'Menlo', 'Courier New', 'monospace'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      fontSize: {
        // Grid-aligned typography - line heights maintain grid rhythm
        'xs': ['12px', { lineHeight: '16px' }],     // 3 units font, 4 units line-height
        'sm': ['14px', { lineHeight: '20px' }],     // 3.5 units font, 5 units line-height
        'base': ['16px', { lineHeight: '24px' }],   // 4 units font, 6 units line-height
        'lg': ['18px', { lineHeight: '28px' }],     // 4.5 units font, 7 units line-height
        'xl': ['20px', { lineHeight: '32px' }],     // 5 units font, 8 units line-height
        '2xl': ['24px', { lineHeight: '36px' }],    // 6 units font, 9 units line-height
        '3xl': ['32px', { lineHeight: '44px' }],    // 8 units font, 11 units line-height
        '4xl': ['40px', { lineHeight: '52px' }],    // 10 units font, 13 units line-height
        '5xl': ['48px', { lineHeight: '60px' }],    // 12 units font, 15 units line-height
        '6xl': ['64px', { lineHeight: '80px' }],    // 16 units font, 20 units line-height
        '7xl': ['80px', { lineHeight: '96px' }],    // 20 units font, 24 units line-height
        '8xl': ['96px', { lineHeight: '112px' }],   // 24 units font, 28 units line-height
        '9xl': ['112px', { lineHeight: '128px' }],  // 28 units font, 32 units line-height
      },
      colors: {
        gray: {
          50: '#f9f9f9',
          100: '#f3f3f3',
          200: '#e6e6e6',
          300: '#d9d9d9',
          400: '#b3b3b3',
          500: '#808080',
          600: '#666666',
          700: '#4d4d4d',
          800: '#333333',
          900: '#1a1a1a',
          950: '#0d0d0d',
        },
      },
      gridTemplateColumns: {
        // Precise 16-column grid system
        '16': 'repeat(16, minmax(0, 1fr))',
        '24': 'repeat(24, minmax(0, 1fr))',
        '32': 'repeat(32, minmax(0, 1fr))',
      },
      gridColumn: {
        'span-13': 'span 13 / span 13',
        'span-14': 'span 14 / span 14',
        'span-15': 'span 15 / span 15',
        'span-16': 'span 16 / span 16',
        'span-17': 'span 17 / span 17',
        'span-18': 'span 18 / span 18',
        'span-19': 'span 19 / span 19',
        'span-20': 'span 20 / span 20',
        'span-21': 'span 21 / span 21',
        'span-22': 'span 22 / span 22',
        'span-23': 'span 23 / span 23',
        'span-24': 'span 24 / span 24',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'grid-pulse': 'gridPulse 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        gridPulse: {
          '0%, 100%': { opacity: '0.1' },
          '50%': { opacity: '0.3' },
        },
      },
    },
  },
  plugins: [],
};