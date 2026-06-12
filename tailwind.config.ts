import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
    darkMode: "class",
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
        extend: {
                colors: {
                        background: 'hsl(var(--background))',
                        foreground: 'hsl(var(--foreground))',
                        card: {
                                DEFAULT: 'hsl(var(--card))',
                                foreground: 'hsl(var(--card-foreground))'
                        },
                        popover: {
                                DEFAULT: 'hsl(var(--popover))',
                                foreground: 'hsl(var(--popover-foreground))'
                        },
                        primary: {
                                DEFAULT: 'hsl(var(--primary))',
                                foreground: 'hsl(var(--primary-foreground))'
                        },
                        secondary: {
                                DEFAULT: 'hsl(var(--secondary))',
                                foreground: 'hsl(var(--secondary-foreground))'
                        },
                        muted: {
                                DEFAULT: 'hsl(var(--muted))',
                                foreground: 'hsl(var(--muted-foreground))'
                        },
                        accent: {
                                DEFAULT: 'hsl(var(--accent))',
                                foreground: 'hsl(var(--accent-foreground))'
                        },
                        destructive: {
                                DEFAULT: 'hsl(var(--destructive))',
                                foreground: 'hsl(var(--destructive-foreground))'
                        },
                        border: 'hsl(var(--border))',
                        input: 'hsl(var(--input))',
                        ring: 'hsl(var(--ring))',
                        chart: {
                                '1': 'hsl(var(--chart-1))',
                                '2': 'hsl(var(--chart-2))',
                                '3': 'hsl(var(--chart-3))',
                                '4': 'hsl(var(--chart-4))',
                                '5': 'hsl(var(--chart-5))'
                        },
                        gothic: {
                                950: '#0a0a0c',
                                900: '#121216',
                                800: '#1a1a22',
                                700: '#2a2a35',
                                600: '#3a3a48',
                                500: '#52526a',
                        },
                        crimson: {
                                900: '#450a0a',
                                700: '#7f1d1d',
                                500: '#b91c1c',
                                300: '#ef4444',
                                100: '#fee2e2',
                        },
                        imperial: {
                                900: '#2e1065',
                                700: '#581c87',
                                500: '#7c3aed',
                                300: '#a78bfa',
                        },
                },
                fontFamily: {
                        display: ['Cinzel', 'Cormorant Garamond', 'Georgia', 'serif'],
                        body: ['Inter', 'Roboto', 'system-ui', 'sans-serif'],
                        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
                },
                animation: {
                        'fade-in': 'fadeIn 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards',
                        'fade-in-up': 'fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards',
                        'slide-in-right': 'slideInRight 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards',
                        'scale-in': 'scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
                        'pulse-crimson': 'pulseCrimson 2s ease-in-out infinite',
                        'progress-fill': 'progressFill 1s ease-out forwards',
                        'number-count': 'numberCount 1.5s ease-out forwards',
                        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
                },
                keyframes: {
                        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
                        fadeInUp: { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
                        slideInRight: { '0%': { opacity: '0', transform: 'translateX(-20px)' }, '100%': { opacity: '1', transform: 'translateX(0)' } },
                        scaleIn: { '0%': { opacity: '0', transform: 'scale(0.9)' }, '100%': { opacity: '1', transform: 'scale(1)' } },
                        pulseCrimson: { '0%, 100%': { boxShadow: '0 0 0 0 rgba(127, 29, 29, 0)' }, '50%': { boxShadow: '0 0 0 8px rgba(127, 29, 29, 0.3)' } },
                        progressFill: { '0%': { width: '0%' }, '100%': { width: 'var(--progress-width)' } },
                        glowPulse: { '0%, 100%': { opacity: '0.6' }, '50%': { opacity: '1' } },
                        numberCount: { '0%': { opacity: '0', transform: 'translateY(10px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
                },
                boxShadow: {
                        'gothic-card': '0 4px 24px rgba(0, 0, 0, 0.6)',
                        'gothic-card-hover': '0 8px 40px rgba(0, 0, 0, 0.8), 0 0 24px rgba(127, 29, 29, 0.15)',
                        'crimson-glow': '0 0 32px rgba(127, 29, 29, 0.4)',
                        'purple-glow': '0 0 32px rgba(88, 28, 135, 0.4)',
                        'inner-subtle': 'inset 0 1px 0 0 rgba(244, 244, 245, 0.05)',
                },
                borderRadius: {
                        lg: 'var(--radius)',
                        md: 'calc(var(--radius) - 2px)',
                        sm: 'calc(var(--radius) - 4px)'
                }
        }
  },
  plugins: [tailwindcssAnimate],
};
export default config;
