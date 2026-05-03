# Advanced Usage: Level Up Your v-craft Skills

You've mastered the basics. Now let's build some seriously cool stuff! This guide is for when you want to create professional-grade page editors.

## Mastering craftNodes and Data Templates

### Understanding craftNodes Deeply

A craftNode is like a smart container that knows:
- What component to render
- What data to use
- How to behave
- How to interact with slots

### Advanced craftNode Structure

```javascript
const advancedCraftNode = {
  id: 'hero-section-001',
  componentName: 'HeroSection',
  props: {
    title: 'Welcome to Our Store',
    subtitle: 'Discover amazing products',
    backgroundImage: 'https://example.com/hero.jpg'
  },
  
  // Advanced: Data-driven content
  data: [
    {
      id: 1,
      name: 'Featured Product 1',
      price: 29.99,
      image: 'product1.jpg'
    },
    {
      id: 2, 
      name: 'Featured Product 2',
      price: 39.99,
      image: 'product2.jpg'
    }
  ],
  
  // Template for rendering data
  template: {
    componentName: 'ProductCard',
    props: {
      // These will be filled from data items
    }
  },
  
  // Advanced configuration
  config: {
    repeat: true,           // Use template for each data item
    maxItems: 6,           // Maximum items to show
    sortBy: 'price',       // Sort data by this field
    sortOrder: 'desc',     // Sort direction
    filter: {              // Filter data
      price: { min: 10, max: 100 }
    }
  },

  slots: {
    default: [
      // These will be auto-generated from data + template
    ]
  }
}
```

## Creating Dynamic Lists with Templates

### Step 1: The List Container

```vue
<!-- DynamicList.vue -->
<template>
  <div class="dynamic-list" :style="containerStyles">
    <div v-if="data.length === 0" class="empty-state">
      No items to display
    </div>
    
    <div v-else class="list-container">
      <component
        v-for="(item, index) in processedData"
        :key="item.id || index"
        :is="templateComponent"
        v-bind="item"
        :index="index"
        :total="processedData.length"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, inject } from 'vue'

const props = defineProps({
  // Data array
  data: {
    type: Array,
    default: () => []
  },
  
  // Template component name
  template: {
    type: String,
    required: true
  },
  
  // Layout settings
  layout: {
    type: String,
    default: 'grid', // grid, list, masonry, carousel
    validator: (value) => ['grid', 'list', 'masonry', 'carousel'].includes(value)
  },
  
  // Grid settings
  columns: {
    type: Number,
    default: 3,
    validator: (value) => value >= 1 && value <= 6
  },
  
  // Spacing
  gap: {
    type: Number,
    default: 20
  },
  
  // Sorting
  sortBy: {
    type: String,
    default: 'id'
  },
  
  sortOrder: {
    type: String,
    default: 'asc',
    validator: (value) => ['asc', 'desc'].includes(value)
  },
  
  // Filtering
  filter: {
    type: Object,
    default: () => ({})
  },
  
  // Pagination
  itemsPerPage: {
    type: Number,
    default: 0 // 0 = show all
  },
  
  currentPage: {
    type: Number,
    default: 1
  }
})

const resolver = inject('resolver')
const templateComponent = computed(() => resolver?.value.resolve(props.template))

const processedData = computed(() => {
  let result = [...props.data]
  
  // Apply filters
  if (Object.keys(props.filter).length > 0) {
    result = result.filter(item => {
      return Object.entries(props.filter).every(([key, value]) => {
        if (typeof value === 'object' && value.min !== undefined) {
          return item[key] >= value.min && item[key] <= value.max
        }
        return item[key] === value
      })
    })
  }
  
  // Apply sorting
  result.sort((a, b) => {
    let valueA = a[props.sortBy]
    let valueB = b[props.sortBy]
    
    if (typeof valueA === 'string') {
      valueA = valueA.toLowerCase()
      valueB = valueB.toLowerCase()
    }
    
    if (props.sortOrder === 'asc') {
      return valueA > valueB ? 1 : -1
    } else {
      return valueA < valueB ? 1 : -1
    }
  })
  
  // Apply pagination
  if (props.itemsPerPage > 0) {
    const start = (props.currentPage - 1) * props.itemsPerPage
    const end = start + props.itemsPerPage
    result = result.slice(start, end)
  }
  
  return result
})

const containerStyles = computed(() => ({
  display: 'grid',
  gridTemplateColumns: props.layout === 'grid' 
    ? `repeat(${props.columns}, 1fr)` 
    : '1fr',
  gap: `${props.gap}px`,
  ...(props.layout === 'list' && {
    gridTemplateColumns: '1fr'
  })
}))
</script>
```

