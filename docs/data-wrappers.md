# Data Wrappers: Feeding External Data into the Tree

A **data wrapper** isn't a special v-craft concept with its own API — it's just an ordinary Vue component that:

1. Fetches (or otherwise produces) some data
2. Hands it to the `CraftNode` it's attached to, via `editor.setNodeData()`
3. Lets its own children map whichever fields they need out of that data via [`slotsPropsPropsMap`](./editor#injecting-data-into-the-node-tree)

That's the entire mechanism. You don't need to invent your own field-mapping props or duplication logic — v-craft already does field selection (JSONPath) and list duplication for you once the data reaches `nodeDataMap`. This page walks through building one, end to end. For the underlying mechanism itself (the `"data"` context bucket, `CraftNodeDatasource`, precedence rules), see [Injecting Data into the Node Tree](./editor#injecting-data-into-the-node-tree) — this page is the practical "how do I fetch something real and wire it up" walkthrough.

## The pieces you need

- **`useCraftNode()`** — gives a component access to its own `CraftNode` (so it knows its `uuid`) when rendered inside the tree.
- **`useEditor()`** and **`editor.setNodeData(uuid, datasource)`** — the store action that populates `nodeDataMap` for that node.
- **`slotsPropsPropsMap`** on the *children* placed inside the wrapper's slot — declares which of their own props should be filled from which JSONPath into the data.

## Worked example: Weather Cards

This example fetches real weather data (via [Open-Meteo](https://open-meteo.com/), a free API that needs no key) for a list of cities and renders one card per city.

### Step 1: The wrapper component

```vue
<!-- WeatherWrapper.vue -->
<template>
  <div class="weather-wrapper">
    <div v-if="loading" class="weather-status">Loading weather…</div>
    <div v-else-if="error" class="weather-status weather-error">{{ error }}</div>
    <!-- Children are rendered by the tree itself (CraftNodeEditor/Static),
         not by this component - this slot is just where they land. -->
    <slot v-else />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useCraftNode, useEditor } from "@versa-stack/v-craft";

const props = withDefaults(
  defineProps<{ cities?: string[] }>(),
  { cities: () => ["London", "Paris", "New York"] },
);

const { craftNode } = useCraftNode();
const editor = useEditor();
const loading = ref(true);
const error = ref("");

const fetchWeather = async () => {
  loading.value = true;
  error.value = "";

  try {
    const results = await Promise.all(
      props.cities.map(async (city) => {
        const geo = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`,
        ).then((r) => r.json());
        const { latitude, longitude } = geo.results?.[0] || {};

        const weather = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m`,
        ).then((r) => r.json());

        return { city, temperature: weather.current?.temperature_2m };
      }),
    );

    // This is the entire integration point: hand the fetched data to this
    // node's own uuid. Everything downstream (duplicating children, field
    // mapping into their props) is handled by the renderer already.
    editor.setNodeData(craftNode.value.uuid, { type: "list", list: results });
  } catch (e) {
    error.value = "Failed to load weather data";
  } finally {
    loading.value = false;
  }
};

onMounted(fetchWeather);
watch(() => props.cities, fetchWeather);
</script>

<style scoped>
.weather-wrapper {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 1em;
}
.weather-status {
  grid-column: 1 / -1;
  text-align: center;
  padding: 2em;
}
</style>
```

Note what's *not* here: no `craftNodeUuid` prop threaded in from outside, no custom `fieldMapping` prop, no duplication logic. `useCraftNode()` gives the component its own identity, and `setNodeData` is the one call that connects it to the tree.

### Step 2: The child card

The card is a plain component with plain props — it has no idea a fetch happened, or where its data came from:

```vue
<!-- WeatherCard.vue -->
<template>
  <div class="weather-card">
    <h3>{{ city }}</h3>
    <div class="temperature">{{ temperature }}°C</div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  city?: string;
  temperature?: number;
}>();
</script>
```

### Step 3: Resolver entries

```ts
const resolverMap: CraftNodeResolverMap = {
  WeatherWrapper: {
    componentName: "WeatherWrapper",
    component: WeatherWrapper,
    slots: ["default"],
    propsSchema: [
      { $formkit: "text", name: "cities", label: "Cities (comma-separated)" },
    ],
  },
  WeatherCard: {
    componentName: "WeatherCard",
    component: WeatherCard,
  },
};
```

### Step 4: The blueprint

The mapping lives on the *card*, not the wrapper — it's per-instance data on the `CraftNode`, exactly like any other `slotsPropsPropsMap` usage:

```ts
export const weatherBlueprints: Blueprints = {
  WeatherWrapper: {
    label: "Weather Display",
    componentName: "WeatherWrapper",
    props: {
      cities: ["London", "Paris", "New York"],
    },
    slots: {
      default: [
        {
          label: "Weather Card",
          componentName: "WeatherCard",
          props: {},
          slots: {},
          slotsPropsPropsMap: {
            data: {
              city: "$.city",
              temperature: "$.temperature",
            },
          },
        },
      ],
    },
  },
};
```

Drop this blueprint onto the canvas, and `WeatherWrapper` fetches on mount, calls `setNodeData` with a `list` datasource, and the single `WeatherCard` template is cloned once per city — each clone reading its own `city`/`temperature` out of its own item via the `"data"` bucket. Nothing here duplicates logic that already exists in the mapping mechanism.

## Choosing `single` vs `list`

- Fetching **one record** (a single product, a logged-in user's profile) → `editor.setNodeData(uuid, { type: "single", item })`. No duplication; children just read fields out of that one object.
- Fetching **a collection** (search results, a product grid, a list of cities) → `type: "list"`. The wrapper's children are cloned once per item, as above.

Both are covered in detail, including precedence rules and the underlying `CraftNodeDatasource` type, in [Injecting Data into the Node Tree](./editor#injecting-data-into-the-node-tree).

## A non-fetching variant: static data

A "data wrapper" doesn't have to fetch anything remote — it's just whatever calls `setNodeData`. For static/local data (e.g. content authored elsewhere, or data passed down as a prop), skip the fetch entirely:

```vue
<script setup lang="ts">
import { onMounted, watch } from "vue";
import { useCraftNode, useEditor } from "@versa-stack/v-craft";

const props = defineProps<{ items: Record<string, any>[] }>();
const { craftNode } = useCraftNode();
const editor = useEditor();

const sync = () =>
  editor.setNodeData(craftNode.value.uuid, { type: "list", list: props.items });

onMounted(sync);
watch(() => props.items, sync);
</script>
```

Same integration point, same downstream behavior — the only difference is where the data comes from.

## Next Steps

- [Injecting Data into the Node Tree](./editor#injecting-data-into-the-node-tree) — the underlying mechanism: `CraftNodeDatasource`, the `"data"` context bucket, and how it composes with scoped-slot data.
- [Resolvers](./resolvers) — declaring components and their schemas.
- [Blueprints](./blueprints) — defining reusable, pre-configured component trees like the one above.
