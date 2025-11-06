# Blueprints: The Recipe Book for Your Components

Think of blueprints as recipes that tell v-craft how to use your components. Just like a recipe tells you what ingredients you need and how to combine them, a blueprint tells the editor what your component is called, what settings it has, and how to create it.

## What is a Blueprint?

A blueprint is a simple JavaScript object that describes your component to v-craft. It answers these questions:
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
  children: []                   // No children allowed
}
```

That's it! This creates a draggable text block.

## Creating Your First Blueprint

### Step 1: Create the Blueprint File

Create a file called `my-blueprints.js`:

```javascript
// my-blueprints.js

export const myBlueprints = {
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
    children: [] // This component can't have children
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
    children: [] // This card can't have children inside it
  }
}
```

### Step 2: Use Your Blueprints in the Editor

```javascript
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
  
  // 4. CHILDREN - Can this hold other components?
  children: [] // Empty array = no children allowed
}
```

## Blueprint Examples for Every Situation

### 1. Simple Text Component

```javascript
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

```javascript
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

```javascript
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

### 4. Container Component (Can Hold Children)

```javascript
const Container = {
  label: "Container Box",
  componentName: "ContainerBox",
  props: {
    backgroundColor: "#f8f9fa",
    padding: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#dee2e6"
  },
  children: [] // This allows child components!
}
```

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

## Blueprint Generator Function

Make your life easier with this helper:

```javascript
// blueprint-generator.js

export const createBlueprint = (name, label, props, allowsChildren = false) => ({
  label,
  componentName: name,
  props: props || {},
  children: allowsChildren ? [] : []
})

// Usage:
const Button = createBlueprint('ActionButton', 'Click Button', {
  text: 'Click me',
  color: '#007bff'
})

const Container = createBlueprint('ContainerBox', 'Box Container', {
  padding: 20,
  background: '#f8f9fa'
}, true) // true = allows children
```

## Next Steps

Now that you understand blueprints:
1. Learn about [Form Configuration](./form-configuration) to make editing easier
2. Create [Data Wrappers](./data-wrappers) for dynamic content
3. Explore [Advanced Usage](./advanced-usage) for complex scenarios
