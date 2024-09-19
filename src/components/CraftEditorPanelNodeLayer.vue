<template>
  <li
    class="fvc-node-layer"
    @click.prevent.stop="emit('layer-click', craftNode)"
  >
    <div class="fvc-component-layer-face">
      <div class="fvc-component-name">{{ componentName }}</div>
      <FontAwesomeIcon :icon="icon" @click.prevent.stop="iconClick" />
    </div>
    <ul class="fvc-node-layers nested-layers" v-if="craftNode.children?.length">
      <CraftEditorPanelNodeLayer
        v-for="(n, index) in craftNode.children"
        :key="index"
        :craftNode="n"
        @layer-click="(node) => emit('layer-click', node)"
        :visible="visible"
      />
    </ul>
  </li>
</template>
<script lang="ts" setup>
import { computed } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { useEditor } from "../store/editor";
import { CraftNode } from "../lib/craftNode";

const props = defineProps<{
  craftNode: CraftNode;
  visible: boolean;
}>();

const craftNodeIsCanvas = (node: CraftNode) => {
  return node.componentName === "CraftCanvas";
};

const emit = defineEmits(["layer-click"]);
const editor = useEditor();
const icon = computed(() => (props.visible ? "eye" : "eye-slash"));
const iconClick = () => {
  editor.toggleNodeVisibility(props.craftNode);
};

const componentName = craftNodeIsCanvas(props.craftNode)
  ? `${props.craftNode.componentName} (${props.craftNode.props.component})`
  : props.craftNode.componentName;
</script>
<style lang="scss" scoped>
@import "../assets/panel";

.fvc-node-layer {
  padding: 5px 0;
  border-bottom: 1px solid #3a3a3a;

  .fvc-component-layer-face {
    display: flex;
    align-items: center;
    padding: 2px 5px;
    background-color: #3a3a3a;
    border-radius: 3px;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: #4a4a4a;
    }
  }

  .fvc-component-name {
    flex-grow: 1;
    font-size: 12px;
  }

  .nested-layers {
    margin-left: 15px;
    border-left: 1px solid #4a4a4a;
    padding-left: 5px;
  }
}

.fvc-delete.formkit-input {
  background-color: #d64937;
  color: #ffffff;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  &:hover {
    background-color: #c43c2b;
  }
}
</style>
