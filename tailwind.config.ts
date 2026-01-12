import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#121524",
        paper: "#f9f6f2",
        accent: "#FF4D6D",
        teal: "#2EC4B6",
        sky: "#7CC6FF",
        lilac: "#B39DFF"
      }
    }
  },
  plugins: []
};

export default config;