### Step 2: The Item Template

```vue
<!-- ProductItem.vue -->
<template>
  <div class="product-item" :style="itemStyles">
    <div class="item-image">
      <img :src="image" :alt="name" />
    </div>
    
    <div class="item-content">
      <h3 class="item-name">{{ name }}</h3>
      <p class="item-description">{{ description }}</p>
      
      <div class="item-meta">
        <span class="item-price">${{ price }}</span>
        <span class="item-rating">⭐ {{ rating }}</span>
      </div>
      
      <div class="item-actions">
        <button @click="addToCart" class="btn-primary">
          Add to Cart
        </button>
        <button @click="viewDetails" class="btn-secondary">
          View Details
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  id: [String, Number],
  name: String,
  description: String,
  price: Number,
  image: String,
  rating: Number,
  category: String,
  index: Number,
  total: Number
})

const emit = defineEmits(['addToCart', 'viewDetails'])

const addToCart = () => {
  emit('addToCart', { id: props.id, name: props.name, price: props.price })
}

const viewDetails = () => {
  emit('viewDetails', props.id)
}

const itemStyles = computed(() => ({
  animationDelay: `${props.index * 0.1}s`
}))
</script>
```

## Advanced Form Configuration with Dynamic Fields

### Conditional Form Fields

```javascript
const advancedFormSchema = {
  // Basic settings
  layoutType: {
    type: 'select',
    label: 'Layout Type',
    options: [
      { value: 'grid', label: 'Grid' },
      { value: 'carousel', label: 'Carousel' },
      { value: 'masonry', label: 'Masonry' }
    ],
    default: 'grid'
  },
  
  // Grid-specific settings (only show if layoutType === 'grid')
  columns: {
    type: 'range',
    label: 'Number of Columns',
    min: 1,
    max: 6,
    default: 3,
    showIf: { field: 'layoutType', value: 'grid' }
  },
  
  // Carousel-specific settings (only show if layoutType === 'carousel')
  autoplay: {
    type: 'checkbox',
    label: 'Auto-play Carousel',
    default: true,
    showIf: { field: 'layoutType', value: 'carousel' }
  },
  
  autoplaySpeed: {
    type: 'range',
    label: 'Auto-play Speed (seconds)',
    min: 1,
    max: 10,
    default: 3,
    showIf: [
      { field: 'layoutType', value: 'carousel' },
      { field: 'autoplay', value: true }
    ]
  },
  
  // Data source configuration
  dataSource: {
    type: 'select',
    label: 'Data Source',
    options: [
      { value: 'api', label: 'API Endpoint' },
      { value: 'json', label: 'JSON Data' },
      { value: 'csv', label: 'CSV File' }
    ],
    default: 'api'
  },
  
  // API settings
  apiUrl: {
    type: 'url',
    label: 'API Endpoint',
    placeholder: 'https://api.example.com/products',
    showIf: { field: 'dataSource', value: 'api' }
  },
  
  // JSON settings
  jsonData: {
    type: 'textarea',
    label: 'JSON Data',
    placeholder: '[{"name": "Item 1", "price": 10}]',
    rows: 5,
    showIf: { field: 'dataSource', value: 'json' }
  },
  
  // CSV settings
  csvUrl: {
    type: 'url',
    label: 'CSV File URL',
    placeholder: 'https://example.com/data.csv',
    showIf: { field: 'dataSource', value: 'csv' }
  }
}
```

