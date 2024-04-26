import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {},
    container: {
      center: true,

      padding: "1rem",

      screens: {
        sm: "400px",
        md: "486px",
        lg: "656px",
        xl: "827px",
        "2xl": "998px",
      },
    },
    // typography: {
    //   default: {
    //     css: {
    //       pre: null,
    //       code: null,
    //       "code::before": null,
    //       "code::after": null,
    //       "pre code": null,
    //       "pre code::before": null,
    //       "pre code::after": null,
    //     },
    //   },
    // },
  },
  plugins: [typography],
};

export default config;
