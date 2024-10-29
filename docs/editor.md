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
