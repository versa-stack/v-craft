---
aside: false
pageClass: no-aside
---

<script lang="ts" setup>
import Editor from "./components/demo/editor-app/editor.vue"
import { useEditor } from "@versa-stack/v-craft"
import { watch, ref, onMounted } from "vue"
import {storeToRefs} from "pinia"

const nodeTreeJson = ref("")
const editor = useEditor();
const { nodeMap } = storeToRefs(editor);

onMounted(() => {
  nodeTreeJson.value = JSON.stringify(editor.nodeTree, null, 2);
})

watch(() => editor.nodeTree, (nt) => {
  nodeTreeJson.value = JSON.stringify(nt, null, 2);
}, {
  deep: true
})

</script>


::: info Editor Demo
Below you can see a working demo of the UI Editor.<br/>
You can drag components from the `blueprints` panel onto the canvas or reaarange them via drag and drop within the canvas itself. <br/>
Click components to see their properties in the `component inspector`. <br/>
The `tree` panel shows you an overview of components in the canvas where you can also hide or show individual components.

Double clicking any text will enter in place editing.
:::

---

<DemoContainer>
  <Editor />
</DemoContainer>


::: details Show editor content
<pre class="w-full overflow-auto">{{ nodeTreeJson }}</pre>
:::

::: details Show code
<<< @/components/demo/editor-app/editor.vue
:::

## Resolvers and Blueprints

Resolvers and Blueprints are essential concepts in the v-craft editor, enabling component management and preset layouts. They enhance the editor's functionality by defining available components and providing pre-configured component structures.

### Resolver Maps

Resolver maps inform the editor about available components and their properties.

#### Purpose

- Define existing components for the editor
- Specify component events and properties

<<< @/components/demo/editor-app/resolvermap.ts

### Blueprints

Blueprints describe preset component trees that can be added to the page layout via drag-and-drop.

#### Purpose

- Create reusable component structures
- Enable quick addition of complex layouts

<<< @/components/demo/editor-app/blueprints.ts

## Mapping Slot Context to Component Props

Some components expose data through Vue [scoped slots](https://vuejs.org/guide/components/slots.html#scoped-slots) — for example a list component that hands each item's data to whatever is placed inside it. A `CraftNode` can capture that data and map individual fields into its own children's props, without those children needing to know anything about the parent that produced the data.

This mapping is driven by two optional fields on `CraftNode`:

```ts
type CraftNode = {
  // ...
  // For each of this node's own slots, the keys exposed by its scoped slot.
  slotsProps?: Record<string, string[]>;
  // For each descendant, which named context bucket(s) to read from and
  // how to map fields out of them into that node's own props.
  slotsPropsPropsMap?: Record<string, Record<string, string>>;
};
```

- **`slotsProps`** lives on the node whose underlying component renders a scoped slot. It declares, per slot name, which keys that slot exposes (e.g. `["item", "index"]`). This whitelists what gets forwarded down the tree — only these keys are captured, everything else the component exposes is ignored.
- **`slotsPropsPropsMap`** lives on the descendant node that wants to consume that data. Its outer key is the *context bucket name*, which is the slot name of the ancestor that produced the data (context accumulates as it flows down the tree, so a node can reach any ancestor's slot, not just its immediate parent). Its inner value maps `{ targetProp: fromPath }`, where `fromPath` is a [JSONPath](https://www.npmjs.com/package/jsonpath-plus) expression evaluated against the bucket's data — the same JSONPath convention used by [`mapData`](https://github.com/versa-stack/v-craft/blob/main/src/lib/mapData.ts) elsewhere in the library.

### Example

Given a `List` component that renders its default slot once per item, exposing `{ item, index }`:

```vue
<!-- List.vue -->
<template>
  <div v-for="(item, index) in items" :key="index">
    <slot :item="item" :index="index" />
  </div>
</template>
```

A `CraftNode` tree can wire an `item.name` field straight into a `Text` node's `label` prop:

```json
{
  "componentName": "List",
  "props": { "items": [{ "name": "Alice" }, { "name": "Bob" }] },
  "slotsProps": { "default": ["item", "index"] },
  "slots": {
    "default": [
      {
        "componentName": "Text",
        "props": {},
        "slots": {},
        "slotsPropsPropsMap": {
          "default": { "label": "$.item.name" }
        }
      }
    ]
  }
}
```

Here `"default"` in `slotsPropsPropsMap` refers to the `default` slot's context bucket declared by the parent's `slotsProps`. The `Text` node's `label` prop is resolved from `$.item.name` against that bucket, so it renders `"Alice"` for the first item and `"Bob"` for the second — without the `Text` node ever being told about `List`.

A prop explicitly set on the node (via `props`) always wins over a mapped value, so `slotsPropsPropsMap` only fills in props that aren't already set.
