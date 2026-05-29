/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#667eea',
                secondary: '#764ba2',
                danger: '#FF5252',
                success: '#4CAF50',
                warning: '#FF9800',
            },
            fontFamily: {
                sans: ['Segoe UI', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
            },
        },
    },
    plugins: [],
}