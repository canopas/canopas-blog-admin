/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      display: ["group-hover"],
      screens: {
        sm: "576px",
        md: "768px",
        lg: "992px",
        xl: "1200px",
        "2xl": "1400px",
        "3xl": "1600px",
      },
      fontFamily: {
        "product-black": ["Product Sans Black"],
        "product-regular": ["Product Sans Regular"],
        "inter-medium": ["Inter Medium"],
        "inter-regular": ["Inter Regular"],
        "inter-bold": ["Inter Bold"],
        "inter-semibold": ["Inter SemiBold"],
        "inter-light": ["Inter ExtraLight"],
        "source-codepro": ["Source CodePro"],
        "poppins-light": ["Poppins Light"],
        "poppins-regular": ["Poppins Regular"],
        "poppins-medium": ["Poppins Medium"],
      },
      colors: {
        black: {
          core: "#000000",
          900: "#3d3d3d",
        },
        white: "#ffffff",
        pink: {
          300: "#f2709c",
        },
        orange: {
          300: "#ff835b",
        },
        slate: {
          200: "rgb(226, 226, 226)",
          400: "rgb(141, 138, 138)",
        },
      },
      transitionTimingFunction: {
        out: "cubic-bezier(0.9, 0.96, 1, 1)",
      },
      backgroundImage: {
        "gradient-L": "linear-gradient(178deg, #FFFFFF  68%, #f77783 40%);",
        "gradient-W": "linear-gradient(257deg, #FFFFFF  65%, #f77783 68%);",
        "gradient-T": "linear-gradient(540deg, #FFFFFF  30.5%, #f77783 10%);",
      },
    },
  },
  corePlugins: {
    container: false,
    aspectRatio: false,
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/aspect-ratio"),
    function ({ addComponents }) {
      addComponents({
        ".container": {
          margin: "auto",
          padding: "0 0.75rem",
          maxWidth: "100%",
          "@screen sm": {
            maxWidth: "540px",
          },
          "@screen md": {
            maxWidth: "720px",
          },
          "@screen lg": {
            maxWidth: "960px",
          },
          "@screen xl": {
            maxWidth: "1140px",
          },
          "@screen 2xl": {
            maxWidth: "1320px",
          },
          "@screen 3xl": {
            maxWidth: "1470px",
          },
        },
      });
    },
  ],
};
