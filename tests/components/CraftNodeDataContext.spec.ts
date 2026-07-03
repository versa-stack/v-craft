import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { v4 as uuidv4 } from "uuid";
import { beforeEach, describe, expect, it } from "vitest";
import { ref } from "vue";
import CraftStaticRenderer from "../../src/components/CraftStaticRenderer.vue";
import CraftNodeStatic from "../../src/components/CraftNodeStatic.vue";
import CraftCanvas from "../../src/components/CraftCanvas.vue";
import CraftNodeEditor from "../../src/components/CraftNodeEditor.vue";
import CraftNodeViewer from "../../src/components/CraftNodeViewer.vue";
import CraftComponentSimpleText from "../../src/components/CraftComponentSimpleText.vue";
import { CraftNode } from "../../src/lib/craftNode";
import CraftNodeResolver, {
  CraftNodeResolverMap,
} from "../../src/lib/CraftNodeResolver";
import { useEditor } from "../../src/store/editor";

const resolverMap: CraftNodeResolverMap<any> = {
  CraftCanvas: { componentName: "CraftCanvas" },
  CraftComponentSimpleText: { componentName: "CraftComponentSimpleText" },
};

const makeTextNode = (fromPath: string): CraftNode => ({
  uuid: uuidv4(),
  componentName: "CraftComponentSimpleText",
  props: { componentName: "span" },
  slots: {},
  slotsPropsPropsMap: {
    data: { content: fromPath },
  },
});

describe("node data context mapping", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("maps a single-item datasource into a descendant's props via JSONPath", () => {
    const textNode = makeTextNode("$.title");
    const wrapperNode: CraftNode = {
      uuid: uuidv4(),
      componentName: "CraftCanvas",
      props: { componentName: "div" },
      slots: { default: [textNode] },
    };

    const wrapper = mount(CraftStaticRenderer, {
      props: {
        nodes: [wrapperNode],
        resolverMap,
        nodeDataMap: {
          [wrapperNode.uuid]: { type: "single", item: { title: "Alice" } },
        },
      },
      global: {
        components: { CraftStaticRenderer, CraftNodeStatic, CraftCanvas, CraftComponentSimpleText },
      },
    });

    expect(wrapper.text()).toBe("Alice");
  });

  it("maps each list item into its own clone via JSONPath, not a shared value", () => {
    const textNode = makeTextNode("$.title");
    const wrapperNode: CraftNode = {
      uuid: uuidv4(),
      componentName: "CraftCanvas",
      props: { componentName: "div" },
      slots: { default: [textNode] },
    };

    const wrapper = mount(CraftStaticRenderer, {
      props: {
        nodes: [wrapperNode],
        resolverMap,
        nodeDataMap: {
          [wrapperNode.uuid]: {
            type: "list",
            list: [{ title: "Alice" }, { title: "Bob" }],
          },
        },
      },
      global: {
        components: { CraftStaticRenderer, CraftNodeStatic, CraftCanvas, CraftComponentSimpleText },
      },
    });

    const texts = wrapper.findAllComponents({ name: "CraftComponentSimpleText" })
      .map((c) => c.text());
    expect(texts).toEqual(["Alice", "Bob"]);
  });

  it("resolves node data through the live editor (CraftNodeViewer preview path)", () => {
    const editor = useEditor();
    const textNode = makeTextNode("$.title");
    const wrapperNode: CraftNode = {
      uuid: uuidv4(),
      componentName: "CraftCanvas",
      props: { componentName: "div" },
      slots: { default: [textNode] },
    };

    editor.setNodes([wrapperNode]);
    editor.setNodeData(wrapperNode.uuid, {
      type: "list",
      list: [{ title: "Alice" }, { title: "Bob" }],
    });

    const resolver = ref(new CraftNodeResolver(resolverMap));
    const wrapper = mount(CraftNodeEditor, {
      props: { craftNode: editor.nodeMap.get(wrapperNode.uuid)! },
      global: {
        components: { CraftNodeViewer, CraftCanvas, CraftComponentSimpleText },
        provide: { resolver },
      },
    });

    // CraftNodeEditor renders the data-bound preview (via CraftNodeViewer)
    // alongside the original static template child, by design - scope the
    // assertion to the preview clones.
    const texts = wrapper
      .findAllComponents({ name: "CraftNodeViewer" })
      .map((c) => c.text());
    expect(texts).toEqual(["Alice", "Bob"]);
  });

  it("a configured mapping overrides a static prop value for that same key", () => {
    // e.g. the Text blueprint's baked-in placeholder content shouldn't
    // shadow a mapping the user deliberately configured for that same prop.
    const textNode: CraftNode = {
      uuid: uuidv4(),
      componentName: "CraftComponentSimpleText",
      props: { componentName: "span", content: "Placeholder" },
      slots: {},
      slotsPropsPropsMap: { data: { content: "$.title" } },
    };
    const wrapperNode: CraftNode = {
      uuid: uuidv4(),
      componentName: "CraftCanvas",
      props: { componentName: "div" },
      slots: { default: [textNode] },
    };

    const wrapper = mount(CraftStaticRenderer, {
      props: {
        nodes: [wrapperNode],
        resolverMap,
        nodeDataMap: {
          [wrapperNode.uuid]: { type: "single", item: { title: "Alice" } },
        },
      },
      global: {
        components: { CraftStaticRenderer, CraftNodeStatic, CraftCanvas, CraftComponentSimpleText },
      },
    });

    expect(wrapper.text()).toBe("Alice");
  });
});
