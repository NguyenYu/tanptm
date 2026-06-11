/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                // Gán font chữ Plus Jakarta Sans làm font 'sans' mặc định của toàn trang
                sans: ['var(--font-jakarta)', 'sans-serif'],
            },
        },
    },
    plugins: [],
}