import { storeToRefs } from "pinia";
import { useEditor } from "../../store/editor";
import { computed, provide, readonly, Ref, toRef, ref } from "vue";
import { CraftNode } from "../../lib/craftNode";

export const useCraftNodeWrapper = <T extends object>(
  craftNode: Ref<CraftNode>
) => {
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
