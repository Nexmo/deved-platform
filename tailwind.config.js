// tailwind.config.js

module.exports = {
  theme: {
    fontFamily: {
      display: ['spezia', 'sans-serif'],
      body: ['spezia', 'sans-serif'],
    },
    fontSize: {
      xs: ['0.75rem', { lineHeight: '1rem' }],
      sm: ['0.875rem', { lineHeight: '1.25rem' }],
      base: ['1rem', { lineHeight: '1.5rem' }],
      lg: ['1.125rem', { lineHeight: '1.75rem' }],
      xl: ['1.25rem', { lineHeight: '1.75rem' }],
      '2xl': ['1.5rem', { lineHeight: '2rem' }],
      '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      '5xl': ['3rem', { lineHeight: '1' }],
      '6xl': ['4rem', { lineHeight: '1' }],
    },
    typography: {
      default: {
        css: {
          maxWidth: '100%',
        },
      },
    },
    extend: {
      colors: {
        black: '#000000',
        white: '#ffffff',
        brand: {
          slack: '#4a154b',
          twitter: '#1da1f2',
          twitch: '#9146FF',
        },
        orange: {
          lighter: '#fee3dd',
          light: '#fcac98',
          DEFAULT: '#fa7454',
          dark: '#c85e43',
          darker: '#642f22',
        },
        blue: {
          lighter: '#d9eefc',
          light: '#80c7f5',
          DEFAULT: '#669fc4',
          dark: '#4d7793',
          darker: '#335062',
        },
        red: {
          lighter: '#fdecec',
          light: '#f79ca6',
          DEFAULT: '#e84545',
          dark: '#ba3737',
          darker: '#5d1b1b',
        },
        green: {
          lighter: '#d7f2e8',
          light: '#86d8b9',
          DEFAULT: '#06ba77',
          dark: '#2d966f',
          darker: '#173630',
        },
        purple: {
          lighter: '#f3e9ff',
          light: '#cfa5ff',
          DEFAULT: '#b779ff',
          dark: '#871fff',
          darker: '#441080',
        },
        teal: {
          lighter: '#dbf3f6',
          light: '#94dbe4',
          DEFAULT: '#4cc3d2',
          dark: '#00848e',
          darker: '#003136',
        },
        yellow: {
          lighter: '#fff8c0',
          light: '#ffe82e',
          DEFAULT: '#ffc100',
          dark: '#9d7005',
          darker: '#583b00',
        },
        indigo: {
          lighter: '#f7d3ec',
          light: '#eb90ce',
          DEFAULT: '#d6219c',
          dark: '#ab197d',
          darker: '#560d3d',
        },
        grey: {
          lighter: '#f3f3f5',
          light: '#e1e2e6',
          DEFAULT: '#c2c4cc',
          dark: '#9b9da3',
          darker: '#616266',
        },
        aqua: {
          lighter: '#d0e7f1',
          light: '#9ccde2',
          DEFAULT: '#3298c4',
          dark: '#0070a1',
          darker: '#035879',
        },
      },
      zIndex: {
        '-10': '-10',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
