# Understanding Components in v-craft

Think of components as LEGO blocks. Each component is a piece you can use to build your page. This guide will teach you everything about creating and using components.

## What is a Component?

A component in v-craft is a **regular Vue.js component** that can be dragged, dropped, and configured in the page editor. It has:
- **A visual representation** (what users see)
- **Configurable properties** (settings users can change)
- **A blueprint** (tells the editor how to use it)

**Important**: Your Vue components **don't need any special wrapping** - they work exactly like normal Vue components!

## Understanding CraftCanvas: Container Magic

**CraftCanvas is NOT for wrapping your Vue components** - it's only used in **blueprints** for components that should accept child components.

### When to Use CraftCanvas

**Use CraftCanvas in blueprints when:**
- You want users to be able to drop components inside this component
- Your component has a `<slot>` that should accept child components

**Don't use CraftCanvas when:**
- Your component is a simple element (button, image, text)
- Your component doesn't need to contain other components

### How It Works

**Your Vue Component (no changes needed):**
```vue
<!-- ContainerComponent.vue -->
<template>
  <div class="container" :style="{ backgroundColor: bgColor, padding: padding + 'px' }">
    <!-- This slot will receive user-dropped components -->
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
interface Props {
  bgColor: string
  padding: number
}

const props = withDefaults(defineProps<Props>(), {
  bgColor: '#f8f9fa',
  padding: 20
})
</script>
```

**Blueprint (where CraftCanvas is used):**
```typescript
const ContainerBlueprint = {
  label: "Container",
  componentName: "CraftCanvas",  // Only here in the blueprint!
  props: {
    componentName: "ContainerComponent", // Your actual component
    bgColor: "#f8f9fa",
    padding: 20
  },
  //slots: {} // You can add content to slots here 
}
```

**Simple Component (no CraftCanvas needed):**
```typescript
const ButtonBlueprint = {
  label: "Button",
  componentName: "MyButton",  // Direct reference to your component
  props: {
    text: "Click me",
    color: "#007bff"
  },
}
```

## Creating Your First Component

### Step 1: Create the Vue Component

Let's create a simple "Hero Section" component:

```vue
<!-- HeroSection.vue -->
<template>
  <div class="hero" :style="{ backgroundColor: bgColor, color: textColor }">
    <h1>{{ title }}</h1>
    <p>{{ subtitle }}</p>
    <button :style="{ backgroundColor: buttonColor }">
      {{ buttonText }}
    </button>
  </div>
</template>

<script setup>
// These are the properties users can change
const props = defineProps({
  title: {
    type: String,
    default: 'Welcome to My Site'
  },
  subtitle: {
    type: String,
    default: 'This is a hero section'
  },
  buttonText: {
    type: String,
    default: 'Get Started'
  },
  bgColor: {
    type: String,
    default: '#f0f0f0'
  },
  textColor: {
    type: String,
    default: '#333333'
  },
  buttonColor: {
    type: String,
    default: '#007bff'
  }
})
</script>

<style scoped>
.hero {
  padding: 60px 20px;
  text-align: center;
  border-radius: 8px;
}

.hero h1 {
  font-size: 2.5em;
  margin-bottom: 10px;
}

.hero p {
  font-size: 1.2em;
  margin-bottom: 20px;
}

.hero button {
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
}
</style>
```

### Step 2: Register Your Component

Create a file called `my-components.ts`:

```typescript
export const myComponents = {
  HeroSection: {
    label: "Hero Section",
    componentName: "HeroSection",
    props: {
      title: "Welcome to My Amazing Site",
      subtitle: "This is where your awesome content goes",
      buttonText: "Learn More",
      bgColor: "#6366f1",
      textColor: "#ffffff",
      buttonColor: "#8b5cf6"
    },
    slots: {} // No child components allowed
  }
}
```

### Step 3: Use It in Your Editor

```javascript
import { myComponents } from './my-components'

const editorConfig = {
  blueprintsLibrary: {
    groups: [
      {
        label: "Landing Page",
        blueprints: [myComponents.HeroSection]
      }
    ]
  }
}
```

