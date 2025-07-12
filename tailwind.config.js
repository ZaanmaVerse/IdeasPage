module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/line-clamp')],
  theme: {
  extend: {
    colors: {
      orange: {
        500: '#f26b3a',
      },
    },
  },
},
};
