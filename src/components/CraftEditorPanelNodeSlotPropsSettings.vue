<template>
  <slot
    name="panel-content"
    :craft-node="craftNode"
    :mapping-groups="mappingGroups"
    :bucket-options="bucketOptions"
    :available-props="availableProps ?? []"
    :target-prop-options-for="targetPropOptionsFor"
    :add-group="addGroup"
    :remove-group="removeGroup"
    :update-bucket="updateBucket"
    :add-field="addField"
    :remove-field="removeField"
    :update-field="updateField"
  >
    <fieldset
      v-if="craftNode"
      class="v-craft-panel-settings formkit-fieldset v-craft-scrollable-content"
    >
      <legend class="formkit-legend">Props Mapping</legend>
      <p class="formkit-help">
        Map fields from an ancestor slot's context into this component's own
        props using JSONPath (e.g. <code>$.item.name</code>), or paste a JSON
        mapping object if the app supports richer transforms.
      </p>

      <p v-if="!mappingGroups.length" class="formkit-help">
        No mappings configured.
      </p>

      <div
        v-for="(group, groupIndex) in mappingGroups"
        :key="group.id"
        class="v-craft-slot-props-map-group"
      >
        <FormKit
          type="select"
          label="Context"
          placeholder="Select context"
          :options="bucketOptions"
          :value="group.bucket"
          @input="(value) => updateBucket(groupIndex, String(value ?? ''))"
        />

        <template v-for="(field, fieldIndex) in group.fields" :key="field.id">
          <FormKit
            v-if="availableProps && availableProps.length"
            type="select"
            label="Target Prop"
            placeholder="target prop"
            :options="targetPropOptionsFor(field.targetProp)"
            :value="field.targetProp"
            @input="
              (value) =>
                updateField(groupIndex, fieldIndex, 'targetProp', String(value ?? ''))
            "
          />
          <FormKit
            v-else
            type="text"
            label="Target Prop"
            placeholder="target prop"
            :value="field.targetProp"
            @input="
              (value) =>
                updateField(groupIndex, fieldIndex, 'targetProp', String(value ?? ''))
            "
          />
          <FormKit
            type="textarea"
            label="JSONPath (or JSON mapping object)"
            placeholder="$.item.name  (or paste a JSON transform object)"
            :value="field.fromPath"
            @input="
              (value) =>
                updateField(groupIndex, fieldIndex, 'fromPath', String(value ?? ''))
            "
          />
          <button
            type="button"
            class="formkit-input v-craft-slot-props-remove"
            @click.prevent="removeField(groupIndex, fieldIndex)"
          >
            Remove field
          </button>
        </template>

        <button
          type="button"
          class="formkit-input v-craft-slot-props-add"
          @click.prevent="addField(groupIndex)"
        >
          + Add field
        </button>
        <button
          type="button"
          class="formkit-input v-craft-slot-props-remove"
          @click.prevent="removeGroup(groupIndex)"
        >
          Remove group
        </button>
      </div>

      <button
        type="button"
        class="formkit-input v-craft-slot-props-add"
        @click.prevent="addGroup"
      >
        + Add mapping group
      </button>
    </fieldset>
  </slot>
</template>

<script lang="ts" setup>
import { FormKit } from "@formkit/vue";
import { v4 as uuidv4 } from "uuid";
import { computed, ref, toRef, watch } from "vue";
import { CraftNode } from "../lib/craftNode";
import { SchemaFieldOption } from "../lib/extractSchemaFieldNames";
import { useAncestorContextBuckets } from "./composable/useAncestorContextBuckets";

type MappingField = { id: string; targetProp: string; fromPath: string };
type MappingGroup = { id: string; bucket: string; fields: MappingField[] };

const props = defineProps<{
  craftNode?: CraftNode;
  availableProps?: SchemaFieldOption[];
}>();

const emit = defineEmits<{
  (
    e: "update:slotsPropsPropsMap",
    value: Record<string, Record<string, unknown>>,
  ): void;
}>();

