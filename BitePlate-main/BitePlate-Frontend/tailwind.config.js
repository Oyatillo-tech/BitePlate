import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#18181b',
        secondary: '#52525b',
        accent: '#2563eb',
        success: '#16a34a',
        danger: '#dc2626',
        warning: '#d97706',
        surface: '#ffffff',
        muted: '#f4f4f5',
        border: '#e4e4e7',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 1px 3px rgba(0,0,0,0.06)',
        card: '0 1px 2px rgba(0,0,0,0.04)',
      },
    },
  },
  plugins: [forms],
};
