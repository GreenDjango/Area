module.exports = {
  purge: ['./src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: require('./src/style/colors.js'),
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
