import { v4 as uuidv4 } from "uuid";
import CraftNodeResolver from "./CraftNodeResolver";
import { useEditor } from "../store/editor";

export type CraftNodeRules = {
  canMoveIn?: <T extends object>(
    craftNode: CraftNode<T>,
    targetNode: CraftNode<T>,
    resolver: CraftNodeResolver<T>
  ) => boolean;
  canMoveOut?: <T extends object>(
    craftNode: CraftNode<T>,
    targetNode: CraftNode<T>,
    resolver: CraftNodeResolver<T>
  ) => boolean;
  canDrag?: <T extends object>(craftNode: CraftNode<T>) => boolean;
  canMoveInto?: <T extends object>(
    craftNode: CraftNode<T>,
    targetNode: CraftNode<T>,
    resolver: CraftNodeResolver<T>
  ) => boolean;
};

export type CraftNode<T extends object> = {
  children: CraftNode<T>[];
  componentName: string;
  parentUuid?: string | null;
  props: any;
  rules?: CraftNodeRules;
  uuid: uuidv4;
  visible?: boolean;
  events?: Record<string, string>;
};

export type CraftNodeDatasource = {
  item?: Record<string, any>;
  list?: Record<string, any>[];
  type: "single" | "list";
};

export const isVisible = <T extends object>(craftNode: CraftNode<T>) =>
  craftNode.visible === undefined || craftNode.visible;

export const craftNodeInCanvas = <T extends object>(
  craftNode: CraftNode<T>
) => {
  let node = craftNode;
  const editor = useEditor<T>()();

  while (node.parentUuid) {
    node = editor.nodeMap.get(node.parentUuid) as CraftNode<T>;
    if (craftNodeIsCanvas(node)) {
      return true;
    }
  }

  return false;
};

export const craftNodeIsDraggable = <T extends object>(
  craftNode: CraftNode<T>
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
  craftNode: CraftNode<T>,
  descendant: CraftNode<T>
) => {
  const editor = useEditor<T>()();
  let currentNode = descendant;

  while (currentNode?.parentUuid) {
    if (currentNode.parentUuid === craftNode.uuid) {
      return true;
    }
    currentNode = editor.nodeMap.get(currentNode.parentUuid) as CraftNode<T>;
  }

  return false;
};

export const resolveNodeName = <T extends object>(craftNode: CraftNode<T>) => {
  if (craftNode.componentName === "CraftCanvas") {
    return craftNode.props.componentName;
  }

  return craftNode.componentName;
};

export const craftNodeCanBeChildOf = <T extends object>(
  craftNode: CraftNode<T>,
  targetNode: CraftNode<T>,
  resolver: CraftNodeResolver<T>
) => {
  if (!craftNodeIsCanvas(targetNode)) {
    return false;
  }

  if (craftNode === targetNode) {
    return false;
  }

  const resolvedTargetNode = resolver.resolve(resolveNodeName(targetNode));
  const resolvedSource = resolver.resolve(resolveNodeName(craftNode));

  const targetNodeRules = resolvedTargetNode?.rules || {};
  const sourceNodeRules = resolvedSource?.rules || {};

  if (craftNode.parentUuid) {
    const editor = useEditor<T>()();
    const parent = editor.nodeMap.get(craftNode.parentUuid) as CraftNode<T>;

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

export const craftNodeIsCanvas = <T extends object>(
  craftNode: CraftNode<T>
) => {
  return craftNode.componentName === "CraftCanvas";
};

export const craftNodeCanBeSiblingOf = <T extends object>(
  craftNode: CraftNode<T>,
  targetNode: CraftNode<T>,
  resolver: CraftNodeResolver<T>
) => {
  const editor = useEditor<T>()();
  if (targetNode === craftNode) {
    return false;
  }

  if (!targetNode.parentUuid) {
    return false;
  }

  return craftNodeCanBeChildOf(
    craftNode,
    editor.nodeMap.get(targetNode.parentUuid) as CraftNode<T>,
    resolver
  );
};

export const buildCraftNodeTree = <T extends object>(
  craftNode: CraftNode<T>
): CraftNode<T> => {
  if (!craftNode.uuid) {
    craftNode.uuid = uuidv4();
  }

  if (!craftNode.children) {
    return craftNode;
  }

  craftNode.children.map((cn) => {
    if (!cn.uuid) {
      cn.uuid = uuidv4();
    }
    if (cn.parentUuid !== craftNode.uuid) {
      cn.parentUuid = craftNode.uuid;
    }

    if (cn.children) {
      cn.children.map((cnc) => buildCraftNodeTree(cnc));
    }

    return cn;
  });

  return craftNode;
};
