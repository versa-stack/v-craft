import { defineStore } from "pinia";
import { v4 as uuidv4 } from "uuid";
import { markRaw, Ref, ref, shallowRef, ShallowRef } from "vue";
import {
  buildCraftNodeTree,
  CraftNode,
  craftNodeCanBeChildOf,
  craftNodeCanBeSiblingOf,
  resolveNodeName,
} from "../lib/craftNode";
import CraftNodeResolver from "../lib/CraftNodeResolver";

export type EditorState = {
  nodeRecord: Record<string, CraftNode>;
  selectedUuid: uuidv4 | null;
  draggedNode: Ref<CraftNode | null>;
  enabled: boolean;
  nodes: ShallowRef<CraftNode[]>;
  nodeRefsRecord: Record<string, HTMLElement>;
  pendingUpdates: Set<CraftNode>;
  resolver: CraftNodeResolver | null;
  nodesToDelete: Set<string>;
};

export type EditorStoreType = ReturnType<typeof useEditor>;

export const useEditor = defineStore("editor", {
  state: () =>
    ({
      nodeRecord: {} as Record<string, CraftNode>,
      selectedUuid: null as uuidv4 | null,
      draggedNode: ref(null),
      enabled: false,
      nodes: shallowRef<CraftNode[]>([]),
      nodeRefsRecord: {} as Record<string, HTMLElement>,
      pendingUpdates: new Set<CraftNode>(),
      resolver: null as CraftNodeResolver | null,
      nodesToDelete: new Set<string>(),
    } as EditorState),

  actions: {
    clear() {
      this.nodeRecord = {};
      this.selectedUuid = null;
      this.draggedNode = null;
      this.enabled = false;
      this.nodes = shallowRef<CraftNode[]>([]) as any;
      this.nodeRefsRecord = {};
      this.pendingUpdates.clear();
    },

    enable() {
      this.enabled = true;
    },

    disable() {
      this.enabled = false;
    },

    setResolver(resolver: CraftNodeResolver) {
      this.resolver = resolver;
    },

    setNodeRef(craftNode: CraftNode, ref: HTMLElement) {
      this.nodeRefsRecord[craftNode.uuid] = ref;
    },

    setNode(craftNode: CraftNode) {
      this.pendingUpdates.add(craftNode);
    },

    applyPendingUpdates() {
      if (this.pendingUpdates.size > 0 || this.nodesToDelete.size > 0) {
        this.nodes = updateNodesInTree(
          this.nodes,
          Array.from(this.pendingUpdates),
          this.nodesToDelete
        );
        this.updateNodeRecord();
        this.pendingUpdates.clear();
        this.nodesToDelete.clear();
      }
    },

    toggleNodeVisibility(craftNode: CraftNode) {
      craftNode.visible = !craftNode.visible;
      this.setNode(craftNode);
    },

    updateNodeProps(nodeUuid: string, newProps: Record<string, any>) {
      const node = this.nodeRecord[nodeUuid];
      if (node) {
        node.props = { ...node.props, ...newProps };
        this.setNode(node);
      }
    },

    updateNodeRecord() {
      this.nodeRecord = {};
      const mapNodes = (nodes: CraftNode[]) => {
        nodes.forEach((node) => {
          this.nodeRecord[node.uuid] = markRaw(node);
          if (node.children && node.children.length > 0) {
            mapNodes(node.children);
          }
        });
      };
      mapNodes(this.nodes);
    },

    setNodes(nodes: CraftNode[]) {
      this.nodes = shallowRef<CraftNode[]>(
        markRaw(nodes.map(buildCraftNodeTree))
      ) as any;
      this.updateNodeRecord();
    },

    selectNode(craftNode: CraftNode | null) {
      this.selectedUuid = craftNode?.uuid ?? null;
    },

    dragNode(craftNode: CraftNode | null) {
      this.draggedNode = craftNode;
    },

    removeNode(craftNode: CraftNode) {
      this.emancipateNode(craftNode);
      if (craftNode.uuid === this.selectedUuid) {
        this.selectedUuid = null;
      }
      this.nodesToDelete.add(craftNode.uuid);
      this.applyPendingUpdates();
    },

    emancipateNode(craftNode: CraftNode) {
      const { parent } = craftNode;
      if (!parent) {
        return craftNode;
      }
      const parentRef = this.nodeRecord[parent.uuid];
      const index = parentRef.children.findIndex(
        (c) => c.uuid === craftNode.uuid
      );
      parentRef.children.splice(index, 1);
      craftNode.parent = null;
      this.setNode(parentRef);
      this.setNode(craftNode);
      return craftNode;
    },
    appendNodeTo(node: CraftNode, targetNode: CraftNode) {
      if (!this.resolver) {
        throw new Error("Resolver is not set.");
      }

      if (!craftNodeCanBeChildOf(node, targetNode, this.resolver)) {
        throw new Error(
          `${resolveNodeName(
            node
          )} is not allowed to be a child of ${resolveNodeName(targetNode)}.`
        );
      }

      const targetNodeRef = this.nodeRecord[targetNode.uuid];

      node = this.emancipateNode(node);
      this.applyPendingUpdates();
      node.parent = targetNodeRef;
      this.setNode(node);
      this.applyPendingUpdates();

      if (!targetNodeRef.children) {
        targetNodeRef.children = [] as CraftNode[];
      }

      targetNodeRef.children.push(node);
      this.setNode(targetNode);
      this.applyPendingUpdates();
    },

    prependNodeTo(node: CraftNode, targetNode: CraftNode) {
      if (!this.resolver) {
        throw new Error("Resolver is not set");
      }
      if (!craftNodeCanBeChildOf(node, targetNode, this.resolver)) {
        throw new Error(
          `${resolveNodeName(
            node
          )} is not allowed to be a child of ${resolveNodeName(targetNode)}.`
        );
      }

      const targetNodeRef = this.nodeRecord[targetNode.uuid];
      node = this.emancipateNode(node);
      node.parent = targetNodeRef;

      if (!targetNodeRef.children?.length) {
        targetNodeRef.children = [node];
      } else {
        targetNodeRef.children.splice(0, 0, node);
      }

      this.setNode(node);
      this.setNode(targetNodeRef);
      this.applyPendingUpdates();
    },

    insertNodeBefore(node: CraftNode, targetNode: CraftNode) {
      if (!this.resolver) {
        throw new Error("Resolver is not set");
      }
      if (!craftNodeCanBeSiblingOf(node, targetNode, this.resolver)) {
        throw new Error("Can not be the sibling of the target node.");
      }

      node = this.emancipateNode(node);
      const parentOfTargetNode = targetNode.parent;
      if (!parentOfTargetNode) {
        throw new Error("Target node has no parent.");
      }

      const indexOfTargetNode = parentOfTargetNode.children.indexOf(targetNode);
      parentOfTargetNode.children.splice(indexOfTargetNode, 0, node);
      node.parent = parentOfTargetNode;
      this.setNode(node);
      this.setNode(parentOfTargetNode);
      this.applyPendingUpdates();
    },
    insertNodeAfter(node: CraftNode, targetNode: CraftNode) {
      if (!this.resolver) {
        throw new Error("Resolver is not set");
      }

      if (!craftNodeCanBeSiblingOf(node, targetNode, this.resolver)) {
        throw new Error("Can not be the sibling of the target node.");
      }

      node = this.emancipateNode(node);
      const parentOfTargetNode = targetNode.parent;
      if (!parentOfTargetNode) {
        throw new Error("Target node has no parent.");
      }

      const indexOfTargetNode = parentOfTargetNode.children.indexOf(targetNode);
      parentOfTargetNode.children.splice(indexOfTargetNode + 1, 0, node);
      node.parent = parentOfTargetNode;
      this.setNode(node);
      this.setNode(parentOfTargetNode);
      this.applyPendingUpdates();
    },
  },
  getters: {
    hasNodes: (state) => state.nodes.length > 0,
    selectedNode(state) {
      return state.selectedUuid ? state.nodeRecord[state.selectedUuid] : null;
    },
    selectedRef: (state) =>
      state.selectedUuid ? state.nodeRefsRecord[state.selectedUuid] : null,
    getRef: (state) => (uuid: string) => state.nodeRefsRecord[uuid],
  },
});

const updateNodesInTree = (
  nodes: CraftNode[],
  updatedNodes: CraftNode[],
  nodesToDelete: Set<string>
): CraftNode[] => {
  return nodes
    .filter((node) => !nodesToDelete.has(node.uuid))
    .map((node) => {
      const source = updatedNodes.find((u) => u.uuid === node.uuid);
      if (source) {
        return {
          ...source,
          children: source.children
            ? updateNodesInTree(source.children, updatedNodes, nodesToDelete)
            : [],
        };
      }
      if (node.children) {
        const updatedChildren = updateNodesInTree(
          node.children,
          updatedNodes,
          nodesToDelete
        );
        return updatedChildren === node.children
          ? node
          : { ...node, children: updatedChildren };
      }
      return node;
    });
};
