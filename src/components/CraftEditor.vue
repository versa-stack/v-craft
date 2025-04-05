<template>
  <CraftEditorPanelLayout :blueprints="config.blueprintsLibrary">
    <template
      v-if="$slots['panel-layout']"
      #panel-layout="{ blueprints, deselectNodes }"
    >
      <slot
        name="panel-layout"
        :blueprints="blueprints"
        :deselectNodes="deselectNodes"
      />
    </template>
    <template v-else #default>
      <CraftFrame>
        <slot />
      </CraftFrame>
    </template>
  </CraftEditorPanelLayout>
</template>

<script lang="ts" setup generic="T extends object">
import { provide, ref } from "vue";
import CraftNodeResolver from "../lib/CraftNodeResolver";
import { CraftEditorConfig } from "../lib/model";

const props = defineProps<{
  config: CraftEditorConfig<T>;
}>();

const resolver = ref(new CraftNodeResolver(props.config.resolverMap));
provide("resolver", resolver);
</script>
