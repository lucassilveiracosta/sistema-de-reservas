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
        blue: {
          50: '#F2F6FF',
          100: '#E5EDFF',
          200: '#C9D7FF',
          300: '#AABEFF',
          400: '#8DA6FF',
          500: '#7A98FF',
          600: '#6B8CFF',
          700: '#5574D9',
          800: '#364D94',
          900: '#1C2A5A',
        }
      }
    },
  },
  plugins: [],
};
export default config;
