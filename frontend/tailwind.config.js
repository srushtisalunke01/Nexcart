/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        luxury: {
          blue: {
            DEFAULT: '#0B3C5D',
            light: '#1D5F8A',
            dark: '#052237',
            deep: '#031422'
          },
          gold: {
            DEFAULT: '#D4AF37',
            light: '#F3E5AB',
            dark: '#AA7C11',
            accent: '#C5A059'
          },
          gray: {
            DEFAULT: '#9EA9B1',
            light: '#F5F7FA',
            medium: '#E2E8F0',
            dark: '#4A5568'
          }
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif']
      },
      boxShadow: {
        'glass-light': '0 8px 32px 0 rgba(31, 38, 135, 0.08)',
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'luxury': '0 20px 40px -15px rgba(0, 0, 0, 0.05), 0 15px 25px -10px rgba(11, 60, 93, 0.05)'
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
};
