import { defineConfig } from "vitepress";
import path from "path";

export default defineConfig({
  title: "faasaf/v-craft",
  base: process.env.PUBLIC_BASE || "/",
  description: "An attempt to deliver a Vue.js 3 page editor library.",

  ssr: {
    noExternal: ["@apollo/client", "@vue/apollo-composable"],
  },

  themeConfig: {
    repo: "https://gitlab.com/faasaf/v-craft",
    docsDir: "docs",
    editLinks: true,
    editLinkText: "Edit this page on GitLab",
    lastUpdated: "Last Updated",

    nav: [
      { text: "Home", link: "/" },
      { text: "Guide", link: "/guide/" },
      { text: "API", link: "/api/" },
    ],

    sidebar: [
      { text: "Installation", link: "/index" },
      {
        text: "Usage",
        children: [
          { text: "Editor", link: "/editor" },
          { text: "Editor Usage", link: "/editor-usage" },
          { text: "Viewer", link: "/viewer" },
          { text: "Viewer Usage", link: "/viewer-usage" },
        ],
      },
    ],
  },

  vite: {
    resolve: {
      alias: {
        "@faasaf/v-craft": path.resolve(__dirname, "../../src"),
      },
      dedupe: ["vue"],
    },
    optimizeDeps: {
      include: ["@apollo/client", "@vue/apollo-composable"],
      exclude: ["react"],
    },
    build: {
      commonjsOptions: {
        include: [/node_modules/],
        ignore: ["react"],
      },
    },
    ssr: {
      noExternal: ["@apollo/client", "@vue/apollo-composable"],
    },
  },
});
