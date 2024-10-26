import { v4 as uuidv4 } from "uuid";
import { CraftNode } from "./craftNode";
import CraftNodeResolver from "./CraftNodeResolver";

const formatComponentName = (vNode) => {
  if (typeof vNode.type === "symbol") {
    return "Fragment";
  }

  if (typeof vNode.type === "string") {
    return vNode.type;
  }

  if (vNode.type.name) {
    return vNode.type.name;
  }

  return "anonmymous";
};

const createNodeFromVNode = <T extends object>(
  resolver: CraftNodeResolver<T>,
  vNode,
  parentNode: CraftNode<T> | null = null
) => {
  const componentName = formatComponentName(vNode);
  const { props } = vNode;
  const craftNode: CraftNode<T> = {
    componentName,
    props,
    children: [],
    parentUuid: parentNode?.uuid ?? null,
    uuid: uuidv4(),
  };

  const vnodeChildren = vNode.children
    ? vNode.children.default
      ? vNode.children.default()
      : vNode.children
    : null;

  craftNode.children = createChildren<T>(resolver, vnodeChildren, craftNode);

  return craftNode;
}

const createChildren = <T extends object>(resolver, vnodeChildren, parent) => {
  if (!vnodeChildren || !(vnodeChildren instanceof Array)) return [] as unknown as CraftNode<T>[];
  return vnodeChildren
    .map((childVNode) => createNodeFromVNode<T>(resolver, childVNode, parent))
    .filter((childNode) => !!childNode) as CraftNode<T>[];
};

export default createNodeFromVNode;
