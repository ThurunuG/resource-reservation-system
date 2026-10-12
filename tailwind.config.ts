import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eefbf6",
          100: "#d7f5e9",
          200: "#b2ebd6",
          300: "#7edcbe",
          400: "#45c39f",
          500: "#22a683",
          600: "#16856a",
          700: "#136a56",
          800: "#125445",
          900: "#11463a",
          950: "#052721",
        },
      },
    },
  },
  plugins: [],
};
export default config;
