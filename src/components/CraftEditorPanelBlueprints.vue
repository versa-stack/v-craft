<template>
  <div class="fvc-panel fvc-blueprints-panel">
    <h3 class="fvc-title">blueprints</h3>
    <div v-for="group in blueprints.groups">
      <h3>{{ group.label }}</h3>
      <CraftEditorBlueprint
        v-for="(craftNode, key) in blueprintsWithDefaults(group)"
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
  </div>
</template>
<script lang="ts" setup>
import { ComputedRef, computed, inject } from "vue";
import CraftNodeResolver from "../lib/CraftNodeResolver";
import { CraftNode } from "../lib/craftNode";
import { BlueprintGroup, BlueprintsLibrary } from "../lib/model";

defineProps<{
  blueprints: BlueprintsLibrary;
}>();

const resolver = inject<ComputedRef<CraftNodeResolver>>("resolver");

const blueprintsWithDefaults = (group: BlueprintGroup) => {
  if (!resolver?.value) return [];

  const returnVal: any[] = [];
  Object.keys(group.blueprints).forEach((key) => {
    const blueprint = group.blueprints[key];
    const defaultProps = resolver.value.getDefaultProps(blueprint as CraftNode);
    blueprint.props = { ...defaultProps, ...blueprint.props };
    returnVal.push(blueprint);
  });

  return returnVal;
};

defineEmits<{
  (event: "close", ...args: any[]): void;
}>();
</script>
<style lang="scss" scoped>
@import "../assets/editorPanelBlueprints";
</style>
