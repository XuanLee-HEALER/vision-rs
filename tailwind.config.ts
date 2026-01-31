import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
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

        text: '#f0f0f0',
        subtext1: '#e0e0e0',
        subtext0: '#d0d0d0',

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
        sans: [
          'var(--font-inter)',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          '"PingFang SC"',
          '"Hiragino Sans GB"',
          '"Microsoft YaHei"',
          '"Noto Sans SC"',
          'system-ui',
          'sans-serif',
        ],
        mono: [
          'var(--font-mono)',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          '"Liberation Mono"',
          '"Courier New"',
          'monospace',
        ],
      },
      animation: {
        gradient: 'gradient 30s ease infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'draw-circle': 'draw-circle 0.6s ease-out',
        'fade-in-up': 'fade-in-up 0.6s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
      },
      keyframes: {
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'pulse-glow': {
          '0%, 100%': {
            opacity: '0.5',
            boxShadow: '0 0 8px currentColor',
          },
          '50%': {
            opacity: '1',
            boxShadow: '0 0 16px currentColor',
          },
        },
        'draw-circle': {
          from: { strokeDasharray: '0 37.7' },
          to: { strokeDasharray: '37.7 37.7' },
        },
        'fade-in-up': {
          from: {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

export default config;
