# Form Configuration: Making Your Components Easy to Edit

Imagine you give someone a remote control, but all the buttons are labeled in a foreign language. That's what it's like using components without good form configuration! This guide will teach you how to make your components super easy for anyone to edit.

## What is Form Configuration?

Form configuration is how you tell v-craft what settings users can change for your components. It's like creating a user-friendly control panel for each component.

Without form configuration, users would have to edit code to change text colors or button labels. With it, they just click and type!

## The Simple Way: Automatic Form Generation

Good news! v-craft can automatically create forms based on your component's props. But we can make it even better with custom configuration.

## Basic Form Setup

### Step 1: Create a Component with Props

```vue
<!-- SimpleCard.vue -->
<template>
  <div class="card" :style="cardStyles">
    <h2 v-if="showTitle">{{ title }}</h2>
    <p>{{ description }}</p>
    <button :style="buttonStyles" v-if="showButton">
      {{ buttonText }}
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  // These will automatically appear in the form!
  title: {
    type: String,
    default: 'Card Title'
  },
  description: {
    type: String,
    default: 'This is a description'
  },
  buttonText: {
    type: String,
    default: 'Learn More'
  },
  backgroundColor: {
    type: String,
    default: '#ffffff'
  },
  showTitle: {
    type: Boolean,
    default: true
  },
  showButton: {
    type: Boolean,
    default: true
  }
})

const cardStyles = {
  backgroundColor: props.backgroundColor,
  padding: '20px',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
}

const buttonStyles = {
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  padding: '10px 20px',
  borderRadius: '4px'
}
</script>
```

### Step 2: The Blueprint Connects Everything

```javascript
// card-blueprint.js
export const cardBlueprint = {
  label: "Simple Card",
  componentName: "SimpleCard",
  props: {
    title: "Welcome Card",
    description: "This is where you describe your amazing content",
    buttonText: "Discover More",
    backgroundColor: "#f8f9fa",
    showTitle: true,
    showButton: true
  },
  children: []
}
```

That's it! v-craft will automatically create a form with:
- Text input for title
- Textarea for description
- Text input for button text
- Color picker for background
- Checkbox for show/hide title
- Checkbox for show/hide button

## Advanced Form Configuration

### Custom Form Schemas

For more control, create custom form schemas:

```javascript
// form-schemas.js

export const heroSectionSchema = {
  // Group 1: Basic Content
  title: {
    type: 'text',
    label: 'Hero Title',
    placeholder: 'Enter your main headline',
    validation: {
      required: true,
      maxLength: 100
    }
  },
  
  subtitle: {
    type: 'textarea',
    label: 'Subtitle Text',
    placeholder: 'Describe what you offer',
    rows: 3,
    validation: {
      maxLength: 200
    }
  },
  
  // Group 2: Button Settings
  buttonText: {
    type: 'text',
    label: 'Button Text',
    placeholder: 'Get Started, Learn More, etc.',
    validation: {
      required: true,
      maxLength: 50
    }
  },
  
  buttonUrl: {
    type: 'url',
    label: 'Button Link',
    placeholder: 'https://example.com'
  },
  
  // Group 3: Styling
  backgroundColor: {
    type: 'color',
    label: 'Background Color',
    default: '#6366f1'
  },
  
  textColor: {
    type: 'color',
    label: 'Text Color',
    default: '#ffffff'
  },
  
  backgroundImage: {
    type: 'image',
    label: 'Background Image',
    placeholder: 'Upload or enter image URL'
  },
  
  // Group 4: Layout
  height: {
    type: 'range',
    label: 'Section Height',
    min: 300,
    max: 800,
    step: 50,
    default: 500
  },
  
  textAlign: {
    type: 'select',
    label: 'Text Alignment',
    options: [
      { value: 'left', label: 'Left' },
      { value: 'center', label: 'Center' },
      { value: 'right', label: 'Right' }
    ],
    default: 'center'
  }
}
```

## Form Field Types Explained

### Text Fields

```javascript
{
  type: 'text',
  label: 'Title',
  placeholder: 'Enter title here',
  validation: {
    required: true,
    minLength: 3,
    maxLength: 100
  }
}
```

