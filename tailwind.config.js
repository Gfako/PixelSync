/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'pixel': ['monospace'],
        'brutalist': ['DM Sans', 'sans-serif'],
        'brutalist-mono': ['Space Mono', 'monospace'],
        'montserrat': ['Montserrat', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
        'roboto': ['Roboto', 'sans-serif'],
        'poppins': ['Poppins', 'sans-serif'],
        'open-sans': ['Open Sans', 'sans-serif'],
        'lato': ['Lato', 'sans-serif'],
        'nunito': ['Nunito', 'sans-serif'],
        'source-sans': ['Source Sans Pro', 'sans-serif'],
      },
      colors: {
        'pixel': {
          'bg': '#cfdbd5',
          'surface': '#cfdbd5',
          'sidebar': '#cfdbd5',
          'primary': '#f5cb5c',
          'secondary': '#cfdbd5',
          'accent': '#333533',
          'success': '#f5cb5c',
          'warning': '#f5cb5c',
          'danger': '#333533',
          'text': '#242423',
          'text-light': '#333533',
          'muted': '#333533',
          'border': '#242423',
        },
        'brutalist': {
          'bg': '#cfdbd5',
          'surface': '#cfdbd5',
          'primary': '#f5cb5c',
          'primary-fg': '#242423',
          'secondary': 'rgba(207, 219, 213, 0.8)',
          'accent': '#333533',
          'text': '#242423',
          'border': '#242423',
          'muted': 'rgba(207, 219, 213, 0.6)',
          'platinum': '#cfdbd5',
          'saffron': '#f5cb5c',
          'eerie-black': '#242423',
          'jet': '#333533',
        }
      },
      boxShadow: {
        'pixel': '0 0 0 2px currentColor',
        'pixel-lg': '0 0 0 4px currentColor',
        'retro-sm': '0 2px 4px rgba(0, 0, 0, 0.1)',
        'retro': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'retro-md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'retro-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'retro-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
      animation: {
        'pixel-pulse': 'pixel-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pixel-bounce': 'pixel-bounce 1s infinite',
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-in': 'slide-in 0.3s ease-out',
      },
      keyframes: {
        'pixel-pulse': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.02)' },
        },
        'pixel-bounce': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-2px)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-in': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      }
    },
  },
  plugins: [],
}