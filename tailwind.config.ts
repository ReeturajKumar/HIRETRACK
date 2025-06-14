import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";
import scrollbar from "tailwind-scrollbar";
import scrollbarHide from "tailwind-scrollbar-hide";
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [typography, scrollbar, scrollbarHide],
};

export default config;
