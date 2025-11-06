# Blueprints: The Recipe Book for Your Components

Think of blueprints as recipes that tell v-craft how to use your components. Just like a recipe tells you what ingredients you need and how to combine them, a blueprint tells the editor what your component is called, what settings it has, and how to create it.

## What Are Blueprints?

Blueprints are like **recipes** for your components. They tell the editor:
- What components are available
- What they look like
- What settings they have
- How they behave

**🔑 Key Concept: CraftCanvas**
`CraftCanvas` is a special component used **only in blueprints** for components that should accept child components. It:
- Renders your actual component
- Enables drag-and-drop of child components into slots
- Provides container functionality automatically

**Simple components** (buttons, images, text) use their component name directly in blueprints.
**Container components** (layouts, cards, sections) use `CraftCanvas` with their component name as a prop.

Think of blueprints as the bridge between your Vue components and the visual editor. A blueprint is a simple JavaScript object that describes your component to v-craft. It answers these questions:
- **What is it called?** (the label users see)
- **What component should be created?** (the actual Vue component)
- **What are the default settings?** (the starting values)
- **Can it have child components?** (like a container)

## The Simplest Blueprint Ever

Let's start with the most basic blueprint possible:

```javascript
const simpleTextBlueprint = {
  label: "Text Block",           // What users see in the editor
  componentName: "SimpleText",   // Your Vue component name
  props: {
    text: "Hello World!"         // Default text
  },
  children: []                   // Empty component tree (no nested components)
}
```

That's it! This creates a draggable text block.

## Creating Your First Blueprint

### Step 1: Create the Blueprint File

Create a file called `my-blueprints.ts`:

```typescript
// my-blueprints.ts

export interface Blueprint {
  label: string
  componentName: string
  props: Record<string, any>
  children: Blueprint[]
}

export const myBlueprints: Record<string, Blueprint> = {
  // This is your blueprint for a Hero Section
  HeroSection: {
    label: "Hero Section",
    componentName: "HeroSection",
    props: {
      title: "Welcome to Our Site",
      subtitle: "We make amazing things",
      buttonText: "Get Started",
      backgroundColor: "#6366f1",
      textColor: "#ffffff"
    },
    children: [] // Single component, no nested structure
  },

  // This is your blueprint for a Card
  InfoCard: {
    label: "Information Card",
    componentName: "InfoCard",
    props: {
      title: "Card Title",
      description: "This is a description",
      imageUrl: "https://via.placeholder.com/300x200",
      buttonText: "Learn More"
    },
    children: [] // Single component, no nested structure
  }
}
```

### Step 2: Use Your Blueprints in the Editor

```typescript
import { myBlueprints } from './my-blueprints'

const editorConfig = {
  blueprintsLibrary: {
    groups: [
      {
        label: "My Awesome Components",
        blueprints: [
          myBlueprints.HeroSection,
          myBlueprints.InfoCard
        ]
      }
    ]
  }
}
```

## Blueprint Structure Explained

Let's break down every part of a blueprint:

```javascript
const myBlueprint = {
  // 1. LABEL - What users see
  label: "My Component Name",
  
  // 2. COMPONENT NAME - Must match your Vue component
  componentName: "MyVueComponent",
  
  // 3. PROPS - Default settings
  props: {
    // Text input
    title: "Default Title",
    
    // Number
    fontSize: 16,
    
    // Boolean (true/false)
    showBorder: true,
    
    // Color
    backgroundColor: "#ffffff",
    
    // Image URL
    imageUrl: "https://example.com/image.jpg"
  },
  
  // 4. CHILDREN - Component tree structure
  children: [] // Empty array = single component with no nested components
}
```

## Blueprint Examples for Every Situation

### 1. Simple Text Component

```typescript
const TextBlock = {
  label: "Text Block",
  componentName: "TextBlock",
  props: {
    text: "Type your text here...",
    fontSize: 16,
    color: "#333333",
    align: "left"
  },
  children: []
}
```

### 2. Button Component

