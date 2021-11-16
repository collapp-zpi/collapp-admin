const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  purge: ['./shared/**/*.tsx', './includes/**/*.tsx', './pages/**/*.tsx'],
  darkMode: 'media', // or 'media' or 'class'
  theme: {
    fontFamily: {
      sans: ['Poppins', ...defaultTheme.fontFamily.sans],
    },
    borderRadius: {
      ...defaultTheme.borderRadius,
      25: '25%',
    },
    extend: {},
  },
  variants: {
    extend: {
      opacity: ['disabled'],
    },
  },
  plugins: [],
}
