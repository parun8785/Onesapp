/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0a',
        'background-secondary': '#1a1a1a',
        'background-tertiary': '#2a2a2a',
        primary: '#ffffff',
        secondary: '#888888',
        accent: '#d4af37', // ゴールドのアクセントカラー（バーらしい雰囲気）
      },
    },
  },
  plugins: [],
}