```typescript
const Button = {
  label: "Button",
  componentName: "ActionButton",
  props: {
    text: "Click Me",
    backgroundColor: "#007bff",
    textColor: "#ffffff",
    borderRadius: 4,
    padding: "12px 24px"
  },
  children: []
}
```

### 3. Image Component

```typescript
const Image = {
  label: "Image",
  componentName: "DisplayImage",
  props: {
    src: "https://via.placeholder.com/400x300",
    alt: "Description of image",
    width: 400,
    height: 300,
    borderRadius: 0
  },
  children: []
}
```

### 4. Container Component (Accepts User-Dropped Children)

For components that should accept child components (like layouts, cards with content areas, etc.), use `CraftCanvas` in the blueprint:

**Your Vue Component (unchanged):**
```vue
<!-- ContainerBox.vue -->
<template>
  <div class="container" :style="{ backgroundColor: bgColor, padding: padding + 'px' }">
    <!-- This slot receives user-dropped components -->
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

**Blueprint (using CraftCanvas for container behavior):**
```typescript
const Container = {
  label: "Container Box",
  componentName: "CraftCanvas",  // Use CraftCanvas for container behavior
  props: {
    componentName: "ContainerBox", // Your actual component name
    bgColor: "#f8f9fa",
    padding: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#dee2e6"
  },
  children: [] // Always empty - CraftCanvas handles user-dropped children
}
```

**Key Difference:**
- **Simple components**: Use `componentName: "YourComponent"` directly
- **Container components**: Use `componentName: "CraftCanvas"` with `props.componentName: "YourComponent"`

### 5. Advanced Component with Many Settings

```javascript
const Card = {
  label: "Information Card",
  componentName: "InfoCard",
  props: {
    // Basic info
    title: "Card Title",
    description: "Card description goes here",
    
    // Image settings
    imageUrl: "https://via.placeholder.com/300x200",
    imageAlt: "Card image",
    
    // Styling
    backgroundColor: "#ffffff",
    borderColor: "#e0e0e0",
    borderRadius: 8,
    shadow: true,
    
    // Button
    buttonText: "Read More",
    buttonColor: "#007bff",
    buttonTextColor: "#ffffff",
    
    // Layout
    padding: 20,
    maxWidth: 300
  },
  children: [] // This card is self-contained
}
```

## Organizing Your Blueprints

### Method 1: By Component Type

```javascript
const blueprints = {
  // Text components
  Heading: { label: "Heading", componentName: "Heading", props: {...}, children: [] },
  Paragraph: { label: "Paragraph", componentName: "Paragraph", props: {...}, children: [] },
  
  // Media components
  Image: { label: "Image", componentName: "Image", props: {...}, children: [] },
  Video: { label: "Video", componentName: "Video", props: {...}, children: [] },
  
  // Layout components
  Container: { label: "Container", componentName: "Container", props: {...}, children: [] },
  Row: { label: "Row", componentName: "Row", props: {...}, children: [] },
  Column: { label: "Column", componentName: "Column", props: {...}, children: [] }
}
```

### Method 2: By Page Section

```javascript
const blueprints = {
  // Hero section components
  HeroTitle: { label: "Hero Title", componentName: "HeroTitle", props: {...}, children: [] },
  HeroSubtitle: { label: "Hero Subtitle", componentName: "HeroSubtitle", props: {...}, children: [] },
  HeroButton: { label: "Hero Button", componentName: "HeroButton", props: {...}, children: [] },
  
  // Feature section components
  FeatureCard: { label: "Feature Card", componentName: "FeatureCard", props: {...}, children: [] },
  FeatureGrid: { label: "Feature Grid", componentName: "FeatureGrid", props: {...}, children: [] }
}
```

## Blueprint Groups (Organizing Your Toolbox)

### Creating Groups

```javascript
const editorConfig = {
  blueprintsLibrary: {
    groups: [
      {
        label: "🏠 Landing Page",
        blueprints: [
          { label: "Hero Section", componentName: "HeroSection", props: {...}, children: [] },
          { label: "Feature List", componentName: "FeatureList", props: {...}, children: [] },
          { label: "Call to Action", componentName: "CTA", props: {...}, children: [] }
        ]
      },
      {
        label: "📝 Content",
        blueprints: [
          { label: "Text Block", componentName: "TextBlock", props: {...}, children: [] },
          { label: "Image", componentName: "Image", props: {...}, children: [] },
          { label: "Button", componentName: "Button", props: {...}, children: [] }
        ]
      },
      {
        label: "📦 Layout",
        blueprints: [
          { label: "Container", componentName: "Container", props: {...}, children: [] },
          { label: "Row", componentName: "Row", props: {...}, children: [] },
          { label: "Column", componentName: "Column", props: {...}, children: [] }
        ]
      }
    ]
  }
}
```

## Common Blueprint Mistakes (And How to Fix Them)

### Mistake 1: Wrong Component Name

❌ **Wrong:**
```javascript
componentName: "MyButton" // But your Vue file is Button.vue
```

✅ **Correct:**
```javascript
componentName: "Button" // Must match your Vue component name
```

### Mistake 2: Missing Default Values

❌ **Wrong:**
```javascript
props: {
  title: undefined // This will break!
}
```

✅ **Correct:**
```javascript
props: {
  title: "Default Title" // Always provide defaults
}
```

### Mistake 3: Complex Objects Without Defaults

❌ **Wrong:**
```javascript
props: {
  style: {} // Empty object might cause issues
}
```

✅ **Correct:**
```javascript
props: {
  style: {
    color: "#333333",
    fontSize: 16
  }
}
```

## Testing Your Blueprints

### Quick Test Method

Create a simple test:

```javascript
// Test your blueprint
console.log('Testing HeroSection blueprint:', {
  label: myBlueprints.HeroSection.label,
  componentName: myBlueprints.HeroSection.componentName,
  hasProps: Object.keys(myBlueprints.HeroSection.props).length > 0,
  canHaveChildren: myBlueprints.HeroSection.children !== undefined
})
```

## How Blueprints and Resolvers Work Together

### The Two-Layer System

Your implementation uses a **two-layer system** where blueprints and resolvers work together to create containers:

1. **Blueprints** define what appears in the editor sidebar
2. **Resolvers** define the actual components and their editable properties

### Real Example: HTML DIV Container

Looking at your actual code, here's how a `<div>` becomes a container:

**Layer 1: Resolver (defines the actual component)**
```typescript
// resolvermap.ts - defines what a <div> is
const resolveHtmlElements = (elements: string[]) => {
  const mapped: Record<string, any> = {};
  
  elements.forEach((element) => {
    mapped[element] = {
      componentName: element,  // "div" - the actual HTML element
      eventsSchema: {
        // Form configuration for event handlers
        $el: "div",
        children: [
          {
            $formkit: "textarea",
            name: "click",
            label: "onClick",
          },
        ],
      },
      propsSchema: [
        {
          $formkit: "text",
          label: "CSS Class(es)",
          name: "class",
        },
      ],
    };
  });
  return mapped;
};
```

**Layer 2: Blueprint (defines what users see in editor)**
```typescript
// blueprints.ts - creates the draggable blueprint
const createHtmlElementBlueprints = () => {
  const resolverMap: CraftNodeResolverMap<any> = htmlResolvers;
  const blueprints: Blueprints<any> = {};

  Object.entries(resolverMap).forEach(([key, value]) => {
    blueprints[key] = {
      label: `HTML <${value.componentName}>`,
      componentName: "CraftCanvas",  // The magic wrapper
      props: {
        ...value.defaultProps,
        componentName: value.componentName, // "div" gets passed as prop
      },
      children: [], // Empty because CraftCanvas handles children
    };
  });
  return blueprints;
};
```

### The Container Magic: How It Actually Works

When a user drags a "HTML `<div>`" from the sidebar:

1. **Blueprint creates**: A `CraftCanvas` component with `componentName="div"`
2. **CraftCanvas renders**: The actual `<div>` element (from resolver)
3. **Container behavior**: `CraftCanvas` automatically enables drop zones
4. **Child components**: Users can now drag components into the div

### Why This Pattern Works

**The separation of concerns:**
- **Resolvers** define the actual component behavior and properties
- **Blueprints** define how components appear in the editor
- **CraftCanvas** provides the container functionality

This means:
- Any HTML element can become a container without changing its code
- The same component can have different editor representations
- Container behavior is added by CraftCanvas, not the component itself

## How Containers Actually Work: The CraftCanvas Pattern

Looking at your actual implementation, containers work through a specific pattern using `CraftCanvas` as a wrapper component. Here's how it works:

### The Container Pattern

**In your resolvermap.ts:**
```typescript
// Defines the actual HTML element component
const resolveHtmlElements = (elements: string[]) => {
  const mapped: Record<string, any> = {};
  
  elements.forEach((element) => {
    mapped[element] = {
      componentName: element,  // This is the actual HTML element name
      eventsSchema: { ... },
      propsSchema: [ ... ],
    };
  });
  return mapped;
};
```

**In your blueprints.ts:**
```typescript
// Creates container blueprints that use CraftCanvas as wrapper
const createHtmlElementBlueprints = () => {
  const resolverMap: CraftNodeResolverMap<any> = htmlResolvers;
  const blueprints: Blueprints<any> = {};

  Object.entries(resolverMap).forEach(([key, value]) => {
    blueprints[key] = {
      label: `HTML <${value.componentName}>`,
      componentName: "CraftCanvas",  // This is the key!
      props: {
        ...value.defaultProps,
        componentName: value.componentName, // Pass the actual element name
      },
      children: [], // Always empty - CraftCanvas handles children
    };
  });
  return blueprints;
};
```

### How It Works

1. **CraftCanvas Component**: A special wrapper component that enables container behavior
2. **componentName prop**: Tells CraftCanvas which actual component to render
3. **children: []**: Always empty in blueprints - CraftCanvas manages child components automatically
4. **User-dropped children**: Handled by CraftCanvas, not the blueprint

### Creating Your Own Container

To create a container component that accepts user-dropped children:

**Step 1: Create the wrapper blueprint**
```typescript
const MyContainer = {
  label: "My Container",
  componentName: "CraftCanvas", // Always use CraftCanvas
  props: {
    componentName: "MyActualContainer", // Your actual component
    backgroundColor: "#f8f9fa",
    padding: 20
  },
  children: [] // Always empty
}
```

**Step 2: Create the actual component**
```vue
<!-- MyActualContainer.vue -->
<template>
  <div :style="{ backgroundColor, padding: padding + 'px' }">
    <!-- This slot receives user-dropped components -->
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
interface Props {
  backgroundColor: string
  padding: number
}

const props = withDefaults(defineProps<Props>(), {
  backgroundColor: '#f8f9fa',
  padding: 20
})
</script>
```

**Key Insight**: The blueprint defines the **wrapper** (CraftCanvas), while the resolver defines the **actual component** that gets rendered inside. This separation allows any component to become a container without modifying its code.

## Blueprint Generator Function

Make your life easier with this helper:

```javascript
// blueprint-generator.js

export const createBlueprint = (name, label, props, hasChildren = false) => ({
  label,
  componentName: name,
  props: props || {},
  children: hasChildren ? [] : []
})

// Usage:
const Button = createBlueprint('ActionButton', 'Click Button', {
  text: 'Click me',
  color: '#007bff'
})

const Container = createBlueprint('ContainerBox', 'Box Container', {
  padding: 20,
  background: '#f8f9fa'
}, true) // true = includes children array for component tree
```

## Next Steps

Now that you understand blueprints:
1. Learn about [Form Configuration](./form-configuration) to make editing easier
2. Create [Data Wrappers](./data-wrappers) for dynamic content
3. Explore [Advanced Usage](./advanced-usage) for complex scenarios
