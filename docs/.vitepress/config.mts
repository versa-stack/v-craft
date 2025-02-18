import { defineConfig } from "vitepress";
import path from "path";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";

export default defineConfig({
  title: "versa-stack/v-craft",
  base: process.env.PUBLIC_BASE || "/",
  description: "An attempt to deliver a Vue.js 3 page editor library.",

  themeConfig: {
    aside: true,
    socialLinks: [
      {icon: "github", link: "https://github.com/versa-stack/v-craft"},
    ],
    nav: [
      {
        text: "Versions",
        items: [
          { text: "develop", link: `${process.env.PUBLIC_BASE ?? '/'}` },
        ],
      },
    ],
    sidebar: [
      { text: "Home", link: "/" },
      { text: "Installation", link: "/installation" },
      { text: "Editor", link: "/editor" },
      { text: "Viewer", link: "/viewer" },
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
