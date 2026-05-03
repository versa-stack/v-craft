# AI Guide: @versa-stack/v-craft

This document is specifically for AI/LLM assistants to understand how to use `@versa-stack/v-craft` correctly.

## What Is It?

A Vue 3 drag-and-drop page editor kit. It renders a tree of `CraftNode` instances in an editable iframe. Users drag components from a palette (defined by **Blueprints**) into a canvas. The state is managed by a Pinia store.

---

## Critical Type Distinction

### Blueprint — palette entry (template)

```typescript
type Blueprint = {
  label: string;
  componentName: string;
  props: Record<string, any>;
  children: Blueprint[];  // always Blueprint[], always empty for simple components
}
```

Used only in the editor UI palette. Never used at runtime.

### CraftNode — runtime instance

```typescript
type CraftNode = {
  uuid: string;
  componentName: string;
  props: Record<string, any>;
  slots: Record<string, CraftNode[]>;  // keyed by slot name, e.g. "default", "header", "body"
  parentUuid?: string | null;
  visible?: boolean;
  rules?: CraftNodeRules;
  events?: Record<string, string>;
}
```

**Never use `children` on a CraftNode. Never use `slots` on a Blueprint.**

---

## Resolver Map

Every component used in the editor must be registered in a resolver map:

```typescript
import { CraftNodeResolver } from '@versa-stack/v-craft'

const resolver = new CraftNodeResolver({
  MyButton: {
    componentName: 'MyButton',
    defaultProps: { text: 'Click me' },
    slots: ['default'],         // optional: declare named slots for the editor UI
    rules: {
      canDrag: (node) => true,
      canMoveIn: (node, target, resolver) => true,
    },
  },
  MyContainer: {
    componentName: 'MyContainer',
    slots: ['header', 'body'], // tells the editor to show drop zones for each slot
  },
})
```

The `slots` array on `CraftNodeComponentMap` controls which named slot drop-zones are shown for that component in the editor. If omitted, the editor falls back to the slots already present in `CraftNode.slots`, or `['default']`.

---

## Multi-Slot Components

Components can expose multiple named slots. Example:

```vue
<!-- MyContainer.vue -->
<template>
  <div>
    <header><slot name="header" /></header>
    <main><slot name="body" /></main>
  </div>
</template>
```

Register it with named slots in the resolver:

```typescript
MyContainer: {
  componentName: 'MyContainer',
  slots: ['header', 'body'],
}
```

Blueprint for a multi-slot container always uses `CraftCanvas`:

```typescript
const myBlueprints = {
  MyContainer: {
    label: 'My Container',
    componentName: 'CraftCanvas',
    props: { componentName: 'MyContainer' },
    children: [],
  }
}
```

When the user drops a node into a multi-slot container, the drop logic targets the **first existing slot name** found in `CraftNode.slots`, falling back to `'default'`.

---

## Setting Up an Editor

```vue
<template>
  <CraftFrame
    :resolver="resolver"
    :blueprints-library="blueprintsLibrary"
  />
</template>

<script setup lang="ts">
import { CraftFrame, CraftNodeResolver } from '@versa-stack/v-craft'
import MyButton from './MyButton.vue'
import MyContainer from './MyContainer.vue'

const resolver = new CraftNodeResolver({
  MyButton: { componentName: 'MyButton' },
  MyContainer: { componentName: 'MyContainer', slots: ['header', 'body'] },
})

const blueprintsLibrary = {
  label: 'My Components',
  blueprints: {
    MyButton: {
      label: 'Button',
      componentName: 'MyButton',
      props: { text: 'Click me' },
      children: [],
    },
    MyContainer: {
      label: 'Container',
      componentName: 'CraftCanvas',
      props: { componentName: 'MyContainer' },
      children: [],
    },
  },
}
</script>
```

---

## SSR / Static Rendering

Use `CraftStaticRenderer` when you want to render a saved `CraftNode[]` tree without any editor functionality (e.g. in Nuxt SSR):

