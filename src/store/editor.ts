import { defineStore } from "pinia";
import { CraftNode, emancipateCraftNode } from "../lib/craftNode";
import { v4 as uuidv4 } from "uuid";

export type EditorState = {
  nodeRecord: Record<string, CraftNode>;
  selectedUuid: uuidv4 | null;
  draggedNode: null | CraftNode;
  enabled: boolean;
  nodes: CraftNode[];
  nodeRefsRecord: Record<string, HTMLElement>;
};

export type EditorStoreType = ReturnType<typeof useEditor>;

const doMap = (ns, map) => {
  ns.forEach((craftNode) => {
    map[craftNode.uuid] = craftNode;
    if (craftNode.children) {
      doMap(craftNode.children, map);
    }
  });
};

export const useEditor = defineStore("editor", {
  state: () =>
    ({
      nodeRecord: {},
      selectedUuid: null,
      draggedNode: null,
      enabled: false,
      nodes: [],
      nodeRefsRecord: {},
    } as EditorState),
  actions: {
    clear() {
      this.nodeRecord = {};
      this.selectedUuid = null;
      this.draggedNode = null;
      this.enabled = false;
      this.nodes = [];
      this.nodeRefsRecord = {};
    },
    enable() {
      this.enabled = true;
    },
    disable() {
      this.enabled = false;
    },
    setNodeRef(craftNode: CraftNode, ref) {
      this.nodeRefsRecord[craftNode.uuid] = ref;
    },
    setNode(craftNode: CraftNode) {
      this.nodes[craftNode.uuid] = craftNode;
      doMap([craftNode], this.nodeRecord);
    },
    toggleNodeVisibility(craftNode: CraftNode) {
      craftNode.props.visible = !craftNode.props.visible;
      this.setNode(craftNode);
    },
    updateNodeProps(nodeUuid: string, newProps: Record<string, any>) {
      const node = this.findNodeByUuid(nodeUuid);
      if (node) {
        node.props = { ...node.props, ...newProps };
      }
    },
    findNodeByUuid(uuid: string): CraftNode | undefined {
      const findNode = (nodes: CraftNode[]): CraftNode | undefined => {
        for (const node of nodes) {
          if (node.uuid === uuid) {
            return node;
          }
          if (node.children) {
            const foundInChildren = findNode(node.children);
            if (foundInChildren) {
              return foundInChildren;
            }
          }
        }
        return undefined;
      };

      return findNode(this.nodes);
    },
    setNodes(nodes: CraftNode[]) {
      this.nodes = nodes;
      doMap(nodes, this.nodeRecord);
    },
    selectNode(craftNode: CraftNode | null) {
      this.selectedUuid = craftNode?.uuid;
    },
    dragNode(craftNode: CraftNode | null) {
      this.draggedNode = craftNode;
    },
    removeNode(craftNode: CraftNode) {
      emancipateCraftNode(craftNode);
      if (craftNode.uuid === this.selectedUuid) {
        this.selectedUuid = null;
      }
    },
  },
  getters: {
    hasNodes: (state) => state.nodes.length > 0,
    selectedNode: (state) =>
      state.selectedUuid ? state.nodeRecord[state.selectedUuid] : null,
    selectedRef: (state) =>
      state.selectedUuid ? state.nodeRefsRecord[state.selectedUuid] : null,
    getRef: (state) => (uuid: string) => state.nodeRefsRecord[uuid],
  },
});
