import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1.5rem",
        sm: "2rem",
        lg: "2rem",
      },
      screens: {
        sm: "640px",
        md: "768px", 
        lg: "1024px",
        xl: "1200px",
        "2xl": "1200px",
      },
    },
    screens: {
      'mobile': {'max': '599px'},
      'tablet': {'min': '600px', 'max': '1023px'},
      'desktop': {'min': '1024px'},
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        
        /* Brand Colors */
        "brand-gold": "hsl(var(--brand-gold))",
        "brand-gold-700": "hsl(var(--brand-gold-700))",
        "brand-charcoal": "hsl(var(--brand-charcoal))",
        
        /* Ink Scale */
        "ink-900": "hsl(var(--ink-900))",
        "ink-800": "hsl(var(--ink-800))",
        "ink-700": "hsl(var(--ink-700))",
        "ink-600": "hsl(var(--ink-600))",
        "ink-500": "hsl(var(--ink-500))",
        
        /* Surface Scale */
        "surface-0": "hsl(var(--surface-0))",
        "surface-50": "hsl(var(--surface-50))",
        "line-100": "hsl(var(--line-100))",
        
        /* Success */
        success: "hsl(var(--success))",
        
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          50: "hsl(var(--primary-50))",
          600: "hsl(var(--primary-600))",
          700: "hsl(var(--primary-700))",
          darker: "hsl(var(--primary-darker))",
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
        lg: "1rem",
        md: "0.75rem", 
        sm: "0.5rem",
        card: "1.25rem",       /* 20px for cards */
        image: "1rem",         /* 16px for images */
        pill: "9999px",        /* Pills for buttons */
        button: "0.75rem",     /* 12px for tertiary buttons */
      },
      fontFamily: {
        heading: "var(--font-heading)",
        body: "var(--font-body)",
      },
      spacing: {
        '4': '4px',
        '8': '8px', 
        '12': '12px',
        '16': '16px',
        '20': '20px',
        '24': '24px',
        '32': '32px',
        '40': '40px',
        '48': '48px',
        '64': '64px',
        '72': '72px',
        '96': '96px',
      },
      maxWidth: {
        container: '1200px',
      },
      aspectRatio: {
        'property': '10 / 16',  /* 16:10 for property images */
      },
      backgroundImage: {
        "gradient-hero": "var(--gradient-hero)",
        "gradient-gold": "var(--gradient-gold)",
      },
      boxShadow: {
        "card-rest": "var(--shadow-card-rest)",
        "card-hover": "var(--shadow-card-hover)",
        "focus-brand": "var(--shadow-focus)",
      },
      lineHeight: {
        'tight': '0.8',
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
        bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
