import { defineConfig } from "vitepress";
import path from "path";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";

export default defineConfig({
  title: "versa-stack/v-craft",
  base: process.env.PUBLIC_BASE || "/",
  description: "An attempt to deliver a Vue.js 3 page editor library.",

  themeConfig: {
    aside: false,
    nav: [],
    outline: false,
    sidebar: [
      { text: "Installation", link: "/index" },
      { text: "Editor", link: "/editor" },
      { text: "Editor Usage", link: "/editor-usage" },
      { text: "Viewer", link: "/viewer" },
      { text: "Viewer Usage", link: "/viewer-usage" },
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
  },
});
