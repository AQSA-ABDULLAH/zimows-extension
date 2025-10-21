/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
   extend: {
      fontFamily: {
        Lato: ["var(--font-lato)", "sans-serif"],
        arial: ["Arial", "sans-serif"],
      },
            screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
        "3xl": "1900px", // 1920
        "4xl": "2500px", // 2560
      },
    },
  },
  plugins: [],
};
