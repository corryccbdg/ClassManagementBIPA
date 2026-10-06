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
        bipa: {
          50: '#f0fdf9',
          100: '#ccfbe8',
          200: '#99f6d4',
          300: '#5fe7bd',
          400: '#2ecda0',
          500: '#12b084',
          600: '#098e6b',
          700: '#0a7156',
          800: '#0b5a46',
          900: '#0b4a3a',
          950: '#022a21',
        },
        batik: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        navy: {
          800: '#0f172a',
          900: '#0b1120',
          950: '#060a12',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.08)',
        'elevated': '0 20px 25px -5px rgba(0, 0, 0, 0.06), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
      }
    },
  },
  plugins: [],
}
