/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#FDF9F3',
          100: '#F7EDE0',
          200: '#F2D8B1',
          300: '#E5A958',
          400: '#C77B3E',
          500: '#9E3C2B',
          600: '#8C1B3F',
          700: '#66102a',
          800: '#45091a',
          900: '#1A1516',
        },
        ink: {
          DEFAULT: '#1A1516',
          50:  '#F2EFEF',
          100: '#E5E0E1',
          200: '#D2C9CB',
          300: '#B5A8AA',
          400: '#918385',
          500: '#6E6062',
          600: '#4B4042',
          700: '#382F31',
          800: '#251E20',
          900: '#1A1516',
        },
        honey:   '#E5A958',
        gold:    '#C77B3E',
        copper:  '#9E3C2B',
        terra:   '#8C1B3F',
        forest:  '#66102a',
      },
      fontFamily: {
        display: ['"Barlow Condensed"', 'sans-serif'],
        body:    ['Barlow', 'sans-serif'],
        script:  ['"Dancing Script"', 'cursive'],
      },
      letterSpacing: {
        widest2: '0.2em',
        widest3: '0.3em',
      },
      animation: {
        'fade-in':    'fadeIn 0.8s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.9s ease-out forwards',
        'slide-left': 'slideLeft 0.7s ease-out forwards',
        'shimmer':    'shimmer 2s linear infinite',
        'bar1':       'barBounce 0.7s ease-in-out infinite alternate',
        'bar2':       'barBounce 0.9s ease-in-out infinite alternate',
        'bar3':       'barBounce 0.6s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        slideLeft: {
          from: { opacity: '0', transform: 'translateX(-24px)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
        shimmer: {
          from: { transform: 'translateX(-100%)' },
          to:   { transform: 'translateX(200%)' },
        },
        barBounce: {
          from: { height: '3px' },
          to:   { height: '12px' },
        },
      },
    },
  },
  plugins: [],
};
