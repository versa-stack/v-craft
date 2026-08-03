import { beforeEach, describe, expect, it } from "vitest";
import { ref } from "vue";
import { v4 as uuidv4 } from "uuid";
import { createPinia, setActivePinia } from "pinia";
import { CraftNode } from "../../../src/lib/craftNode";
import CraftNodeResolver from "../../../src/lib/CraftNodeResolver";
import useDragCraftNode from "../../../src/components/composable/useDragCraftNode";
import { useEditor } from "../../../src/store/editor";
import { defaultResolvers } from "../../../src/resolvers/default";

describe("useDragCraftNode", () => {
  let editor: ReturnType<typeof useEditor>;
  let resolver: CraftNodeResolver<any>;

  beforeEach(() => {
    setActivePinia(createPinia());
    editor = useEditor();
    resolver = new CraftNodeResolver({
      CraftComponentSimpleText: defaultResolvers.CraftComponentSimpleText as any,
    });
  });

  const createCraftNode = (componentName = "CraftComponentSimpleText"): CraftNode => ({
    uuid: uuidv4(),
    componentName,
    props: {},
    slots: {},
  });

  describe("handleDragStart", () => {
    it("should start dragging node when editor is enabled", () => {
      const craftNode = createCraftNode();
      editor.enabled = true;
      const nodeRef = ref({ $el: document.createElement("div") });

      const { handleDragStart } = useDragCraftNode(ref(craftNode), nodeRef, resolver);
      handleDragStart({} as MouseEvent);

      expect(editor.draggedNode).toEqual(craftNode);
    });

    it("should not start dragging when editor is disabled", () => {
      const craftNode = createCraftNode();
      editor.enabled = false;
      const nodeRef = ref({ $el: document.createElement("div") });

      const { handleDragStart } = useDragCraftNode(ref(craftNode), nodeRef, resolver);
      handleDragStart({} as MouseEvent);

      expect(editor.draggedNode).toBeNull();
    });
  });

  describe("handleDragEnd", () => {
    it("should stop dragging node when editor is enabled", () => {
      const craftNode = createCraftNode();
      editor.enabled = true;
      editor.dragNode(craftNode);
      const nodeRef = ref({ $el: document.createElement("div") });

      const { handleDragEnd } = useDragCraftNode(ref(craftNode), nodeRef, resolver);
      handleDragEnd();

      expect(editor.draggedNode).toBeNull();
    });

    it("should not stop dragging when editor is disabled", () => {
      const craftNode = createCraftNode();
      editor.enabled = false;
      editor.dragNode(craftNode);
      const nodeRef = ref({ $el: document.createElement("div") });

      const { handleDragEnd } = useDragCraftNode(ref(craftNode), nodeRef, resolver);
      handleDragEnd();

      expect(editor.draggedNode).toEqual(craftNode);
    });
  });

  describe("handleDragOver", () => {
    it("should call drag handleDragOver when editor is enabled", () => {
      const craftNode = createCraftNode();
      editor.enabled = true;
      editor.dragNode(craftNode);
      const nodeRef = ref({ $el: document.createElement("div") });

      const { handleDragOver } = useDragCraftNode(ref(craftNode), nodeRef, resolver);
      handleDragOver({ clientX: 50, clientY: 50 } as MouseEvent);

      expect(editor.draggedNode).toEqual(craftNode);
    });

    it("should not call drag handleDragOver when editor is disabled", () => {
      const craftNode = createCraftNode();
      editor.enabled = false;
      editor.dragNode(craftNode);
      const nodeRef = ref({ $el: document.createElement("div") });

      const { handleDragOver } = useDragCraftNode(ref(craftNode), nodeRef, resolver);
      handleDragOver({ clientX: 50, clientY: 50 } as MouseEvent);

      expect(editor.draggedNode).toEqual(craftNode);
    });

    it("should not call drag handleDragOver when nodeRef has no $el", () => {
      const craftNode = createCraftNode();
      editor.enabled = true;
      editor.dragNode(craftNode);
      const nodeRef = ref({});

      const { handleDragOver } = useDragCraftNode(ref(craftNode), nodeRef, resolver);
      handleDragOver({ clientX: 50, clientY: 50 } as MouseEvent);

      expect(editor.draggedNode).toEqual(craftNode);
    });
  });

  describe("handleDrop", () => {
    it("should call drag handleDrop when editor is enabled", () => {
      const craftNode = createCraftNode();
      editor.enabled = true;
      editor.dragNode(craftNode);
      const nodeRef = ref({ $el: document.createElement("div") });

      const { handleDrop } = useDragCraftNode(ref(craftNode), nodeRef, resolver);
      handleDrop({ clientX: 50, clientY: 50 } as MouseEvent);

      expect(editor.draggedNode).toEqual(craftNode);
    });

    it("should not call drag handleDrop when editor is disabled", () => {
      const craftNode = createCraftNode();
      editor.enabled = false;
      editor.dragNode(craftNode);
      const nodeRef = ref({ $el: document.createElement("div") });

      const { handleDrop } = useDragCraftNode(ref(craftNode), nodeRef, resolver);
      handleDrop({ clientX: 50, clientY: 50 } as MouseEvent);

      expect(editor.draggedNode).toEqual(craftNode);
    });

    it("should not call drag handleDrop when nodeRef has no $el", () => {
      const craftNode = createCraftNode();
      editor.enabled = true;
      editor.dragNode(craftNode);
      const nodeRef = ref({});

      const { handleDrop } = useDragCraftNode(ref(craftNode), nodeRef, resolver);
      handleDrop({ clientX: 50, clientY: 50 } as MouseEvent);

      expect(editor.draggedNode).toEqual(craftNode);
    });
  });
});
