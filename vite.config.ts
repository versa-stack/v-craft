const path = require("path");
const { defineConfig } = require("vite");
import vue from "@vitejs/plugin-vue";
import { optimizeDeps } from "vite";
import dts from "vite-plugin-dts";

const packageName = "v-craft";

module.exports = defineConfig({
  plugins: [vue(), dts()],
  optimizeDeps: {
    include: ["@apollo/client/core"],
  },
  
  build: {
    sourcemap: true,
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      fileName: (format) => `${packageName}.${format}.js`,
      formats: ["es"],
      name: packageName,
    },
    rollupOptions: {
      external: [
        "@apollo/client",
        "@vue/apollo-composable",
        "@fortawesome/fontawesome-svg-core",
        "@fortawesome/free-solid-svg-icons",
        "@fortawesome/vue-fontawesome",
        "lodash",
        "pinia",
        "uuid",
        "vue",
        "react",
      ],
      output: {
        exports: "named",
        globals: {
          vue: "Vue",
        },
      },
    },
    emptyOutDir: false,
  },
});
