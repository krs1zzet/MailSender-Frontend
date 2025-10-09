/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  screens: {
    sm: '480px',
    md: '768px',
    lg: '976px',
    xl: '1440px'
  },
  theme: { extend: {
    fontFamily: {
      sans: ['Barlow Semi Condensed', 'sans-serif']
    }
  } },
  plugins: [],
}
