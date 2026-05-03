import { defineConfig } from "vitepress";
import path from "path";
import tailwindcss from "@tailwindcss/postcss";
import autoprefixer from "autoprefixer";

const base = process.env.PUBLIC_BASE || "/";

export default defineConfig({
  title: "versa-stack/v-craft",
  description: "An attempt to deliver a Vue.js 3 page editor library.",
  base,
  srcDir: ".",
  outDir: ".vitepress/dist",
  cacheDir: ".vitepress/cache",
  themeConfig: {
    aside: true,
    socialLinks: [
      { icon: "github", link: "https://github.com/versa-stack/v-craft" },
    ],
    nav: [
      {
        text: "Versions",
        items: [{ text: "develop", link: "/" }],
      },
    ],
    sidebar: [
      { text: "Home", link: "/" },
      { text: "Installation", link: "/installation" },
      { text: "Getting Started", link: "/getting-started" },
      { text: "Editor", link: "/editor" },
      { text: "Viewer", link: "/viewer" },
      { text: "Static Renderer", link: "/static-renderer" },
      { text: "Components", link: "/components" },
      { text: "Blueprints", link: "/blueprints" },
      { text: "Form Configuration", link: "/form-configuration" },
      { text: "Data Wrappers", link: "/data-wrappers" },
      { text: "Advanced Usage", link: "/advanced-usage" },
      { text: "Customized Editor", link: "/custom-editor" },
    ],
  },

  rewrites: {
    "CONTRIBUTING.md": "/CONTRIBUTING.md",
    LICENSE: "/LICENSE.md",
  },
  vite: {
    resolve: {
      alias: {
        "@versa-stack/v-craft": path.resolve(__dirname, "../../src"),
      },
    },
    css: {
      postcss: {
        plugins: [tailwindcss, autoprefixer],
      },
    },
    optimizeDeps: {
      include: ["@formkit/vue"],
    },
    ssr: {
      noExternal: ["@formkit/vue"],
    },
    build: {
      cssCodeSplit: true,
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, "index.html"),
          frame: path.resolve(__dirname, ".vitepress/theme/frame.css"),
        },
      },
    },
  },
});
