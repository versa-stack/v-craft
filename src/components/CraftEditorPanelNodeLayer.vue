<template>
  <li
    class="v-craft-node-layer"
    :class="{
      'v-craft-node-layer-selected': isSelected,
    }"
    @click.prevent.stop="emit('layer-click', craftNode)"
  >
    <div class="v-craft-component-layer-face">
      <div class="v-craft-component-name">{{ componentName }}</div>
      <button
        type="button"
        class="v-craft-component-icon"
        @click.prevent.stop="iconClick"
      >{{ isVisible ? 'hide' : 'show' }}</button>
    </div>
    <ul class="v-craft-node-layers nested-layers" v-if="craftNode.children?.length">
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

const componentName = computed(() => resolveNodeName(craftNode.value));
const isSelected = computed(
  () => selectedNode?.value?.uuid === craftNode.value.uuid
);

const iconClick = () => {
  editor.toggleNodeVisibility(craftNode.value);
};
</script>

<style lang="scss" scoped>
.v-craft-node-layer {
  padding: 5px 0;
  border-bottom: 1px solid var(--v-craft-gray-dark);
  list-style-type: none;

  &.v-craft-node-layer-selected {
    & > .v-craft-component-layer-face {
      background-color: var(--v-craft-blue-lighter-5);

      &:hover {
        background-color: var(--v-craft-blue-lighter-15);
      }
    }
  }

  :deep(.v-craft-component-layer-face) {
    display: flex;
    align-items: center;
    padding: 2px 5px;
    background-color: var(--v-craft-gray-medium);
    border-radius: 3px;
    transition: background-color 0.2s ease;
    position: relative;

    &::before {
      position: absolute;
      background-color: var(--v-craft-gray-medium);
      width: 0.5em;
      height: 1px;
      top: 50%;
      left: -0.5em;
      content: " ";
    }

    &:hover {
      background-color: var(--v-craft-gray-medium-lighter-15);
      
    }
  }

  :deep(.v-craft-component-name) {
    flex-grow: 1;
    font-size: 12px;
    cursor: pointer;
  }

  :deep(.v-craft-component-icon) {
    font-size: 12px;
    cursor: pointer;
    margin-left: 5px;
    transition: color 0.2s ease;
    &:hover {
      color: var(--v-craft-blue);
    }
    border: none;
    padding: 0.12em;
  }

  :deep(.nested-layers) {
    margin-left: 15px;
    border-left: 1px solid var(--v-craft-gray-medium);
    padding-left: 5px;
  }
}
</style>
