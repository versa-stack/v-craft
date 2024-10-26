/// <reference types="vitest" />
import path from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import dts from "vite-plugin-dts";

const packageName = "v-craft";

export default defineConfig({
  plugins: [
    vue(),
    dts({
      insertTypesEntry: true,
      include: ["src/**/*.ts", "src/**/*.vue"],
      outDir: "dist/types",
    }),
  ],
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
  test: {
    environment: "happy-dom",
    globals: true,
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/**/*.{test,spec}.{js,ts}',
      ],
    },
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