## Real-Time Data Updates with WebSockets

### WebSocket Data Wrapper

```vue
<!-- RealtimeDataWrapper.vue -->
<template>
  <div class="realtime-wrapper">
    <div class="connection-status" :class="connectionClass">
      {{ connectionStatus }}
    </div>
    
    <div class="data-stream">
      <component
        v-for="item in liveData"
        :key="item.id"
        :is="templateComponent"
        v-bind="item"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, inject } from 'vue'

const props = defineProps({
  websocketUrl: String,
  template: String,
  reconnectInterval: {
    type: Number,
    default: 5000
  }
})

const liveData = ref([])
const isConnected = ref(false)
const reconnectTimer = ref(null)
let websocket = null

const resolver = inject('resolver')
const templateComponent = computed(() => resolver?.value.resolve(props.template))

const connectionStatus = computed(() => {
  return isConnected.value ? '🟢 Connected' : '🔴 Disconnected'
})

const connectionClass = computed(() => {
  return isConnected.value ? 'connected' : 'disconnected'
})

const connectWebSocket = () => {
  if (websocket) {
    websocket.close()
  }
  
  websocket = new WebSocket(props.websocketUrl)
  
  websocket.onopen = () => {
    isConnected.value = true
    console.log('WebSocket connected')
  }
  
  websocket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data)
      
      // Handle different message types
      if (data.type === 'initial') {
        liveData.value = data.items
      } else if (data.type === 'add') {
        liveData.value.unshift(data.item)
      } else if (data.type === 'update') {
        const index = liveData.value.findIndex(item => item.id === data.item.id)
        if (index !== -1) {
          liveData.value[index] = data.item
        }
      } else if (data.type === 'delete') {
        liveData.value = liveData.value.filter(item => item.id !== data.id)
      }
    } catch (err) {
      console.error('Error processing WebSocket message:', err)
    }
  }
  
  websocket.onclose = () => {
    isConnected.value = false
    console.log('WebSocket disconnected')
    
    // Auto-reconnect
    reconnectTimer.value = setTimeout(() => {
      connectWebSocket()
    }, props.reconnectInterval)
  }
  
  websocket.onerror = (error) => {
    console.error('WebSocket error:', error)
  }
}

onMounted(() => {
  connectWebSocket()
})

onUnmounted(() => {
  if (websocket) {
    websocket.close()
  }
  if (reconnectTimer.value) {
    clearTimeout(reconnectTimer.value)
  }
})
</script>
```

## Advanced Blueprint Configuration

### Blueprint with Data Sources

```javascript
const advancedBlueprints = {
  // Data-driven product showcase
  ProductShowcase: {
    label: "Product Showcase",
    componentName: "DynamicList",
    props: {
      template: "ProductCard",
      layout: "grid",
      columns: 3,
      gap: 20,
      data: [],
      
      // Data source configuration
      dataSource: {
        type: 'api',
        url: 'https://fakestoreapi.com/products',
        method: 'GET',
        headers: {},
        transform: (data) => data.map(item => ({
          id: item.id,
          name: item.title,
          price: item.price,
          image: item.image,
          description: item.description.substring(0, 100) + '...',
          category: item.category
        }))
      },
      
      // Filtering
      filters: {
        category: 'electronics',
        priceRange: { min: 0, max: 100 }
      },
      
      // Sorting
      sortBy: 'price',
      sortOrder: 'desc',
      
      // Pagination
      itemsPerPage: 6,
      enablePagination: true
    },
    children: []
  },
  
  // Real-time updates
  LiveChat: {
    label: "Live Chat Feed",
    componentName: "RealtimeDataWrapper",
    props: {
      websocketUrl: 'wss://chat.example.com/stream',
      template: "ChatMessage",
      maxMessages: 50,
      showTimestamps: true,
      autoScroll: true
    },
    children: []
  }
}
```

