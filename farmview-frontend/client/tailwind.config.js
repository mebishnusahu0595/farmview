/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf7',
          100: '#dcfceb',
          200: '#bdf7d8',
          300: '#8aefbb',
          400: '#52de97',
          500: '#2bc77a',
          600: '#1da662',
          700: '#198651',
          800: '#186a43',
          900: '#165738',
        },
        secondary: {
          50: '#f7fef5',
          100: '#edfce8',
          200: '#d9f8d1',
          300: '#b8f0ac',
          400: '#8fe37e',
          500: '#6dd158',
          600: '#52b03e',
          700: '#418a33',
          800: '#376d2d',
          900: '#2f5b28',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
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
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
