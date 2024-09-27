import { Ref } from "vue";
import { EditorStoreType } from "../../store/editor";
import { IndicatorStoreType } from "../../store/indicator";
import {
  CraftNode,
  craftNodeCanBeChildOf,
  craftNodeCanBeSiblingOf,
  craftNodeIsCanvas,
  buildCraftNodeTree,
} from "../craftNode";
import CraftNodeResolver from "../CraftNodeResolver";
import { mouseOnEdge, mouseOnLeftHalf, mouseOnTopHalf } from "./mouse";

export type DragCraftNodeContext = {
  editor: EditorStoreType;
  indicator: IndicatorStoreType;
  craftNode: Ref<CraftNode>;
  resolver: CraftNodeResolver;
};

const handleElementDrop = (
  e: MouseEvent,
  el: HTMLElement,
  draggedNode: CraftNode,
  context: DragCraftNodeContext
) => {
  if (
    !craftNodeCanBeSiblingOf(
      draggedNode,
      context.craftNode.value,
      context.resolver
    )
  ) {
    return context.craftNode.value;
  }

  const parent = context.craftNode.value.parent;
  if (!parent) {
    return context.craftNode.value;
  }

  const sibling = parent.children.find(
    (c) => c.uuid === context.craftNode.value.uuid
  );
  if (!sibling) {
    return context.craftNode.value;
  }

  if (mouseOnLeftHalf(e, el)) {
    context.editor.insertNodeBefore(draggedNode, sibling);
  } else {
    context.editor.insertNodeAfter(draggedNode, sibling);
  }

  return context.craftNode.value;
};

const handleCanvasDrop = (
  e: MouseEvent,
  el: HTMLElement,
  draggedNode: CraftNode,
  context: DragCraftNodeContext
) => {
  if (mouseOnEdge(e, el)) {
    return handleElementDrop(e, el, draggedNode, context);
  }

  if (
    !craftNodeCanBeChildOf(
      draggedNode,
      context.craftNode.value,
      context.resolver
    )
  ) {
    return context.craftNode.value;
  }

  if (mouseOnTopHalf(e, el)) {
    context.editor.prependNodeTo(draggedNode, context.craftNode.value);
  } else {
    context.editor.appendNodeTo(draggedNode, context.craftNode.value);
  }

  return context.craftNode.value;
};

export default (
  e: MouseEvent,
  el: HTMLElement,
  context: DragCraftNodeContext
) => {
  if (!context.editor.draggedNode) {
    return context.craftNode.value;
  }

  const nodeCopy = (() => {
    if (context.editor.draggedNode?.uuid) {
      return context.editor.draggedNode;
    }
    return buildCraftNodeTree(
      JSON.parse(JSON.stringify(context.editor.draggedNode))
    );
  })();

  const updatedNode = craftNodeIsCanvas(context.craftNode.value)
    ? handleCanvasDrop(e, el, nodeCopy, context)
    : handleElementDrop(e, el, nodeCopy, context);

  return updatedNode;
};
