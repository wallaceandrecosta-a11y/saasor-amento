/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#F5F7FA', // Ice White
          100: '#E6EDFF', // Very light blue
          200: '#C2D6FF',
          300: '#99BEFF',
          400: '#5290FF',
          500: '#0A4DFF', // Royal Deep Blue (Cor Principal)
          600: '#003CE6', // Hover Deep Blue
          700: '#0030B8',
          800: '#002385',
          900: '#071A3D', // Midnight Blue
          950: '#050816', // Deep space dark background
        },
        brand: {
          dark: '#050816', // Deep space dark background
          secondary: '#071A3D', // Midnight Blue
          light: '#F5F7FA', // Ice White
          muted: '#8B95A7', // Cool gray text
        }
      },
      boxShadow: {
        'soft': '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)',
        'float': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'premium': '0 10px 40px -10px rgba(0,0,0,0.25)',
        'glow': '0 0 15px rgba(10, 77, 255, 0.15)',
        'glow-intense': '0 0 25px rgba(10, 77, 255, 0.35)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slow-pulse': 'slowPulse 8s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slowPulse: {
          '0%, 100%': { opacity: '0.15', transform: 'scale(1)' },
          '50%': { opacity: '0.25', transform: 'scale(1.05)' },
        }
      }
    },
  },
  plugins: [],
}
