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
        "@vue/apollo-composable",
        "graphql",
        "graphql-tag",
        "lodash-es",
        "pinia",
        "uuid",
        "jsonpath",
      ],
      output: {
        globals: {
          vue: "Vue",
          "@apollo/client": "ApolloClient",
          "@formkit/vue": "FormKitVue",
          "@vue/apollo-composable": "VueApolloComposable",
          graphql: "graphql",
          "graphql-tag": "gql",
          "lodash-es": "_",
          pinia: "Pinia",
          uuid: "uuid",
          jsonpath: "jsonpath",
        },
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
      "@vue/apollo-composable",
      "graphql",
      "graphql-tag",
      "lodash-es",
      "pinia",
      "uuid",
      "jsonpath",
    ],
  },
});
