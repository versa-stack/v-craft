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
      <CraftFrame
        :useIframe="useIframe"
        :inheritStyles="inheritStyles"
        :iFrameStyleSheets="iFrameStyleSheets"
      >
        <slot />
      </CraftFrame>
    </template>
  </CraftEditorPanelLayout>
</template>

<script lang="ts" setup generic="T extends object">
import { provide, ref, watch } from "vue";
import CraftNodeResolver from "../lib/CraftNodeResolver";
import { CraftEditorConfig } from "../lib/model";
import { type CraftNode } from "../lib/craftNode";
import { useEditor } from "../store/editor";
import { storeToRefs } from "pinia";

const props = withDefaults(
  defineProps<{
    config: CraftEditorConfig<T>;
    useIframe?: boolean;
    iFrameStyleSheets?: string[];
    inheritStyles?: boolean;
  }>(),
  {
    useIframe: false,
    inheritStyles: false,
    iFrameStyleSheets: () => [],
  }
);

const emit = defineEmits<{
  (e: "nodeDragStart", n: CraftNode): void;
  (e: "nodeDragEnd"): void;
}>();

const editor = useEditor();

const { getDraggedNode } = storeToRefs(editor);

watch(getDraggedNode, (node) => {
  if (node) {
    emit("nodeDragStart", node);
    return;
  }
  emit("nodeDragEnd");
});

const resolver = ref(new CraftNodeResolver(props.config.resolverMap));
provide("resolver", resolver);
</script>
