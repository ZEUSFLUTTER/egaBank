/** @type {import('tailwindcss').Config} */
module.exports = {
  prefix:'',
  purge:{
    content: [
      "./src/**/*.{html,ts}",
    ],
  },
  darkMode:'class',
  theme: {
    extend: {},
  },
  variants:{
    extends :{},
  },
  plugins: [require('@tailwindcss/forms'),require('@tailwindcss/typography')],
}
