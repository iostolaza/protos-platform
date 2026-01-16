/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./apps/admin/src/**/*.{html,ts}",
    "./apps/portal/src/**/*.{html,ts}",
    "./apps/shared/src/**/*.{html,ts}"
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('tailwind-scrollbar')
  ],
}
