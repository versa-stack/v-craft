# Getting Started with v-craft

This guide will walk you through the absolute basics of v-craft, step by step. Even if you've never used a page builder before, you'll be creating pages in no time.

## What is v-craft?

v-craft is a Vue.js 3 library that lets you build drag-and-drop page editors. Think of it like LEGO blocks for web pages - you have different components (nodes) that you can drag, drop, and configure to build complete web pages without writing code.

## Installation (Super Simple)

### Step 1: Install the package

Open your terminal and run:

```bash
npm install @versa-stack/v-craft@alpha
```

### Step 2: Import what you need

In your Vue app, import the components:

```javascript
import { 
  CraftEditor, 
  CraftCanvas, 
  CraftComponentSimpleText 
} from '@versa-stack/v-craft'
```

### Step 3: Set up your first editor

Create a file called `MyPageEditor.vue`:

```vue
<template>
  <div>
    <h1>My First Page Editor</h1>
    <CraftEditor :config="editorConfig" />
  </div>
</template>

<script setup>
import { CraftEditor } from '@versa-stack/v-craft'

const editorConfig = {
  blueprintsLibrary: {
    groups: [
      {
        label: "Basic Components",
        blueprints: [
          {
            label: "Text Node",
            componentName: "CraftComponentSimpleText",
            props: {
              content: "Hello World!",
              componentName: "p"
            }
          }
        ]
      }
    ]
  }
}
</script>
```

That's it! You now have a working page editor.

## Your First Component

Let's create a simple component you can drag and drop:

### Step 1: Create the component

Create `MyButton.vue`:

```vue
<template>
  <button :style="{ backgroundColor: color, padding: '10px 20px' }">
    {{ text }}
  </button>
</template>

<script setup>
const props = defineProps({
  text: {
    type: String,
    default: 'Click me!'
  },
  color: {
    type: String,
    default: '#007bff'
  }
})
</script>
```

### Step 2: Register it in your blueprints

Add it to your editor config:

```javascript
const editorConfig = {
  blueprintsLibrary: {
    groups: [
      {
        label: "My Components",
        blueprints: [
          {
            label: "My Button",
            componentName: "MyButton",
            props: {
              text: "Click me!",
              color: "#007bff"
            }
          }
        ]
      }
    ]
  }
}
```

## Next Steps

Now that you have the basics:
1. Learn about [Components](./components)
2. Understand [Blueprints](./blueprints)
3. Learn about [Resolvers](./resolvers)
4. Build [Data Wrappers](./data-wrappers)
