import { FormKitSchemaFormKit } from "@formkit/core";
import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { v4 as uuidv4 } from "uuid";
import { beforeEach, describe, expect, it } from "vitest";
import { nextTick, ref } from "vue";
import CraftCanvas from "../../src/components/CraftCanvas.vue";
import CraftComponentSimpleText from "../../src/components/CraftComponentSimpleText.vue";
import CraftNodeEditor from "../../src/components/CraftNodeEditor.vue";
import CraftNodeViewer from "../../src/components/CraftNodeViewer.vue";
import { CraftNode } from "../../src/lib/craftNode";
import CraftNodeResolver, {
  CraftNodeResolverMap,
} from "../../src/lib/CraftNodeResolver";
import { defaultResolvers } from "../../src/resolvers/default";
import { useEditor } from "../../src/store/editor";

const createSimpleText = (
  content: string = "Hello World",
  componentName: string = "h1"
) => {
  return {
    componentName: "CraftComponentSimpleText",
    props: {
      content,
      componentName,
    },
    slots: {},
    uuid: uuidv4(),
  };
};

const createCanvas = <T extends object = FormKitSchemaFormKit>(
  children: CraftNode<T>[]
) => {
  return {
    componentName: "CraftCanvas",
    props: {
      componentName: "div"
    },
    slots: {
      default: children,
    },
    uuid: uuidv4(),
  };
};

