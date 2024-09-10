import { v4 as uuidv4 } from "uuid";
import { EditorStoreType } from "../../store/editor";
import { IndicatorStoreType } from "../../store/indicator";
import {
  appendCraftNodeTo,
  CraftNode,
  craftNodeCanBeChildOf,
  craftNodeCanBeSiblingOf,
  craftNodeEnsureTree,
  craftNodeIsCanvas,
  insertCraftNodeAfter,
  insertCraftNodeBefore,
  prependCraftNodeTo,
} from "../craftNode";
import { mouseOnEdge, mouseOnLeftHalf, mouseOnTopHalf } from "./mouse";
import CraftNodeResolver from "../CraftNodeResolver";

export type DragCraftNodeContext = {
  editor: EditorStoreType;
  indicator: IndicatorStoreType;
  craftNode: CraftNode;
  resolver: CraftNodeResolver
};

const handleElementDrop = (
  e: MouseEvent,
  el: HTMLElement,
  draggedNode: CraftNode,
  dropTarget: CraftNode,
  resolver: CraftNodeResolver
) => {
  if (!craftNodeCanBeSiblingOf(draggedNode, dropTarget, resolver)) {
    return dropTarget;
  }

  if (mouseOnLeftHalf(e, el)) {
    return insertCraftNodeBefore(draggedNode, dropTarget, resolver);
  }

  return insertCraftNodeAfter(draggedNode, dropTarget, resolver);
};

const handleCanvasDrop = (
  e: MouseEvent,
  el: HTMLElement,
  draggedNode: CraftNode,
  dropTarget: CraftNode,
  resolver: CraftNodeResolver
) => {
  if (mouseOnEdge(e, el)) {
    return handleElementDrop(e, el, draggedNode, dropTarget, resolver);
  }

  if (!craftNodeCanBeChildOf(draggedNode, dropTarget, resolver)) {
    return dropTarget;
  }

  if (mouseOnTopHalf(e, el)) {
    return prependCraftNodeTo(draggedNode, dropTarget, resolver);
  }
  return appendCraftNodeTo(draggedNode, dropTarget, resolver);
};

export default (
  e: MouseEvent,
  el: HTMLElement,
  context: DragCraftNodeContext
) => {
  if (!context.editor.draggedNode) {
    return context.craftNode;
  }

  const nodeCopy = (() => {
    if (context.editor.draggedNode?.uuid) {
      return context.editor.draggedNode;
    }
    const cp = craftNodeEnsureTree(
      JSON.parse(JSON.stringify(context.editor.draggedNode))
    );
    cp.uuid = uuidv4();
    return cp;
  })();

  return craftNodeIsCanvas(context.craftNode)
    ? handleCanvasDrop(e, el, nodeCopy, context.craftNode, context.resolver)
    : handleElementDrop(e, el, nodeCopy, context.craftNode, context.resolver);
};
