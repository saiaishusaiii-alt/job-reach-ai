/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{tsx,ts,jsx,js}'],
  theme: {
    extend: {
      colors: {
        space: '#04050f',
        violet: {
          500: '#7c3aed',
          400: '#8b5cf6',
          300: '#a78bfa',
          600: '#6d28d9'
        },
        cyan: {
          500: '#06b6d4',
          400: '#22d3ee',
          600: '#0891b2'
        },
        pink: { 500: '#ec4899' },
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      },
      animation: {
        float: 'float 4s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite'
      }
    }
  },
  plugins: []
}
