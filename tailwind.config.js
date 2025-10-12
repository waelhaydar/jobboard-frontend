/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Enable class-based dark mode
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'job-text-primary': 'rgb(var(--color-foreground) / <alpha-value>)',
        'job-text-muted': 'rgb(var(--color-muted-foreground) / <alpha-value>)',
        'job-text-white': 'rgb(var(--color-primary-foreground) / <alpha-value>)',
        'job-status-pending-background': 'rgba(255, 255, 0, 0.1)',
        'job-button-primary-gradient': 'linear-gradient(90deg, #06b6d4, #8b5cf6)',
        'job-button-text': 'white',
        'job-card-background': 'rgb(var(--color-card) / <alpha-value>)',
        'job-card-border': 'rgb(var(--color-border) / <alpha-value>)',
        'job-primary-ring': 'rgb(var(--color-ring) / <alpha-value>)',
      },
    },
  },
  plugins: [],
}
