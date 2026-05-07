# Resolvers: The Component Registry

Think of resolvers as a registry that tells v-craft everything about your components. While blueprints define how components appear in the editor sidebar, resolvers define the actual component behavior, editable properties, event handlers, and rules.

## What Are Resolvers?

Resolvers are like **component registries** that tell the editor:
- What components actually are
- What properties can be edited
- What events can be handled
- What drag-and-drop rules apply
- What slots are available

**🔑 Key Concept: Resolver Map**
A resolver map is a JavaScript object where keys are component names and values contain all the metadata about each component. This metadata includes:
- `componentName` - The actual Vue component name
- `propsSchema` - FormKit schema for editable properties
- `eventsSchema` - FormKit schema for event handlers
- `defaultProps` - Default property values
- `rules` - Drag-and-drop behavior rules
- `slots` - Available slot names

**🎯 Built on FormKit**
Resolvers use [FormKit](https://formkit.com/) schemas for defining editable properties and events. This means you get access to FormKit's powerful form system, validation, and field types.

## The Simplest Resolver Ever

Let's start with the most basic resolver possible:

```typescript
const myResolver = {
  SimpleText: {
    componentName: "SimpleText",
    propsSchema: [
      {
        $formkit: "text",
        name: "text",
        label: "Text Content",
      }
    ],
    defaultProps: {
      text: "Hello World!"
    }
  }
}
```

That's it! This resolver tells v-craft:
- There's a component called "SimpleText"
- It has one editable property called "text"
- The default value is "Hello World!"

## Creating Your First Resolver

### Step 1: Define the Resolver Map

Create a file called `resolvers.ts`:

```typescript
import type { CraftNodeResolverMap } from '@versa-stack/v-craft'

export const myResolvers: CraftNodeResolverMap<any> = {
  HeroSection: {
    componentName: "HeroSection",
    propsSchema: [
      {
        $formkit: "text",
        name: "title",
        label: "Hero Title",
        validation: "required",
      },
      {
        $formkit: "textarea",
        name: "subtitle",
        label: "Subtitle",
      },
      {
        $formkit: "color",
        name: "backgroundColor",
        label: "Background Color",
        value: "#6366f1",
      }
    ],
    eventsSchema: {
      $el: "div",
      children: [
        {
          $formkit: "textarea",
          name: "onClick",
          label: "onClick Handler",
        },
      ],
    },
    defaultProps: {
      title: "Welcome to Our Site",
      subtitle: "We make amazing things",
      backgroundColor: "#6366f1",
    }
  },

  InfoCard: {
    componentName: "InfoCard",
    propsSchema: [
      {
        $formkit: "text",
        name: "title",
        label: "Card Title",
      },
      {
        $formkit: "textarea",
        name: "description",
        label: "Description",
      },
      {
        $formkit: "url",
        name: "imageUrl",
        label: "Image URL",
      }
    ],
    defaultProps: {
      title: "Card Title",
      description: "This is a description",
      imageUrl: "https://via.placeholder.com/300x200",
    }
  }
}
```

### Step 2: Use Your Resolvers in the Editor

```typescript
import { CraftNodeResolver } from '@versa-stack/v-craft'
import { myResolvers } from './resolvers'

const resolver = new CraftNodeResolver(myResolvers)

const editorConfig = {
  resolver
}
```

## Resolver Structure Explained

Let's break down every part of a resolver:

```typescript
const myResolver = {
  // 1. COMPONENT NAME - Must match your Vue component
  componentName: "MyVueComponent",

  // 2. PROPS SCHEMA - FormKit schema for editable properties
  propsSchema: [
    {
      $formkit: "text",
      name: "title",
      label: "Title",
      validation: "required",
    },
    {
      $formkit: "number",
      name: "fontSize",
      label: "Font Size",
      value: 16,
    }
  ],

  // 3. EVENTS SCHEMA - FormKit schema for event handlers
  eventsSchema: {
    $el: "div",
    children: [
      {
        $formkit: "textarea",
        name: "onClick",
        label: "onClick Handler",
      },
    ],
  },

  // 4. DEFAULT PROPS - Default property values
  defaultProps: {
    title: "Default Title",
    fontSize: 16,
  },

  // 5. RULES - Drag-and-drop behavior rules
  rules: {
    canAccept: (node) => true,
    canDrag: (node) => true,
  },

  // 6. SLOTS - Available slot names
  slots: ["default", "header", "footer"]
}
```

## Resolver Examples for Every Situation

### 1. Simple Text Component

```typescript
const TextBlock = {
  componentName: "TextBlock",
  propsSchema: [
    {
      $formkit: "text",
      name: "text",
      label: "Text Content",
    },
    {
      $formkit: "number",
      name: "fontSize",
      label: "Font Size (px)",
      value: 16,
    },
    {
      $formkit: "color",
      name: "color",
      label: "Text Color",
      value: "#333333",
    },
    {
      $formkit: "select",
      name: "align",
      label: "Text Alignment",
      options: [
        { value: "left", label: "Left" },
        { value: "center", label: "Center" },
        { value: "right", label: "Right" },
      ],
      value: "left",
    }
  ],
  defaultProps: {
    text: "Type your text here...",
    fontSize: 16,
    color: "#333333",
    align: "left"
  }
}
```

### 2. Button Component

```typescript
const Button = {
  componentName: "ActionButton",
  propsSchema: [
    {
      $formkit: "text",
      name: "text",
      label: "Button Text",
      validation: "required",
    },
    {
      $formkit: "color",
      name: "backgroundColor",
      label: "Background Color",
      value: "#007bff",
    },
    {
      $formkit: "color",
      name: "textColor",
      label: "Text Color",
      value: "#ffffff",
    },
    {
      $formkit: "number",
      name: "borderRadius",
      label: "Border Radius (px)",
      value: 4,
    }
  ],
  eventsSchema: {
    $el: "div",
    children: [
      {
        $formkit: "textarea",
        name: "onClick",
        label: "onClick Handler",
      },
    ],
  },
  defaultProps: {
    text: "Click Me",
    backgroundColor: "#007bff",
    textColor: "#ffffff",
    borderRadius: 4,
  }
}
```

### 3. Image Component

```typescript
const Image = {
  componentName: "DisplayImage",
  propsSchema: [
    {
      $formkit: "url",
      name: "src",
      label: "Image URL",
      validation: "required|url",
    },
    {
      $formkit: "text",
      name: "alt",
      label: "Alt Text",
    },
    {
      $formkit: "number",
      name: "width",
      label: "Width (px)",
      value: 400,
    },
    {
      $formkit: "number",
      name: "height",
      label: "Height (px)",
      value: 300,
    },
    {
      $formkit: "number",
      name: "borderRadius",
      label: "Border Radius (px)",
      value: 0,
    }
  ],
  defaultProps: {
    src: "https://via.placeholder.com/400x300",
    alt: "Description of image",
    width: 400,
    height: 300,
    borderRadius: 0,
  }
}
```

### 4. Container Component with Slots

```typescript
const Container = {
  componentName: "ContainerBox",
  propsSchema: [
    {
      $formkit: "color",
      name: "bgColor",
      label: "Background Color",
      value: "#f8f9fa",
    },
    {
      $formkit: "number",
      name: "padding",
      label: "Padding (px)",
      value: 20,
    },
    {
      $formkit: "number",
      name: "borderRadius",
      label: "Border Radius (px)",
      value: 8,
    }
  ],
  defaultProps: {
    bgColor: "#f8f9fa",
    padding: 20,
    borderRadius: 8,
  },
  slots: ["default"]
}
```

### 5. Component with Drag-and-Drop Rules

```typescript
const DraggableSection = {
  componentName: "Section",
  propsSchema: [
    {
      $formkit: "text",
      name: "title",
      label: "Section Title",
    }
  ],
  defaultProps: {
    title: "My Section",
  },
  rules: {
    canAccept: (node) => {
      // Only accept text and button components
      return node.componentName === "TextBlock" || node.componentName === "ActionButton"
    },
    canDrag: (node) => {
      // Allow dragging unless it's the root node
      return node.parentUuid !== null
    }
  }
}
```

## Using the CraftNodeResolver Class

The `CraftNodeResolver` class provides methods to work with your resolver map:

```typescript
import { CraftNodeResolver } from '@versa-stack/v-craft'
import { myResolvers } from './resolvers'

const resolver = new CraftNodeResolver(myResolvers)

// Resolve a component by name
const componentInfo = resolver.resolve("HeroSection")

// Get default props for a CraftNode
const defaults = resolver.getDefaultProps(myCraftNode)

// Get the props schema for a CraftNode
const schema = resolver.getSchema(myCraftNode)

// Get the events schema for a CraftNode
const eventsSchema = resolver.getEventsSchema(myCraftNode)

// Get drag-and-drop rules for a CraftNode
const rules = resolver.getRules(myCraftNode)
```

## How Resolvers and Blueprints Work Together

### The Two-Layer System

Your implementation uses a **two-layer system** where blueprints and resolvers work together:

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
      componentName: element,
      eventsSchema: {
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
      componentName: "CraftCanvas",
      props: {
        ...value.defaultProps,
        componentName: value.componentName,
      },
      slots: {},
    };
  });
  return blueprints;
};
```

### Why This Separation Works

- **Resolvers** define the actual component behavior and properties
- **Blueprints** define how components appear in the editor
- This allows the same component to have different editor representations
- Container behavior is added by CraftCanvas, not the component itself

## FormKit Schema Reference

All resolver schemas use [FormKit schemas](https://formkit.com/inputs). Here are common patterns:

### Text Input
```typescript
{
  $formkit: "text",
  name: "title",
  label: "Title",
  validation: "required",
  placeholder: "Enter title...",
}
```

### Textarea
```typescript
{
  $formkit: "textarea",
  name: "description",
  label: "Description",
  rows: 4,
}
```

### Number
```typescript
{
  $formkit: "number",
  name: "fontSize",
  label: "Font Size",
  value: 16,
  min: 12,
  max: 72,
}
```

### Color
```typescript
{
  $formkit: "color",
  name: "backgroundColor",
  label: "Background Color",
  value: "#ffffff",
}
```

### Select
```typescript
{
  $formkit: "select",
  name: "align",
  label: "Alignment",
  options: [
    { value: "left", label: "Left" },
    { value: "center", label: "Center" },
    { value: "right", label: "Right" },
  ],
  value: "left",
}
```

### URL
```typescript
{
  $formkit: "url",
  name: "imageUrl",
  label: "Image URL",
  validation: "required|url",
}
```

**📚 See Also:**

- [FormKit Input Documentation](https://formkit.com/inputs) - Complete list of all available input types
- [FormKit Validation](https://formkit.com/essentials/validation) - Advanced validation options
- [FormKit Conditional Logic](https://formkit.com/essentials/conditional-logic) - Show/hide fields based on other values

## Resolver Best Practices

### 1. Always Provide Default Props

```typescript
// ❌ Bad - no defaults
const BadResolver = {
  componentName: "MyComponent",
  propsSchema: [...]
}

