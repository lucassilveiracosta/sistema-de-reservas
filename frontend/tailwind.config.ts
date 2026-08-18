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
          50: '#F0F6FB',
          100: '#DCEBFA',
          200: '#C2DEF5',
          300: '#99C6EB',
          400: '#66AADD',
          500: '#338DCD',
          600: '#0066B3',
          700: '#005291',
          800: '#053E6E',
          900: '#0B3061',
        },
        lime: {
          50: '#FCFDF5',
          100: '#F6FAEA',
          200: '#EBF4CC',
          300: '#DFEDAA',
          400: '#D6E882',
          500: '#CDE231',
          600: '#B5C929',
          700: '#9BB02C',
          800: '#7B8C22',
          900: '#586616',
        }
      }
    },
  },
  plugins: [],
};
export default config;
