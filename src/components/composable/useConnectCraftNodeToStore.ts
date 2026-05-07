import { storeToRefs } from "pinia";
import { ComponentPublicInstance, computed, onMounted, Ref, watch } from "vue";
import { CraftNode, craftNodeIsDraggable } from "../../lib/craftNode";
import { useEditor } from "../../store/editor";

export default (
  craftNode: CraftNode,
  nodeRef: Ref<
    ComponentPublicInstance<HTMLElement> | null,
    ComponentPublicInstance<HTMLElement> | null
  >
): {
  selectNode: () => void;
  isDraggable: Ref<boolean>;
  isSelected: Ref<boolean>;
} => {
  const editor = useEditor();
  const { enabled, selectedUuid, draggingDisabled } = storeToRefs(editor);

  let lastEl: HTMLElement | null = null;
  const updateNodeRef = () => {
    const el = nodeRef?.value?.$el;
    if (el && el !== lastEl) {
      lastEl = el;
      editor.setNodeRef(craftNode, el);
    }
  };

  onMounted(updateNodeRef);
  watch(nodeRef, updateNodeRef, { flush: "post" });

  const isSelected = computed<boolean>(
    () => selectedUuid.value === craftNode.uuid
  );

  const isDraggable = computed<boolean>(() => {
    return (
      enabled.value &&
      !draggingDisabled.value &&
      craftNodeIsDraggable(craftNode)
    );
  });

  const selectNode = () => {
    if (!enabled.value) {
      return;
    }
    editor.selectNode(craftNode);
  };

  return {
    isDraggable,
    isSelected,
    selectNode,
  };
};
