<template>
  <fieldset
    v-if="craftNode"
    class="v-craft-panel-settings formkit-fieldset v-craft-scrollable-content v-craft-slot-props-settings"
  >
    <template v-if="ownSlotNames.length">
      <legend class="formkit-legend">Slot Context</legend>
      <p class="v-craft-slot-props-hint">
        Prop names this component's own slots expose to their children (e.g.
        a list exposing <code>item</code> and <code>index</code>).
      </p>

      <div
        v-for="slotName in ownSlotNames"
        :key="slotName"
        class="v-craft-slot-props-row"
      >
        <label class="formkit-label" :for="`slot-props-${slotName}`">{{
          slotName
        }}</label>
        <input
          :id="`slot-props-${slotName}`"
          class="formkit-input"
          type="text"
          placeholder="item, index"
          :value="slotsPropsDraft[slotName]"
          @input="updateSlotProps(slotName, ($event.target as HTMLInputElement).value)"
        />
      </div>
    </template>

    <legend class="formkit-legend">Props Mapping</legend>
    <p class="v-craft-slot-props-hint">
      Map fields from an ancestor slot's context into this component's own
      props using JSONPath (e.g. <code>$.item.name</code>).
    </p>

    <p v-if="!mappingGroups.length" class="v-craft-slot-props-empty">
      No mappings configured.
    </p>

    <div
      v-for="(group, groupIndex) in mappingGroups"
      :key="group.id"
      class="v-craft-slot-props-map-group"
    >
      <div class="v-craft-slot-props-map-header">
        <select
          class="formkit-input v-craft-slot-props-bucket"
          :value="group.bucket"
          @change="updateBucket(groupIndex, ($event.target as HTMLSelectElement).value)"
        >
          <option value="" disabled>Select context</option>
          <option
            v-for="option in bucketOptions"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
        <button
          type="button"
          class="formkit-input v-craft-slot-props-remove"
          @click.prevent="removeGroup(groupIndex)"
        >
          Remove
        </button>
      </div>

      <div
        v-for="(field, fieldIndex) in group.fields"
        :key="field.id"
        class="v-craft-slot-props-map-field"
      >
        <select
          v-if="availableProps && availableProps.length"
          class="formkit-input"
          :value="field.targetProp"
          @change="
            updateField(
              groupIndex,
              fieldIndex,
              'targetProp',
              ($event.target as HTMLSelectElement).value,
            )
          "
        >
          <option value="" disabled>target prop</option>
          <option
            v-for="option in targetPropOptionsFor(field.targetProp)"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
        <input
          v-else
          class="formkit-input"
          type="text"
          placeholder="target prop"
          :value="field.targetProp"
          @input="
            updateField(
              groupIndex,
              fieldIndex,
              'targetProp',
              ($event.target as HTMLInputElement).value,
            )
          "
        />
        <input
          class="formkit-input"
          type="text"
          placeholder="$.item.name"
          :value="field.fromPath"
          @input="
            updateField(
              groupIndex,
              fieldIndex,
              'fromPath',
              ($event.target as HTMLInputElement).value,
            )
          "
        />
        <button
          type="button"
          class="formkit-input v-craft-slot-props-remove"
          @click.prevent="removeField(groupIndex, fieldIndex)"
        >
          &times;
        </button>
      </div>

      <button
        type="button"
        class="formkit-input v-craft-slot-props-add"
        @click.prevent="addField(groupIndex)"
      >
        + Add field
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
</template>

<script lang="ts" setup>
import { v4 as uuidv4 } from "uuid";
import { computed, ref, toRef, watch } from "vue";
import { CraftNode } from "../lib/craftNode";
import { SchemaFieldOption } from "../lib/extractSchemaFieldNames";
import { useAncestorContextBuckets } from "./composable/useAncestorContextBuckets";

type MappingField = { id: string; targetProp: string; fromPath: string };
type MappingGroup = { id: string; bucket: string; fields: MappingField[] };

const props = defineProps<{
  craftNode?: CraftNode;
  availableSlots?: string[];
  availableProps?: SchemaFieldOption[];
}>();

const emit = defineEmits<{
  (e: "update:slotsProps", value: Record<string, string[]>): void;
  (
    e: "update:slotsPropsPropsMap",
    value: Record<string, Record<string, string>>,
  ): void;
}>();

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

const ownSlotNames = computed(() => props.availableSlots || []);

const targetPropOptionsFor = (currentValue: string) => {
  const base = props.availableProps || [];
  if (!currentValue || base.some((option) => option.value === currentValue)) {
    return base;
  }
  return [{ value: currentValue, label: `${currentValue} (custom)` }, ...base];
};

const slotsPropsDraft = ref<Record<string, string>>({});
const mappingGroups = ref<MappingGroup[]>([]);

const syncFromNode = () => {
  const node = craftNode.value;

  const nextSlotsProps: Record<string, string> = {};
  ownSlotNames.value.forEach((slotName) => {
    nextSlotsProps[slotName] = (node?.slotsProps?.[slotName] || []).join(", ");
  });
  slotsPropsDraft.value = nextSlotsProps;

  mappingGroups.value = Object.entries(node?.slotsPropsPropsMap || {}).map(
    ([bucket, fields]) => ({
      id: uuidv4(),
      bucket,
      fields: Object.entries(fields).map(([targetProp, fromPath]) => ({
        id: uuidv4(),
        targetProp,
        fromPath,
      })),
    }),
  );
};

watch(() => craftNode.value?.uuid, syncFromNode, { immediate: true });

const emitSlotsProps = () => {
  const result: Record<string, string[]> = {};
  Object.entries(slotsPropsDraft.value).forEach(([slotName, text]) => {
    const keys = text
      .split(",")
      .map((key) => key.trim())
      .filter(Boolean);
    if (keys.length) result[slotName] = keys;
  });
  emit("update:slotsProps", result);
};

const emitMappingGroups = () => {
  const result: Record<string, Record<string, string>> = {};
  mappingGroups.value.forEach((group) => {
    if (!group.bucket.trim()) return;
    const fields: Record<string, string> = {};
    group.fields.forEach((field) => {
      if (field.targetProp.trim() && field.fromPath.trim()) {
        fields[field.targetProp.trim()] = field.fromPath.trim();
      }
    });
    if (Object.keys(fields).length) {
      result[group.bucket.trim()] = fields;
    }
  });
  emit("update:slotsPropsPropsMap", result);
};

const updateSlotProps = (slotName: string, value: string) => {
  slotsPropsDraft.value[slotName] = value;
  emitSlotsProps();
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
.v-craft-slot-props-hint {
  font-size: 0.8em;
  opacity: 0.75;
  margin: 0.25em 0 0.75em;
}

.v-craft-slot-props-empty {
  font-size: 0.85em;
  opacity: 0.65;
}

.v-craft-slot-props-row {
  display: flex;
  flex-direction: column;
  gap: 0.25em;
  margin-bottom: 0.75em;
}

.v-craft-slot-props-map-group {
  border: 1px solid var(--v-craft-gray-medium, #ccc);
  border-radius: 4px;
  padding: 0.5em;
  margin-bottom: 0.75em;
}

.v-craft-slot-props-map-header {
  display: flex;
  gap: 0.5em;
  align-items: center;
  margin-bottom: 0.5em;
}

.v-craft-slot-props-bucket {
  flex: 1;
}

.v-craft-slot-props-map-field {
  display: flex;
  gap: 0.5em;
  align-items: center;
  margin-bottom: 0.5em;
}

.v-craft-slot-props-map-field input {
  flex: 1;
}

.v-craft-slot-props-remove {
  flex: none;
}
</style>
