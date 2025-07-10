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
        sans: ["Poppins", "ui-sans-serif", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "Noto Sans", "sans-serif"],
        heading: ["Poppins", "ui-sans-serif", "system-ui", "sans-serif"],
        body: ["Poppins", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          muted: 'var(--color-text-muted)',
        },
      },
      boxShadow: {
        neumorph: '8px 8px 24px #e0e0e0, -8px -8px 24px #ffffff',
        'neumorph-inset': 'inset 4px 4px 12px #e0e0e0, inset -4px -4px 12px #ffffff',
      },
    },
  },
  plugins: [],
  darkMode: 'class'
}
