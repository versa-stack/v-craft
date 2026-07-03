import { storeToRefs } from "pinia";
import { computed, provide, readonly, Ref } from "vue";
import type { CraftNode } from "../../lib/craftNode";
import { useEditor } from "../../store/editor";

export const useCraftNodeWrapper = (craftNode: Ref<CraftNode>) => {
  const editor = (() => {
    try {
      return useEditor();
    } catch (e) {
      return null;
    }
  })();

  const enabled = computed(() => {
    if (!editor) return false;
    const storeRefs = storeToRefs(editor);
    return (storeRefs as any).enabled?.value ?? false;
  });

  const visible = computed(() => craftNode.value?.visible !== false);

  provide("craftNode", readonly(craftNode));

  return {
    editor,
    craftNode,
    enabled,
    visible,
  };
};
