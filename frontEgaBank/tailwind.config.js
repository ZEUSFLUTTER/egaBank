/** @type {import('tailwindcss').Config} */
module.exports = {
  prefix:'',
  content: [
    "./src/**/*.{html,ts}",
  ],
  darkMode:'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        light: {
          50: '#fefefe',
          100: '#fdfdfd',
          200: '#fafafa',
          300: '#f7f7f7',
          400: '#f3f4f6',
          500: '#e5e7eb',
          600: '#d1d5db',
          700: '#9ca3af',
          800: '#6b7280',
          900: '#374151',
        }
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
        'playfair': ['Playfair Display', 'serif'],
      }
    },
  },
  variants:{
    extends :{},
  },
  plugins: [require('@tailwindcss/forms'),require('@tailwindcss/typography')],
}