## Performance Optimization

### Virtual Scrolling for Large Lists

```vue
<!-- VirtualList.vue -->
<template>
  <div class="virtual-list" ref="container">
    <div class="virtual-spacer" :style="spacerStyle">
      <div
        v-for="item in visibleItems"
        :key="item.index"
        class="virtual-item"
        :style="item.style"
      >
        <component
          :is="templateComponent"
          v-bind="item.data"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  data: Array,
  template: String,
  itemHeight: {
    type: Number,
    default: 100
  },
  bufferSize: {
    type: Number,
    default: 5
  }
})

const container = ref(null)
const scrollTop = ref(0)
const containerHeight = ref(0)

const totalHeight = computed(() => props.data.length * props.itemHeight)

const startIndex = computed(() => 
  Math.max(0, Math.floor(scrollTop.value / props.itemHeight) - props.bufferSize)
)

const endIndex = computed(() => 
  Math.min(
    props.data.length,
    Math.ceil((scrollTop.value + containerHeight.value) / props.itemHeight) + props.bufferSize
  )
)

const visibleItems = computed(() => {
  const items = []
  for (let i = startIndex.value; i < endIndex.value; i++) {
    if (i < props.data.length) {
      items.push({
        index: i,
        data: props.data[i],
        style: {
          position: 'absolute',
          top: `${i * props.itemHeight}px`,
          width: '100%'
        }
      })
    }
  }
  return items
})

const spacerStyle = computed(() => ({
  height: `${totalHeight.value}px`,
  position: 'relative'
}))

const handleScroll = () => {
  scrollTop.value = container.value.scrollTop
}

const handleResize = () => {
  containerHeight.value = container.value.clientHeight
}

onMounted(() => {
  containerHeight.value = container.value.clientHeight
  container.value.addEventListener('scroll', handleScroll)
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  container.value?.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', handleResize)
})
</script>
```

## Putting It All Together: Complete Example

### Master Blueprint Configuration

```javascript
// master-blueprints.js

export const masterBlueprints = {
  // E-commerce product grid
  ProductGrid: {
    label: "Product Grid",
    componentName: "DynamicList",
    props: {
      template: "ProductCard",
      layout: "grid",
      columns: 4,
      gap: 24,
      
      // Data configuration
      dataSource: {
        type: 'api',
        url: '/api/products',
        params: {
          limit: 12,
          sort: 'popularity'
        }
      },
      
      // Filtering options
      enableFilters: true,
      filters: {
        category: { type: 'select', options: [] },
        price: { type: 'range', min: 0, max: 1000 },
        rating: { type: 'select', options: [4, 3, 2, 1] }
      },
      
      // Sorting options
      sortOptions: [
        { value: 'price-asc', label: 'Price: Low to High' },
        { value: 'price-desc', label: 'Price: High to Low' },
        { value: 'rating', label: 'Highest Rated' },
        { value: 'newest', label: 'Newest First' }
      ],
      
      // Pagination
      enablePagination: true,
      itemsPerPage: 12,
      
      // Responsive breakpoints
      responsive: {
        mobile: { columns: 1 },
        tablet: { columns: 2 },
        desktop: { columns: 4 }
      }
    },
    children: []
  },
  
  // Real-time social feed
  SocialFeed: {
    label: "Live Social Feed",
    componentName: "RealtimeDataWrapper",
    props: {
      websocketUrl: 'wss://social.example.com/feed',
      template: "SocialPost",
      maxItems: 20,
      showTimestamps: true,
      enableAnimations: true,
      
      // Post filtering
      filters: {
        hashtags: [],
        mentions: [],
        minLikes: 0
      },
      
      // Display options
      displayOptions: {
        showImages: true,
        showLikes: true,
        showComments: true,
        showShareButtons: true
      }
    },
    children: []
  }
}
```

