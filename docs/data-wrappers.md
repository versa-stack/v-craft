# Data Wrappers: Making Your Components Smart

Think of data wrappers as smart containers that can fetch information from the internet and then use that information to create multiple copies of a component. It's like having a magic box that:
1. Gets data from somewhere (like weather, products, or news)
2. Uses that data to create lots of cards, items, or sections
3. Updates automatically when the data changes

## What is a Data Wrapper?

A data wrapper is a special component that:
- **Fetches data** from APIs, databases, or files
- **Transforms data** into the format your components need
- **Creates multiple instances** of child components using the data
- **Updates automatically** when data changes

## Your First Data Wrapper: Weather Display

Let's build a weather display that fetches real weather data and creates weather cards.

### Step 1: Create the Data Wrapper

```vue
<!-- WeatherWrapper.vue -->
<template>
  <div class="weather-display">
    <!-- Show loading while fetching -->
    <div v-if="loading" class="loading">
      🌤️ Loading weather data...
    </div>

    <!-- Show error if something went wrong -->
    <div v-else-if="error" class="error">
      ⚠️ {{ error }}
    </div>

    <!-- Slot for child components -->
    <!-- The renderer will duplicate these with data -->
    <slot></slot>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useEditorStore } from '@versa-stack/v-craft'

// Props that users can configure
const props = defineProps({
  // Which cities to show weather for
  cities: {
    type: Array,
    default: () => ['London', 'Paris', 'New York']
  },

  // Temperature unit
  unit: {
    type: String,
    default: 'celsius', // or 'fahrenheit'
    validator: (value) => ['celsius', 'fahrenheit'].includes(value)
  },

  // API key for weather service
  apiKey: {
    type: String,
    default: ''
  },

  // How often to refresh (in minutes)
  refreshInterval: {
    type: Number,
    default: 30
  },

  // The CraftNode UUID (injected by renderer)
  craftNodeUuid: String
})

const weatherData = ref([])
const loading = ref(true)
const error = ref(null)
const editorStore = useEditorStore()

// Function to fetch weather for one city
const fetchWeatherForCity = async (city) => {
  try {
    // Using OpenWeatherMap API (free tier)
    const apiKey = props.apiKey || 'demo-key'
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    )
    
    if (!response.ok) {
      throw new Error(`Weather data for ${city} not found`)
    }
    
    const data = await response.json()
    
    return {
      city: data.name,
      temperature: props.unit === 'fahrenheit' 
        ? Math.round(data.main.temp * 9/5 + 32)
        : Math.round(data.main.temp),
      condition: data.weather[0].main,
      icon: data.weather[0].icon,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed
    }
  } catch (err) {
    // Demo fallback data
    return {
      city: city,
      temperature: Math.floor(Math.random() * 30) + 10,
      condition: ['Sunny', 'Cloudy', 'Rainy'][Math.floor(Math.random() * 3)],
      icon: '01d',
      humidity: Math.floor(Math.random() * 100),
      windSpeed: Math.floor(Math.random() * 20)
    }
  }
}

// Function to fetch all weather data
const fetchWeatherData = async () => {
  loading.value = true
  error.value = null

  try {
    const promises = props.cities.map(city => fetchWeatherForCity(city))
    const data = await Promise.all(promises)

    // Store data in the CraftNode's datasource
    // The renderer will use this to duplicate slot children
    if (props.craftNodeUuid) {
      const craftNode = editorStore.nodes[props.craftNodeUuid]
      if (craftNode) {
        craftNode.datasource = {
          type: 'list',
          list: data
        }
      }
    }
  } catch (err) {
    error.value = 'Failed to load weather data'
    console.error(err)
  } finally {
    loading.value = false
  }
}

// Fetch data when component mounts
onMounted(() => {
  fetchWeatherData()

  // Set up auto-refresh
  if (props.refreshInterval > 0) {
    setInterval(fetchWeatherData, props.refreshInterval * 60 * 1000)
  }
})

// Re-fetch if cities change
watch(() => props.cities, fetchWeatherData)
</script>

<style scoped>
.weather-display {
  padding: 20px;
}

.loading, .error {
  text-align: center;
  padding: 40px;
  font-size: 18px;
}

.error {
  color: #e74c3c;
}

.weather-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}
</style>
```

### Step 2: Create the Child Component

```vue
<!-- WeatherCard.vue -->
<template>
  <div class="weather-card">
    <div class="weather-header">
      <h3>{{ city }}</h3>
      <img :src="weatherIcon" :alt="condition" />
    </div>
    
    <div class="weather-info">
      <div class="temperature">{{ temperature }}°</div>
      <div class="condition">{{ condition }}</div>
      
      <div class="weather-details">
        <span>💧 {{ humidity }}%</span>
        <span>💨 {{ windSpeed }} km/h</span>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  city: String,
  temperature: Number,
  condition: String,
  icon: String,
  humidity: Number,
  windSpeed: Number
})

const weatherIcon = computed(() => 
  `https://openweathermap.org/img/wn/${props.icon}@2x.png`
)
</script>

