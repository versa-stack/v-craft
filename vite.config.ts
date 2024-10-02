const path = require("path");
const { defineConfig } = require("vite");
import vue from "@vitejs/plugin-vue";
import dts from "vite-plugin-dts";

const packageName = "v-craft";

module.exports = defineConfig({
  plugins: [vue(), dts()],
  build: {
    sourcemap: true,
    minify: "esbuild",
    target: "esnext",
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      fileName: (format) => `${packageName}.${format}.js`,
      formats: ["es", "umd"],
      name: packageName,
    },
    rollupOptions: {
      external: [
        "vue",
        "@apollo/client",
        "@formkit/vue",
        "@fortawesome/fontawesome-svg-core",
        "@fortawesome/free-regular-svg-icons",
        "@fortawesome/free-solid-svg-icons",
        "@fortawesome/vue-fontawesome",
        "@vue/apollo-composable",
        "graphql",
        "graphql-tag",
        "lodash-es",
        "monaco-editor",
        "monaco-editor-vue3",
        /^monaco-editor\/.*/,
        "pinia",
        "uuid",
        "jsonpath",
      ],
      output: {
        globals: {
          vue: "Vue",
          "monaco-editor": "monaco"
        },
        manualChunks: undefined,
      },
    },
    commonjsOptions: {
      include: [],
    },
    emptyOutDir: true,
    reportCompressedSize: false,
  },

  optimizeDeps: {
    exclude: [
      "@apollo/client",
      "@formkit/vue",
      "@fortawesome/fontawesome-svg-core",
      "@fortawesome/free-regular-svg-icons",
      "@fortawesome/free-solid-svg-icons",
      "@fortawesome/vue-fontawesome",
      "@vue/apollo-composable",
      "graphql",
      "graphql-tag",
      "lodash-es",
      "monaco-editor",
      "monaco-editor-vue3",
      "pinia",
      "uuid",
      "jsonpath",
    ],
  },
});
