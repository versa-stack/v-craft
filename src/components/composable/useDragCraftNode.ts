import { Ref } from "vue";
import { CraftNode } from "../../lib/craftNode";
import CraftNodeResolver from "../../lib/CraftNodeResolver";
import drag from "../../lib/dragCraftNode";
import { useEditor } from "../../store/editor";
import { useIndicator } from "../../store/indicator";
import { debounce } from "lodash-es";

export default (
  craftNode: Ref<CraftNode>,
  nodeRef: Ref<any>,
  resolver: CraftNodeResolver
): {
  handleDragStart: (e: MouseEvent) => void;
  handleDragOver: (e: MouseEvent) => void;
  handleDrop: (e: MouseEvent) => void;
  handleDragEnd: () => void;
} => {
  const editor = useEditor();
  const indicator = useIndicator();

  const handleDragStart = (e) => {
    if (!editor.enabled) {
      e.preventDefault();
      return;
    }
    editor.dragNode(craftNode.value);
  };

  const handleDragOver = debounce((event: MouseEvent) => {
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
    if (!nodeRef.value?.$el) {
      return;
    }

    const outerNode = drag.handleDrop(event, nodeRef.value.$el, {
      editor,
      indicator,
      craftNode,
      resolver,
    });

    editor.setNode(outerNode);
  };

  const handleDragEnd = () => {
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