### Textarea (Long Text)

```javascript
{
  type: 'textarea',
  label: 'Description',
  placeholder: 'Enter detailed description',
  rows: 4,
  validation: {
    maxLength: 500
  }
}
```

### Number Input

```javascript
{
  type: 'number',
  label: 'Font Size',
  min: 12,
  max: 72,
  step: 1,
  default: 16
}
```

### Range Slider

```javascript
{
  type: 'range',
  label: 'Padding',
  min: 0,
  max: 100,
  step: 5,
  default: 20
}
```

### Color Picker

```javascript
{
  type: 'color',
  label: 'Background Color',
  default: '#ffffff',
  palette: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7']
}
```

### Select Dropdown

```javascript
{
  type: 'select',
  label: 'Font Family',
  options: [
    { value: 'Arial', label: 'Arial' },
    { value: 'Helvetica', label: 'Helvetica' },
    { value: 'Times New Roman', label: 'Times' },
    { value: 'Georgia', label: 'Georgia' }
  ],
  default: 'Arial'
}
```

### Image Upload/URL

```javascript
{
  type: 'image',
  label: 'Profile Picture',
  placeholder: 'Enter image URL or upload',
  validation: {
    required: false
  }
}
```

### Checkbox (True/False)

```javascript
{
  type: 'checkbox',
  label: 'Show Border',
  default: true
}
```

### URL Input

```javascript
{
  type: 'url',
  label: 'Website Link',
  placeholder: 'https://example.com',
  validation: {
    required: true,
    pattern: '^https?://.+'
  }
}
```

## Real-World Examples

### 1. Product Card Form

```javascript
const productCardSchema = {
  // Product Info
  productName: {
    type: 'text',
    label: 'Product Name',
    placeholder: 'Awesome Product',
    validation: { required: true, maxLength: 50 }
  },
  
  price: {
    type: 'number',
    label: 'Price ($)',
    min: 0,
    max: 10000,
    step: 0.01,
    validation: { required: true }
  },
  
  description: {
    type: 'textarea',
    label: 'Product Description',
    rows: 3,
    validation: { maxLength: 200 }
  },
  
  // Images
  productImage: {
    type: 'image',
    label: 'Product Image',
    validation: { required: true }
  },
  
  // Styling
  cardBackground: {
    type: 'color',
    label: 'Card Background',
    default: '#ffffff'
  },
  
  showBadge: {
    type: 'checkbox',
    label: 'Show "New" Badge',
    default: false
  },
  
  badgeText: {
    type: 'text',
    label: 'Badge Text',
    placeholder: 'NEW, SALE, HOT',
    showIf: { field: 'showBadge', value: true }
  }
}
```

### 2. Contact Form Configuration

```javascript
const contactFormSchema = {
  // Form Settings
  formTitle: {
    type: 'text',
    label: 'Form Title',
    default: 'Contact Us'
  },
  
  // Email Settings
  recipientEmail: {
    type: 'email',
    label: 'Send To Email',
    placeholder: 'you@example.com',
    validation: { required: true, email: true }
  },
  
  // Success Message
  successMessage: {
    type: 'textarea',
    label: 'Success Message',
    default: 'Thank you! We\'ll get back to you soon.',
    rows: 2
  },
  
  // Styling
  backgroundColor: {
    type: 'color',
    label: 'Form Background',
    default: '#f8f9fa'
  },
  
  buttonText: {
    type: 'text',
    label: 'Submit Button Text',
    default: 'Send Message'
  },
  
  buttonColor: {
    type: 'color',
    label: 'Button Color',
    default: '#007bff'
  }
}
```

### 3. Hero Section with Conditional Fields

