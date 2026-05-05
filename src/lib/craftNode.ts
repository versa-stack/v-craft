import { v4 as uuidv4 } from "uuid";
import CraftNodeResolver from "./CraftNodeResolver";
import { useEditor } from "../store/editor";

export type CraftNodeRules = {
  canMoveIn?: <T extends object>(
    craftNode: CraftNode,
    targetNode: CraftNode,
    resolver: CraftNodeResolver<T>
  ) => boolean;
  canMoveOut?: <T extends object>(
    craftNode: CraftNode,
    targetNode: CraftNode,
    resolver: CraftNodeResolver<T>
  ) => boolean;
  canDrag?: <T extends object>(craftNode: CraftNode) => boolean;
  canMoveInto?: <T extends object>(
    craftNode: CraftNode,
    targetNode: CraftNode,
    resolver: CraftNodeResolver<T>
  ) => boolean;
};

export type CraftNode = {
  slots: Record<string, CraftNode[]>;
  componentName: string;
  parentUuid?: string | null;
  props: any;
  rules?: CraftNodeRules;
  uuid: string;
  visible?: boolean;
  events?: Record<string, string>;
};

export type CraftNodeDatasource = {
  item?: Record<string, any>;
  list?: Record<string, any>[];
  type: "single" | "list";
  slotName?: string;
};

export const isVisible = (craftNode: CraftNode) =>
  craftNode.visible === undefined || craftNode.visible;

export const craftNodeInCanvas = <T extends object>(craftNode: CraftNode) => {
  let node = craftNode;
  const editor = useEditor();

  while (node.parentUuid) {
    node = editor.nodeMap.get(node.parentUuid) as CraftNode;
    if (craftNodeIsCanvas(node)) {
      return true;
    }
  }

  return false;
};

export const craftNodeIsDraggable = <T extends object>(
  craftNode: CraftNode
) => {
  if (!craftNodeInCanvas(craftNode)) {
    return false;
  }

  if (craftNode.rules?.canDrag) {
    return craftNode.rules.canDrag(craftNode);
  }

  return true;
};

export const craftNodeIsAncestorOf = <T extends object>(
  craftNode: CraftNode,
  descendant: CraftNode
) => {
  const editor = useEditor();
  let currentNode = descendant;

  while (currentNode?.parentUuid) {
    if (currentNode.parentUuid === craftNode.uuid) {
      return true;
    }
    currentNode = editor.nodeMap.get(currentNode.parentUuid) as CraftNode;
  }

  return false;
};

export const resolveNodeName = <T extends object>(craftNode: CraftNode) => {
  if (craftNode.componentName === "CraftCanvas") {
    return craftNode.props.componentName;
  }

  return craftNode.componentName;
};

export const craftNodeCanBeChildOf = <T extends object>(
  craftNode: CraftNode,
  targetNode: CraftNode,
  resolver: CraftNodeResolver<T>
) => {
  if (!craftNodeIsCanvas(targetNode)) {
    return false;
  }

  if (craftNode.uuid === targetNode.uuid) {
    return false;
  }

  const resolvedTargetNode = resolver.resolve(resolveNodeName(targetNode));
  const resolvedSource = resolver.resolve(resolveNodeName(craftNode));

  const targetNodeRules = resolvedTargetNode?.rules || {};
  const sourceNodeRules = resolvedSource?.rules || {};

  if (craftNode.parentUuid) {
    const editor = useEditor();
    const parent = editor.nodeMap.get(craftNode.parentUuid) as CraftNode;

    const rules = resolver.resolve(resolveNodeName<T>(parent))?.rules || {};
    if (
      rules.canMoveOut &&
      !rules.canMoveOut(craftNode, targetNode, resolver)
    ) {
      return;
    }
  }

  if (
    sourceNodeRules.canMoveInto &&
    !sourceNodeRules.canMoveInto(craftNode, targetNode, resolver)
  ) {
    return false;
  }

  if (craftNodeIsAncestorOf(craftNode, targetNode)) {
    return false;
  }

  if (
    targetNodeRules.canMoveIn &&
    !targetNodeRules.canMoveIn(craftNode, targetNode, resolver)
  ) {
    return false;
  }

  return true;
};

export const craftNodeIsCanvas = <T extends object>(craftNode: CraftNode) => {
  return craftNode.componentName === "CraftCanvas";
};

export const craftNodeCanBeSiblingOf = <T extends object>(
  craftNode: CraftNode,
  targetNode: CraftNode,
  resolver: CraftNodeResolver<T>
) => {
  const editor = useEditor();
  if (targetNode.uuid === craftNode.uuid) {
    return false;
  }

  if (!targetNode.parentUuid) {
    return false;
  }

  return craftNodeCanBeChildOf(
    craftNode,
    editor.nodeMap.get(targetNode.parentUuid) as CraftNode,
    resolver
  );
};

export const buildCraftNodeTree = <T extends object>(
  craftNode: CraftNode
): CraftNode => {
  if (!craftNode.uuid) {
    craftNode.uuid = uuidv4();
  }

  if (!craftNode.slots) {
    return craftNode;
  }

  Object.values(craftNode.slots).forEach((slotChildren) => {
    slotChildren.forEach((cn) => {
      if (!cn.uuid) {
        cn.uuid = uuidv4();
      }
      if (cn.parentUuid !== craftNode.uuid) {
        cn.parentUuid = craftNode.uuid;
      }

      buildCraftNodeTree(cn);

      return cn;
    });
  });

  return craftNode;
};
