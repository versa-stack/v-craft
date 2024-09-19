<template>
  <div class="fvc-panel fvc-blueprints-panel">
    <h3 class="fvc-title">blueprints</h3>
    <CraftEditorBlueprint
      v-for="(craftNode, key) in blueprintsWithDefaults"
      :craftNode="craftNode"
      :key="key"
    >
      <div class="fvc-blueprint">
        <div class="fvc-label">
          {{ craftNode.label }}
        </div>
      </div>
    </CraftEditorBlueprint>
  </div>
</template>
<script lang="ts" setup>
import { Blueprints } from "../lib/model";
import { inject, ComputedRef, computed } from "vue";
import CraftNodeResolver from "../lib/CraftNodeResolver";
import { CraftNode } from "../lib/craftNode";

const props = defineProps<{
  blueprints: Blueprints;
}>();

const resolver = inject<ComputedRef<CraftNodeResolver>>("resolver");

const blueprintsWithDefaults = computed(() => {
  if (!resolver?.value) return [];
  const returnVal: any[] = [];
  Object.keys(props.blueprints).forEach((key) => {
    const blueprint = props.blueprints[key];
    const defaultProps = resolver.value.getDefaultProps(blueprint as CraftNode);
    blueprint.props = { ...defaultProps, ...blueprint.props };
    returnVal.push(blueprint);
  });

  return returnVal;
});

defineEmits<{
  (event: "close", ...args: any[]): void;
}>();
</script>
<style lang="scss">
@import "../assets/editorPanelBlueprints";
</style>
