import { defineConfig } from "vitepress";
import path from "path";
import tailwindcss from "@tailwindcss/postcss";
import autoprefixer from "autoprefixer";
import fs from "fs";

export default defineConfig({
  title: "versa-stack/v-craft",
  base: process.env.PUBLIC_BASE || "/",
  description: "An attempt to deliver a Vue.js 3 page editor library.",

  async buildEnd(siteConfig) {
    const distPath = path.resolve(__dirname, 'dist');
    const fixHtmlFiles = (dir: string) => {
      const files = fs.readdirSync(dir);
      files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
          fixHtmlFiles(filePath);
        } else if (file.endsWith('.html')) {
          let content = fs.readFileSync(filePath, 'utf-8');
          content = content.replace(
            /<link rel="preload stylesheet"([^>]*) as="style">/g,
            '<link rel="stylesheet"$1>'
          );
          fs.writeFileSync(filePath, content, 'utf-8');
        }
      });
    };
    if (fs.existsSync(distPath)) {
      fixHtmlFiles(distPath);
    }
  },

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
