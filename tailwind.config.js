/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    colors: {
      // Override Tailwind's default colors
      transparent: 'transparent',
      current: 'currentColor',
      white: '#ffffff',
      black: '#000000',
      gray: {
        50: '#f9fafb',
        100: '#f3f4f6',
        200: '#e5e7eb',
        300: '#d1d5db',
        400: '#9ca3af',
        500: '#6b7280',
        600: '#4b5563',
        700: '#374151',
        800: '#1f2937',
        900: '#111827',
        950: '#030712',
      },
      // Proper dark mode colors following Material Design guidelines
      slate: {
        50: '#f8fafc',
        100: '#f1f5f9',
        200: '#e2e8f0',
        300: '#cbd5e1',
        400: '#94a3b8',
        500: '#64748b',
        600: '#475569',
        700: '#334155',
        800: '#1e293b',
        850: '#181c24',
        900: '#0a0e1a',  // Dark blue-purple base
        950: '#06080f',
      },
      space: {
        950: '#06080f',  // Deepest space
        900: '#0a0e1a',  // Dark space blue
        850: '#0f1525',  // Card background
        800: '#141b2e',  // Lighter card
        700: '#1a2237',  // Hover states
      },
      red: {
        50: '#fef2f2',
        100: '#fee2e2',
        200: '#fecaca',
        300: '#fca5a5',
        400: '#f87171',
        500: '#ef4444',
        600: '#dc2626',
        700: '#b91c1c',
        800: '#991b1b',
        900: '#7f1d1d',
        950: '#450a0a',
      },
      yellow: {
        50: '#fefce8',
        100: '#fef9c3',
        200: '#fef08a',
        300: '#fde047',
        400: '#facc15',
        500: '#eab308',
        600: '#ca8a04',
        700: '#a16207',
        800: '#854d0e',
        900: '#713f12',
        950: '#422006',
      },
      green: {
        50: '#f0fdf4',
        100: '#dcfce7',
        200: '#bbf7d0',
        300: '#86efac',
        400: '#4ade80',
        500: '#22c55e',
        600: '#16a34a',
        700: '#15803d',
        800: '#166534',
        900: '#14532d',
        950: '#052e16',
      },
      blue: {
        50: '#eff6ff',
        100: '#dbeafe',
        200: '#bfdbfe',
        300: '#93c5fd',
        400: '#60a5fa',
        500: '#3b82f6',
        600: '#2563eb',
        700: '#1d4ed8',
        800: '#1e40af',
        900: '#1e3a8a',
        950: '#172554',
      },
        // Very subtle accent colors (muted for dark mode)
        accent: {
          blue: '#7e9ab8',    // Muted blue-gray
          purple: '#9b8db8',  // Muted purple-gray
          teal: '#7db3a8',    // Muted teal-gray
          emerald: '#85b39e', // Muted green-gray
        },
      // Mission control orange for light mode (unchanged)
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
    },
    extend: {
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
        'grid-pattern': 'linear-gradient(to right, rgba(100, 116, 139, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(100, 116, 139, 0.05) 1px, transparent 1px)',
        'dots-pattern': 'radial-gradient(circle, rgba(100, 116, 139, 0.08) 1px, transparent 1px)',
        'stars-pattern': 'radial-gradient(circle at 20% 30%, rgba(147, 197, 253, 0.03) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(167, 139, 250, 0.03) 0%, transparent 50%), radial-gradient(circle at 50% 50%, rgba(139, 217, 209, 0.02) 0%, transparent 50%)',
        'space-gradient': 'linear-gradient(180deg, #0a0e1a 0%, #0f1525 50%, #0a0e1a 100%)',
        'mission-gradient': 'linear-gradient(135deg, #ff9800 0%, #fb8c00 100%)',
      },
      backgroundSize: {
        'grid': '24px 24px',
        'dots': '16px 16px',
        'stars': '400px 400px',
      },
    },
  },
  plugins: [],
}