describe("CraftNodeEditor", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("renders the correct component based on the craftNode", async () => {
    const craftNode = ref(createSimpleText());

    const resolver = ref(
      new CraftNodeResolver({
        CraftComponentSimpleText: defaultResolvers.CraftComponentSimpleText,
      } as CraftNodeResolverMap<any>)
    );

    const wrapper = mount(CraftNodeEditor, {
      props: {
        craftNode: craftNode.value,
      },
      global: {
        components: {
          CraftNodeViewer,
          CraftComponentSimpleText,
        },
        provide: {
          resolver,
        },
      },
    });

    expect(
      wrapper.findComponent({ name: "CraftComponentSimpleText" }).exists()
    ).toBe(true);
    expect(
      wrapper
        .findComponent({
          name: "CraftComponentSimpleText",
        })
        .element.tagName.toLowerCase()
    ).toBe("h1");
    expect(wrapper.text()).toContain("Hello World");

    craftNode.value.props.componentName = "p";
    await nextTick();

    expect(
      wrapper
        .findComponent({
          name: "CraftComponentSimpleText",
        })
        .element.tagName.toLowerCase()
    ).toBe("p");
  });

  it("renders the correct component tree based on craftNode", async () => {
    const craftNode = ref(createCanvas([createSimpleText()]));
    const editor = useEditor();
    editor.enable();

    const resolver = ref(
      new CraftNodeResolver({
        CraftComponentSimpleText: defaultResolvers.CraftComponentSimpleText,
        CraftCanvas: defaultResolvers.CraftCanvas,
        div: {
          componentName: "div"
        }
      } as CraftNodeResolverMap<any>)
    );

    const wrapper = mount(CraftNodeEditor, {
      props: {
        craftNode: craftNode.value,
      },
      global: {
        components: {
          CraftNodeViewer,
          CraftComponentSimpleText,
          CraftCanvas,
        },
        provide: {
          resolver,
        },
      },
    });

    expect(
      wrapper.findComponent({ name: "CraftCanvas" }).exists()
    ).toBe(true);
    
    expect(
      wrapper.findComponent({ name: "CraftComponentSimpleText" }).exists()
    ).toBe(true);

    expect(
      wrapper
        .findComponent({
          name: "CraftComponentSimpleText",
        })
        .element.tagName.toLowerCase()
    ).toBe("h1");
    expect(wrapper.text()).toContain("Hello World");

    craftNode.value.slots.default[0].props.componentName = "p";
    await nextTick();

    expect(
      wrapper
        .findComponent({
          name: "CraftComponentSimpleText",
        })
        .element.tagName.toLowerCase()
    ).toBe("p");
  });

  it("sets the CraftNode to selected when clicked.", async () => {
    const editor = useEditor();
    editor.enable();
    await nextTick();

    const simpleText = createSimpleText();
    editor.setNodes([simpleText]);
    const craftNode = ref<CraftNode<any> | null>(
      editor.nodeMap.get(simpleText.uuid) || null
    );

    if (!craftNode) {
      throw Error("Craft node was not found.");
    }

    const resolver = ref(
      new CraftNodeResolver<any>({
        CraftComponentSimpleText: defaultResolvers.CraftComponentSimpleText,
      })
    );

    const wrapper = mount(CraftNodeEditor, {
      props: {
        craftNode: craftNode.value as CraftNode<any>,
      },
      global: {
        components: {
          CraftComponentSimpleText,
          CraftNodeViewer,
        },
        provide: {
          craftNode,
          resolver,
        },
      },
    });

    const node = wrapper.findComponent({ name: "CraftComponentSimpleText" });
    await node.trigger("click");

    expect(editor.selectedNode?.uuid).toBe(simpleText.uuid);
    expect(node.classes()).toContain("v-craft-node-selected");
  });

  it("does not render slot templates for non-canvas nodes with empty slots", () => {
    const craftNode = ref({
      componentName: "div",
      props: {},
      slots: { default: [] },
      uuid: uuidv4(),
    });

    const resolver = ref(
      new CraftNodeResolver({
        div: { componentName: "div" },
      } as CraftNodeResolverMap<any>)
    );

    const wrapper = mount(CraftNodeEditor, {
      props: {
        craftNode: craftNode.value,
      },
      global: {
        components: {
          CraftNodeViewer,
        },
        provide: {
          resolver,
        },
      },
    });

    expect(wrapper.find("div").exists()).toBe(true);
    expect(wrapper.findAllComponents({ name: "CraftNodeViewer" })).toHaveLength(0);
  });

  it("renders slot templates for canvas nodes with empty slots", () => {
    const craftNode = ref(createCanvas([]));
    const editor = useEditor();
    editor.enable();

    const resolver = ref(
      new CraftNodeResolver({
        CraftCanvas: defaultResolvers.CraftCanvas,
        div: { componentName: "div" },
      } as CraftNodeResolverMap<any>)
    );

    const wrapper = mount(CraftNodeEditor, {
      props: {
        craftNode: craftNode.value,
      },
      global: {
        components: {
          CraftNodeViewer,
          CraftCanvas,
        },
        provide: {
          resolver,
        },
      },
    });

    expect(wrapper.findComponent({ name: "CraftCanvas" }).exists()).toBe(true);
    expect(wrapper.find(".v-craft-drop-text").exists()).toBe(true);
  });

  it("renders slot templates for non-canvas nodes with non-empty slots", () => {
    const craftNode = ref({
      componentName: "div",
      props: {},
      slots: { default: [createSimpleText()] },
      uuid: uuidv4(),
    });

    const resolver = ref(
      new CraftNodeResolver({
        div: { componentName: "div" },
        CraftComponentSimpleText: defaultResolvers.CraftComponentSimpleText,
      } as CraftNodeResolverMap<any>)
    );

    const wrapper = mount(CraftNodeEditor, {
      props: {
        craftNode: craftNode.value,
      },
      global: {
        components: {
          CraftNodeViewer,
          CraftComponentSimpleText,
        },
        provide: {
          resolver,
        },
      },
    });

    expect(wrapper.find("div").exists()).toBe(true);
    expect(wrapper.findComponent({ name: "CraftComponentSimpleText" }).exists()).toBe(true);
  });

  it("does not render slot templates for void HTML elements with empty slots", () => {
    const craftNode = ref({
      componentName: "img",
      props: { src: "https://example.com/image.jpg", class: "w-full" },
      slots: { default: [] },
      uuid: uuidv4(),
    });

    const resolver = ref(
      new CraftNodeResolver({
        img: { componentName: "img" },
      } as CraftNodeResolverMap<any>)
    );

    const wrapper = mount(CraftNodeEditor, {
      props: {
        craftNode: craftNode.value,
      },
      global: {
        components: {
          CraftNodeViewer,
        },
        provide: {
          resolver,
        },
      },
    });

    expect(wrapper.find("img").exists()).toBe(true);
    expect(wrapper.findAllComponents({ name: "CraftNodeViewer" })).toHaveLength(0);
  });
});
