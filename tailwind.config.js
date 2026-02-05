/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './components/**/*.{js,vue,ts}',
        './layouts/**/*.vue',
        './pages/**/*.vue',
        './plugins/**/*.{js,ts}',
        './app.vue',
    ],
    theme: {
        extend: {
            colors: {
                // Custom COVID dashboard colors
                'covid-blue': '#3b82f6',
                'covid-red': '#ef4444',
                'covid-green': '#22c55e',
                'covid-orange': '#f97316',
                'covid-purple': '#a855f7',
            },
        },
    },
    plugins: [require('daisyui')],
    daisyui: {
        themes: [
            {
                covidDark: {
                    'primary': '#3b82f6',
                    'secondary': '#a855f7',
                    'accent': '#22c55e',
                    'neutral': '#1f2937',
                    'base-100': '#111827',
                    'base-200': '#1f2937',
                    'base-300': '#374151',
                    'info': '#3b82f6',
                    'success': '#22c55e',
                    'warning': '#f97316',
                    'error': '#ef4444',
                },
            },
            'dark',
            'light',
        ],
        darkTheme: 'covidDark',
    },
};
