import { beforeEach, describe, expect, it, vi } from "vitest";
import { ref } from "vue";
import { v4 as uuidv4 } from "uuid";
import { createPinia, setActivePinia } from "pinia";
import { CraftNode } from "../../../src/lib/craftNode";
import CraftNodeResolver from "../../../src/lib/CraftNodeResolver";
import dragOver from "../../../src/lib/dragCraftNode/dragOver";
import { useEditor } from "../../../src/store/editor";
import { useIndicator } from "../../../src/store/indicator";
import { defaultResolvers } from "../../../src/resolvers/default";

describe("dragCraftNode/dragOver", () => {
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

  describe("main dragOver function", () => {
    it("should handle canvas node drag over", () => {
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

      const pointInsideSpy = vi.spyOn(indicator, "pointInside");

      dragOver(event, el, {
        editor,
        indicator,
        craftNode: ref(canvasNode),
        resolver,
      });

      expect(pointInsideSpy).toHaveBeenCalled();
    });

    it("should handle non-canvas node drag over", () => {
      const targetNode = createCraftNode();
      const draggedNode = createCraftNode();
      editor.setNodes([targetNode]);
      editor.dragNode(draggedNode);

      const el = createMockElement();
      const event = createMockEvent(25, 50);

      const pointBeforeSpy = vi.spyOn(indicator, "pointBefore");

      dragOver(event, el, {
        editor,
        indicator,
        craftNode: ref(targetNode),
        resolver,
      });

      expect(pointBeforeSpy).toHaveBeenCalled();
    });

    it("should do nothing when no dragged node", () => {
      const targetNode = createCraftNode();
      editor.setNodes([targetNode]);

      const el = createMockElement();
      const event = createMockEvent(50, 50);

      const pointInsideSpy = vi.spyOn(indicator, "pointInside");

      dragOver(event, el, {
        editor,
        indicator,
        craftNode: ref(targetNode),
        resolver,
      });

      expect(pointInsideSpy).not.toHaveBeenCalled();
    });

    it("should set forbidden when node cannot be sibling", () => {
      const targetNode = createCraftNode();
      const draggedNode = createCraftNode();
      editor.setNodes([targetNode]);
      editor.dragNode(draggedNode);

      const el = createMockElement();
      const event = createMockEvent(25, 50);

      const setIsForbiddenSpy = vi.spyOn(indicator, "setIsForbidden");

      dragOver(event, el, {
        editor,
        indicator,
        craftNode: ref(targetNode),
        resolver,
      });

      expect(setIsForbiddenSpy).toHaveBeenCalled();
    });
  });
});
