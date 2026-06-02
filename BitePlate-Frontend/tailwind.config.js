// /** @type {import('tailwindcss').Config} */
// export default {
//     content: [
//         "./index.html",
//         "./src/**/*.{js,ts,jsx,tsx}",
//     ],
//     theme: {
//         extend: {
//             colors: {
//                 primary: '#667eea',
//                 secondary: '#764ba2',
//                 success: '#4CAF50',
//                 danger: '#FF5252',
//                 warning: '#FF9800',
//                 info: '#2196F3',
//             },
//             fontFamily: {
//                 sans: ['Segoe UI', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
//                 serif: ['Georgia', 'serif'],
//                 mono: ['Monaco', 'monospace'],
//             },
//             fontSize: {
//                 xs: ['0.75rem', { lineHeight: '1rem' }],
//                 sm: ['0.875rem', { lineHeight: '1.25rem' }],
//                 base: ['1rem', { lineHeight: '1.5rem' }],
//                 lg: ['1.125rem', { lineHeight: '1.75rem' }],
//                 xl: ['1.25rem', { lineHeight: '1.75rem' }],
//                 '2xl': ['1.5rem', { lineHeight: '2rem' }],
//                 '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
//                 '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
//             },
//             spacing: {
//                 '128': '32rem',
//                 '144': '36rem',
//             },
//             borderRadius: {
//                 'none': '0',
//                 'sm': '0.125rem',
//                 DEFAULT: '0.25rem',
//                 'md': '0.375rem',
//                 'lg': '0.5rem',
//                 'xl': '0.75rem',
//                 '2xl': '1rem',
//                 '3xl': '1.5rem',
//             },
//             boxShadow: {
//                 'xs': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
//                 'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
//                 'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
//                 'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
//                 'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
//                 '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
//             },
//             animation: {
//                 'spin': 'spin 1s linear infinite',
//                 'ping': 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
//                 'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
//                 'bounce': 'bounce 1s infinite',
//                 'fadeIn': 'fadeIn 0.3s ease-in-out',
//                 'slideInUp': 'slideInUp 0.3s ease-out',
//                 'slideInDown': 'slideInDown 0.3s ease-out',
//             },
//             keyframes: {
//                 fadeIn: {
//                     'from': { opacity: '0' },
//                     'to': { opacity: '1' },
//                 },
//                 slideInUp: {
//                     'from': {
//                         transform: 'translateY(10px)',
//                         opacity: '0',
//                     },
//                     'to': {
//                         transform: 'translateY(0)',
//                         opacity: '1',
//                     },
//                 },
//                 slideInDown: {
//                     'from': {
//                         transform: 'translateY(-10px)',
//                         opacity: '0',
//                     },
//                     'to': {
//                         transform: 'translateY(0)',
//                         opacity: '1',
//                     },
//                 },
//             },
//             gap: {
//                 '128': '32rem',
//             },
//             maxWidth: {
//                 '8xl': '88rem',
//                 '9xl': '96rem',
//             },
//             opacity: {
//                 '4': '0.04',
//                 '8': '0.08',
//                 '12': '0.12',
//             },
//             transitionDuration: {
//                 '250': '250ms',
//                 '350': '350ms',
//             },
//         },
//     },
//     plugins: [
//         require('@tailwindcss/forms'),
//         require('@tailwindcss/typography'),
//         require('@tailwindcss/line-clamp'),
//     ],
// }