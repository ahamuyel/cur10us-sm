/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // permite alternar com a classe 'dark'
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './modules/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--color-background)',
        foreground: 'var(--color-foreground)',
        primary: {
          DEFAULT: '#4F46E5',
          dark: '#4338CA',
        },
        accent: '#6366F1',
      },
      fontFamily: {
        sans: 'var(--font-sans)',
        mono: 'var(--font-mono)',
      },
    },
  },
  plugins: [],
}
