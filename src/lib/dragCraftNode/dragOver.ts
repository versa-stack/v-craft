import { mouseOnEdge, mouseOnLeftHalf, mouseOnTopHalf } from "./mouse";
import { DragCraftNodeContext } from "./drop";
import {
  craftNodeCanBeSiblingOf,
  craftNodeCanBeChildOf,
  craftNodeIsCanvas,
} from "../craftNode";

const handleElementDragOver = (
  e: MouseEvent,
  el: HTMLElement,
  { editor, indicator, craftNode, resolver }: DragCraftNodeContext
) => {
  if (!editor.draggedNode) {
    return;
  }

  indicator.setIsForbidden(!craftNodeCanBeSiblingOf(editor.draggedNode, craftNode, resolver));

  if (mouseOnLeftHalf(e, el)) {
    indicator.pointBefore(el);
    return;
  }

  indicator.pointAfter(el);
};

const handleCanvasDragOver = (
  e: MouseEvent,
  el: HTMLElement,
  { editor, indicator, craftNode, resolver }: DragCraftNodeContext
) => {
  if (!editor.draggedNode) return;

  if (mouseOnEdge(e, el)) {
    handleElementDragOver(e, el, { editor, indicator, craftNode, resolver });
    return;
  }

  const cannotBeChild = !craftNodeCanBeChildOf(editor.draggedNode, craftNode, resolver);
  indicator.setIsForbidden(cannotBeChild);
  if (mouseOnTopHalf(e, el)) {
    indicator.pointInsideTop(el);
    return;
  }

  indicator.pointInside(el);
};

export default (
  e: MouseEvent,
  el: HTMLElement,
  context: DragCraftNodeContext
) => {
  if (craftNodeIsCanvas(context.craftNode)) {
    handleCanvasDragOver(e, el, context);
    return;
  }
  handleElementDragOver(e, el, context);
};
