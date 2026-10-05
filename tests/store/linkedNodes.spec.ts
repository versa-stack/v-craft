import { flushPromises, mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";
import { ref } from "vue";
import CraftComponentSimpleText from "../../src/components/CraftComponentSimpleText.vue";
import CraftNodeEditor from "../../src/components/CraftNodeEditor.vue";
import CraftNodeViewer from "../../src/components/CraftNodeViewer.vue";
import { CraftNode, craftNodeCanBeChildOf } from "../../src/lib/craftNode";
import CraftNodeResolver from "../../src/lib/CraftNodeResolver";
import { defaultResolvers } from "../../src/resolvers/default";
import { useEditor } from "../../src/store/editor";

const text = (uuid: string, content = "hi"): CraftNode => ({
  uuid,
  componentName: "CraftComponentSimpleText",
  props: { content, componentName: "p" },
  slots: {},
});

const canvas = (uuid: string, children: CraftNode[]): CraftNode => ({
  uuid,
  componentName: "CraftCanvas",
  props: { componentName: "div" },
  slots: { default: children },
});

const link = { page: "home", node: "header" };

const page = (): CraftNode =>
  canvas("root", [
    { uuid: "inst", link, label: "Header", slots: { default: [text("leak")] } } as unknown as CraftNode,
    text("after"),
  ]);

const resolver = () => new CraftNodeResolver(defaultResolvers as any);

describe("linked nodes", () => {
  beforeEach(() => setActivePinia(createPinia()));

  it("serializes an instance as {uuid, link, label} with no children", () => {
    const editor = useEditor();
    editor.setResolver(resolver());
    editor.setNodes([page()]);
    const inst = editor.nodeTree[0].slots.default[0];
    expect(inst).toEqual({ uuid: "inst", parentUuid: "root", link, label: "Header" });
    expect(editor.nodeMap.has("leak")).toBe(false);
  });

  it("refuses a drop onto an instance or a descendant of one", () => {
    const editor = useEditor();
    const r = resolver();
    editor.setResolver(r);
    editor.setNodes([page()]);
    const inst = editor.nodeMap.get("inst")!;
    const descendant = { ...canvas("d", []), parentUuid: "inst" };
    const blueprint = text("new");
    expect(craftNodeCanBeChildOf(blueprint, inst, r)).toBe(false);
    expect(craftNodeCanBeChildOf(blueprint, descendant, r)).toBe(false);
    expect(craftNodeCanBeChildOf(blueprint, editor.nodeMap.get("root")!, r)).toBe(true);
  });

  it("deleting the instance removes only the instance node", () => {
    const editor = useEditor();
    editor.setResolver(resolver());
    editor.setNodes([page()]);
    editor.removeNode(editor.nodeMap.get("inst")!);
    expect([...editor.nodeMap.keys()].sort()).toEqual(["after", "root"]);
  });

  const mountInstance = (resolveLink: (l: any) => Promise<CraftNode | null>) => {
    const editor = useEditor();
    const r = resolver();
    editor.setResolver(r);
    editor.setLinkResolver(resolveLink);
    editor.enable();
    editor.setNodes([page()]);
    const wrapper = mount(CraftNodeEditor, {
      props: { craftNode: editor.nodeMap.get("inst")! },
      global: {
        components: { CraftNodeViewer, CraftComponentSimpleText },
        provide: { resolver: ref(r) },
      },
    });
    return { editor, wrapper };
  };

  it("renders the resolved subtree read-only", async () => {
    const { editor, wrapper } = mountInstance(async () => canvas("src", [text("src-child", "Nav")]));
    await flushPromises();
    expect(wrapper.text()).toContain("Nav");
    await wrapper.find("p").trigger("click");
    expect(editor.selectedUuid).toBe("inst");
    expect(editor.nodeMap.has("src-child")).toBe(false);
    expect(editor.nodeTree[0].slots.default[0]).toEqual({ uuid: "inst", parentUuid: "root", link, label: "Header" });
  });

  it("renders a Broken link placeholder when the resolver returns null", async () => {
    const { editor, wrapper } = mountInstance(async () => null);
    await flushPromises();
    expect(wrapper.text()).toContain("Broken link");
    expect(editor.nodeTree[0].slots.default[0]).toEqual({ uuid: "inst", parentUuid: "root", link, label: "Header" });
  });
});
