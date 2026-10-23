/**
 * Tailwind CSS configuration for the `web` app.
 * The content paths include all files under the `app` directory so that
 * class names used in Next.js pages and components are tree‑shaken.
 */

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // The main app directory contains the page files.
    "./app/**/*.{js,ts,jsx,tsx}",
    // If you add a components folder later it will be picked up automatically.
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

