# Installation

## Pre-requisites

1. First install Vue 3.5 or later

   ```bash
   npm create vue@latest
   ```
   Make sure to accept typescript and the addition of pinia.

2. Then install the latest version

   ```bash
   npm install @versa-stack/v-craft@alpha

   ```

3. [Install and configure FormKit](https://formkit.com/getting-started/installation)

4. [Install and configure tailwindcss](https://v2.tailwindcss.com/docs/guides/vue-3-vite#setting-up-tailwind-css)

## Setup

### Register v-craft and formkit

The following setup is taken from the vitepress documentation's own `index.ts` file.
The marked lines are the relevant calls to register v-craft into your application.
Make sure you have also formkit setup properly and added a theme.

<<< @/.vitepress/theme/index.ts{3,6-8,19-28,30-31}

### Include tailwindcss

Create a `custom.css` file and add the following first 3 lines to it if you haven't done that already during the tailwindcss setup.

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```
