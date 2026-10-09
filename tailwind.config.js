/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef4ff',
          100: '#dae6ff',
          200: '#bcd2ff',
          300: '#8db4ff',
          400: '#578bff',
          500: '#3366f0',
          600: '#1d4ed8',
          700: '#1a42c4',
          800: '#1a3aa0',
          900: '#1c357e',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(15,23,42,0.06), 0 1px 2px -1px rgba(15,23,42,0.04)',
        soft: '0 4px 24px -8px rgba(15,23,42,0.12)',
      },
    },
  },
  plugins: [],
};
