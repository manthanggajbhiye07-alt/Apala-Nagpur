/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Deep midnight navy — intelligence / map experience
        ink: {
          950: '#0a0f1a',
          900: '#0e1524',
          850: '#121b2d',
          800: '#1a2640',
          700: '#243355',
          600: '#324674',
          500: '#44598f',
          400: '#6a7fb0',
          300: '#94a5cc',
          200: '#c4cee0',
          100: '#e2e8f4',
        },
        // Warm neutral surfaces — discovery pages
        sand: {
          50: '#faf8f5',
          100: '#f5f1ea',
          200: '#ebe4d7',
          300: '#ddd2bd',
          400: '#c4b296',
          500: '#a8916c',
          600: '#8a7556',
          700: '#6b5a43',
          800: '#4d4030',
          900: '#332a20',
        },
        // Teal accent — meaningful actions
        teal: {
          50: '#ecfdf7',
          100: '#d1faec',
          200: '#a6f2da',
          300: '#6ce4c4',
          400: '#34cfa9',
          500: '#14b890',
          600: '#0d9576',
          700: '#0e7760',
          800: '#105f4f',
          900: '#104e42',
        },
        // Lime accent — selected states
        lime: {
          50: '#f7fee7',
          100: '#ecfccb',
          200: '#d9f599',
          300: '#beeb61',
          400: '#a3d939',
          500: '#84bd20',
          600: '#639815',
          700: '#4b7412',
          800: '#3c5b14',
          900: '#334c14',
        },
        // Status colors
        success: '#16a34a',
        warning: '#d97706',
        error: '#dc2626',
        info: '#0284c7',
      },
      borderRadius: {
        'xl': '0.875rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(10,15,26,0.06), 0 1px 2px -1px rgba(10,15,26,0.04)',
        'card-lg': '0 4px 24px -6px rgba(10,15,26,0.10), 0 2px 6px -2px rgba(10,15,26,0.06)',
        'card-xl': '0 12px 40px -8px rgba(10,15,26,0.18), 0 4px 12px -4px rgba(10,15,26,0.08)',
        'glow-teal': '0 0 0 3px rgba(20,184,144,0.18)',
      },
      animation: {
        'fade-in': 'fadeIn 300ms ease-out',
        'slide-up': 'slideUp 350ms cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-right': 'slideRight 350ms cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in': 'scaleIn 250ms cubic-bezier(0.16, 1, 0.3, 1)',
        'shimmer': 'shimmer 1.8s linear infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(12px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        slideRight: { '0%': { opacity: '0', transform: 'translateX(-12px)' }, '100%': { opacity: '1', transform: 'translateX(0)' } },
        scaleIn: { '0%': { opacity: '0', transform: 'scale(0.96)' }, '100%': { opacity: '1', transform: 'scale(1)' } },
        shimmer: { '0%': { backgroundPosition: '-800px 0' }, '100%': { backgroundPosition: '800px 0' } },
      },
    },
  },
  plugins: [],
};
