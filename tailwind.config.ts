import { type Config } from "tailwindcss";

import { fontFamily } from "tailwindcss/defaultTheme";
import tailwindcssRadix from "tailwindcss-radix";
import tailwindcssAnimate from "tailwindcss-animate";

const Prefix = "ta-";
const PrefixExt = "tas-";

const RenderPrefixVariable = (value:string) => `var(--${PrefixExt}${value})`;

const config: Config = {
    prefix: Prefix,
    content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
    theme: {
        screens: {
            sm: { min: "640px" },
            md: { min: "768px" },
            lg: { min: "1024px" },
            xl: { min: "1280px" },
            "2xl": { min: "1536px" },
            "2xl.max": { min: "1600px" },
            "2xl-5": "1600px",
            "1xl": "1440px",
            "max-sm": { max: "639px" },
            "3xl": "1600px",
        },
        extend: {
            colors: {
              primary: RenderPrefixVariable("primary"),
              info: RenderPrefixVariable("info"),
              secondary: RenderPrefixVariable("secondary"),
              "secondary-body": RenderPrefixVariable("secondary-body"),
              line: RenderPrefixVariable("line"),
              title: RenderPrefixVariable("title"),
              body: RenderPrefixVariable("body"),
              warning: RenderPrefixVariable("warning"),
              success: RenderPrefixVariable("success"),
              danger: RenderPrefixVariable("danger"),
            },
            fontFamily: {
              sans: [...fontFamily.sans],
            },
            borderRadius: {
              "modal": RenderPrefixVariable("modal-radius"),
            },
            keyframes: {
              shimmer: {
                "0%": { opacity: "0.1" },
                "50%": { opacity: "0.5" },
                "100%": { opacity: "1" },
              },
            },
            animation: {
              "accordion-down": "accordion-down 0.2s ease-out",
              "accordion-up": "accordion-up 0.2s ease-out",
              overlayShow: "overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1)",
              contentShow: "contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1)",
              shimmer: "shimmer 0.5s infinite linear",
            },
            transitionDuration: {
              DEFAULT: "150ms",
            },
            screens: {
              "xs": "375px",
            },
        },
    },
    plugins: [tailwindcssRadix, tailwindcssAnimate],
};

export default config;
