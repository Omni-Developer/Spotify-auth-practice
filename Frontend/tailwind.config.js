/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        spotify: {
          dark: "#121212",
          card: "#1e1e1e",
          hover: "#282828",
          green: "#1DB954",
          lightText: "#b3b3b3",
        },
      },
      fontFamily: {
        sans: ["Poppins", "system-ui", "sans-serif"],
      },
    },
  },
  darkMode: "class",
  plugins: [],
};
