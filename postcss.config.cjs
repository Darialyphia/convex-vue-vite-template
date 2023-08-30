module.exports = {
  plugins: {
    autoprefixer: {},
    cssnano: {},
    'postcss-scrollbar': {},
    'postcss-nesting': { noIsPseudoSelector: false },
    'postcss-custom-media': { preserve: false },
    '@unocss/postcss': {}
  }
};
