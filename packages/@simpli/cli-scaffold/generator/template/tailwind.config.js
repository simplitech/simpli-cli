const _ = require('lodash')
const TailwindCssVariables = require('tailwind-css-variables')
const TailwindTransition = require('tailwindcss-transition')
const TailwindGrid = require('tailwindcss-grid')

module.exports = {
  important: true,

  plugins: [
    // tailwind variables as css variables
    TailwindCssVariables(),

    // transitions
    TailwindTransition({
      standard: 'all 300ms ease',
    }),

    // grid
    TailwindGrid({
      grids: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      gaps: {
        0: '0',
        1: '0.25rem',
        2: '0.5rem',
        3: '0.75rem',
        4: '1rem',
        6: '1.5rem',
        8: '2rem',
        12: '3rem',
        16: '4rem',
        20: '5rem',
      },
      autoMinWidths: {
        '16': '4rem',
        '24': '6rem',
      },
      variants: ['responsive'],
    }),

    // horiz and verti
    ({addUtilities, variants}) => {
      const newUtilities = {
        '.horiz': {
          'display': 'flex',
          'flex-direction': 'row',
          '& > *': {
            'flex-shrink': 0,
          },
        },
        '.verti': {
          'display': 'flex',
          'flex-direction': 'column',
          '& > *': {
            'flex-shrink': 0,
          },
        },
      }

      addUtilities(newUtilities, variants())
    },

    // items-center-center
    ({addUtilities, variants}) => {
      const newUtilities = {
        '.items-center-center': {
          'display': 'flex',
          'justify-content': 'center',
          'align-items': 'center',
        },
      }

      addUtilities(newUtilities, variants())
    },

    // weight
    ({addUtilities, e, theme, variants}) => {
      const weight = theme('weight')

      const utilities = _.map(weight, ([number], name) => ({
        [`.weight-${e(name)}`]: {
          'flex-grow': number,
          'flex-shrink': 'unset',
          'flex-basis': 0,
        },
      }))

      addUtilities(utilities, variants())
    },

    // children variant
    ({addVariant, e}) => {
      addVariant('children', ({modifySelectors, separator}) => {
        modifySelectors(({className}) => {
          return `.${e(`children${separator}${className}`)} > *`
        })
      })
    },
  ],

  theme: {
    fontFamily: {
      display: ['Poppins'], // custom font
    },
    container: {
      center: true,
      padding: '1rem',
    },
    screens: {
      'sm': `${process.env.VUE_APP_SMALL_SCREEN}px`,
      'md': `${process.env.VUE_APP_MEDIUM_SCREEN}px`,
      'lg': `${process.env.VUE_APP_LARGE_SCREEN}px`,
      'xl': `${process.env.VUE_APP_EXTRA_LARGE_SCREEN}px`,
    },
    extend: {
      colors: { // colors defined on .env file
        'primary': process.env.VUE_APP_PRIMARY_COLOR,
        'secondary': process.env.VUE_APP_SECONDARY_COLOR,
        'tertiary': process.env.VUE_APP_TERTIARY_COLOR,
        'success': process.env.VUE_APP_SUCCESS_COLOR,
        'danger': process.env.VUE_APP_DANGER_COLOR,
        'white-100': 'rgba(255, 255, 255, 0.1)',
        'white-200': 'rgba(255, 255, 255, 0.2)',
        'white-300': 'rgba(255, 255, 255, 0.3)',
        'white-400': 'rgba(255, 255, 255, 0.4)',
        'white-500': 'rgba(255, 255, 255, 0.5)',
        'white-600': 'rgba(255, 255, 255, 0.6)',
        'white-700': 'rgba(255, 255, 255, 0.7)',
        'white-800': 'rgba(255, 255, 255, 0.8)',
        'white-900': 'rgba(255, 255, 255, 0.9)',
        'black-100': 'rgba(0, 0, 0, 0.1)',
        'black-200': 'rgba(0, 0, 0, 0.2)',
        'black-300': 'rgba(0, 0, 0, 0.3)',
        'black-400': 'rgba(0, 0, 0, 0.4)',
        'black-500': 'rgba(0, 0, 0, 0.5)',
        'black-600': 'rgba(0, 0, 0, 0.6)',
        'black-700': 'rgba(0, 0, 0, 0.7)',
        'black-800': 'rgba(0, 0, 0, 0.8)',
        'black-900': 'rgba(0, 0, 0, 0.9)',
      },
      spacing: {
        '80': '20rem',
        '94': '24rem',
        '110': '28rem',
      },
      boxShadow: {
        'btn': '0 5px 10px 0 rgba(0, 0, 0, 0.2)',
        'box-sm': '0 0 5px rgba(0, 0, 0, 0.5)',
        'box-md': '0 0 10px rgba(0, 0, 0, 0.5)',
        'box-lg': '0 0 15px rgba(0, 0, 0, 0.5)',
      },
      weight: theme => ({
        '1': [1],
        '2': [2],
        '3': [3],
        '4': [4],
        '5': [5],
      }),
    },
  },

  variants: ['responsive', 'hover', 'children'],
}
