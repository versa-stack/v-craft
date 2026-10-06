import { CraftNode } from "./craftNode";

const within = (nodes: Record<string, CraftNode>, node: CraftNode, scopeUuid: string): boolean => {
  for (let p = node.parentUuid; p; p = nodes[p]?.parentUuid) if (p === scopeUuid) return true;
  return false;
};

/**
 * Values of every descendant of `scopeUuid` that has a `name` prop, keyed by
 * that name: the captured runtime value, else the field's prefill
 * (`modelValue`, `defaultValue`, `value`).
 */
export const formValues = (
  nodes: Record<string, CraftNode> | null | undefined,
  nodeValues: Record<string, Record<string, any>> | undefined,
  scopeUuid: string,
): Record<string, unknown> => {
  const out: Record<string, unknown> = {};
  // ponytail: list-bound children share a uuid, so repeated fields collapse to one value; key per item when a form repeats fields.
  for (const [uuid, node] of Object.entries(nodes ?? {})) {
    const p = node.props ?? {};
    if (typeof p.name !== "string" || !p.name || !within(nodes!, node, scopeUuid)) continue;
    const v = nodeValues?.[uuid];
    out[p.name] = v?.value ?? v?.modelValue ?? p.modelValue ?? p.defaultValue ?? p.value;
  }
  return out;
};
