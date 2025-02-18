# Installation

## Pre-requisites

1. First install vue@3.2.0 or earlier (later versions include Pinia 3 which is not yet compatible)

   ```bash
   npm create vue@3.2.0
   ```
   Make sure to accept typescript and the addition of pinia.

2. Then install the latest version

   ```bash
   npm install @versa-stack/v-craft@alpha

   ```

3. [Install and configure FormKit](https://formkit.com/getting-started/installation)

4. [Install and configure tailwindcss](https://v2.tailwindcss.com/docs/guides/vue-3-vite#setting-up-tailwind-css)

5. Make sure you have also all other peerDependencies installed

   ```bash
   npm i locash-es@4.17.21 uui@10.0.0
   ```

   ::: info
   You won't need the apollo and graphql packages listed in the peerDependencies as these will be removed in future versions
   :::

## Setup

### Register v-craft and formkit

The following setup is taken from the vitepress documentation's own `index.ts` file.
The marked lines are the relevant calls to register v-craft into your application.
Make sure you have also formkit setup properly and added a theme.

<<< @/.vitepress/theme/index.ts{2,6,8,18,19-26}

### Include tailwindcss

Create a `custom.css` file and add the following first 3 lines to it if you haven't done that already during the tailwindcss setup.

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```
