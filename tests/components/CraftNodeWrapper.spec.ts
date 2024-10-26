import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { nextTick, ref } from "vue";
import CraftNodeWrapper from "../../src/components/CraftNodeWrapper.vue";
import CraftNodeEditor from "../../src/components/CraftNodeEditor.vue";
import CraftNodeViewer from "../../src/components/CraftNodeViewer.vue";
import CraftNodeResolver, {
  CraftNodeResolverMap,
} from "../../src/lib/CraftNodeResolver";
import { defaultResolvers } from "../../src/resolvers/default";
import { CraftNode } from "../../src/lib/craftNode";
import { v4 as uuidv4 } from "uuid";
import { useEditor } from "../../src/store/editor";
import CraftComponentSimpleText from "../../src/components/CraftComponentSimpleText.vue";
import { beforeEach, describe, expect, it } from "vitest";

const createSimpleText = (
  content: string = "Hello World",
  componentName: string = "h1"
): CraftNode<any> => {
  return {
    componentName: "CraftComponentSimpleText",
    props: {
      content,
      componentName,
    },
    children: [],
    uuid: uuidv4(),
    visible: true,
  };
};

describe("CraftNodeWrapper", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  const createWrapper = (
    craftNode: CraftNode<any>,
    viewOnly: boolean = false
  ) => {
    const resolver = ref(
      new CraftNodeResolver({
        CraftComponentSimpleText: defaultResolvers.CraftComponentSimpleText,
      } as CraftNodeResolverMap<any>)
    );

    return mount(CraftNodeWrapper, {
      props: {
        craftNode,
        viewOnly,
      },
      global: {
        components: {
          CraftNodeWrapper,
          CraftNodeEditor,
          CraftNodeViewer,
          CraftComponentSimpleText,
        },
        provide: {
          resolver,
        },
      },
    });
  };

  it("renders CraftNodeEditor when not viewOnly, visible, and editor is enabled", async () => {
    const editor = useEditor()();
    editor.enable();
    await nextTick();

    const craftNode = createSimpleText();
    const wrapper = createWrapper(craftNode);

    expect(wrapper.findComponent(CraftNodeEditor).exists()).toBe(true);
    expect(wrapper.findComponent(CraftNodeViewer).exists()).toBe(false);
  });

  it("renders CraftNodeViewer when viewOnly and visible", async () => {
    const craftNode = createSimpleText();
    const wrapper = createWrapper(craftNode, true);

    expect(wrapper.findComponent(CraftNodeViewer).exists()).toBe(true);
    expect(wrapper.findComponent(CraftNodeEditor).exists()).toBe(false);
  });

  it("renders CraftNodeViewer when visible and editor is disabled", async () => {
    const editor = useEditor()();
    editor.disable();
    await nextTick();

    const craftNode = createSimpleText();
    const wrapper = createWrapper(craftNode);

    expect(wrapper.findComponent(CraftNodeViewer).exists()).toBe(true);
    expect(wrapper.findComponent(CraftNodeEditor).exists()).toBe(false);
  });

  it("does not render anything when not visible", async () => {
    const craftNode = createSimpleText();
    craftNode.visible = false;
    const wrapper = createWrapper(craftNode);

    expect(wrapper.findComponent(CraftNodeEditor).exists()).toBe(false);
    expect(wrapper.findComponent(CraftNodeViewer).exists()).toBe(false);
  });

  it("updates when craftNode prop changes", async () => {
    const craftNode = createSimpleText("Initial Content");
    const wrapper = createWrapper(craftNode);

    expect(wrapper.text()).toContain("Initial Content");

    await wrapper.setProps({
      craftNode: createSimpleText("Updated Content"),
    });

    expect(wrapper.text()).toContain("Updated Content");
  });

  it("provides readonly craftNode to child components", async () => {
    const craftNode = createSimpleText();
    const wrapper = createWrapper(craftNode);

    const editor = useEditor()();
    editor.enable();
    await nextTick();

    const childComponent = wrapper.findComponent(CraftNodeEditor);
    expect(childComponent.exists()).toBe(true);

    const providedCraftNode = (childComponent as any).vm.craftNode;
    expect(providedCraftNode).toBeDefined();
    expect(() => {
      providedCraftNode.value.props.content = "Modified Content";
    }).toThrow();
  });
});
