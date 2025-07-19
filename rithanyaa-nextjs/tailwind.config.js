/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Forest Green Palette
        primary: {
          50: '#f0f9f0',
          100: '#dcf1dc',
          200: '#bce3bc',
          300: '#8fcf8f',
          400: '#5ab55a',
          500: '#2d5f2d', // Main forest green
          600: '#1f4a1f',
          700: '#1a3d1a',
          800: '#163016',
          900: '#122612',
          950: '#0a130a',
        },
        // Secondary Gold Palette
        secondary: {
          50: '#fffef7',
          100: '#fffbeb',
          200: '#fef4c7',
          300: '#fdeba3',
          400: '#fcd965',
          500: '#f9c93c', // Main gold
          600: '#f59e0b',
          700: '#d97706',
          800: '#b45309',
          900: '#92400e',
          950: '#78350f',
        },
        // Complementary Colors for Indian Traditional Theme
        accent: {
          maroon: '#8B1538',
          rust: '#CD7F32',
          cream: '#FDF6E3',
          sage: '#87A96B',
          terracotta: '#E2725B',
        },
        // Neutral Colors
        neutral: {
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1c1917',
          950: '#0c0a09',
        }
      },
      fontFamily: {
        'sans': ['var(--font-sans)', 'Inter', 'sans-serif'],
        'serif': ['var(--font-serif)', 'Cinzel', 'serif'],
        'display': ['var(--font-display)', 'Playfair Display', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-in': 'slideIn 0.5s ease-out',
        'bounce-subtle': 'bounceSubtle 2s infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'silk-texture': "url('/images/background.jpg')",
      },
      boxShadow: {
        'traditional': '0 4px 20px rgba(45, 95, 45, 0.15)',
        'gold': '0 4px 20px rgba(249, 201, 60, 0.25)',
        'inner-glow': 'inset 0 2px 4px 0 rgba(255, 255, 255, 0.06)',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}