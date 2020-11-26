import { create } from '@storybook/theming/create'

export default create({
  base: 'light',

  colorPrimary: '#41b883',
  colorSecondary: '#060a0e',

  // UI
  appBg: '#152232',
  appContentBg: '#0b1622',
  appBorderColor: '#CBD5E0',
  appBorderRadius: 4,

  // Typography
  fontBase: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", "Open Sans", sans-serif',
  fontCode: 'monospace',

  // Text colors
  textColor: '#94A3B8',
  textInverseColor: 'black',

  // Toolbar default and active colors
  barTextColor: 'silver',
  barSelectedColor: '#FFFFFF',
  barBg: '#152232',

  // Form colors
  inputBg: '#152232',
  inputBorder: '#152232',
  inputTextColor: '#FFFFFF',
  inputBorderRadius: 4,

  brandTitle: 'Vue Image Kit',
  brandUrl: 'https://github.com/guastallaigor/vue-image-kit',
  brandImage: 'https://raw.githubusercontent.com/guastallaigor/vue-image-kit/master/.github/logo.png'
})
