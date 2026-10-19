/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          black: '#111111',
          orange: '#F97316',
          bg: '#F5F4F2',
          surface: '#FFFFFF',
          border: '#E2E2E0',
          muted: '#6B6B6B',
          placeholder: '#EBEBE9'
        }
      },
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        heading: ['"Archivo"', 'sans-serif']
      },
      borderRadius: {
        DEFAULT: '4px',
        sm: '2px',
        md: '4px',
        lg: '6px'
      },
      aspectRatio: {
        'portrait': '4 / 5'
      }
    },
  },
  plugins: [],
}
