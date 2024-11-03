import { storeToRefs } from "pinia";
import { useEditor } from "../../store/editor";
import { computed, provide, readonly, Ref, toRef } from "vue";
import { CraftNode } from "../../lib/craftNode";

export const useCraftNodeWrapper = <T extends object>(
  craftNode: Ref<CraftNode<T>>
) => {
  const editor = useEditor<T>()();
  const { enabled } = storeToRefs(editor);

  const visible = computed(() => craftNode.value?.visible !== false);

  provide("craftNode", readonly(craftNode));

  return {
    editor,
    craftNode,
    enabled,
    visible,
  };
};
