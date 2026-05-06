## [0.9.0-beta.7](https://github.com/versa-stack/v-craft/compare/v0.9.0-beta.6...v0.9.0-beta.7) (2026-05-06)

### 🐛 Bug Fixes

* explicitly exclude PR refs from release job ([c29b6e2](https://github.com/versa-stack/v-craft/commit/c29b6e20e909d80ac3adaab9a59eee21d0faeaab))
* prevent release job from running on pull requests ([569ea6d](https://github.com/versa-stack/v-craft/commit/569ea6d57af87dda4804fe5977582cde001d7723))

## [0.9.0-beta.6](https://github.com/versa-stack/v-craft/compare/v0.9.0-beta.5...v0.9.0-beta.6) (2026-05-06)

### 🐛 Bug Fixes

* remove NPM registry configuration from test workflow ([83dd642](https://github.com/versa-stack/v-craft/commit/83dd6422db576e24b47f5f4571d92289059cf7e2))
* update workflow for npm publishing on release branches ([a759332](https://github.com/versa-stack/v-craft/commit/a759332a58d619cdb55871b7932adec54f5e67db))

## [0.9.0-beta.5](https://github.com/versa-stack/v-craft/compare/v0.9.0-beta.4...v0.9.0-beta.5) (2026-05-06)

### 🐛 Bug Fixes

* update package.json version to match beta branch ([912a4e6](https://github.com/versa-stack/v-craft/commit/912a4e69ff50e4ea2c76a9bf059217168fcf6c6f))

## [0.9.0-beta.4](https://github.com/versa-stack/v-craft/compare/v0.9.0-beta.3...v0.9.0-beta.4) (2026-05-06)

### 🐛 Bug Fixes

* verify beta release versioning ([1e7df9d](https://github.com/versa-stack/v-craft/commit/1e7df9dcb990b25a03e6469bb6157db79230d849))

## [0.9.0-beta.3](https://github.com/versa-stack/v-craft/compare/v0.9.0-beta.2...v0.9.0-beta.3) (2026-05-06)

### 🐛 Bug Fixes

* remove --no-ci flag and unnecessary git config for correct branch detection ([9f04947](https://github.com/versa-stack/v-craft/commit/9f04947d5afd5938eaa75c389dcd495b21cde57e))
* use --branches flag to explicitly tell semantic-release to use beta branch ([f381ed8](https://github.com/versa-stack/v-craft/commit/f381ed8384ac66c835123f2b00143cd02122f780))

## [0.9.0-beta.2](https://github.com/versa-stack/v-craft/compare/v0.9.0-beta.1...v0.9.0-beta.2) (2026-05-06)

### 🐛 Bug Fixes

* add BRANCH env var to semantic-release for correct branch detection ([a187c88](https://github.com/versa-stack/v-craft/commit/a187c885a84ef7e8cf3aaa158074871dec02cab2))

## [0.9.0-beta.1](https://github.com/versa-stack/v-craft/compare/v0.1.0-beta.1...v0.9.0-beta.1) (2026-05-06)

### 🐛 Bug Fixes

* add develop to release job condition (alpha branch) ([821984d](https://github.com/versa-stack/v-craft/commit/821984d80134534cf99df7f6ded4279ca3042e09))
* add ref to checkout for correct branch detection in semantic-release ([0cb4471](https://github.com/versa-stack/v-craft/commit/0cb4471e8b39692022d7a84b9eb99e8f7c1a1954))

## [0.1.0-beta.1](https://github.com/versa-stack/v-craft/compare/v0.0.11...v0.1.0-beta.1) (2026-05-06)

### ✨ Features

* add agent instructions and reorganize FormKit configuration ([217b324](https://github.com/versa-stack/v-craft/commit/217b32409cf78c7cf2dd02f121ffd0e025b60e70))
* add iframe load event emission and improve static rendering with optional editor support ([8a51b7f](https://github.com/versa-stack/v-craft/commit/8a51b7fa519fd84cd7ff4f54cf5f06a9d7a9eb9b))
* add rc (release candidate) channel configuration ([e884bcc](https://github.com/versa-stack/v-craft/commit/e884bccf471084cbca88b057a4b619371c690114))
* add trailing slash to PUBLIC_BASE path in docs workflow ([0c15bbf](https://github.com/versa-stack/v-craft/commit/0c15bbf218431b00d507c05152639e6303957dba))
* Added draggingDisabled flag to editor to allow for inline editing with SimplTextComponent. ([4b611bf](https://github.com/versa-stack/v-craft/commit/4b611bf733e3f7582ffef27b1503199f1d2302ab))
* added iframe option to CraftFrame component. ([#20](https://github.com/versa-stack/v-craft/issues/20)) ([22c146b](https://github.com/versa-stack/v-craft/commit/22c146b962ac9982b9e7a55b03de563d40c8b102))
* Allow override of CraftEditorPanelLayout ([069e2be](https://github.com/versa-stack/v-craft/commit/069e2beb21f902444d6a9afa9837538f1d7d5e73))
* configure semantic-release channels ([86cdff3](https://github.com/versa-stack/v-craft/commit/86cdff3382b497809dd16fed95fdd4a21aaa85fd))
* Custom editor layout and panels. ([8e493b5](https://github.com/versa-stack/v-craft/commit/8e493b5bc6f878cce42f686a053303f408e47d17))
* Enabled prewrapping for simple text component to preserve whitespace. ([c4d593a](https://github.com/versa-stack/v-craft/commit/c4d593a18b4ddb66a945453ae6388a2307413125))
* removed graphql and data components. will be provided in external packages. ([912449f](https://github.com/versa-stack/v-craft/commit/912449fe15d1b14a20e00e65b47ce0025e91037e))
* Reworked simple text component for inline editing. ([a318be8](https://github.com/versa-stack/v-craft/commit/a318be874a37f5576afc32a9f56304134db11f82))

### 🐛 Bug Fixes

* added beta release to docs. ([69149f5](https://github.com/versa-stack/v-craft/commit/69149f55fbe6a2b4be28917e6ed7063674d17b5e))
* Added release commit. ([d33990c](https://github.com/versa-stack/v-craft/commit/d33990ca11ead9bd92b7ca80c8235bb70ab113c3))
* adjust iframe width calculation and improve height measurement accuracy ([1ebe42a](https://github.com/versa-stack/v-craft/commit/1ebe42aff7576a56400858dcbf3e3fcce4323ba5))
* checkout branch from triggering workflow in Release workflow ([96a6e17](https://github.com/versa-stack/v-craft/commit/96a6e178510fcfe9b4d055d17383a1c22ce11dad))
* convert Release to reusable workflow to avoid workflow_run branch bug ([90c56cc](https://github.com/versa-stack/v-craft/commit/90c56cc8cdcf32762f1f72be708d141cb6ce438f))
* correct base path for GitHub Pages deployment ([ca72c7c](https://github.com/versa-stack/v-craft/commit/ca72c7c12769a8b42d0a7f209e57568d1fc412bd))
* correct stylesheet link attributes in VitePress build ([0c7d0fd](https://github.com/versa-stack/v-craft/commit/0c7d0fd081dc75b211b79fc465bf3e082aa43577))
* correct Tailwind CSS v4 import syntax ([267710f](https://github.com/versa-stack/v-craft/commit/267710f86ef70c3e9b4ee5c90eb6b984276095d3))
* correct Tailwind CSS v4 import syntax ([0864cc7](https://github.com/versa-stack/v-craft/commit/0864cc76b464bf42dff762cc12a0c0caf7a62868))
* craftnode events passes editor now directly with the context. ([42a6d56](https://github.com/versa-stack/v-craft/commit/42a6d563cf7477075b9686db20dbf9d5c731f9a0))
* deploy docs to /v-craft/ root without branch subfolder ([7e7fca4](https://github.com/versa-stack/v-craft/commit/7e7fca4e8cea12cc22098e462c457f668920c311))
* deploy release ([299610a](https://github.com/versa-stack/v-craft/commit/299610ab326de742df62a962b59119f089266384))
* deploy release ([85d3284](https://github.com/versa-stack/v-craft/commit/85d32843fbb94ac6131197948c5d5d0bfdef64a7))
* export EditorStoreInstanceType for type inference ([14d3573](https://github.com/versa-stack/v-craft/commit/14d357303c16e4debe1b4e51bd580df458d05c4b))
* fixed build errors and changed package type to module. ([c50b249](https://github.com/versa-stack/v-craft/commit/c50b249d27459aec86a8ba1729d47afe6db16232))
* Fixed disappearing element when dropping it as its own sibling. ([62238e1](https://github.com/versa-stack/v-craft/commit/62238e17ae7b1f8776a2da250816158eeadfc81b))
* Fixed faulty css export in package. ([232a2b2](https://github.com/versa-stack/v-craft/commit/232a2b2f2db75c5483ac86b7169b953c57a22ea6))
* Fixed missing resolver within node viewer and editor. ([159fe58](https://github.com/versa-stack/v-craft/commit/159fe580ae6bb0db527c71329980ee02c1e7ca18))
* fixed node insert mistakes when checking for index ([0810638](https://github.com/versa-stack/v-craft/commit/0810638aeed317f736846b342a010b95920d6735))
* improve CraftCanvas component resolution and remove unnecessary resolver configuration ([7dde064](https://github.com/versa-stack/v-craft/commit/7dde064e601f75f28422e38302ea1151ed828ad0))
* improve CSS handling and optimize reactivity in editor components ([a4bb9fc](https://github.com/versa-stack/v-craft/commit/a4bb9fc120d550ea6008cca150c445682dca8b92))
* improved node visibility handling. ([a35d82e](https://github.com/versa-stack/v-craft/commit/a35d82e6eda9ac7b4bd536340bfa2ea58eac6529))
* inline release steps in test workflow to avoid workflow_run bug ([76e30ab](https://github.com/versa-stack/v-craft/commit/76e30ab5cdc4302c26baa039fe68d3cfda2de101))
* moved tests to run before build. ([e8a310e](https://github.com/versa-stack/v-craft/commit/e8a310ea4acb88798c760678b7f3d1cb946ebd08))
* only deploy docs to GitHub Pages from main branch ([4f45c87](https://github.com/versa-stack/v-craft/commit/4f45c872241ae038681800e721eb19b4415594ca))
* optimize slot rendering to skip empty slots for non-canvas nodes ([11cf9ca](https://github.com/versa-stack/v-craft/commit/11cf9ca682b4520fda0f0055f152fc89ee46b5bf))
* prevent rendering children for void HTML elements and remove withBase wrapper from CSS imports ([479187f](https://github.com/versa-stack/v-craft/commit/479187f081f557f3b812e741d9a52d3cedbcdafa))
* refactor CraftStaticRenderer to use CraftNodeViewer component ([b736f22](https://github.com/versa-stack/v-craft/commit/b736f22d619319b00e826eb39965c2848d4f2975))
* release management. ([741cd63](https://github.com/versa-stack/v-craft/commit/741cd6334f81df8e50514db8f04d3735f271d440))
* remove branch filtering from workflow_run trigger and add job condition ([a54b21b](https://github.com/versa-stack/v-craft/commit/a54b21b0e8a058cde9b7b49d7dfe9ef90723a68b))
* remove console logs and refactor iframe height calculation logic ([f05d0e0](https://github.com/versa-stack/v-craft/commit/f05d0e088231d48473192cd43ff8fdd5193bc70a))
* remove extra function call from useEditor invocations ([1066078](https://github.com/versa-stack/v-craft/commit/10660780351ccee38343c13bf014a3780dfc71ef))
* remove redundant watch on hasNodes in useCraftFrame ([b670d4e](https://github.com/versa-stack/v-craft/commit/b670d4eea541f3e070e90a860169de45a71c90f9))
* remove unnecessary double invocation of useEditor composable ([27627aa](https://github.com/versa-stack/v-craft/commit/27627aaaebe88c8abe4e82f219f7cec73ab04ef8))
* Removed CraftNodeWrapper for better performance in the frontend. ([172f34c](https://github.com/versa-stack/v-craft/commit/172f34c4bb82674c4cab47206b1489daa607d691))
* replace watchEffect with onMounted and watch in useConnectCraftNodeToStore ([ff03154](https://github.com/versa-stack/v-craft/commit/ff03154343dfb5bc0b554d074dfbcde11b4c6660))
* resolve stylesheet preload issue in VitePress build ([179e96f](https://github.com/versa-stack/v-craft/commit/179e96fa7b8312431a72b3f6445808700f146819))
* restore buildEnd hook to fix VitePress stylesheet loading issue ([a108df0](https://github.com/versa-stack/v-craft/commit/a108df0bcb3ea2a3a3cdbf336e2270d6966fb4a2))
* restrict docs deployment to main branch only ([9201af7](https://github.com/versa-stack/v-craft/commit/9201af782bc6a44e17d74d6a12cfef733327433a))
* simplify blueprintsWithDefaults to use map instead of forEach ([3fd60fb](https://github.com/versa-stack/v-craft/commit/3fd60fbc208fcad4a32511d186fd7298b66ee8fd))
* test stage in ci. ([1da6fd4](https://github.com/versa-stack/v-craft/commit/1da6fd44427e2fdd9ee212d0af1d2f9cc6335ca2))
* use style.css with full Tailwind CSS for production builds ([ae8392b](https://github.com/versa-stack/v-craft/commit/ae8392b57a5e327b18d0ad1b14e9de2fbe83a8a6))
* use traditional Tailwind CSS directives for VitePress compatibility ([d593855](https://github.com/versa-stack/v-craft/commit/d5938554917fc7de288dec07ce6158d4ec97e885))

## [0.1.0-alpha.29](https://github.com/versa-stack/v-craft/compare/v0.1.0-alpha.28...v0.1.0-alpha.29) (2026-05-06)

### ✨ Features

* configure semantic-release channels ([86cdff3](https://github.com/versa-stack/v-craft/commit/86cdff3382b497809dd16fed95fdd4a21aaa85fd))

## [0.1.0-alpha.31](https://github.com/versa-stack/v-craft/compare/v0.1.0-alpha.30...v0.1.0-alpha.31) (2026-05-06)

### 🐛 Bug Fixes

* add repository url to package.json for provenance validation ([eba0656](https://github.com/versa-stack/v-craft/commit/eba0656970822488b4998279c00b04e1726204ee))

## [0.1.0-alpha.30](https://github.com/versa-stack/v-craft/compare/v0.1.0-alpha.29...v0.1.0-alpha.30) (2026-05-06)

### ✨ Features

* fix npm publish tag to use channel instead of gitTag ([9a92062](https://github.com/versa-stack/v-craft/commit/9a92062702b647129018d68bdd37ee5ee7382c54))

## [0.1.0-alpha.29](https://github.com/versa-stack/v-craft/compare/v0.1.0-alpha.28...v0.1.0-alpha.29) (2026-05-06)

### ✨ Features

* release trigger ([d1c788a](https://github.com/versa-stack/v-craft/commit/d1c788ae1af2b9f916f8636fc1f8307a895df2a5))

## [0.1.0-alpha.28](https://github.com/versa-stack/v-craft/compare/v0.1.0-alpha.27...v0.1.0-alpha.28) (2026-05-05)

### ✨ Features

* add agent instructions and reorganize FormKit configuration ([217b324](https://github.com/versa-stack/v-craft/commit/217b32409cf78c7cf2dd02f121ffd0e025b60e70))
* add iframe load event emission and improve static rendering with optional editor support ([8a51b7f](https://github.com/versa-stack/v-craft/commit/8a51b7fa519fd84cd7ff4f54cf5f06a9d7a9eb9b))

### 🐛 Bug Fixes

* adjust iframe width calculation and improve height measurement accuracy ([1ebe42a](https://github.com/versa-stack/v-craft/commit/1ebe42aff7576a56400858dcbf3e3fcce4323ba5))
* optimize slot rendering to skip empty slots for non-canvas nodes ([11cf9ca](https://github.com/versa-stack/v-craft/commit/11cf9ca682b4520fda0f0055f152fc89ee46b5bf))
* remove console logs and refactor iframe height calculation logic ([f05d0e0](https://github.com/versa-stack/v-craft/commit/f05d0e088231d48473192cd43ff8fdd5193bc70a))

## [0.1.0-alpha.27](https://github.com/versa-stack/v-craft/compare/v0.1.0-alpha.26...v0.1.0-alpha.27) (2025-12-06)

### 🐛 Bug Fixes

* prevent rendering children for void HTML elements and remove withBase wrapper from CSS imports ([479187f](https://github.com/versa-stack/v-craft/commit/479187f081f557f3b812e741d9a52d3cedbcdafa))

## [0.1.0-alpha.26](https://github.com/versa-stack/v-craft/compare/v0.1.0-alpha.25...v0.1.0-alpha.26) (2025-12-06)

### 🐛 Bug Fixes

* improve CraftCanvas component resolution and remove unnecessary resolver configuration ([7dde064](https://github.com/versa-stack/v-craft/commit/7dde064e601f75f28422e38302ea1151ed828ad0))

## [0.1.0-alpha.25](https://github.com/versa-stack/v-craft/compare/v0.1.0-alpha.24...v0.1.0-alpha.25) (2025-12-06)

### 🐛 Bug Fixes

* refactor CraftStaticRenderer to use CraftNodeViewer component ([b736f22](https://github.com/versa-stack/v-craft/commit/b736f22d619319b00e826eb39965c2848d4f2975))

## [0.1.0-alpha.24](https://github.com/versa-stack/v-craft/compare/v0.1.0-alpha.23...v0.1.0-alpha.24) (2025-12-06)

### 🐛 Bug Fixes

* export EditorStoreInstanceType for type inference ([14d3573](https://github.com/versa-stack/v-craft/commit/14d357303c16e4debe1b4e51bd580df458d05c4b))

## [0.1.0-alpha.23](https://github.com/versa-stack/v-craft/compare/v0.1.0-alpha.22...v0.1.0-alpha.23) (2025-12-04)

### 🐛 Bug Fixes

* simplify blueprintsWithDefaults to use map instead of forEach ([3fd60fb](https://github.com/versa-stack/v-craft/commit/3fd60fbc208fcad4a32511d186fd7298b66ee8fd))

## [0.1.0-alpha.22](https://github.com/versa-stack/v-craft/compare/v0.1.0-alpha.21...v0.1.0-alpha.22) (2025-12-03)

### 🐛 Bug Fixes

* improve CSS handling and optimize reactivity in editor components ([a4bb9fc](https://github.com/versa-stack/v-craft/commit/a4bb9fc120d550ea6008cca150c445682dca8b92))

## [0.1.0-alpha.21](https://github.com/versa-stack/v-craft/compare/v0.1.0-alpha.20...v0.1.0-alpha.21) (2025-12-03)

### 🐛 Bug Fixes

* replace watchEffect with onMounted and watch in useConnectCraftNodeToStore ([ff03154](https://github.com/versa-stack/v-craft/commit/ff03154343dfb5bc0b554d074dfbcde11b4c6660))

## [0.1.0-alpha.20](https://github.com/versa-stack/v-craft/compare/v0.1.0-alpha.19...v0.1.0-alpha.20) (2025-12-03)

### 🐛 Bug Fixes

* remove redundant watch on hasNodes in useCraftFrame ([b670d4e](https://github.com/versa-stack/v-craft/commit/b670d4eea541f3e070e90a860169de45a71c90f9))

## [0.1.0-alpha.19](https://github.com/versa-stack/v-craft/compare/v0.1.0-alpha.18...v0.1.0-alpha.19) (2025-11-06)

### 🐛 Bug Fixes

* use style.css with full Tailwind CSS for production builds ([ae8392b](https://github.com/versa-stack/v-craft/commit/ae8392b57a5e327b18d0ad1b14e9de2fbe83a8a6))

## [0.1.0-alpha.18](https://github.com/versa-stack/v-craft/compare/v0.1.0-alpha.17...v0.1.0-alpha.18) (2025-11-06)

### 🐛 Bug Fixes

* restore buildEnd hook to fix VitePress stylesheet loading issue ([a108df0](https://github.com/versa-stack/v-craft/commit/a108df0bcb3ea2a3a3cdbf336e2270d6966fb4a2))

## [0.1.0-alpha.17](https://github.com/versa-stack/v-craft/compare/v0.1.0-alpha.16...v0.1.0-alpha.17) (2025-11-06)

### 🐛 Bug Fixes

* correct Tailwind CSS v4 import syntax ([267710f](https://github.com/versa-stack/v-craft/commit/267710f86ef70c3e9b4ee5c90eb6b984276095d3))
* use traditional Tailwind CSS directives for VitePress compatibility ([d593855](https://github.com/versa-stack/v-craft/commit/d5938554917fc7de288dec07ce6158d4ec97e885))

## [0.1.0-alpha.16](https://github.com/versa-stack/v-craft/compare/v0.1.0-alpha.15...v0.1.0-alpha.16) (2025-11-06)

### 🐛 Bug Fixes

* correct Tailwind CSS v4 import syntax ([0864cc7](https://github.com/versa-stack/v-craft/commit/0864cc76b464bf42dff762cc12a0c0caf7a62868))

## [0.1.0-alpha.15](https://github.com/versa-stack/v-craft/compare/v0.1.0-alpha.14...v0.1.0-alpha.15) (2025-11-06)

### 🐛 Bug Fixes

* correct base path for GitHub Pages deployment ([ca72c7c](https://github.com/versa-stack/v-craft/commit/ca72c7c12769a8b42d0a7f209e57568d1fc412bd))

## [0.1.0-alpha.14](https://github.com/versa-stack/v-craft/compare/v0.1.0-alpha.13...v0.1.0-alpha.14) (2025-11-06)

### 🐛 Bug Fixes

* deploy docs to /v-craft/ root without branch subfolder ([7e7fca4](https://github.com/versa-stack/v-craft/commit/7e7fca4e8cea12cc22098e462c457f668920c311))

## [0.1.0-alpha.13](https://github.com/versa-stack/v-craft/compare/v0.1.0-alpha.12...v0.1.0-alpha.13) (2025-11-05)

### 🐛 Bug Fixes

* correct stylesheet link attributes in VitePress build ([0c7d0fd](https://github.com/versa-stack/v-craft/commit/0c7d0fd081dc75b211b79fc465bf3e082aa43577))

## [0.1.0-alpha.12](https://github.com/versa-stack/v-craft/compare/v0.1.0-alpha.11...v0.1.0-alpha.12) (2025-11-05)

### 🐛 Bug Fixes

* resolve stylesheet preload issue in VitePress build ([179e96f](https://github.com/versa-stack/v-craft/commit/179e96fa7b8312431a72b3f6445808700f146819))

## [0.1.0-alpha.11](https://github.com/versa-stack/v-craft/compare/v0.1.0-alpha.10...v0.1.0-alpha.11) (2025-11-05)

### 🐛 Bug Fixes

* remove extra function call from useEditor invocations ([1066078](https://github.com/versa-stack/v-craft/commit/10660780351ccee38343c13bf014a3780dfc71ef))

## [0.1.0-alpha.10](https://github.com/versa-stack/v-craft/compare/v0.1.0-alpha.9...v0.1.0-alpha.10) (2025-11-05)

### ✨ Features

* add trailing slash to PUBLIC_BASE path in docs workflow ([0c15bbf](https://github.com/versa-stack/v-craft/commit/0c15bbf218431b00d507c05152639e6303957dba))

## [0.1.0-alpha.9](https://github.com/versa-stack/v-craft/compare/v0.1.0-alpha.8...v0.1.0-alpha.9) (2025-11-05)

### 🐛 Bug Fixes

* remove unnecessary double invocation of useEditor composable ([27627aa](https://github.com/versa-stack/v-craft/commit/27627aaaebe88c8abe4e82f219f7cec73ab04ef8))

## [0.1.0-alpha.8](https://github.com/versa-stack/v-craft/compare/v0.1.0-alpha.7...v0.1.0-alpha.8) (2025-06-18)

### ✨ Features

* added iframe option to CraftFrame component. ([#20](https://github.com/versa-stack/v-craft/issues/20)) ([22c146b](https://github.com/versa-stack/v-craft/commit/22c146b962ac9982b9e7a55b03de563d40c8b102))

## [0.1.0-alpha.7](https://github.com/versa-stack/v-craft/compare/v0.1.0-alpha.6...v0.1.0-alpha.7) (2025-04-05)

### ✨ Features

* Custom editor layout and panels. ([8e493b5](https://github.com/versa-stack/v-craft/commit/8e493b5bc6f878cce42f686a053303f408e47d17))

## [0.1.0-alpha.6](https://github.com/versa-stack/v-craft/compare/v0.1.0-alpha.5...v0.1.0-alpha.6) (2025-04-05)

### ✨ Features

* Allow override of CraftEditorPanelLayout ([069e2be](https://github.com/versa-stack/v-craft/commit/069e2beb21f902444d6a9afa9837538f1d7d5e73))

## [0.1.0-alpha.5](https://github.com/versa-stack/v-craft/compare/v0.1.0-alpha.4...v0.1.0-alpha.5) (2025-03-14)

### 🐛 Bug Fixes

* Fixed faulty css export in package. ([232a2b2](https://github.com/versa-stack/v-craft/commit/232a2b2f2db75c5483ac86b7169b953c57a22ea6))

## [0.1.0-alpha.4](https://github.com/versa-stack/v-craft/compare/v0.1.0-alpha.3...v0.1.0-alpha.4) (2025-03-14)

### ✨ Features

- Enabled prewrapping for simple text component to preserve whitespace. ([c4d593a](https://github.com/versa-stack/v-craft/commit/c4d593a18b4ddb66a945453ae6388a2307413125))

## [0.1.0-alpha.3](https://github.com/versa-stack/v-craft/compare/v0.1.0-alpha.2...v0.1.0-alpha.3) (2025-03-14)

### ✨ Features

- Added draggingDisabled flag to editor to allow for inline editing with SimplTextComponent. ([4b611bf](https://github.com/versa-stack/v-craft/commit/4b611bf733e3f7582ffef27b1503199f1d2302ab))

### 🐛 Bug Fixes

- fixed build errors and changed package type to module. ([c50b249](https://github.com/versa-stack/v-craft/commit/c50b249d27459aec86a8ba1729d47afe6db16232))
- Fixed disappearing element when dropping it as its own sibling. ([62238e1](https://github.com/versa-stack/v-craft/commit/62238e17ae7b1f8776a2da250816158eeadfc81b))

## [0.1.0-alpha.2](https://github.com/versa-stack/v-craft/compare/v0.1.0-alpha.1...v0.1.0-alpha.2) (2024-11-18)

### ✨ Features

- removed graphql and data components. will be provided in external packages. ([912449f](https://github.com/versa-stack/v-craft/commit/912449fe15d1b14a20e00e65b47ce0025e91037e))

## [0.1.0-alpha.1](https://github.com/versa-stack/v-craft/compare/v0.0.12-alpha.4...v0.1.0-alpha.1) (2024-11-05)

### 🐛 Bug Fixes

- Fixed missing resolver within node viewer and editor. ([159fe58](https://github.com/versa-stack/v-craft/commit/159fe580ae6bb0db527c71329980ee02c1e7ca18))

### ✨ Features

- Reworked simple text component for inline editing. ([a318be8](https://github.com/versa-stack/v-craft/commit/a318be874a37f5576afc32a9f56304134db11f82))

## [0.0.12-alpha.4](https://github.com/versa-stack/v-craft/compare/v0.0.12-alpha.3...v0.0.12-alpha.4) (2024-11-03)

### 🐛 Bug Fixes

- Removed CraftNodeWrapper for better performance in the frontend. ([172f34c](https://github.com/versa-stack/v-craft/commit/172f34c4bb82674c4cab47206b1489daa607d691))

## [0.0.12-alpha.3](https://github.com/versa-stack/v-craft/compare/v0.0.12-alpha.2...v0.0.12-alpha.3) (2024-10-29)

### 🐛 Bug Fixes

- craftnode events passes editor now directly with the context. ([42a6d56](https://github.com/versa-stack/v-craft/commit/42a6d563cf7477075b9686db20dbf9d5c731f9a0))
- improved node visibility handling. ([a35d82e](https://github.com/versa-stack/v-craft/commit/a35d82e6eda9ac7b4bd536340bfa2ea58eac6529))

## [0.0.12-alpha.2](https://github.com/versa-stack/v-craft/compare/v0.0.12-alpha.1...v0.0.12-alpha.2) (2024-10-29)

### 🐛 Bug Fixes

- fixed node insert mistakes when checking for index ([0810638](https://github.com/versa-stack/v-craft/commit/0810638aeed317f736846b342a010b95920d6735))

## [0.0.12-alpha.1](https://github.com/versa-stack/v-craft/compare/v0.0.11...v0.0.12-alpha.1) (2024-10-26)

### 🐛 Bug Fixes

- moved tests to run before build. ([e8a310e](https://github.com/versa-stack/v-craft/commit/e8a310ea4acb88798c760678b7f3d1cb946ebd08))
- test stage in ci. ([1da6fd4](https://github.com/versa-stack/v-craft/commit/1da6fd44427e2fdd9ee212d0af1d2f9cc6335ca2))
