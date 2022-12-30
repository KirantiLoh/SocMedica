/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                "primary": {
                    100: "#886EAC",
                    900: "#2e026d",
                    DEFAULT: "#6A4A97"
                },
                "secondary": {
                    900: "#15162c"
                }
            },
            screens: {
                xs: "425px"
            }
        },
    },
    plugins: [],
};