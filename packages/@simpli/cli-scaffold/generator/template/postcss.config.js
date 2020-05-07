const purgecss = require('@fullhuman/postcss-purgecss')({
  content: [
    './src/**/*.html',
    './src/**/*.vue',
    './src/**/*.jsx',
    './src/**/*.scss',
    './node_modules/normalize-scss/**/*.scss',
    './node_modules/pretty-checkbox/**/*.scss',
    './node_modules/sweetalert2/**/*.scss',
    './node_modules/vue-transition-expand/dist/vue-transition-expand.css',
  ],
  whitelistPatterns: [
    /^v-[A-Za-z0-9-_:/]+/,
    /^fa-[A-Za-z0-9-_:/]+/,
    /^icon-[A-Za-z0-9-_:/]+/,
  ],
  defaultExtractor: content => content.match(/[A-Za-z0-9-_:/]+/g) || [],
})

module.exports = {
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
    ...(process.env.NODE_ENV === 'production' ? [purgecss] : []),
  ],
}
