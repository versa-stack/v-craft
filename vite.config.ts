/// <reference types="vitest" />
import path from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import dts from "vite-plugin-dts";
import tailwindcss from "@tailwindcss/vite";

const packageName = "v-craft";

export default defineConfig({
  plugins: [
    vue(),
    dts({
      insertTypesEntry: true,
      include: ["src/**/*.ts", "src/**/*.vue"],
      outDir: "dist/types",
    }),
    tailwindcss(),
  ],
  build: {
    sourcemap: true,
    minify: "esbuild",
    target: "esnext",
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      fileName: (format) => `${packageName}.${format}.js`,
      formats: ["es"], 
      name: packageName,
    },
    rollupOptions: {
      external: [
        "vue",
        "@formkit/vue",
        "lodash-es",
        "pinia",
        "uuid",
        "jsonpath",
      ],
      output: {
        globals: {
          vue: "Vue",
          "@formkit/vue": "FormKitVue",
          "lodash-es": "_",
          pinia: "Pinia",
          uuid: "uuid",
          jsonpath: "jsonpath",
        },
        interop: "auto",
      },
    },
    commonjsOptions: {
      include: [
        /node_modules/,
        /jsonpath/,
      ],
      transformMixedEsModules: true,
    },
    emptyOutDir: true,
    reportCompressedSize: false,
  },
  test: {
    environment: "happy-dom",
    globals: true,
    coverage: {
      reporter: ["text", "json", "html"],
      exclude: ["node_modules/", "src/**/*.{test,spec}.{js,ts}"],
    },
  },
  optimizeDeps: {
    include: [
      "jsonpath",
      "lodash-es",
    ],
  },
});
