import {
  craftNodeCanBeChildOf,
  craftNodeCanBeSiblingOf,
  craftNodeIsCanvas,
} from "../craftNode";
import { DragCraftNodeContext } from "./drop";
import { mouseOnEdge, mouseOnLeftHalf, mouseOnTopHalf } from "./mouse";

const handleElementDragOver = <T extends object>(
  e: MouseEvent,
  el: HTMLElement,
  { editor, indicator, craftNode, resolver }: DragCraftNodeContext<T>
) => {
  if (!editor.draggedNode) {
    return;
  }

  indicator.setIsForbidden(!craftNodeCanBeSiblingOf(editor.draggedNode, craftNode.value, resolver));

  if (mouseOnLeftHalf(e, el)) {
    indicator.pointBefore(el);
    return;
  }

  indicator.pointAfter(el);
};

const handleCanvasDragOver = <T extends object>(
  e: MouseEvent,
  el: HTMLElement,
  { editor, indicator, craftNode, resolver }: DragCraftNodeContext<T>
) => {
  if (!editor.draggedNode) return;

  if (mouseOnEdge(e, el)) {
    handleElementDragOver(e, el, { editor, indicator, craftNode, resolver });
    return;
  }

  const cannotBeChild = !craftNodeCanBeChildOf(editor.draggedNode, craftNode.value, resolver);
  indicator.setIsForbidden(cannotBeChild);
  if (mouseOnTopHalf(e, el)) {
    indicator.pointInsideTop(el);
    return;
  }

  indicator.pointInside(el);
};

export default <T extends object>(
  e: MouseEvent,
  el: HTMLElement,
  context: DragCraftNodeContext<T>
) => {
  if (craftNodeIsCanvas(context.craftNode.value)) {
    handleCanvasDragOver<T>(e, el, context);
    return;
  }
  handleElementDragOver<T>(e, el, context);
};
