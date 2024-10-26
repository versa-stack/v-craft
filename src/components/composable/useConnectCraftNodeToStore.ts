import { storeToRefs } from "pinia";
import { ComponentPublicInstance, computed, Ref, watchEffect } from "vue";
import { CraftNode, craftNodeIsDraggable } from "../../lib/craftNode";
import { useEditor } from "../../store/editor";

export default <T extends object>(
  craftNode: CraftNode<T>,
  nodeRef: Ref<
    ComponentPublicInstance<HTMLElement> | null,
    ComponentPublicInstance<HTMLElement> | null
  >
): {
  selectNode: () => void;
  isDraggable: Ref<boolean>;
  isSelected: Ref<boolean>;
} => {
  const editor = useEditor<T>()();
  const { enabled, selectedUuid } = storeToRefs(editor);

  watchEffect(() => {
    if (nodeRef?.value?.$el) {
      editor.setNodeRef(craftNode, nodeRef.value.$el);
    }
  });

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
