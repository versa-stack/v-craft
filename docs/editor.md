<script lang="ts" setup>
import Editor from "./components/demo/editor-app/editor.vue"
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