```vue
<template>
  <CraftStaticRenderer :nodes="pageContent" :resolver-map="resolverMap" />
</template>

<script setup lang="ts">
import { CraftStaticRenderer } from '@versa-stack/v-craft'

const resolverMap = {
  MyButton: { componentName: 'MyButton' },
}

const pageContent = [
  {
    uuid: 'abc-123',
    componentName: 'MyButton',
    props: { text: 'Hello' },
    slots: {},
  }
]
</script>
```

For programmatic rendering:

```typescript
import { renderCraftNodesToVNodes } from '@versa-stack/v-craft'

const vnodes = renderCraftNodesToVNodes(nodes, { resolverMap })
```

---

## Data Binding (nodeDataMap)

Bind dynamic data to nodes via the Pinia store or the `nodeDataMap` prop:

```typescript
type CraftNodeDatasource = {
  type: 'single' | 'list';
  item?: Record<string, any>;   // used when type === 'single'
  list?: Record<string, any>[]; // used when type === 'list'
  slotName?: string;             // which slot to bind to (defaults to all)
}
```

- `single`: merges `item` props into each child node once
- `list`: repeats the child nodes for each item in `list`, merging item props

```typescript
editor.setNodeData('node-uuid', {
  type: 'list',
  slotName: 'body',
  list: [
    { name: 'Product A', price: 29.99 },
    { name: 'Product B', price: 49.99 },
  ]
})
```

---

## Building CraftNode Trees

Use `buildCraftNodeTree` to recursively assign UUIDs to a node and all its slot children:

```typescript
import { buildCraftNodeTree } from '@versa-stack/v-craft'
import { v4 as uuidv4 } from 'uuid'

const tree = buildCraftNodeTree({
  uuid: uuidv4(),
  componentName: 'MyContainer',
  props: {},
  slots: {
    header: [
      { uuid: uuidv4(), componentName: 'MyButton', props: { text: 'Go' }, slots: {} }
    ],
    body: [],
  },
})
```

---

## CraftCanvas

`CraftCanvas` is a built-in wrapper component that enables drag-and-drop container behavior. It is **only used in blueprints**, not in your own Vue components.

- In a blueprint: set `componentName: 'CraftCanvas'` and pass the real component name as `props.componentName`
- The editor will render the real component and enable child drop zones automatically

```typescript
// Blueprint for a container
{
  label: 'Card',
  componentName: 'CraftCanvas',
  props: { componentName: 'MyCard' },
  children: [],
}
```

---

## Drag/Drop Rules

Define per-node rules in the resolver map:

```typescript
{
  componentName: 'DropZone',
  rules: {
    canMoveIn: (incoming, target, resolver) => incoming.componentName === 'MyButton',
    canMoveOut: (node, target, resolver) => true,
    canDrag: (node) => true,
    canMoveInto: (node, target, resolver) => true,
  }
}
```

---

## Key Files

| File | Purpose |
|------|---------|
| `src/lib/craftNode.ts` | `CraftNode` type, `buildCraftNodeTree`, all drag/drop rule helpers |
| `src/lib/CraftNodeResolver.ts` | `CraftNodeResolver` class, `CraftNodeComponentMap` type |
| `src/store/editor.ts` | Pinia store — node map, selection, drag state, slot-aware `appendNodeTo`/`prependNodeTo` |
| `src/lib/dragCraftNode/drop.ts` | Drop event logic — determines slot from existing node slots |
| `src/components/CraftNodeEditor.vue` | Renders editable node tree; `availableSlots` computed from resolver or node state |
| `src/components/CraftContainerExample.vue` | Reference 2-slot component (`header` + `body`) |
| `src/blueprints/default.ts` | Default blueprint library |

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Using `children` on a CraftNode | Use `slots: { default: [] }` |
| Using `slots` on a Blueprint | Use `children: []` |
| Forgetting `uuid` on a CraftNode | Use `uuidv4()` or call `buildCraftNodeTree` |
| Using a component name not in the resolver | Add it to `CraftNodeResolver` |
| Wrapping your Vue component with `CraftCanvas` in your template | Only use `CraftCanvas` in blueprint definitions, not in component templates |
