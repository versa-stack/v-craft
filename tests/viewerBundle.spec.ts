// @vitest-environment node
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "fs";
import path from "path";
import type { RollupOutput } from "rollup";
import { build } from "vite";
import { afterAll, expect, it } from "vitest";

// A site that only renders pages must not ship the editor (#84): bundle what
// a viewer imports from the built package and look for editor-only code.
const root = path.resolve(__dirname, "..");
const cache = path.join(root, "node_modules/.cache");
mkdirSync(cache, { recursive: true });
const out = mkdtempSync(path.join(cache, "v-craft-viewer-"));
afterAll(() => rmSync(out, { recursive: true, force: true }));

it("viewer imports leave out FormKit and the editor panels", async () => {
  await build({ root, logLevel: "silent", build: { outDir: path.join(out, "dist") } });
  writeFileSync(path.join(out, "package.json"), JSON.stringify(
    { name: "@versa-stack/v-craft", type: "module", sideEffects: ["*.css", "*.scss"], module: "./dist/v-craft.es.js" }));
  const entry = path.join(out, "entry.js");
  writeFileSync(entry, `import { CraftCanvas, CraftComponentSimpleText, CraftNodeResolver, CraftNodeViewer, CraftStaticRenderer, defaultResolvers, useEditor } from "./dist/v-craft.es.js";
console.log(CraftCanvas, CraftComponentSimpleText, CraftNodeResolver, CraftNodeViewer, CraftStaticRenderer, defaultResolvers, useEditor);`);
  const result = (await build({
    configFile: false, logLevel: "silent",
    build: { write: false, minify: false, lib: { entry, formats: ["es"], fileName: "viewer" },
      rollupOptions: { external: [/^vue/, /^pinia/, /^lodash-es/, /^uuid/, /^jsonpath-plus/, /^@formkit/] } },
  })) as RollupOutput[];
  const code = result[0].output[0].code;
  expect(code).toContain("CraftNodeViewer");
  expect(code).not.toContain("@formkit");
  expect(code).not.toContain("CraftEditorPanel");
}, 120_000);
