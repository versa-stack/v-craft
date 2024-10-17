const formKitTailwind = require("@formkit/themes/tailwindcss");

module.exports = {
  content: ["./docs/**/*.{md,vue,ts}", "./src/**/*.{vue,js,ts}"],
  theme: {
    extend: {},
  },
  plugins: [formKitTailwind],
};
