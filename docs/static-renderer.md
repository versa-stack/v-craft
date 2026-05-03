<script lang="ts" setup>
import StaticRenderer from "./components/demo/editor-app/static-renderer.vue"
</script>

# Static Renderer (SSR Compatible)

The `CraftStaticRenderer` component and `renderCraftNodesToVNodes` function provide SSR-compatible rendering of CraftNode content without requiring the Pinia editor store.

::: info Static Renderer Demo
Below you can see a working demo of the Static Renderer.<br/>
It renders CraftNode content without any editor state or Pinia dependency, making it suitable for SSR and static site generation.
:::

---

<DemoContainer>
  <StaticRenderer />
</DemoContainer>

::: details Show Code
<<< @/components/demo/editor-app/static-renderer.vue
:::

## When to Use

Use the static renderer when:

- Building static sites with Nuxt, Astro, or similar frameworks
- Server-side rendering page content
- Displaying view-only content without editor functionality
- Pre-rendering pages at build time

## CraftStaticRenderer Component

The simplest way to render CraftNode arrays in SSR environments.

### Basic Usage

```vue
<template>
  <CraftStaticRenderer
    :nodes="pageContent"
    :resolver-map="resolverMap"
  />
</template>

<script setup>
import { CraftStaticRenderer } from '@versa-stack/v-craft'

const resolverMap = {
  MyButton: {
    componentName: 'MyButton',
    defaultProps: { variant: 'primary' }
  },
  MyText: {
    componentName: 'MyText',
    defaultProps: {}
  }
}

const pageContent = [
  {
    uuid: '1',
    componentName: 'MyText',
    props: { content: 'Hello World' },
    slots: {}
  }
]
</script>
```

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `nodes` | `CraftNode[]` | Yes | Array of CraftNode objects to render |
| `resolverMap` | `CraftNodeResolverMap` | Yes | Component resolver configuration |
| `nodeDataMap` | `Record<string, CraftNodeDatasource>` | No | Data sources keyed by node UUID |
| `eventsContext` | `Record<string, any>` | No | Context object available to event handlers |

### Nuxt Example

```vue
<template>
  <div class="page-content">
    <CraftStaticRenderer
      v-if="content?.length"
      :nodes="content"
      :resolver-map="resolverMap"
    />
  </div>
</template>

<script setup>
import { CraftStaticRenderer } from '@versa-stack/v-craft'

const { $vcraftConfig } = useNuxtApp()
const resolverMap = $vcraftConfig?.resolverMap || {}

const { data: content } = await useFetch('/api/page-content')
</script>
```

## renderCraftNodesToVNodes Function

For programmatic rendering or custom render functions.

### Basic Usage

```ts
import { renderCraftNodesToVNodes } from '@versa-stack/v-craft'
import { h } from 'vue'

const vnodes = renderCraftNodesToVNodes(nodes, {
  resolverMap,
  componentRegistry: { MyButton, MyText }
})
```

### Options

```ts
interface RenderOptions<T extends object> {
  resolverMap: CraftNodeResolverMap<T>
  componentRegistry?: Record<string, any>
}
```

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `resolverMap` | `CraftNodeResolverMap` | Yes | Component resolver configuration |
| `componentRegistry` | `Record<string, Component>` | No | Map of component names to actual components. If not provided, component names are used as-is (requires global registration) |

### Custom Render Function Example

```vue
<script setup>
import { renderCraftNodesToVNodes } from '@versa-stack/v-craft'
import { h, computed } from 'vue'
import MyButton from './MyButton.vue'
import MyText from './MyText.vue'

const props = defineProps<{
  nodes: CraftNode[]
}>()

const resolverMap = {
  MyButton: { componentName: 'MyButton' },
  MyText: { componentName: 'MyText' }
}

const renderedContent = computed(() => 
  renderCraftNodesToVNodes(props.nodes, {
    resolverMap,
    componentRegistry: { MyButton, MyText }
  })
)
</script>

<template>
  <component :is="() => renderedContent" />
</template>
```

## Comparison with CraftFrame

| Feature | CraftFrame | CraftStaticRenderer |
|---------|------------|---------------------|
| SSR Compatible | ❌ | ✅ |
| Requires Pinia | ✅ | ❌ |
| Edit Mode | ✅ | ❌ |
| View-Only Mode | ✅ | ✅ |
| Drag & Drop | ✅ | ❌ |
| Event Handlers | ✅ | ✅ |
| Data Sources | ✅ | ✅ |
| Visibility Control | ✅ | ✅ |

## Migration from CraftFrame

If you're currently using `CraftFrame` with `viewOnly: true` and experiencing SSR issues:

### Before (SSR Error)

```vue
<template>
  <CraftFrame :view-only="true" :resolver-map="resolverMap" />
</template>

<script setup>
import { CraftFrame, useEditor } from '@versa-stack/v-craft'

const editor = useEditor()
editor.setNodes(content)
</script>
```

### After (SSR Compatible)

```vue
<template>
  <CraftStaticRenderer :nodes="content" :resolver-map="resolverMap" />
</template>

<script setup>
import { CraftStaticRenderer } from '@versa-stack/v-craft'
</script>
```

## Nested Content

The static renderer handles nested content automatically:

```ts
const nodes = [
  {
    uuid: '1',
    componentName: 'Container',
    props: { padding: '20px' },
    slots: {
      default: [
        {
          uuid: '2',
          componentName: 'MyText',
          props: { content: 'Nested content' },
          slots: {}
        }
      ]
    }
  }
]
```

Content is passed as default slot content to parent components.

## Event Handlers

Event handlers work the same as in `CraftFrame`. Define events on nodes and provide context:

```vue
<template>
  <CraftStaticRenderer
    :nodes="nodes"
    :resolver-map="resolverMap"
    :events-context="eventsContext"
  />
</template>

<script setup>
const eventsContext = {
  showAlert: (message) => alert(message),
  navigate: (path) => router.push(path),
  trackEvent: (name) => analytics.track(name),
}

const nodes = [
  {
    uuid: '1',
    componentName: 'MyButton',
    props: { label: 'Click me' },
    events: {
      click: 'ctx.showAlert("Button clicked!")'
    },
    slots: {}
  }
]
</script>
```

## Data Sources

Bind dynamic data to nodes using `nodeDataMap`:

```vue
<template>
  <CraftStaticRenderer
    :nodes="nodes"
    :resolver-map="resolverMap"
    :node-data-map="nodeDataMap"
  />
</template>

<script setup>
const nodes = [
  {
    uuid: 'product-list',
    componentName: 'ProductGrid',
    props: {},
    slots: {
      default: [
        {
          uuid: 'product-card',
          componentName: 'ProductCard',
          props: { name: '', price: 0 },
          slots: {}
        }
      ]
    }
  }
]

const nodeDataMap = {
  'product-list': {
    type: 'list',
    list: [
      { name: 'Product A', price: 29.99 },
      { name: 'Product B', price: 49.99 },
      { name: 'Product C', price: 19.99 },
    ]
  }
}
</script>
```

### Data Source Types

| Type | Description |
|------|-------------|
| `single` | Merges `item` props into each node once |
| `list` | Repeats nodes for each item in `list`, merging item props |

## Limitations

The static renderer is designed for view-only SSR scenarios:

- **No editor state**: Cannot select, drag, or modify nodes
- **No node refs**: Does not register DOM element references

For editing capabilities, use `CraftFrame` on the client side.