## Component Types

### 1. Simple Components (No Slots)
These are like single LEGO pieces:
- Text blocks
- Images
- Buttons
- Icons

### 2. Container Components (Can Have Slots)
These are like LEGO baseplates:
- Sections
- Columns
- Grids
- Cards

Example container component:

```vue
<!-- CardContainer.vue -->
<template>
  <div class="card" :style="{ backgroundColor: bgColor, padding: padding + 'px' }">
    <h3 v-if="showTitle">{{ title }}</h3>
    <!-- This slot allows child components -->
    <div class="card-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: { type: String, default: 'Card Title' },
  bgColor: { type: String, default: '#ffffff' },
  padding: { type: Number, default: 20 },
  showTitle: { type: Boolean, default: true }
})
</script>
```

## Component Properties Explained

### Property Types

| Type | Description | Example |
|------|-------------|---------|
| `String` | Text input | `"Hello World"` |
| `Number` | Numeric input | `42` |
| `Boolean` | True/false toggle | `true` |
| `Array` | List of items | `["red", "blue", "green"]` |
| `Object` | Complex settings | `{ color: "red", size: "large" }` |

### Properties Are Automatically Detected

**Important:** You don't need to do anything special to make properties editable. v-craft automatically detects properties defined with TypeScript's `defineProps` and makes them available in the editor's property panel.

```typescript
<script setup lang="ts">
interface Props {
  // Text input
  heading: string
  
  // Color picker
  backgroundColor: string
  
  // Number input with slider
  padding: number
  
  // Checkbox
  showBorder: boolean
  
  // Select dropdown
  alignment: 'left' | 'center' | 'right'
}

const props = withDefaults(defineProps<Props>(), {
  heading: 'Section Heading',
  backgroundColor: '#ffffff',
  padding: 20,
  showBorder: true,
  alignment: 'left'
})
</script>
```

The editor automatically creates appropriate input controls based on your TypeScript types:
- `string` → Text input or color picker (if property name includes 'color')
- `number` → Number input with optional slider
- `boolean` → Checkbox toggle
- `string` with union types → Dropdown select
- Arrays and objects → Advanced editors

## Common Component Patterns

### 1. Image Component

```vue
<template>
  <img 
    :src="imageUrl" 
    :alt="altText"
    :style="{ width: width + 'px', height: height + 'px' }"
  />
</template>

<script setup>
const props = defineProps({
  imageUrl: {
    type: String,
    default: 'https://via.placeholder.com/300x200'
  },
  altText: {
    type: String,
    default: 'Placeholder image'
  },
  width: {
    type: Number,
    default: 300
  },
  height: {
    type: Number,
    default: 200
  }
})
</script>
```

### 2. Text Component with Styling

```vue
<template>
  <div 
    :style="{ 
      fontSize: fontSize + 'px',
      color: textColor,
      textAlign: textAlign,
      fontWeight: bold ? 'bold' : 'normal'
    }"
  >
    {{ content }}
  </div>
</template>

<script setup>
const props = defineProps({
  content: {
    type: String,
    default: 'Your text here...'
  },
  fontSize: {
    type: Number,
    default: 16
  },
  textColor: {
    type: String,
    default: '#333333'
  },
  textAlign: {
    type: String,
    default: 'left'
  },
  bold: {
    type: Boolean,
    default: false
  }
})
</script>
```

## Testing Your Components

### Quick Test Method

Create a simple test page:

```vue
<template>
  <div>
    <h2>Component Preview</h2>
    <HeroSection 
      title="Test Title"
      subtitle="This is a test"
      buttonText="Click Me"
      bgColor="#ff6b6b"
    />
  </div>
</template>

<script setup>
import HeroSection from './HeroSection.vue'
</script>
```

## Next Steps

Now that you understand components:
1. Learn about [Blueprints](./blueprints) to register your components
2. Add [Resolvers](./resolvers) for better editing
3. Create [Data Wrappers](./data-wrappers) for dynamic content
