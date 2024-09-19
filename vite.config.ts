const path = require("path");
const { defineConfig } = require("vite");
import vue from "@vitejs/plugin-vue";
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
        "@formkit/vue",
        "@fortawesome/fontawesome-svg-core",
        "@fortawesome/free-regular-svg-icons",
        "@fortawesome/free-solid-svg-icons",
        "@fortawesome/vue-fontawesome",
        "@vue/apollo-composable",
        "graphql",
        "graphql-tag",
        "lodash",
        "monaco-editor",
        "monaco-editor-vue3",
        "pinia",
        "react",
        "uuid",
        "vue",
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
