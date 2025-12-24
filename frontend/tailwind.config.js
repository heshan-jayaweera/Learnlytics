/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 60% - Dominant dark base colors
        'dark-base': '#0f172a',      // Slate 900
        'dark-surface': '#1e293b',    // Slate 800
        'dark-elevated': '#334155',   // Slate 700
        
        // 30% - Secondary complementary colors
        'primary': '#3b82f6',        // Blue 500
        'primary-dark': '#2563eb',    // Blue 600
        'primary-light': '#60a5fa',   // Blue 400
        'secondary': '#6366f1',      // Indigo 500
        'secondary-dark': '#4f46e5',  // Indigo 600
        
        // 10% - Accent colors for highlights
        'accent': '#06b6d4',         // Cyan 500
        'accent-dark': '#0891b2',    // Cyan 600
        'accent-light': '#22d3ee',   // Cyan 400
        'accent-alt': '#8b5cf6',     // Purple 500
        
        // Semantic colors
        'success': '#10b981',        // Emerald 500
        'warning': '#f59e0b',        // Amber 500
        'danger': '#ef4444',          // Red 500
        'info': '#06b6d4',            // Cyan 500
      },
      animation: {
        'gradient': 'gradient 8s linear infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 3s infinite',
        'shake': 'shake 0.5s ease-in-out',
        'fade-in': 'fadeIn 0.5s ease-in',
        'slide-up': 'slideUp 0.5s ease-out',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'spin-slow': 'spin 3s linear infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      transitionDelay: {
        '100': '100ms',
        '200': '200ms',
        '300': '300ms',
        '400': '400ms',
        '500': '500ms',
        '600': '600ms',
        '700': '700ms',
        '800': '800ms',
        '900': '900ms',
        '1000': '1000ms',
      },
      keyframes: {
        gradient: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-5px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(5px)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(59, 130, 246, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.8), 0 0 30px rgba(59, 130, 246, 0.6)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}

