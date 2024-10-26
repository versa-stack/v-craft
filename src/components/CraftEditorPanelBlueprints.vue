<template>
  <div class="v-craft-panel v-craft-blueprints-panel">
    <h3 class="v-craft-title">blueprints</h3>
    <div class="v-craft-panel-content">
      <div v-for="group in blueprints.groups">
        <h4>{{ group.label }}</h4>
        <div class="flex flex-wrap gap-2 p-1">
          <CraftEditorBlueprint
            v-for="(craftNode, key) in blueprintsWithDefaults(group)"
            :craftNode="craftNode"
            :key="key"
          >
            <div class="v-craft-blueprint">
              <div class="v-craft-blueprint-label">
                {{ craftNode.label }}
              </div>
            </div>
          </CraftEditorBlueprint>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup generic="T extends object">
import { ComputedRef, computed, inject } from "vue";
import CraftNodeResolver from "../lib/CraftNodeResolver";
import { CraftNode } from "../lib/craftNode";
import { BlueprintGroup, BlueprintsLibrary } from "../lib/model";

defineProps<{
  blueprints: BlueprintsLibrary<T>;
}>();

const resolver = inject<ComputedRef<CraftNodeResolver<T>>>("resolver");

const blueprintsWithDefaults = (group: BlueprintGroup<T>) => {
  if (!resolver?.value) return [];

  const returnVal: any[] = [];
  Object.keys(group.blueprints).forEach((key) => {
    const blueprint = group.blueprints[key];
    const defaultProps = resolver.value.getDefaultProps(
      blueprint as CraftNode<T>
    );
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
.v-craft-blueprints-panel {
  min-width: 15em;
  max-width: 15em;
  width: 15em;

  .v-craft-blueprint {
    text-align: center;
    padding: 0.25em;
    position: relative;
    border: 1px solid var(--v-craft-gray-medium);
    border-radius: 3px;
    display: flex;
    align-items: center;
    cursor: pointer;
    background-color: var(--v-craft-background-color-lighter-10);
  }

  .v-craft-blueprint-label {
    font-size: 0.8em;
    text-transform: uppercase;
    font-weight: bold;
    color: var(--v-craft-gray-darker);
  }

  h4 {
    font-size: 0.8em;
    text-transform: uppercase;
    font-weight: bold;
    color: var(--v-craft-gray-medium);
    margin-bottom: 0.75em;
    margin-top: 2em;
  }
}
</style>