/** `fromPath` doubles as a JSON escape hatch: `{...}` parses as a mapping object, anything else is a literal JSONPath string. */
const parseFromPath = (value: string): unknown => {
  const trimmed = value.trim();
  if (!trimmed.startsWith("{")) return trimmed;
  try {
    return JSON.parse(trimmed);
  } catch {
    return trimmed;
  }
};

const stringifyMapping = (mapping: unknown): string =>
  typeof mapping === "string" ? mapping : JSON.stringify(mapping);

const craftNode = toRef(props, "craftNode");
const { buckets } = useAncestorContextBuckets(craftNode);

const bucketOptions = computed(() => {
  const seen = new Set<string>();
  return buckets.value
    .filter((bucket) => {
      if (seen.has(bucket.slotName)) return false;
      seen.add(bucket.slotName);
      return true;
    })
    .map((bucket) => ({
      value: bucket.slotName,
      label: bucket.keys.length
        ? `${bucket.slotName} (${bucket.ancestorComponentName}: ${bucket.keys.join(", ")})`
        : `${bucket.slotName} (${bucket.ancestorComponentName})`,
    }));
});

const targetPropOptionsFor = (currentValue: string) => {
  const base = props.availableProps || [];
  if (!currentValue || base.some((option) => option.value === currentValue)) {
    return base;
  }
  return [{ value: currentValue, label: `${currentValue} (custom)` }, ...base];
};

const mappingGroups = ref<MappingGroup[]>([]);

const syncFromNode = () => {
  const node = craftNode.value;

  mappingGroups.value = Object.entries(node?.slotsPropsPropsMap || {}).map(
    ([bucket, fields]) => ({
      id: uuidv4(),
      bucket,
      fields: Object.entries(fields).map(([targetProp, mapping]) => ({
        id: uuidv4(),
        targetProp,
        fromPath: stringifyMapping(mapping),
      })),
    }),
  );
};

watch(() => craftNode.value?.uuid, syncFromNode, { immediate: true });

const emitMappingGroups = () => {
  const result: Record<string, Record<string, unknown>> = {};
  mappingGroups.value.forEach((group) => {
    if (!group.bucket.trim()) return;
    const fields: Record<string, unknown> = {};
    group.fields.forEach((field) => {
      if (field.targetProp.trim() && field.fromPath.trim()) {
        fields[field.targetProp.trim()] = parseFromPath(field.fromPath);
      }
    });
    if (Object.keys(fields).length) {
      result[group.bucket.trim()] = fields;
    }
  });
  emit("update:slotsPropsPropsMap", result);
};

const addGroup = () => {
  mappingGroups.value.push({
    id: uuidv4(),
    bucket: bucketOptions.value[0]?.value || "",
    fields: [{ id: uuidv4(), targetProp: "", fromPath: "" }],
  });
  emitMappingGroups();
};

const removeGroup = (groupIndex: number) => {
  mappingGroups.value.splice(groupIndex, 1);
  emitMappingGroups();
};

const updateBucket = (groupIndex: number, value: string) => {
  mappingGroups.value[groupIndex].bucket = value;
  emitMappingGroups();
};

const addField = (groupIndex: number) => {
  mappingGroups.value[groupIndex].fields.push({
    id: uuidv4(),
    targetProp: "",
    fromPath: "",
  });
};

const removeField = (groupIndex: number, fieldIndex: number) => {
  mappingGroups.value[groupIndex].fields.splice(fieldIndex, 1);
  emitMappingGroups();
};

const updateField = (
  groupIndex: number,
  fieldIndex: number,
  key: "targetProp" | "fromPath",
  value: string,
) => {
  mappingGroups.value[groupIndex].fields[fieldIndex][key] = value;
  emitMappingGroups();
};
</script>

<style lang="scss" scoped>
.v-craft-slot-props-map-group {
  border: 1px solid var(--v-craft-gray-medium, #ccc);
  border-radius: 4px;
  padding: 0.75em;
  margin-bottom: 1em;
}

.v-craft-slot-props-remove,
.v-craft-slot-props-add {
  width: 100%;
  margin-top: 0.25em;
}
</style>
