/** Tailwind config — colours read CSS variables so dark mode + opacity (e.g. border-ink/15) work */
module.exports = {
  content: ['./index.html', './js/**/*.js'],
  theme: {
    extend: {
      colors: {
        ink: 'rgb(var(--ink) / <alpha-value>)',     // navy (text)
        accent: 'rgb(var(--accent) / <alpha-value>)',   // accent
        paper: 'rgb(var(--paper) / <alpha-value>)', // ivory (background)
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'Arial', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'ui-serif', 'serif'],
      },
    },
  },
  plugins: [],
};
