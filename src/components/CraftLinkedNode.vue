<template>
  <div
    class="v-craft-linked"
    :data-link-page="craftNode.link?.page"
  >
    <div
      v-if="resolved === null"
      class="v-craft-linked-broken"
    >
      Broken link: {{ craftNode.link?.page }} / {{ craftNode.link?.node }}
    </div>
    <CraftNodeStatic
      v-else-if="resolved"
      :craft-node="resolved"
      :node-map="emptyMap"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted } from "vue";
import { CraftNode } from "../lib/craftNode";
import { useEditor } from "../store/editor";
import CraftNodeStatic from "./CraftNodeStatic.vue";

defineOptions({
  name: "CraftLinkedNode",
});

const props = defineProps<{
  craftNode: CraftNode;
}>();

const editor = useEditor();
const emptyMap = new Map<string, CraftNode>();
const resolved = computed(() => editor.linkedTrees[props.craftNode.uuid]);

onMounted(() => {
  if (!(props.craftNode.uuid in editor.linkedTrees)) {
    editor.resolveLinkedNode(props.craftNode);
  }
});
</script>
