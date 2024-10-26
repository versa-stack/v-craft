import { Ref } from "vue";
import { CraftNode } from "../../lib/craftNode";
import CraftNodeResolver from "../../lib/CraftNodeResolver";
import drag from "../../lib/dragCraftNode";
import { useEditor } from "../../store/editor";
import { useIndicator } from "../../store/indicator";
import { debounce } from "lodash-es";

export default <T extends object>(
  craftNode: Ref<CraftNode<T>>,
  nodeRef: Ref<any>,
  resolver: CraftNodeResolver<T>
): {
  handleDragStart: (e: MouseEvent) => void;
  handleDragOver: (e: MouseEvent) => void;
  handleDrop: (e: MouseEvent) => void;
  handleDragEnd: () => void;
} => {
  const editor = useEditor<T>()();
  const indicator = useIndicator();

  const handleDragStart = (e) => {
    if (!editor.enabled) {
      return;
    }
    editor.dragNode(craftNode.value);
  };

  const handleDragOver = debounce((event: MouseEvent) => {
    if (!editor.enabled) {
      return;
    }

    if (!nodeRef.value?.$el) {
      return;
    }
    drag.handleDragOver(event, nodeRef.value.$el, {
      editor,
      indicator,
      craftNode,
      resolver,
    });
  }, 8);

  const handleDrop = (event: MouseEvent) => {
    if (!editor.enabled) {
      return;
    }
    if (!nodeRef.value?.$el) {
      return;
    }

    drag.handleDrop<T>(event, nodeRef.value.$el, {
      editor: editor as any,
      indicator,
      craftNode,
      resolver,
    });
  };

  const handleDragEnd = () => {
    if (!editor.enabled) {
      return;
    }
    editor.dragNode(null);
    indicator.hide();
  };

  return {
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
  };
};
