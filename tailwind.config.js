/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      fontSize: {
        '2xs': ['0.65rem', {
          lineHeight: '0.75rem',
          letterSpacing: '-0.02em',
        }],
      },
      spacing: {
        'aside': '20rem',
      }
    },
  },
  plugins: [],
}

