import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, "../docs/.vitepress/dist");
const base = process.env.PUBLIC_BASE || "/";

function injectTailwindCSS() {
  try {
    const assetsDir = path.join(distDir, "assets");
    const files = fs.readdirSync(assetsDir);
    
    // Prefer style.css (which has Tailwind), fallback to largest frame.css
    const styleFiles = files.filter((f) => f.startsWith("style.") && f.endsWith(".css"));
    const frameFiles = files.filter((f) => f.startsWith("frame.") && f.endsWith(".css"));
    
    let cssFile;
    if (styleFiles.length > 0) {
      cssFile = styleFiles[0];
    } else if (frameFiles.length > 0) {
      // Get the largest frame CSS file
      let largestFile = frameFiles[0];
      let largestSize = fs.statSync(path.join(assetsDir, frameFiles[0])).size;
      
      for (const file of frameFiles) {
        const size = fs.statSync(path.join(assetsDir, file)).size;
        if (size > largestSize) {
          largestSize = size;
          largestFile = file;
        }
      }
      cssFile = largestFile;
    } else {
      return;
    }

    const cssLink = `    <link rel="stylesheet" href="${base}assets/${cssFile}">`;
    function walkDir(dir) {
      const files = fs.readdirSync(dir);
      for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
          walkDir(filePath);
        } else if (file.endsWith(".html")) {
          let content = fs.readFileSync(filePath, "utf-8");

          if (!content.includes(`${base}assets/${cssFile}`)) {
            content = content.replace("</head>", `${cssLink}\n  </head>`);
            fs.writeFileSync(filePath, content);
            console.log(`✓ Injected CSS into ${path.relative(distDir, filePath)}`);
          }
        }
      }
    }

    walkDir(distDir);
    console.log(`✓ CSS injection completed successfully`);
  } catch (error) {
    console.error("Error injecting CSS:", error);
    process.exit(1);
  }
}

injectTailwindCSS();
