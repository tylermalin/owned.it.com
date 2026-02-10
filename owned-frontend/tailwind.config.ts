import type { Config } from "tailwindcss";

export default {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                serif: ['var(--font-serif)'],
                sans: ['var(--font-sans)', 'Inter', 'sans-serif'],
            },
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                primary: {
                    DEFAULT: "var(--primary)",
                    foreground: "var(--primary-foreground)",
                },
                muted: {
                    DEFAULT: "var(--muted)",
                    foreground: "var(--muted-foreground)",
                },
                accent: {
                    DEFAULT: "var(--accent)",
                    foreground: "var(--accent-foreground)",
                },
                border: "var(--border)",
            },
            borderRadius: {
                '3xl': '1.5rem',
                '4xl': '2rem',
            },
            boxShadow: {
                'saas': 'var(--shadow-saas)',
                'saas-lg': 'var(--shadow-saas-lg)',
            },
        },
    },
    plugins: [],
} satisfies Config;
