const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.tsx"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
      },
      screens: {
        DEFAULT: "80rem",
      },
    },
    colors: ({ colors }) => ({
      inherit: colors.inherit,
      current: colors.current,
      transparent: colors.transparent,
      black: "#000",
      white: "#FFF",
      purple: {
        800: "#331832",
      },
      ruby: {
        600: "#D81E5B",
      },
      orange: {
        600: "#F0544F",
      },
      opal: {
        400: "#C6D8D3",
      },
      papaya: {
        400: "#FDF0D5",
      },
    }),
    fontFamily: {
      sans: ["Montserrat", ...defaultTheme.fontFamily.sans],
    },
  },
};
