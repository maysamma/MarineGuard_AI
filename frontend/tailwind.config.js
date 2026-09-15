/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        ocean: {
          950: '#04131c',
          900: '#062532',
          800: '#083b4a',
          700: '#0b5968',
          600: '#0f7884',
          500: '#13a4a4',
          100: '#d9f7f5',
          50: '#effcfb',
        },
      },
    },
  },
  plugins: [],
}