<style scoped>
.weather-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.weather-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.weather-header h3 {
  margin: 0;
  color: #333;
}

.temperature {
  font-size: 2.5em;
  font-weight: bold;
  color: #6366f1;
  margin: 10px 0;
}

.condition {
  font-size: 1.2em;
  color: #666;
  margin-bottom: 15px;
}

.weather-details {
  display: flex;
  justify-content: space-around;
  color: #888;
  font-size: 0.9em;
}
</style>
```

### Step 3: Create the Blueprint

```javascript
// weather-blueprints.js

export const weatherBlueprints = {
  WeatherWrapper: {
    label: "Weather Display",
    componentName: "WeatherWrapper",
    props: {
      cities: ['London', 'Paris', 'Tokyo', 'New York'],
      unit: 'celsius',
      refreshInterval: 30,
      apiKey: ''
    },
    slots: {} // WeatherWrapper is a data wrapper, not a container
  },
  
  WeatherCard: {
    label: "Weather Card",
    componentName: "WeatherCard",
    props: {
      city: 'London',
      temperature: 20,
      condition: 'Sunny',
      icon: '01d',
      humidity: 65,
      windSpeed: 12
    },
    slots: {}
  }
}
```

## Your Second Data Wrapper: Product Showcase

Let's build a product showcase that fetches products from an API.

### Step 1: Product Data Wrapper

```vue
<!-- ProductWrapper.vue -->
<template>
  <div class="product-showcase">
    <div v-if="loading" class="loading">
      🛍️ Loading amazing products...
    </div>
    
    <div v-else-if="error" class="error">
      ⚠️ {{ error }}
    </div>
    
    <div v-else class="products-grid">
      <ProductCard
        v-for="product in products"
        :key="product.id"
        :name="product.name"
        :price="product.price"
        :image="product.image"
        :description="product.description"
        :rating="product.rating"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

const props = defineProps({
  // API endpoint
  apiUrl: {
    type: String,
    default: 'https://fakestoreapi.com/products'
  },
  
  // How many products to show
  limit: {
    type: Number,
    default: 6
  },
  
  // Filter by category
  category: {
    type: String,
    default: '' // empty = all categories
  },
  
  // Sort order
  sortBy: {
    type: String,
    default: 'id', // id, price, rating, title
    validator: (value) => ['id', 'price', 'rating', 'title'].includes(value)
  },
  
  // Sort direction
  sortOrder: {
    type: String,
    default: 'asc', // asc, desc
    validator: (value) => ['asc', 'desc'].includes(value)
  }
})

const products = ref([])
const loading = ref(true)
const error = ref(null)

const fetchProducts = async () => {
  loading.value = true
  error.value = null
  
  try {
    let url = props.apiUrl
    
    // Add category filter if specified
    if (props.category) {
      url += `/category/${props.category}`
    }
    
    const response = await fetch(url)
    let data = await response.json()
    
    // Limit results
    data = data.slice(0, props.limit)
    
    // Sort products
    data.sort((a, b) => {
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
    
    // Transform to our format
    products.value = data.map(product => ({
      id: product.id,
      name: product.title,
      price: product.price,
      image: product.image,
      description: product.description.substring(0, 100) + '...',
      rating: product.rating.rate,
      category: product.category
    }))
    
  } catch (err) {
    error.value = 'Failed to load products'
    console.error(err)
    
    // Demo fallback
    products.value = [
      {
        id: 1,
        name: 'Premium Wireless Headphones',
        price: 199.99,
        image: 'https://via.placeholder.com/300x300?text=Headphones',
        description: 'High-quality wireless headphones with noise cancellation...',
        rating: 4.5,
        category: 'electronics'
      },
      // ... more demo products
    ]
  } finally {
    loading.value = false
  }
}

onMounted(fetchProducts)
</script>

<style scoped>
.product-showcase {
  padding: 20px;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}
</style>
```

### Step 2: Product Card Component

```vue
<!-- ProductCard.vue -->
<template>
  <div class="product-card">
    <img :src="image" :alt="name" class="product-image" />
    
    <div class="product-info">
      <h3 class="product-name">{{ name }}</h3>
      <p class="product-description">{{ description }}</p>
      
      <div class="product-meta">
        <div class="rating">
          ⭐ {{ rating }}/5
        </div>
        <div class="price">
          ${{ price }}
        </div>
      </div>
      
      <button class="add-to-cart">
        Add to Cart
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  name: String,
  price: Number,
  image: String,
  description: String,
  rating: Number
})
</script>

<style scoped>
.product-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.product-card:hover {
  transform: translateY(-2px);
}

.product-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.product-info {
  padding: 15px;
}

.product-name {
  margin: 0 0 8px 0;
  font-size: 1.1em;
  color: #333;
}

