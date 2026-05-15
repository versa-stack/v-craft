import { beforeEach, describe, expect, it, vi } from "vitest";
import { ref } from "vue";
import { v4 as uuidv4 } from "uuid";
import { createPinia, setActivePinia } from "pinia";
import { CraftNode } from "../../../src/lib/craftNode";
import CraftNodeResolver from "../../../src/lib/CraftNodeResolver";
import drop from "../../../src/lib/dragCraftNode/drop";
import { useEditor } from "../../../src/store/editor";
import { useIndicator } from "../../../src/store/indicator";
import { defaultResolvers } from "../../../src/resolvers/default";

describe("dragCraftNode/drop", () => {
  let editor: ReturnType<typeof useEditor>;
  let indicator: ReturnType<typeof useIndicator>;
  let resolver: CraftNodeResolver<any>;

  beforeEach(() => {
    setActivePinia(createPinia());
    editor = useEditor();
    indicator = useIndicator();
    resolver = new CraftNodeResolver({
      CraftComponentSimpleText: defaultResolvers.CraftComponentSimpleText as any,
    });
    editor.setResolver(resolver);
  });

  const createMockElement = (width = 100, height = 100) => {
    const el = document.createElement("div");
    el.style.width = `${width}px`;
    el.style.height = `${height}px`;
    Object.defineProperty(el, "getBoundingClientRect", {
      value: () => ({ left: 0, top: 0, right: width, bottom: height, width, height }),
    });
    return el;
  };

  const createMockEvent = (clientX = 50, clientY = 50) => {
    return {
      clientX,
      clientY,
      target: document.createElement("div"),
    } as unknown as MouseEvent;
  };

  const createCraftNode = (componentName = "CraftComponentSimpleText"): CraftNode => ({
    uuid: uuidv4(),
    componentName,
    props: {},
    slots: {},
  });

  describe("main drop function", () => {
    it("should return target node when no dragged node", () => {
      const targetNode = createCraftNode();
      editor.setNodes([targetNode]);

      const el = createMockElement();
      const event = createMockEvent();

      const result = drop(event, el, {
        editor,
        indicator,
        craftNode: ref(targetNode),
        resolver,
      });

      expect(result).toStrictEqual(targetNode);
    });

    it("should deep copy dragged node", () => {
      const targetNode = createCraftNode();
      const draggedNode = createCraftNode();
      editor.setNodes([targetNode]);
      editor.dragNode(draggedNode);

      const el = createMockElement();
      const event = createMockEvent(50, 50);

      drop(event, el, {
        editor,
        indicator,
        craftNode: ref(targetNode),
        resolver,
      });

      expect(editor.draggedNode?.uuid).toBe(draggedNode.uuid);
    });

    it("should handle canvas node drop", () => {
      const canvasNode: CraftNode = {
        uuid: uuidv4(),
        componentName: "CraftCanvas",
        props: { componentName: "div" },
        slots: { default: [] },
      };
      const draggedNode = createCraftNode();
      editor.setNodes([canvasNode]);
      editor.dragNode(draggedNode);

      const el = createMockElement();
      const event = createMockEvent(50, 50);

      const appendSpy = vi.spyOn(editor, "appendNodeTo");

      drop(event, el, {
        editor,
        indicator,
        craftNode: ref(canvasNode),
        resolver,
      });

      expect(appendSpy).toHaveBeenCalled();
    });

    it("should handle non-canvas node drop", () => {
      const parentNode: CraftNode = {
        uuid: uuidv4(),
        componentName: "CraftCanvas",
        props: { componentName: "div" },
        slots: { default: [] },
      };
      const targetNode = createCraftNode();
      targetNode.parentUuid = parentNode.uuid;
      parentNode.slots.default = [targetNode];
      
      const draggedNode = createCraftNode();
      editor.setNodes([parentNode]);
      editor.dragNode(draggedNode);

      const el = createMockElement();
      const event = createMockEvent(25, 50);

      const insertBeforeSpy = vi.spyOn(editor, "insertNodeBefore");

      drop(event, el, {
        editor,
        indicator,
        craftNode: ref(targetNode),
        resolver,
      });

      expect(insertBeforeSpy).toHaveBeenCalled();
    });
  });
});