## Working with Multiple Slots

v-craft supports components with multiple named slots. This allows you to create more complex container components with distinct content areas.

### Example: Container with Header and Body Slots

This documentation includes an example component `CraftContainerExample` that demonstrates multi-slot support. Here's how it's implemented:

**Component (docs/components/CraftContainerExample.vue):**
```vue
<template>
  <div class="border-2 border-gray-300 rounded-lg p-4 my-2 bg-gray-50">
    <div class="border-b border-gray-300 pb-2 mb-2 font-bold min-h-[20px]">
      <slot name="header" />
    </div>
    <div class="min-h-[40px]">
      <slot name="body" />
    </div>
  </div>
</template>
```

This component has two named slots:
- `header` - For header content
- `body` - For body content

**Resolver (docs/components/resolver.ts):**
```typescript
export const docsResolverMap = {
  CraftContainerExample: {
    componentName: "CraftContainerExample",
    slots: ["header", "body"],  // Declare available slots
  },
};
```

**Blueprint (docs/components/blueprints.ts):**
```typescript
export const docsBlueprints = {
  CraftContainerExample: {
    label: "Container (2 Slots)",
    componentName: "CraftCanvas",  // Use CraftCanvas wrapper
    props: {
      componentName: "CraftContainerExample",
    },
  },
};
```

### Declaring Slots

For **multi-slot components**, you must declare the available slots in your resolver:

```typescript
{
  MyContainer: {
    componentName: 'MyContainer',
    slots: ['header', 'content', 'footer'],  // Declare available slots
  }
}
```

For **single-slot components**, you don't need to declare slots - v-craft automatically defaults to `['default']`.

### How It Works

When you define `slots: ["header", "body"]` in your resolver:

1. The editor renders placeholders for each slot when empty
2. Users can drop components into specific slots
3. The drop handler automatically assigns components to the appropriate slot

### Creating Your Own Multi-Slot Components

To create a component with multiple slots:

1. Define named slots in your component template using `<slot name="slotName" />`
2. Register the component in your resolver map with the `slots` array
3. Add it to your blueprints using `CraftCanvas` as the wrapper

```javascript
// Resolver registration with slots
{
  MyContainer: {
    componentName: 'MyContainer',
    slots: ['header', 'content', 'footer'],  // Define available slots
  }
}

// Blueprint using CraftCanvas wrapper
{
  MyContainer: {
    label: "My Container",
    componentName: "CraftCanvas",
    props: {
      componentName: "MyContainer",
    },
  }
}
```

### Slot Data Binding

When using data-driven content with multi-slot components, you can specify which slot the data should be bound to using the `slotName` property in your node data:

```javascript
const nodeData = {
  type: 'list',
  slotName: 'header', // Binds data to the 'header' slot
  list: [/* your data items */]
}
```

This allows you to have different data sources for different slots within the same container component.

## Next Steps and Resources

### Building Your Own Advanced Components

1. **Start Simple**: Begin with basic data wrappers
2. **Add Features Gradually**: Layer on filtering, sorting, pagination
3. **Test Performance**: Use virtual scrolling for large datasets
4. **Add Real-time**: Implement WebSockets for live updates
5. **Make Responsive**: Ensure components work on all screen sizes

### Common Advanced Patterns

- **Multi-step forms** with conditional logic
- **Drag-and-drop reordering** of list items
- **Real-time collaboration** features
- **Advanced filtering** with multiple criteria
- **Infinite scrolling** for large datasets
- **Export/import** functionality for page layouts

### Performance Tips

1. **Use virtual scrolling** for lists over 100 items
2. **Implement debouncing** for search/filter inputs
3. **Cache API responses** when appropriate
4. **Lazy load images** and heavy content
5. **Use web workers** for complex data processing

Now you have the knowledge to build professional-grade page editors with v-craft! The possibilities are endless.
