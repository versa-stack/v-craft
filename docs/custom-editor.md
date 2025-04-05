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
const editor = useEditor()();
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