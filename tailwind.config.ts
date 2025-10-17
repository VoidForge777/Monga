/** @type {import('tailwindcss').Config} */

const config = {
  darkMode: ['[data-theme="dark"]', 'class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  safelist: [
    'lg:col-span-4',
    'lg:col-span-6',
    'lg:col-span-8',
    'lg:col-span-12',
    'border-border',
    'bg-card',
    'border-error',
    'bg-error/30',
    'border-success',
    'bg-success/30',
    'border-warning',
    'bg-warning/30',
  ],
  theme: {
    container: {
      center: true,
      padding: {
        '2xl': '2rem',
        DEFAULT: '1rem',
        lg: '2rem',
        md: '2rem',
        sm: '1rem',
        xl: '2rem',
      },
      screens: {
        '2xl': '86rem',
        lg: '64rem',
        md: '48rem',
        sm: '40rem',
        xl: '80rem',
      },
    },
    extend: {
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      colors: {
        light: 'var(--light)',
        dark: 'var(--dark)',
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        toggle: 'var(--toggle)',
        bg: 'var(--bg)',
        fg: 'var(--fg)',
        primary: {
          DEFAULT: 'var(--primary)',
          fg: 'var(--primary-fg)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          fg: 'var(--secondary-fg)',
        },
        tertiary: {
          DEFAULT: 'var(--tertiary)',
          fg: 'var(--tertiary-fg)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          fg: 'var(--accent-fg)',
          subtle: 'var(--accent-subtle)',
          'subtle-fg': 'var(--accent-subtle-fg)',
        },
        success: {
          DEFAULT: 'var(--success)',
          fg: 'var(--success-fg)',
        },
        info: {
          DEFAULT: 'var(--info)',
          fg: 'var(--info-fg)',
        },
        danger: {
          DEFAULT: 'var(--danger)',
          fg: 'var(--danger-fg)',
        },
        warning: {
          DEFAULT: 'var(--warning)',
          fg: 'var(--warning-fg)',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          fg: 'hsl(var(--muted-fg))',
        },
        overlay: {
          DEFAULT: 'var(--overlay)',
          fg: 'var(--overlay-fg)',
        },
      },
      borderRadius: {
        '3xl': 'calc(var(--radius) + 7.5px)',
        '2xl': 'calc(var(--radius) + 5px)',
        xl: 'calc(var(--radius) + 2.5px)',
        lg: 'calc(var(--radius))',
        md: 'calc(var(--radius) - 2.5px)',
        sm: 'calc(var(--radius) - 5px)',
      },
      fontFamily: {
        mono: ['var(--font-geist-mono)'],
        sans: ['var(--font-geist-sans)'],
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: [
            {
              '--tw-prose-body': 'var(--text)',
              '--tw-prose-headings': 'var(--text)',
              h1: {
                fontWeight: 'normal',
                marginBottom: '0.25em',
              },
            },
          ],
        },
        base: {
          css: [
            {
              h1: {
                fontSize: '2.5rem',
              },
              h2: {
                fontSize: '1.25rem',
                fontWeight: 600,
              },
            },
          ],
        },
        md: {
          css: [
            {
              h1: {
                fontSize: '3.5rem',
              },
              h2: {
                fontSize: '1.5rem',
              },
            },
          ],
        },
      }),
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('tailwindcss-react-aria-components'),
    require('@tailwindcss/typography'),
  ],
}

export default config
