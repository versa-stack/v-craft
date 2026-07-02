import type { FormKitSchemaDefinition } from "@formkit/core";

export type SchemaFieldOption = { value: string; label: string };

/**
 * Reads the flat `propsSchema`/`eventsSchema` array shape used throughout
 * this project's resolvers (each entry a FormKit node carrying `name` and
 * an optional `label`) and turns it into options for a target-prop picker.
 */
export const extractSchemaFieldNames = (
  schema: FormKitSchemaDefinition | undefined | null,
): SchemaFieldOption[] => {
  if (!Array.isArray(schema)) {
    return [];
  }

  return (schema as unknown as Record<string, unknown>[])
    .filter(
      (node) =>
        typeof node === "object" &&
        node !== null &&
        typeof node.name === "string",
    )
    .map((node) => {
      const name = node.name as string;
      const label = node.label;
      return {
        value: name,
        label: typeof label === "string" && label.trim() ? label : name,
      };
    });
};
