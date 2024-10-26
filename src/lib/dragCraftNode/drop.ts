import { Ref } from "vue";
import { EditorStoreInstanceType } from "../../store/editor";
import { IndicatorStoreType } from "../../store/indicator";
import {
  buildCraftNodeTree,
  CraftNode,
  craftNodeCanBeChildOf,
  craftNodeCanBeSiblingOf,
  craftNodeIsCanvas,
} from "../craftNode";
import CraftNodeResolver from "../CraftNodeResolver";
import { mouseOnEdge, mouseOnLeftHalf, mouseOnTopHalf } from "./mouse";
import { cloneDeep } from "lodash-es";

export type DragCraftNodeContext<T extends object> = {
  editor: EditorStoreInstanceType<T>;
  indicator: IndicatorStoreType;
  craftNode: Ref<CraftNode<T>>;
  resolver: CraftNodeResolver<T>;
};

const handleElementDrop = <T extends object>(
  e: MouseEvent,
  el: HTMLElement,
  draggedNode: CraftNode<T>,
  context: DragCraftNodeContext<T>
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

  const parent = context.craftNode.value.parentUuid
    ? context.editor.nodeMap.get(context.craftNode.value.parentUuid)
    : null;
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

const handleCanvasDrop = <T extends object>(
  e: MouseEvent,
  el: HTMLElement,
  draggedNode: CraftNode<T>,
  context: DragCraftNodeContext<T>
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

export default <T extends object>(
  e: MouseEvent,
  el: HTMLElement,
  context: DragCraftNodeContext<T>
) => {
  if (!context.editor.draggedNode) {
    return context.craftNode.value;
  }

  const nodeCopy = (() => {
    if (context.editor.draggedNode?.uuid) {
      return JSON.parse(JSON.stringify(context.editor.draggedNode));
    }
    return buildCraftNodeTree(
      JSON.parse(JSON.stringify(context.editor.draggedNode))
    );
  })();

  return craftNodeIsCanvas(context.craftNode.value)
    ? handleCanvasDrop(e, el, nodeCopy, context)
    : handleElementDrop(e, el, nodeCopy, context);
};
