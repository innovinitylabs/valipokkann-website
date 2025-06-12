/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#FFD700',
          DEFAULT: '#FFA500',
          dark: '#FF8C00',
        },
        secondary: {
          light: '#FF6B6B',
          DEFAULT: '#FF4757',
          dark: '#FF2E44',
        },
        background: {
          light: '#FFFFFF',
          dark: '#000000',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Noto Serif Tamil', 'serif'],
      },
      animation: {
        'barrel-roll': 'barrel-roll 1s ease-in-out forwards',
        'barrel-roll-reverse': 'barrel-roll-reverse 1s ease-in-out forwards',
        'quote-fade': 'quote-fade 1s ease-in-out',
      },
      keyframes: {
        'barrel-roll': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(180deg)' },
        },
        'barrel-roll-reverse': {
          '0%': { transform: 'rotate(180deg)' },
          '100%': { transform: 'rotate(0deg)' },
        },
        'quote-fade': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: 'inherit',
            a: {
              color: 'inherit',
              textDecoration: 'none',
              fontWeight: '500',
              '&:hover': {
                color: '#FFA500',
              },
            },
            strong: {
              color: 'inherit',
              fontWeight: '600',
            },
            code: {
              color: '#10B981',
              fontWeight: '400',
              backgroundColor: '#1F2937',
              padding: '0.2em 0.4em',
              borderRadius: '0.25rem',
            },
            pre: {
              backgroundColor: '#1F2937',
              color: '#E5E7EB',
            },
            blockquote: {
              borderLeftColor: '#374151',
              color: '#9CA3AF',
            },
            h1: {
              color: 'inherit',
              fontWeight: '700',
            },
            h2: {
              color: 'inherit',
              fontWeight: '600',
            },
            h3: {
              color: 'inherit',
              fontWeight: '600',
            },
            h4: {
              color: 'inherit',
              fontWeight: '600',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/typography'),
  ],
} 