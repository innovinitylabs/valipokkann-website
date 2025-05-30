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
          dark: '#1A1A1A',
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
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
  ],
} 