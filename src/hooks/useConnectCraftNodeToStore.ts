import {
  onBeforeUnmount,
  onMounted,
  watchEffect,
  computed,
  Ref,
  ComponentPublicInstance,
} from "vue";
import { useEditor } from "../store/editor";
import { CraftNode, craftNodeIsDraggable } from "../lib/craftNode";

export default (
  craftNode: CraftNode,
  nodeRef: Ref<ComponentPublicInstance<HTMLElement | null>>,
): {
  selectNode: () => void;
  isDraggable: boolean;
  isSelected: boolean;
} => {
  const editor = useEditor();

  watchEffect(() => {
    if (!nodeRef.value) {
      return;
    }
    editor.setNodeRef(craftNode, nodeRef.value.$el);
  });

  onMounted(() => {
    document.addEventListener("click", handleDocumentClick);
  });

  onBeforeUnmount(() => {
    document.removeEventListener("click", handleDocumentClick);
  });

  const handleDocumentClick = () => {
    return;
  };

  const isSelected = computed<boolean>(
    () => editor.selectedUuid === craftNode.uuid
  );

  const isDraggable = computed<boolean>(() => {
    return editor.enabled && craftNodeIsDraggable(craftNode);
  });

  const selectNode = () => {
    if (!editor.enabled) {
      return;
    }

    editor.selectNode(craftNode);
  };

  return {
    isDraggable: isDraggable.value,
    isSelected: isSelected.value,
    selectNode,
  };
};
