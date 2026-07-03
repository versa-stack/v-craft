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

Some components expose data through Vue [scoped slots](https://vuejs.org/guide/components/slots.html#scoped-slots) — for example a list component that hands each item's data to whatever is placed inside it. A **child** `CraftNode` placed in that slot can pull individual fields out of that data and map them into its *own* props, without the parent needing to know anything about which children are inside it.

This mapping is driven by two optional fields, and they live in two different places — the producer side is a fixed property of the *component* (declared once by whoever writes the resolver), while the consumer side is per-*instance* data on the child `CraftNode` (configurable per placement, e.g. from the editor's "Props Mapping" panel):

```ts
// Resolvers.ts — the producer side, keyed by component, not by instance.
export type CraftNodeComponentMap<T> = {
  // ...
  // For each of this component's own slots, the context keys that
  // slot's scoped-slot data exposes to whatever is placed inside it.
  slotsProps?: Record<string, string[]>;
};
```

```ts
// craftNode.ts — the consumer side, one CraftNode instance at a time.
export type CraftNode = {
  // ...
  // Set on the CHILD, not the producer: which ancestor's exposed context
  // bucket(s) to read from, and how to map fields out of them into this
  // node's own props.
  slotsPropsPropsMap?: Record<string, Record<string, string>>;
};
```

- **`slotsProps`** lives on the resolver entry for the component whose template renders a scoped slot — it declares, per slot name, which keys that slot exposes (e.g. `["item", "index"]`). It's an intrinsic fact about that component's implementation, so it's declared once in the resolver map rather than repeated on every blueprint/instance. This also whitelists what gets forwarded down the tree — only these keys are captured, everything else the component exposes is ignored.
- **`slotsPropsPropsMap`** lives on the child `CraftNode` instance that wants to consume that data — each child configures its own mapping, independently of its siblings, and this *is* per-instance data (it's what the "Props Mapping" panel in the component inspector edits). Its outer key is the *context bucket name*, which is the slot name of the ancestor that produced the data (context accumulates as it flows down the tree, so a node can reach any ancestor's slot, not just its immediate parent). Its inner value maps `{ targetProp: fromPath }`, where `fromPath` is a [JSONPath](https://www.npmjs.com/package/jsonpath-plus) expression evaluated against the bucket's data — the same JSONPath convention used by [`mapData`](https://github.com/versa-stack/v-craft/blob/main/src/lib/mapData.ts) elsewhere in the library.

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

Its resolver entry declares what that slot exposes:

```ts
const resolverMap: CraftNodeResolverMap = {
  List: {
    componentName: "List",
    component: List,
    slots: ["default"],
    slotsProps: { default: ["item", "index"] },
  },
  // ...
};
```

A `CraftNode` tree can then wire an `item.name` field straight into a `Text` node's `label` prop:

```json
{
  "componentName": "List",
  "props": { "items": [{ "name": "Alice" }, { "name": "Bob" }] },
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

A configured mapping wins over whatever static value happens to sit in `props` for that same key — e.g. a blueprint's baked-in placeholder text shouldn't shadow a mapping you deliberately set up for that prop. Only props you *haven't* mapped stay under the sole control of `props`.

## Injecting Data into the Node Tree

The section above covers *how* a node picks fields out of ambient data via JSONPath. This section covers *where* that data actually comes from — there are two independent producers, and they both feed the same `slotsPropsPropsMap` mapping mechanism, just under different context-bucket names.

### 1. Scoped slots (component-internal data)

Covered above: a component's own template loops and exposes data via `<slot :item="x">`. The bucket name is whatever slot produced it (e.g. `"default"`), declared once via the resolver's `slotsProps`. This is the right fit when the repeated *shape* is baked into one Vue component (like `CraftListExample` in the demo above) — the component owns both the loop and the per-item markup.

### 2. Node data (externally injected data)

The other producer is `CraftNodeDatasource`, attached to a specific node's `uuid` via a `nodeDataMap`:

```ts
// craftNode.ts
export type CraftNodeDatasource = {
  item?: Record<string, any>;   // used when type is "single"
  list?: Record<string, any>[]; // used when type is "list"
  type: "single" | "list";
  slotName?: string;            // defaults to "default" when omitted
};
```

Unlike scoped slots, this doesn't require a dedicated looping component — it's meant for cases where the per-item *layout* is authored visually in the canvas (an arbitrary multi-node subtree: an image, a title, a price, laid out node-by-node) rather than baked into one component's template.

- **`type: "single"`** attaches one data object to a node's children — no duplication, just makes the object's fields available for mapping.
- **`type: "list"`** clones that node's children once per item in the array (the same fan-out behavior as before this feature existed) — but now each clone additionally gets its *own* item exposed for field-level mapping, instead of only the older wholesale prop-spread (see below).

Whichever node holds the datasource, its children (in `slotName`, or `"default"` if unset) can map fields out of it via the reserved **`"data"`** context bucket:

```json
{
  "componentName": "CraftCanvas",
  "props": { "componentName": "ProductCard" },
  "slots": {
    "default": [
      {
        "componentName": "Text",
        "props": {},
        "slots": {},
        "slotsPropsPropsMap": {
          "data": { "label": "$.title" }
        }
      }
    ]
  }
}
```

`"data"` here isn't a slot name — it's a reserved bucket name, always available (when populated) regardless of which slot the datasource targets.

#### Backward-compatible wholesale spread

Independently of field-level mapping, list/single datasources have always also spread the *entire* item object onto each clone's `props` wholesale (every key the item has, whether or not the child declares a matching prop). This still happens first and is unaffected by `slotsPropsPropsMap` — the two compose: the wholesale spread runs, then field mapping fills in (and, for keys it targets, overrides — see the precedence rule above) whatever it's configured for. If you don't need selective field mapping, wholesale spread alone may already be enough; `slotsPropsPropsMap` is for when you want a specific prop pulled from a specific path, e.g. `$.author.name` instead of the whole `item` object.

### Where the data actually comes from

`nodeDataMap` itself doesn't fetch or generate anything — something has to populate it. There are three ways, depending on context:

- **`editor.setNodeData(uuid, data)`** — the store action for the live, interactive editor (`CraftEditor`/`CraftNodeEditor`). This is the intended integration point for a host application: fetch your own data, then call this whenever it changes. Nothing in the library calls it automatically.
- **The `nodeDataMap` prop on `CraftStaticRenderer`** — for production/SSR rendering outside the interactive editor, pass the map in directly as a prop instead of going through the Pinia store.
- **The "Data Source" panel in the component inspector** — a small JSON-paste UI (`type` toggle + textarea) built specifically so you can experiment with mapping in the docs demo above without writing any code. It's a convenience for trying out `slotsPropsPropsMap` against arbitrary data, not the production data path — a real application should call `setNodeData()` (or pass `nodeDataMap`) with real data instead of asking users to paste JSON.

::: warning Not yet wired up
`src/lib/mapData.ts` (`CraftDataWrapperPropMap`/`CraftDataPatch`) exists as a JSONPath-based transform utility intended to reshape a raw API response into the `CraftNodeDatasource` shape before it reaches `nodeDataMap`, but nothing in the library currently calls it — treat it as unfinished, not as part of the supported data flow. Until it's wired in (or replaced), transform raw data into `{ type, item }` / `{ type, list }` yourself before calling `setNodeData()`.
:::

### Choosing a mechanism

| | Scoped slots | Node data (single) | Node data (list) |
|---|---|---|---|
| Per-item layout lives in | one Vue component's template | an arbitrary canvas subtree | an arbitrary canvas subtree, cloned per item |
| Duplicates CraftNode children? | no (Vue's own `v-for` handles it) | no | yes, once per item |
| Declared via | resolver `slotsProps` | `nodeDataMap` (`type: "single"`) | `nodeDataMap` (`type: "list"`) |
| Good fit for | reusable widgets (carousels, repeaters) you're building as components anyway | attaching a single record's fields to a hand-laid-out section | product grids / feeds where each card is authored visually, not as one component |
