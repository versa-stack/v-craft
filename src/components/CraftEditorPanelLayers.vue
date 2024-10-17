<template>
  <div class="v-craft-panel v-craft-layers-panel">
    <h3 class="v-craft-title">layers</h3>
    <div class="v-craft-layers">
      <ul class="v-craft-node-layers">
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
<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useEditor } from "../store/editor";
import { CraftNode } from "../lib/craftNode";

defineOptions({
  name: "CraftEditorPanelLayers",
});

const editor = useEditor();
const { nodes } = storeToRefs(editor);

const layerClick = (craftNode: CraftNode) => {
  editor.selectNode(craftNode);
  
};
</script>

<style lang="scss" scoped>
@use "../assets/mixins" as *;

.v-craft-panel.v-craft-layers-panel {
  padding: 10px;
  display: flex;
  flex-direction: column;
  height: auto;
  position: relative;
  width: 23rem;
}

.v-craft-layers {
  @include v-craft-scrollable;
  max-height: 300px;
  overflow-y: auto;
  margin-top: 10px;
}

ul.v-craft-node-layers {
  margin: 0;
  padding: 0;
  list-style-type: none;
}

</style>
