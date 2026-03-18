/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#5B8CFF',
        accent: '#00E0FF',
        dark: '#0A0F1C',
        glass: 'rgba(255,255,255,0.05)',
      },
      boxShadow: {
        glass: '0 8px 32px rgba(0,0,0,0.35)',
        soft: '0 4px 12px rgba(0,0,0,0.2)',
        primary: '0 4px 16px rgba(91,140,255,0.4)',
      },
      backdropBlur: {
        xl: '20px',
      },
      scale: {
        '102': '1.02',
        '98': '0.98',
      },
    },
  },
  plugins: [],
}