// ✅ Good - always provide defaults
const GoodResolver = {
  componentName: "MyComponent",
  propsSchema: [...],
  defaultProps: {
    title: "Default Title",
    color: "#333333"
  }
}
```

### 2. Use Validation Where Appropriate

```typescript
// ❌ Bad - no validation
{
  $formkit: "text",
  name: "email",
  label: "Email",
}

// ✅ Good - with validation
{
  $formkit: "text",
  name: "email",
  label: "Email",
  validation: "required|email",
}
```

### 3. Group Related Properties

```typescript
// ✅ Group related properties in your schema
propsSchema: [
  // Content properties
  { $formkit: "text", name: "title", label: "Title" },
  { $formkit: "textarea", name: "description", label: "Description" },

  // Styling properties
  { $formkit: "color", name: "backgroundColor", label: "Background" },
  { $formkit: "color", name: "textColor", label: "Text Color" },
]
```

### 4. Define Slots for Multi-Slot Components

```typescript
// ✅ Define all available slots
{
  componentName: "MyContainer",
  slots: ["header", "body", "footer"]
}
```

### 5. Use Rules for Complex Drag-and-Drop Behavior

```typescript
// ✅ Define rules to control drag-and-drop
rules: {
  canAccept: (node) => {
    // Custom logic for what can be dropped
    return true
  },
  canDrag: (node) => {
    // Custom logic for what can be dragged
    return true
  }
}
```

## Common Resolver Mistakes (And How to Fix Them)

### Mistake 1: Wrong Component Name

❌ **Wrong:**
```typescript
componentName: "MyButton" // But your Vue file is Button.vue
```

✅ **Correct:**
```typescript
componentName: "Button" // Must match your Vue component name
```

### Mistake 2: Missing Default Props

❌ **Wrong:**
```typescript
{
  componentName: "MyComponent",
  propsSchema: [...]
  // No defaultProps!
}
```

✅ **Correct:**
```typescript
{
  componentName: "MyComponent",
  propsSchema: [...],
  defaultProps: {
    title: "Default Title",
    color: "#333333"
  }
}
```

### Mistake 3: Incorrect FormKit Schema Syntax

❌ **Wrong:**
```typescript
propsSchema: [
  {
    type: "text",  // Should be $formkit
    name: "title",
    label: "Title"
  }
]
```

✅ **Correct:**
```typescript
propsSchema: [
  {
    $formkit: "text",  // Correct FormKit syntax
    name: "title",
    label: "Title"
  }
]
```

### Mistake 4: Not Defining Slots for Container Components

❌ **Wrong:**
```typescript
{
  componentName: "MyContainer",
  propsSchema: [...],
  // No slots definition!
}
```

✅ **Correct:**
```typescript
{
  componentName: "MyContainer",
  propsSchema: [...],
  slots: ["default", "header", "footer"]
}
```

## Testing Your Resolvers

### Quick Test Method

```typescript
import { CraftNodeResolver } from '@versa-stack/v-craft'
import { myResolvers } from './resolvers'

const resolver = new CraftNodeResolver(myResolvers)

// Test resolution
console.log('Testing HeroSection resolver:', {
  componentName: resolver.resolve("HeroSection")?.componentName,
  hasPropsSchema: !!resolver.resolve("HeroSection")?.propsSchema,
  hasDefaultProps: !!resolver.resolve("HeroSection")?.defaultProps,
  hasEventsSchema: !!resolver.resolve("HeroSection")?.eventsSchema,
})
```

## Next Steps

Now that you understand resolvers:

1. Learn about [Blueprints](./blueprints) to see how resolvers connect to the editor UI
2. Create [Data Wrappers](./data-wrappers) for dynamic content
