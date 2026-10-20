/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'ine-blue-dark': '#1e3a8a',
        'ine-blue': '#2563eb',
        'ine-blue-light': '#dbeafe',
      }
    },
  },
  plugins: [],
}