```javascript
const heroSchema = {
  // Main Content
  headline: {
    type: 'text',
    label: 'Main Headline',
    placeholder: 'Your amazing headline here',
    validation: { required: true, maxLength: 60 }
  },
  
  subheadline: {
    type: 'textarea',
    label: 'Subheadline',
    placeholder: 'Explain what you do in one sentence',
    rows: 2,
    validation: { maxLength: 120 }
  },
  
  // Button Configuration
  showButton: {
    type: 'checkbox',
    label: 'Show Call-to-Action Button',
    default: true
  },
  
  buttonText: {
    type: 'text',
    label: 'Button Text',
    default: 'Get Started',
    showIf: { field: 'showButton', value: true }
  },
  
  buttonUrl: {
    type: 'url',
    label: 'Button Link',
    placeholder: 'https://example.com/signup',
    showIf: { field: 'showButton', value: true },
    validation: { required: true }
  },
  
  // Background Options
  backgroundType: {
    type: 'select',
    label: 'Background Type',
    options: [
      { value: 'color', label: 'Solid Color' },
      { value: 'image', label: 'Image' },
      { value: 'gradient', label: 'Gradient' }
    ],
    default: 'color'
  },
  
  backgroundColor: {
    type: 'color',
    label: 'Background Color',
    default: '#6366f1',
    showIf: { field: 'backgroundType', value: 'color' }
  },
  
  backgroundImage: {
    type: 'image',
    label: 'Background Image',
    showIf: { field: 'backgroundType', value: 'image' }
  },
  
  gradientStart: {
    type: 'color',
    label: 'Gradient Start',
    default: '#6366f1',
    showIf: { field: 'backgroundType', value: 'gradient' }
  },
  
  gradientEnd: {
    type: 'color',
    label: 'Gradient End',
    default: '#8b5cf6',
    showIf: { field: 'backgroundType', value: 'gradient' }
  }
}
```

## Form Validation Made Simple

### Basic Validation

```javascript
{
  email: {
    type: 'email',
    label: 'Email Address',
    validation: {
      required: true,
      email: true,
      message: 'Please enter a valid email address'
    }
  }
}
```

### Advanced Validation

```javascript
{
  password: {
    type: 'text',
    label: 'Password',
    validation: {
      required: true,
      minLength: 8,
      pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$',
      message: 'Password must be 8+ characters with uppercase, lowercase, and numbers'
    }
  }
}
```

## Grouping Form Fields

### Organize with Sections

```javascript
const advancedSchema = {
  // Content Section
  _content: {
    type: 'section',
    label: 'Content Settings',
    fields: ['title', 'description', 'buttonText']
  },
  
  title: { type: 'text', label: 'Title' },
  description: { type: 'textarea', label: 'Description' },
  buttonText: { type: 'text', label: 'Button Text' },
  
  // Design Section
  _design: {
    type: 'section',
    label: 'Design Settings',
    fields: ['backgroundColor', 'textColor', 'borderRadius']
  },
  
  backgroundColor: { type: 'color', label: 'Background' },
  textColor: { type: 'color', label: 'Text Color' },
  borderRadius: { type: 'range', label: 'Corner Rounding', min: 0, max: 20 }
}
```

## Testing Your Forms

### Quick Test Component

```vue
<!-- TestForm.vue -->
<template>
  <div>
    <h2>Form Test</h2>
    <div v-for="(value, key) in props" :key="key">
      <strong>{{ key }}:</strong> {{ value }}
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: String,
  description: String,
  backgroundColor: String,
  // ... other props
})
</script>
```

## Form Configuration Best Practices

### 1. Use Clear Labels
```javascript
// ❌ Bad
label: "bgClr"

// ✅ Good  
label: "Background Color"
```

### 2. Provide Helpful Placeholders
```javascript
// ❌ Bad
placeholder: "Enter text"

// ✅ Good
placeholder: "e.g., Welcome to our amazing website"
```

### 3. Group Related Settings
```javascript
// ❌ Scattered fields
// ✅ Use sections to group related settings
```

### 4. Use Appropriate Field Types
```javascript
// ❌ Using text for colors
// ✅ Use color type for colors
```

### 5. Provide Sensible Defaults
```javascript
// ❌ No defaults
// ✅ Always provide good default values
```

## Next Steps

Now that you understand form configuration:
1. Learn about [Data Wrappers](./data-wrappers) for dynamic content
2. Explore [Advanced Usage](./advanced-usage) for complex scenarios
3. Check out the [Components](./components) guide for building better components
