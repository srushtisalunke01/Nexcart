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
        brand: {
          50: '#FFFDF0',
          100: '#FEF9C3',
          200: '#FEF08A',
          300: '#FDE047',
          400: '#FACC15',
          500: '#FFC800', // Premium Logo Gold Accent
          600: '#E5B300',
          700: '#B88F00',
          800: '#8A6B00',
          900: '#5C4700',
        },
        cyber: {
          cyan: '#00E5FF',
          gold: '#FFC800',
          blue: '#00A8FF',
        },
        premium: {
          light: '#F8F9FC', // Clean light bg
          dark: '#060A13',  // Logo dark metallic slate bg
          cardLight: '#FFFFFF',
          cardDark: '#0D1424', // Dark card background
        }
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
      },
      borderRadius: {
        'premium': '22px', // 20px - 24px rounded corners
      },
      boxShadow: {
        'glass-light': '0 8px 32px 0 rgba(31, 38, 135, 0.06)',
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'soft': '0 10px 30px -10px rgba(0, 0, 0, 0.04)',
        'premium-orange': '0 10px 25px -5px rgba(255, 107, 0, 0.25)',
        'neon-cyan': '0 0 20px rgba(0, 229, 255, 0.3)',
        'neon-gold': '0 0 20px rgba(255, 200, 0, 0.35)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 1.5s infinite linear',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        }
      }
    },
  },
  plugins: [],
}
