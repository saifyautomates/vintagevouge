/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        parchment: {
          50: '#FAF8F5',
          100: '#F6F3EC',
          200: '#EFEAE0',
          300: '#E2DBD0',
          400: '#CFC5B4',
          500: '#B8AB97',
          600: '#948671',
          700: '#6E6250',
          800: '#4A4135',
          900: '#2C2720',
          950: '#1A1713',
        },
        umber: {
          DEFAULT: '#1C1917',
          light: '#2E2925',
          dark: '#12100E',
        },
        patina: {
          terracotta: '#A65B32',
          gold: '#C4975A',
          forest: '#2D4736',
          ruby: '#8E2B2B',
          navy: '#233240',
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Garamond', 'Georgia', 'serif'],
        display: ['"Cinzel"', '"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"Space Mono"', '"JetBrains Mono"', 'monospace'],
      },
      letterSpacing: {
        'widest-plus': '0.25em',
        'loose-plus': '0.35em',
      }
    },
  },
  plugins: [],
}

