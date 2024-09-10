import { v4 as uuidv4 } from "uuid";
import CraftNodeResolver from "./CraftNodeResolver";

export type CraftNodeRules = {
  canMoveIn?: (craftNode: CraftNode, targetNode: CraftNode, resolver: CraftNodeResolver) => boolean;
  canMoveOut?: (craftNode: CraftNode, targetNode: CraftNode, resolver: CraftNodeResolver) => boolean;
  canDrag?: (craftNode: CraftNode) => boolean;
  canMoveInto?: (craftNode: CraftNode, targetNode: CraftNode, resolver: CraftNodeResolver) => boolean;
};

export interface CraftNode {
  componentName: string;
  props: any;
  children: CraftNode[];
  parent: CraftNode | null;
  uuid: uuidv4;
  rules?: CraftNodeRules;
  data?: CraftNodeDatasource;
}

export interface CraftNodeDatasource {
  type: "single" | "list";
  item?: Record<string, any>;
  list?: Record<string, any>[];
}

export const setCraftNodeProps = (craftNode: CraftNode, props: any) => {
  craftNode.props = { ...craftNode.props, ...props };
};

export const emancipateCraftNode = (craftNode: CraftNode) => {
  const { parent } = craftNode;

  if (!parent) {
    return;
  }

  const index = parent.children.indexOf(craftNode);
  parent.children.splice(index, 1);
  craftNode.parent = null;
};

export const setParent = (
  craftNode: CraftNode,
  parent: CraftNode,
  resolver: CraftNodeResolver
) => {
  if (!craftNodeCanBeChildOf(craftNode, parent, resolver)) {
    throw new Error("Parent node is not droppable.");
  }

  emancipateCraftNode(craftNode);

  parent.children.push(craftNode);
  craftNode.parent = parent;
};

export const craftNodeInCanvas = (craftNode: CraftNode) => {
  let curentParent = craftNode.parent;

  while (curentParent) {
    if (craftNodeIsCanvas(curentParent)) {
      return true;
    }

    curentParent = curentParent.parent;
  }

  return false;
};

export const craftNodeIsDraggable = (craftNode: CraftNode) => {
  if (!craftNodeInCanvas(craftNode)) {
    return false;
  }

  if (craftNode.rules?.canDrag) {
    return craftNode.rules.canDrag(craftNode);
  }

  return true;
};

export const craftNodeIsAncestorOf = (
  craftNode: CraftNode,
  descendant: CraftNode
) => {
  let curentParent = descendant.parent;

  while (curentParent) {
    if (curentParent === craftNode) {
      return true;
    }
    curentParent = curentParent.parent;
  }

  return false;
};

const resolveNodeName = (craftNode: CraftNode) => {
  if (craftNode.componentName === "CraftCanvas") {
    return craftNode.props.component;
  }

  return craftNode.componentName;
};

export const craftNodeCanBeChildOf = (
  craftNode: CraftNode,
  targetNode: CraftNode,
  resolver: CraftNodeResolver
) => {
  if (!craftNodeIsCanvas(targetNode)) {
    return false;
  }

  if (craftNode === targetNode) {
    return false;
  }

  const resolvedTargetNode = resolver.resolve(resolveNodeName(targetNode));
  const resolvedSource = resolver.resolve(resolveNodeName(craftNode));

  const targetNodeRules = resolvedTargetNode.rules || {};
  const sourceNodeRules = resolvedSource.rules || {};
  
  if (craftNode.parent) {
    const rules = resolver.resolve(resolveNodeName(craftNode.parent))?.rules || {};
    if (rules.canMoveOut && !rules.canMoveOut(craftNode, targetNode, resolver)) {
      return;
    }
  }

  if (sourceNodeRules.canMoveInto && !sourceNodeRules.canMoveInto(craftNode, targetNode, resolver)) {
    return false;
  }

  if (craftNodeIsAncestorOf(craftNode, targetNode)) {
    return false;
  }

  if (targetNodeRules.canMoveIn && !targetNodeRules.canMoveIn(craftNode, targetNode, resolver)) {
    return false;
  }

  return true;
};

export const craftNodeIsCanvas = (craftNode: CraftNode) => {
  return craftNode.componentName === "CraftCanvas";
};

export const appendCraftNodeTo = (
  craftNode: CraftNode,
  targetNode: CraftNode,
  resolver: CraftNodeResolver
) => {
  if (!craftNodeCanBeChildOf(craftNode, targetNode, resolver)) {
    throw new Error(
      `${craftNode.componentName} is not allowed to be a child of ${targetNode.componentName}.`
    );
  }

  emancipateCraftNode(craftNode);

  craftNode.parent = targetNode;
  targetNode.children.push(craftNode);

  return targetNode;
};

export const prependCraftNodeTo = (
  craftNode: CraftNode,
  targetNode: CraftNode,
  resolver: CraftNodeResolver
) => {
  if (!craftNodeCanBeChildOf(craftNode, targetNode, resolver)) {
    throw new Error(
      `${craftNode.componentName} is not allowed to be a child of ${targetNode.componentName}.`
    );
  }

  emancipateCraftNode(craftNode);

  targetNode.children.splice(0, 0, craftNode);
  craftNode.parent = targetNode;

  return targetNode;
};

export const craftNodeCanBeSiblingOf = (
  craftNode: CraftNode,
  targetNode: CraftNode,
  resolver: CraftNodeResolver
) => {
  if (targetNode === craftNode) {
    return false;
  }

  if (!targetNode.parent) {
    return false;
  }

  return craftNodeCanBeChildOf(craftNode, targetNode.parent, resolver);
};

export const insertCraftNodeBefore = (
  craftNode: CraftNode,
  targetNode: CraftNode,
  resolver: CraftNodeResolver
) => {
  if (!craftNodeCanBeSiblingOf(craftNode, targetNode, resolver)) {
    throw new Error("Can not be the sibling of the target node.");
  }

  emancipateCraftNode(craftNode);

  const parentOfTargetNode = targetNode.parent;

  if (!parentOfTargetNode) {
    throw new Error("Target node has no parent.");
  }

  const indexOfTargetNode = parentOfTargetNode.children.indexOf(targetNode);
  parentOfTargetNode.children.splice(indexOfTargetNode, 0, craftNode);
  craftNode.parent = parentOfTargetNode;

  return parentOfTargetNode;
};

export const insertCraftNodeAfter = (
  craftNode: CraftNode,
  targetNode: CraftNode,
  resolver: CraftNodeResolver
) => {
  if (!craftNodeCanBeSiblingOf(craftNode, targetNode, resolver)) {
    throw new Error("Can not be the sibling of the target node.");
  }

  emancipateCraftNode(craftNode);

  const parentOfTargetNode = targetNode.parent;

  if (!parentOfTargetNode) {
    throw new Error("Target node has no parent.");
  }
  const indexOfTargetNode = parentOfTargetNode.children.indexOf(targetNode);
  parentOfTargetNode.children.splice(indexOfTargetNode + 1, 0, craftNode);
  craftNode.parent = parentOfTargetNode;

  return parentOfTargetNode;
};

export const craftNodeEnsureTree = (craftNode: CraftNode): CraftNode => {
  if (!craftNode.children) {
    return craftNode;
  }

  craftNode.children.map((cn) => {
    if (!cn.uuid) {
      cn.uuid = uuidv4();
    }
    if (cn.parent !== craftNode) {
      cn.parent = craftNode;
    }

    if (cn.children) {
      cn.children.map((cnc) => craftNodeEnsureTree(cnc));
    }

    return cn;
  });

  return craftNode;
};
