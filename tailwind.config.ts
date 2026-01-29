import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Catppuccin Macchiato 主题色
        base: '#24273a',
        mantle: '#1e2030',
        crust: '#181926',

        surface0: '#363a4f',
        surface1: '#494d64',
        surface2: '#5b6078',

        text: '#cad3f5',
        subtext1: '#b8c0e0',
        subtext0: '#a5adcb',

        overlay0: '#6e738d',
        overlay1: '#8087a2',
        overlay2: '#939ab7',

        blue: '#8aadf4',
        lavender: '#b7bdf8',
        sapphire: '#7dc4e4',
        sky: '#91d7e3',
        teal: '#8bd5ca',
        green: '#a6da95',
        yellow: '#eed49f',
        peach: '#f5a97f',
        maroon: '#ee99a0',
        red: '#ed8796',
        mauve: '#c6a0f6',
        pink: '#f5bde6',
        flamingo: '#f0c6c6',
        rosewater: '#f4dbd6',
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans SC', 'sans-serif'],
        mono: ['Fira Code', 'JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};

export default config;
