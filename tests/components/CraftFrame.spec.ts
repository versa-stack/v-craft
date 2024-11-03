import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";
import { h, nextTick } from "vue";
import CraftComponentSimpleText from "../../src/components/CraftComponentSimpleText.vue";
import Indicator from "../../src/components/CraftDropIndicator.vue";
import CraftFrame from "../../src/components/CraftFrame.vue";
import CraftNodeEditor from "../../src/components/CraftNodeEditor.vue";
import CraftNodeViewer from "../../src/components/CraftNodeViewer.vue";
import { CraftNodeResolverMap } from "../../src/lib/CraftNodeResolver";
import { defaultResolvers } from "../../src/resolvers/default";
import { useEditor } from "../../src/store/editor";

describe("CraftFrame", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  const createWrapper = (props = {}, slots = {}) => {
    return mount(CraftFrame, {
      props: {
        resolverMap: {
          CraftComponentSimpleText: defaultResolvers.CraftComponentSimpleText,
        } as CraftNodeResolverMap<any>,
        ...props,
      },
      global: {
        components: {
          CraftNodeEditor,
          CraftNodeViewer,
          CraftFrame,
          CraftComponentSimpleText,
          Indicator,
        },
      },
      slots,
    });
  };

  it("renders CraftNodeViewer for each node in the editor", async () => {
    const editor = useEditor()();
    editor.setNodes([
      {
        uuid: "1",
        componentName: "CraftComponentSimpleText",
        props: {},
        children: [],
      },
      {
        uuid: "2",
        componentName: "CraftComponentSimpleText",
        props: {},
        children: [],
      },
    ]);

    const wrapper = createWrapper();
    await nextTick();

    expect(
      wrapper.findAllComponents({ name: "CraftNodeViewer" })
    ).toHaveLength(2);
  });

  it("creates nodes from default slot when editor has no nodes", async () => {
    const wrapper = createWrapper(
      {},
      {
        default: () => [
          h(CraftComponentSimpleText, { content: "Text 1" }),
          h(CraftComponentSimpleText, { content: "Text 2" }),
        ],
      }
    );

    await nextTick();

    const editor = useEditor()();
    expect(editor.nodeMap).toHaveLength(2);
    expect(
      wrapper.findAllComponents({ name: "CraftNodeViewer" })
    ).toHaveLength(2);
  });

  it("does not create nodes from slot when editor already has nodes", async () => {
    const editor = useEditor()();
    editor.setNodes([
      {
        uuid: "1",
        componentName: "CraftComponentSimpleText",
        props: {},
        children: [],
      },
    ]);

    const wrapper = createWrapper(
      {},
      {
        default: () => [
          h(CraftComponentSimpleText, { content: "Text 1" }),
          h(CraftComponentSimpleText, { content: "Text 2" }),
        ],
      }
    );

    await nextTick();

    expect(editor.nodeTree).toHaveLength(1);
    expect(
      wrapper.findAllComponents({ name: "CraftNodeViewer" })
    ).toHaveLength(1);
  });

  it("renders Indicator when not viewOnly and editor is enabled", async () => {
    const editor = useEditor()();
    editor.enable();

    const wrapper = createWrapper();
    await nextTick();

    expect(wrapper.findComponent(Indicator).exists()).toBe(true);
  });

  it("does not render Indicator when viewOnly", async () => {
    const editor = useEditor()();
    editor.enable();

    const wrapper = createWrapper({ viewOnly: true });
    await nextTick();

    expect(wrapper.findComponent(Indicator).exists()).toBe(false);
  });

  it("does not render Indicator when editor is disabled", async () => {
    const editor = useEditor()();
    editor.disable();

    const wrapper = createWrapper();
    await nextTick();

    expect(wrapper.findComponent(Indicator).exists()).toBe(false);
  });
});
