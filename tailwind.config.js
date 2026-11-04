/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        galaxy: {
          bg: '#08080D',
          panel: '#11131B',
          violet: '#7C5CFF',
          light: '#A78BFF',
          pink: '#FF67C7',
          cyan: '#42DFFF',
          blue: '#648DFF',
          green: '#3CCF91',
          red: '#FF5F6D',
          orange: '#FF9F43',
          white: '#F5F7FF',
        },
      },
      boxShadow: {
        glow: '0 0 28px rgba(124, 92, 255, 0.45)',
      },
    },
  },
  plugins: [],
}
