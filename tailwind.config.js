/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#fdf6e8',
          100: '#f9e8c8',
          200: '#F6D7A1',
          300: '#E7B86A',
          400: '#C99249',
          500: '#A8673A',
          600: '#8A523F',
          700: '#5B3D31',
          800: '#4E5A43',
          900: '#232124',
        },
        ink: {
          DEFAULT: '#232124',
          50:  '#f5f2ee',
          100: '#e5dfd8',
          200: '#c9bfb2',
          300: '#a39688',
          400: '#7d7168',
          500: '#5a514a',
          600: '#3d3834',
          700: '#2e2a27',
          800: '#282527',
          900: '#232124',
        },
        honey:   '#E7B86A',
        gold:    '#C99249',
        copper:  '#A8673A',
        terra:   '#8A523F',
        forest:  '#4E5A43',
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
