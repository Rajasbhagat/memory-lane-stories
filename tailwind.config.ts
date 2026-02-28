import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['"Atkinson Hyperlegible"', 'sans-serif'],
      },
      fontSize: {
        /* Accessibility-first type scale — 18px minimum */
        'sm': ['18px', { lineHeight: '1.6' }],
        'base': ['20px', { lineHeight: '1.75' }],
        'lg': ['22px', { lineHeight: '1.6' }],
        'xl': ['24px', { lineHeight: '1.5' }],
        '2xl': ['28px', { lineHeight: '1.3' }],
        '3xl': ['32px', { lineHeight: '1.3' }],
        '4xl': ['36px', { lineHeight: '1.3' }],
        /* Semantic aliases */
        'body': ['20px', { lineHeight: '1.75' }],
        'heading-sm': ['24px', { lineHeight: '1.3' }],
        'heading': ['28px', { lineHeight: '1.3' }],
        'heading-lg': ['36px', { lineHeight: '1.3' }],
        'speech': ['22px', { lineHeight: '1.6' }],
        'button': ['20px', { lineHeight: '1.4' }],
        'caption': ['18px', { lineHeight: '1.5' }],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 4px)",
        sm: "calc(var(--radius) - 8px)",
        full: "999px",
      },
      spacing: {
        '18': '4.5rem',
      },
      minHeight: {
        'touch': '60px',
        'touch-lg': '72px',
        'touch-xl': '96px',
      },
      minWidth: {
        'touch': '60px',
        'touch-lg': '72px',
        'touch-xl': '96px',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(1)", opacity: "0.8" },
          "50%": { transform: "scale(1.15)", opacity: "0.4" },
          "100%": { transform: "scale(1)", opacity: "0.8" },
        },
        "shake": {
          "0%, 100%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-4px)" },
          "75%": { transform: "translateX(4px)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-ring": "pulse-ring 1.5s ease-out infinite",
        "shake": "shake 0.15s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
