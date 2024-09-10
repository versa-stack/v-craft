
<template>
  <div class="fvc-panel fvc-layers-panel">
    <h3 class="fvc-title">Layers</h3>
    <div class="fvc-layers">
      <ul class="fvc-node-layers">
        <CraftEditorPanelNodeLayer
          v-for="(craftNode, key) in nodes"
          :key="key"
          :craftNode="craftNode"
          @layer-click="layerClick"
        />
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "CraftEditorPanelLayers",
};
</script>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useEditor } from "../store/editor";

const editor = useEditor();
const { nodes } = storeToRefs(editor);

const layerClick = (craftNode) => {
  editor.selectNode(craftNode);
};
</script>

<style lang="scss" scoped>
@import '../assets/editorPanelLayers';
</style>

