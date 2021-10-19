const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  purge: [
    './shared/**/*.{tsx}',
    './components/**/*.{tsx}',
    './includes/**/*.{tsx}',
    './pages/**/*.{tsx}',
  ],
  darkMode: 'media', // or 'media' or 'class'
  theme: {
    fontFamily: {
      sans: ['Poppins', ...defaultTheme.fontFamily.sans],
    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
