/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: {
          light: '#F8FAFC',
          dark: '#090D16',
          DEFAULT: '#090D16',
        },
        surface: {
          light: '#FFFFFF',
          dark: '#0F172A',
          card: '#131D31',
          hover: '#1A2642',
          DEFAULT: '#0F172A',
        },
        border: {
          light: '#E2E8F0',
          dark: '#1E293B',
          glow: 'rgba(0, 210, 255, 0.25)',
          DEFAULT: '#1E293B',
        },
        text: {
          light: '#0F172A',
          dark: '#F8FAFC',
          mutedLight: '#64748B',
          mutedDark: '#94A3B8',
          DEFAULT: '#F8FAFC',
        },
        accent: {
          cyan: '#00D2FF',
          blue: '#2563EB',
          sky: '#38BDF8',
          DEFAULT: '#00D2FF',
        },
        primary: {
          DEFAULT: '#00D2FF',
          hover: '#00B4DB',
          light: '#E0F7FA',
          dark: '#0083B0',
        },
        jarvis: {
          DEFAULT: '#00D2FF',
          hover: '#0284C7',
          light: '#E0F2FE',
          glow: 'rgba(0, 210, 255, 0.4)',
        },
        status: {
          success: '#10B981',
          warning: '#F59E0B',
          danger: '#EF4444',
          info: '#38BDF8',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.3s ease-in-out forwards',
        'slide-up': 'slideUp 0.3s ease-out forwards',
        'glow-pulse': 'pulseGlow 2.5s infinite ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
};
