import { storeToRefs } from "pinia";
import {
  ComponentPublicInstance,
  computed,
  onBeforeUnmount,
  onMounted,
  Ref,
  watchEffect,
} from "vue";
import { CraftNode, craftNodeIsDraggable } from "../../lib/craftNode";
import { useEditor } from "../../store/editor";

export default (
  craftNode: CraftNode,
  nodeRef: Ref<ComponentPublicInstance<HTMLElement | null>>
): {
  selectNode: () => void;
  isDraggable: Ref<boolean>;
  isSelected: Ref<boolean>;
} => {
  const editor = useEditor();
  const { enabled, selectedUuid } = storeToRefs(editor);

  watchEffect(() => {
    if (nodeRef.value?.$el) {
      editor.setNodeRef(craftNode, nodeRef.value.$el);
    }
  });

  onMounted(() => {
    document.addEventListener("click", handleDocumentClick);
  });

  onBeforeUnmount(() => {
    document.removeEventListener("click", handleDocumentClick);
  });

  const handleDocumentClick = () => {
    // Implement if needed
  };

  const isSelected = computed<boolean>(
    () => selectedUuid.value === craftNode.uuid
  );

  const isDraggable = computed<boolean>(() => {
    return enabled.value && craftNodeIsDraggable(craftNode);
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
