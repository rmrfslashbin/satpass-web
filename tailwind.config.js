/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Cyber cyan for dark mode accents
        cyber: {
          50: '#e0f7ff',
          100: '#b3ecff',
          200: '#80e1ff',
          300: '#4dd6ff',
          400: '#26ccff',
          500: '#00c2ff',
          600: '#00a8e6',
          700: '#007db3',
          800: '#005280',
          900: '#00274d',
        },
        // Neon magenta for highlights
        neon: {
          50: '#ffe5f5',
          100: '#ffb3e0',
          200: '#ff80cb',
          300: '#ff4db6',
          400: '#ff26a7',
          500: '#ff0099',
          600: '#e60089',
          700: '#b30069',
          800: '#800049',
          900: '#4d0029',
        },
        // Mission control orange for light mode
        mission: {
          50: '#fff5e5',
          100: '#ffe0b3',
          200: '#ffcc80',
          300: '#ffb84d',
          400: '#ffa826',
          500: '#ff9800',
          600: '#e68900',
          700: '#b36a00',
          800: '#804b00',
          900: '#4d2c00',
        },
        // Deep space colors for backgrounds
        space: {
          50: '#e8eaf6',
          100: '#c5cae9',
          200: '#9fa8da',
          300: '#7986cb',
          400: '#5c6bc0',
          500: '#3f51b5',
          600: '#3949ab',
          700: '#303f9f',
          800: '#283593',
          900: '#1a237e',
          950: '#0d1117',
        },
      },
      fontFamily: {
        mono: ['"IBM Plex Mono"', '"JetBrains Mono"', 'Consolas', 'monospace'],
        sans: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'glow': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 5px currentColor' },
          '50%': { boxShadow: '0 0 20px currentColor' },
        },
      },
      backgroundImage: {
        'grid-pattern': 'linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
        'cyber-gradient': 'linear-gradient(135deg, #00c2ff 0%, #ff0099 100%)',
        'space-gradient': 'linear-gradient(180deg, #0d1117 0%, #1a237e 100%)',
        'mission-gradient': 'linear-gradient(135deg, #ff9800 0%, #3f51b5 100%)',
      },
      backgroundSize: {
        'grid': '30px 30px',
      },
    },
  },
  plugins: [],
}
