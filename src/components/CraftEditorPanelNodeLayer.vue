<template>
  <li
    class="fvc-node-layer"
    :class="{
      'fvc-node-layer-selected': isSelected,
    }"
    @click.prevent.stop="emit('layer-click', craftNode)"
  >
    <div class="fvc-component-layer-face">
      <div class="fvc-component-name">{{ componentName }}</div>
      <FontAwesomeIcon
        class="fvc-component-icon"
        :icon="icon"
        @click.prevent.stop="iconClick"
      />
    </div>
    <ul class="fvc-node-layers nested-layers" v-if="craftNode.children?.length">
      <CraftEditorPanelNodeLayer
        v-for="(n, index) in craftNode.children"
        :key="index"
        :craftNode="n"
        @layer-click="(node) => emit('layer-click', node)"
        :visible="isVisible"
      />
    </ul>
  </li>
</template>
<script lang="ts" setup>
import { computed, toRefs, watch } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { useEditor } from "../store/editor";
import { CraftNode, resolveNodeName } from "../lib/craftNode";
import { storeToRefs } from "pinia";

const props = withDefaults(
  defineProps<{
    craftNode: CraftNode;
    visible?: boolean;
  }>(),
  {
    visible: true,
  }
);

const { craftNode, visible } = toRefs(props);

const isVisible = computed(
  () =>
    (visible.value && craftNode.value.visible === undefined) ||
    craftNode.value.visible
);

const emit = defineEmits(["layer-click"]);
const editor = useEditor();
const { selectedNode } = storeToRefs(editor);

const icon = computed(() => (isVisible.value ? "eye" : "eye-slash"));
const componentName = computed(() => resolveNodeName(craftNode.value));
const isSelected = computed(
  () => selectedNode?.value?.uuid === craftNode.value.uuid
);

const iconClick = () => {
  editor.toggleNodeVisibility(craftNode.value);
};
</script>
<style lang="scss" scoped>
@use "sass:color";
@import "../assets/panel";
.fvc-node-layer {
  padding: 5px 0;
  border-bottom: 1px solid $gray-dark;
  list-style-type: none;

  &.fvc-node-layer-selected {
    & > .fvc-component-layer-face {
      background-color: color.adjust($blue, $lightness: 5%);

      &:hover {
        background-color: color.change($blue, $lightness: 15%);
      }
    }
  }

  :deep(.fvc-component-layer-face) {
    display: flex;
    align-items: center;
    padding: 2px 5px;
    background-color: $gray-medium;
    border-radius: 3px;
    transition: background-color 0.2s ease;
    position: relative;

    &::before {
      position: absolute;
      background-color: $gray-medium;
      width: 0.5em;
      height: 1px;
      top: 50%;
      left: -0.5em;
      content: " ";
    }

    &:hover {
      background-color: color.adjust($gray-medium, $lightness: 15%);
      
    }
  }

  :deep(.fvc-component-name) {
    flex-grow: 1;
    font-size: 12px;
    cursor: pointer;
  }

  :deep(.fvc-component-icon) {
    font-size: 12px;
    cursor: pointer;
    margin-left: 5px;
    transition: color 0.2s ease;
    &:hover {
      color: $blue;
    }
  }

  :deep(.nested-layers) {
    margin-left: 15px;
    border-left: 1px solid $gray-medium;
    padding-left: 5px;
  }
}

:global(.fvc-delete.formkit-input) {
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
