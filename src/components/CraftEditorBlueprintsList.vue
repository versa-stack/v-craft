<template>
  <div v-if="resolver">
    <div v-for="group in blueprints.groups">
      <slot
        name="blueprint-group"
        :group="group"
        :resolver="resolver"
      >
        <h4>{{ group.label }}</h4>
        <div class="flex flex-wrap gap-2 p-1">
          <CraftEditorBlueprint
            v-for="(craftNode, key) in blueprintsWithDefaults(group, resolver)"
            :key="key"
            :craft-node="craftNode"
          >
            <div class="v-craft-blueprint">
              <div class="v-craft-blueprint-label">
                {{ craftNode.label }}
              </div>
            </div>
          </CraftEditorBlueprint>
        </div>
      </slot>
    </div>
  </div>
</template>
<script
  lang="ts"
  setup
  generic="T extends FormKitSchemaDefinition = FormKitSchemaDefinition"
>
import type { FormKitSchemaDefinition } from "@formkit/core";
import { ComputedRef, inject } from "vue";
import CraftNodeResolver from "../lib/CraftNodeResolver";
import { BlueprintsLibrary } from "../lib/model";
import { blueprintsWithDefaults } from "./utils";

defineProps<{
  blueprints: BlueprintsLibrary;
}>();

const resolver = inject<ComputedRef<CraftNodeResolver<T>>>("resolver");
</script>
