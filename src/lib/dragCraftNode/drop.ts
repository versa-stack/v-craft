import { Ref, ref } from "vue";
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

export type DragCraftNodeContext<T extends object> = {
  editor: EditorStoreInstanceType;
  indicator: IndicatorStoreType;
  craftNode: Ref<CraftNode>;
  resolver: CraftNodeResolver<T>;
};

const handleElementDrop = <T extends object>(
  e: MouseEvent,
  el: HTMLElement,
  draggedNode: CraftNode,
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

  const sibling = Object.values(parent.slots || {}).flat().find(
    (c) => c.uuid === context.craftNode.value.uuid
  );
  if (!sibling) {
    return context.craftNode.value;
  }

  if (sibling.uuid === draggedNode.uuid) {
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
  draggedNode: CraftNode,
  context: DragCraftNodeContext<T>
) => {
  const { editor, resolver, craftNode } = context;
  const target = e.target as HTMLElement;
  const targetNode = editor.nodeMap.get(target.id);
  if (targetNode && craftNodeIsCanvas(targetNode)) {
    handleCanvasDrop(e, el, draggedNode, { ...context, craftNode: ref(targetNode) });
    return context.craftNode.value;
  }
  const slotPlaceholder = target.closest('.v-craft-drop-text');
  let slotName = 'default';
  
  if (slotPlaceholder) {
    const slotNameAttr = slotPlaceholder.getAttribute('data-slot-name');
    if (slotNameAttr) {
      slotName = slotNameAttr;
    }
  } else {
    if (mouseOnEdge(e, el)) {
      return handleElementDrop(e, el, draggedNode, context);
    }

    const targetSlots = context.craftNode.value.slots || {};
    const slotNames = Object.keys(targetSlots);
    slotName = slotNames.length > 0 ? slotNames[0] : 'default';
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
    context.editor.prependNodeTo(draggedNode, context.craftNode.value, slotName);
  } else {
    context.editor.appendNodeTo(draggedNode, context.craftNode.value, slotName);
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
