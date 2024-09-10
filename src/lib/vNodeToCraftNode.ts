import { CraftNode } from "./craftNode";
import CraftNodeResolver from "./CraftNodeResolver";
import { v4 as uuidv4 } from "uuid";

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

const createNodeFromVNode = (
  resolver: CraftNodeResolver,
  vNode,
  parentNode: CraftNode | null = null
) => {
  const componentName = formatComponentName(vNode);
  const { props } = vNode;
  const craftNode: CraftNode = {
    componentName,
    props,
    children: [],
    parent: parentNode,
    uuid: uuidv4(),
  };

  const vnodeChildren = vNode.children
    ? vNode.children.default
      ? vNode.children.default()
      : vNode.children
    : null;

  craftNode.children = createChildren(resolver, vnodeChildren, craftNode);

  return craftNode;
}

const createChildren = (resolver, vnodeChildren, parent) => {
  if (!vnodeChildren || !(vnodeChildren instanceof Array)) return [];
  return vnodeChildren
    .map((childVNode) => createNodeFromVNode(resolver, childVNode, parent))
    .filter((childNode) => !!childNode);
};

export default createNodeFromVNode;
