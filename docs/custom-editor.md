---
aside: false
pageClass: no-aside
---

<script lang="ts" setup>
import Editor from "./components/demo/editor-app/custom-editor.vue"
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

## Custom Editor Panels

You can easily customize the editor by using the `panel-layout` slot.
Its slotProps include the `blueprints` configured for the editor.
You can either implement your own panels or use the existing ones.

- `<CraftEditorPanelLayers>`: Panel showing the layers of the editor.
- `<CraftEditorPanelBlueprints>`: Panel showing available blueprints and support drag 'n' drop.
- `<CraftEditorPanelSettings>`: Panel showing a form which is generated from the component resolver's scheme.

For more information on how to create custom Panels see the Panel components code.

---

<DemoContainer>
  <Editor />
</DemoContainer>


::: details Show code
<<< @/components/demo/editor-app/custom-editor.vue
:::

## Example: A Custom Service Data Panel

Panels aren't limited to editing a node's own props — the `panel-content` slot on `<CraftEditorPanelSettings>` also exposes `handleNodeDataUpdate`, the same handler backing the built-in "Data Source" panel. That's enough to build a panel that talks to an external service and feeds the result straight into [the node-data mechanism](./editor#injecting-data-into-the-node-tree), without touching anything else in the editor.

The demo above includes a working example: select the **"Lorem API Demo"** section (dashed border, near the bottom of the canvas) and use the **"Lorem API"** panel on the right to fetch real placeholder paragraphs from [lorem-api.com](https://lorem-api.com/) and watch them replace the section's child text.

The panel itself is a small, self-contained component:

```vue
<!-- LoremDataPanel.vue -->
<template>
  <fieldset v-if="craftNode">
    <legend>Lorem API</legend>

    <FormKit
      type="number"
      label="Paragraphs"
      min="1"
      max="10"
      :value="paragraphCount"
      @input="(value) => (paragraphCount = Number(value) || 1)"
    />

    <button type="button" :disabled="loading" @click.prevent="fetchLorem">
      {{ loading ? "Fetching…" : "Fetch from Lorem API" }}
    </button>
  </fieldset>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { CraftNode, CraftNodeDatasource } from "@versa-stack/v-craft";

const props = defineProps<{
  craftNode?: CraftNode;
  handleNodeDataUpdate: (data: CraftNodeDatasource | null) => void;
}>();

const paragraphCount = ref(3);
const loading = ref(false);

const fetchLorem = async () => {
  loading.value = true;
  try {
    const response = await fetch(
      `https://lorem-api.com/api/lorem?paragraphs=${paragraphCount.value}`,
    );
    // The API returns plain text, one paragraph per line - no JSON to
    // parse, just split it and give each line a field name to map from.
    const paragraphs = (await response.text())
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    props.handleNodeDataUpdate({
      type: "list",
      list: paragraphs.map((text) => ({ text })),
    });
  } finally {
    loading.value = false;
  }
};
</script>
```

::: details Show full source (with loading/error state)
<<< @/components/demo/editor-app/LoremDataPanel.vue
:::

There's nothing v-craft-specific about the fetch itself — it's an ordinary `fetch()` call. The only integration point is the last line: calling `handleNodeDataUpdate` with a `{ type: "list", list }` datasource. Everything downstream — cloning the section's child once per paragraph, and filling in whichever prop a child targets via `slotsPropsPropsMap: { data: { content: "$.text" } }` — is handled by the mechanism already in place; the panel doesn't need to know anything about who's listening.

Wiring it in is the same `panel-content` override pattern as above, just with one more field destructured and one more component rendered:

```vue-html{4,17-20}
<CraftEditorPanelSettings>
  <template
    #panel-content="{
      selectedNode, handleNodeDataUpdate, /* ...other slot props */
    }"
  >
    <LoremDataPanel
      :craftNode="selectedNode"
      :handleNodeDataUpdate="handleNodeDataUpdate"
    />
  </template>
</CraftEditorPanelSettings>
```

This is the general recipe for any "service data configuration" panel — a weather API, a CMS, a search index, your own backend: build a small form for whatever parameters the service needs, call it, and hand the result to `handleNodeDataUpdate` (or `editor.setNodeData()` directly, if the panel isn't nested inside `CraftEditorPanelSettings`). See [Data Wrappers](./data-wrappers) for the equivalent pattern when the fetch should happen automatically (e.g. on mount) rather than from a user-triggered panel action.