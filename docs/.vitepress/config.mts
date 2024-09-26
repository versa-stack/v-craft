import { defineConfig } from "vitepress";
import path from "path";

export default defineConfig({
  title: "versa-stack/v-craft",
  base: process.env.PUBLIC_BASE || "/",
  description: "An attempt to deliver a Vue.js 3 page editor library.",

  themeConfig: {
    base: process.env.GITHUB_REF === "refs/heads/develop" ? "/develop/" : "/",
    repo: "https://github.com/versa-stack/v-craft",
    docsDir: "docs",
    editLinks: true,
    editLinkText: "Edit this page on Github",
    lastUpdated: "Last Updated",
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

  vite: {
    resolve: {
      alias: {
        "@versa-stack/v-craft": path.resolve(__dirname, "../../src"),
      },
    },
    // optimizeDeps: {
    //   include: [
    //     "lodash-es",
    //     "@apollo/client",
    //     "@formkit/vue",
    //     "@fortawesome/fontawesome-svg-core",
    //     "@fortawesome/free-regular-svg-icons",
    //     "@fortawesome/free-solid-svg-icons",
    //     "@fortawesome/vue-fontawesome",
    //     "@vue/apollo-composable",
    //     "graphql",
    //     "graphql-tag",
    //     "monaco-editor",
    //     "monaco-editor-vue3",
    //     "pinia",
    //     "uuid",
    //     "jsonpath",
    //   ],
    // },
    // ssr: {
    //   noExternal: [
    //     "lodash-es",
    //     "@apollo/client",
    //     "@formkit/vue",
    //     "@fortawesome/fontawesome-svg-core",
    //     "@fortawesome/free-regular-svg-icons",
    //     "@fortawesome/free-solid-svg-icons",
    //     "@fortawesome/vue-fontawesome",
    //     "@vue/apollo-composable",
    //     "graphql",
    //     "graphql-tag",
    //     "monaco-editor-vue3",
    //     "pinia",
    //     "uuid",
    //     "jsonpath",
    //   ],
    // },
    // build: {
    //   commonjsOptions: {
    //     include: [/node_modules/],
    //   },
    // },
  },
});