.product-description {
  margin: 0 0 12px 0;
  color: #666;
  font-size: 0.9em;
  line-height: 1.4;
}

.product-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.rating {
  color: #f39c12;
  font-weight: bold;
}

.price {
  font-size: 1.3em;
  font-weight: bold;
  color: #27ae60;
}

.add-to-cart {
  width: 100%;
  padding: 10px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
}

.add-to-cart:hover {
  background: #2980b9;
}
</style>
```

## Advanced Data Wrapper Features

### 1. Pagination Support

```javascript
const props = defineProps({
  page: { type: Number, default: 1 },
  perPage: { type: Number, default: 10 },
  totalPages: { type: Number, default: 1 }
})
```

### 2. Search/Filter Support

```javascript
const props = defineProps({
  searchTerm: { type: String, default: '' },
  category: { type: String, default: '' },
  minPrice: { type: Number, default: 0 },
  maxPrice: { type: Number, default: 1000 }
})
```

### 3. Custom Data Sources

```javascript
const props = defineProps({
  dataSource: {
    type: String,
    default: 'api',
    validator: (value) => ['api', 'json', 'csv', 'database'].includes(value)
  },
  
  // For JSON data
  jsonData: { type: String, default: '' },
  
  // For CSV data
  csvUrl: { type: String, default: '' },
  
  // For database
  connectionString: { type: String, default: '' }
})
```

## Creating Reusable Data Templates

### Step 1: Create a Generic Data Wrapper

```vue
<!-- GenericDataWrapper.vue -->
<template>
  <div class="data-wrapper">
    <div v-if="loading" class="loading">{{ loadingText }}</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    
    <component
      v-for="(item, index) in processedData"
      :key="index"
      :is="childComponent"
      v-bind="item"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

const props = defineProps({
  // Data source
  dataUrl: String,
  
  // Child component to render
  childComponent: String,
  
  // How to map data to props
  fieldMapping: {
    type: Object,
    default: () => ({})
  },
  
  // Loading text
  loadingText: {
    type: String,
    default: 'Loading...'
  }
})

const data = ref([])
const loading = ref(true)
const error = ref(null)

const processedData = computed(() => {
  return data.value.map(item => {
    const mapped = {}
    
    // Map fields according to fieldMapping
    Object.keys(props.fieldMapping).forEach(key => {
      mapped[key] = item[props.fieldMapping[key]] || item[key]
    })
    
    return mapped
  })
})

const fetchData = async () => {
  try {
    const response = await fetch(props.dataUrl)
    data.value = await response.json()
  } catch (err) {
    error.value = 'Failed to load data'
    console.error(err)
  } finally {
    loading.value = false
  }
}

onMounted(fetchData)
</script>
```

### Step 2: Use It for Different Data Types

```javascript
// news-blueprints.js
export const newsBlueprints = {
  NewsList: {
    label: "News Articles",
    componentName: "GenericDataWrapper",
    props: {
      dataUrl: 'https://jsonplaceholder.typicode.com/posts',
      childComponent: 'NewsCard',
      fieldMapping: {
        title: 'title',
        description: 'body',
        author: 'userId'
      },
      loadingText: '📰 Loading latest news...'
    },
    slots: {}
  },
  
  NewsCard: {
    label: "News Card",
    componentName: "NewsCard",
    props: {
      title: 'Sample News',
      description: 'News description here',
      author: 'Anonymous',
      date: '2024-01-01'
    },
    slots: {}
  }
}
```

## Testing Your Data Wrappers

### Quick Test Method

```vue
<!-- TestDataWrapper.vue -->
<template>
  <div>
    <h2>Data Wrapper Test</h2>
    <ProductWrapper
      :limit="3"
      category="electronics"
      sortBy="price"
      sortOrder="desc"
    />
  </div>
</template>

<script setup>
import ProductWrapper from './ProductWrapper.vue'
</script>
```

## Common Data Wrapper Patterns

### 1. Blog Post List

```javascript
const blogWrapper = {
  label: "Blog Posts",
  componentName: "BlogWrapper",
  props: {
    apiUrl: 'https://jsonplaceholder.typicode.com/posts',
    postsPerPage: 6,
    showExcerpt: true,
    showDate: true,
    showAuthor: true
  }
}
```

### 2. Team Members

```javascript
const teamWrapper = {
  label: "Team Members",
  componentName: "TeamWrapper",
  props: {
    apiUrl: '/api/team',
    layout: 'grid', // grid, list, carousel
    showSocial: true,
    showBio: false
  }
}
```

### 3. Testimonials

```javascript
const testimonialsWrapper = {
  label: "Customer Testimonials",
  componentName: "TestimonialsWrapper",
  props: {
    apiUrl: '/api/testimonials',
    autoRotate: true,
    rotationSpeed: 5000,
    showStars: true
  }
}
```

## Next Steps

Now that you understand data wrappers:
1. Explore [Resolvers](./resolvers) for component configuration
2. Create your own data sources and APIs
