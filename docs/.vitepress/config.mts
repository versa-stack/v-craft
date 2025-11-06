import { defineConfig } from "vitepress";
import path from "path";
import tailwindcss from "@tailwindcss/postcss";
import autoprefixer from "autoprefixer";
import fs from "fs";

export default defineConfig({
  title: "versa-stack/v-craft",
  base: process.env.PUBLIC_BASE || "/",
  description: "An attempt to deliver a Vue.js 3 page editor library.",


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
      { text: "Components", link: "/components" },
      { text: "Blueprints", link: "/blueprints" },
      { text: "Form Configuration", link: "/form-configuration" },
      { text: "Data Wrappers", link: "/data-wrappers" },
      { text: "Advanced Usage", link: "/advanced-usage" },
      { text: "Editor", link: "/editor" },
      { text: "Customized Editor", link: "/custom-editor" },
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
