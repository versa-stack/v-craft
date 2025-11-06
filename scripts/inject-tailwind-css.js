import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, "../docs/.vitepress/dist");

function injectTailwindCSS() {
  try {
    const assetsDir = path.join(distDir, "assets");
    const files = fs.readdirSync(assetsDir);
    const styleFiles = files.filter((f) => f.startsWith("style.") && f.endsWith(".css"));
    const frameFiles = files.filter((f) => f.startsWith("frame.") && f.endsWith(".css"));

    if (styleFiles.length === 0 && frameFiles.length === 0) {
      console.log("No CSS files found");
      return;
    }

    const cssLinks = [];

    if (styleFiles.length > 0) {
      const styleFile = styleFiles[0];
      cssLinks.push(`    <link rel="stylesheet" href="/assets/${styleFile}">`);
    }

    if (frameFiles.length > 0) {
      const frameFile = frameFiles[frameFiles.length - 1];
      cssLinks.push(`    <link rel="stylesheet" href="/assets/${frameFile}">`);
    }

    function walkDir(dir) {
      const files = fs.readdirSync(dir);
      for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
          walkDir(filePath);
        } else if (file.endsWith(".html")) {
          let content = fs.readFileSync(filePath, "utf-8");
          let modified = false;

          for (const link of cssLinks) {
            const href = link.match(/href="([^"]+)"/)[1];
            if (!content.includes(href)) {
              content = content.replace("</head>", `${link}\n  </head>`);
              modified = true;
            }
          }

          if (modified) {
            fs.writeFileSync(filePath, content);
            console.log(`✓ Injected CSS into ${path.relative(distDir, filePath)}`);
          }
        }
      }
    }

    walkDir(distDir);

    if (frameFiles.length > 1) {
      const oldFrameFile = frameFiles[0];
      const newFrameFile = frameFiles[frameFiles.length - 1];
      
      if (oldFrameFile !== newFrameFile) {
        console.log(`\n✓ Updating editor CSS reference from ${oldFrameFile} to ${newFrameFile}`);
        
        const jsDir = path.join(distDir, "assets");
        const jsFiles = fs.readdirSync(jsDir).filter((f) => f.endsWith(".js"));
        
        for (const jsFile of jsFiles) {
          const jsPath = path.join(jsDir, jsFile);
          let content = fs.readFileSync(jsPath, "utf-8");
          
          if (content.includes(`/assets/${oldFrameFile}`)) {
            content = content.replaceAll(`/assets/${oldFrameFile}`, `/assets/${newFrameFile}`);
            fs.writeFileSync(jsPath, content);
            console.log(`✓ Updated ${jsFile}`);
          }
        }
      }
    }

    console.log(`✓ CSS links injected successfully`);
  } catch (error) {
    console.error("Error injecting CSS:", error);
    process.exit(1);
  }
}

injectTailwindCSS();
