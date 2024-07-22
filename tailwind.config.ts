import { type Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
      screens: {
        'print': { 'raw': 'print' },
      },
      animation: {
        ripple: 'ripple 0.8s',
      },
      scrollbar: {
        width: '12px',    // Set the scrollbar width
        track: 'bg-gray-300',   // Set the track color
        thumb: 'bg-indigo-500',  // Set the thumb (draggable part) color
      },
      keyframes: {
        ripple: {
          '100%': {
            opacity: '0',
            transform: 'scale(2)'
         },
        }
      }
    },
  },
  plugins: [],
} satisfies Config;

