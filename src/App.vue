<script setup lang="ts">
import { computed, ref } from 'vue'

type WatchedSearch = {
  id: number
  name: string
  query: string
  maxPrice: number
  minDiscount: number
  enabled: boolean
}

type Listing = {
  id: string
  title: string
  price: number
  referencePrice?: number
  searchName: string
  url: string
  found: string
}

const searches = ref<WatchedSearch[]>([
  { id: 1, name: 'Steam Deck', query: 'Steam Deck', maxPrice: 130, minDiscount: 35, enabled: true },
  { id: 2, name: 'Switch OLED', query: 'Nintendo Switch OLED', maxPrice: 150, minDiscount: 30, enabled: true },
])

const listings = ref<Listing[]>([
  { id: 'demo-1', title: 'Steam Deck 256GB LCD', price: 82, referencePrice: 145, searchName: 'Steam Deck', url: '#', found: 'Demo' },
  { id: 'demo-2', title: 'Nintendo Switch OLED White', price: 128, referencePrice: 180, searchName: 'Switch OLED', url: '#', found: 'Demo' },
])

const activeCount = computed(() => searches.value.filter((s) => s.enabled).length)
const dealPercent = (item: Listing) => item.referencePrice
  ? Math.round((1 - item.price / item.referencePrice) * 100)
  : null

function addSearch() {
  const id = Date.now()
  searches.value.push({ id, name: 'New watch', query: '', maxPrice: 100, minDiscount: 30, enabled: true })
}
</script>

<template>
  <main class="shell">
    <aside class="sidebar">
      <div class="brand">VR</div>
      <nav>
        <button class="nav active">Overview</button>
        <button class="nav">Watched searches</button>
        <button class="nav">Listing history</button>
        <button class="nav">Settings</button>
      </nav>
      <div class="status"><span class="dot"></span>{{ activeCount }} watches active</div>
    </aside>

    <section class="content">
      <header class="topbar">
        <div>
          <p class="eyebrow">Vinted Researcher</p>
          <h1>Find underpriced listings before everyone else.</h1>
        </div>
        <button class="primary" @click="addSearch">+ Add watch</button>
      </header>

      <section class="stats">
        <article><span>Active watches</span><strong>{{ activeCount }}</strong></article>
        <article><span>Listings seen today</span><strong>{{ listings.length }}</strong></article>
        <article><span>Best demo deal</span><strong>43% below</strong></article>
      </section>

      <section class="panel">
        <div class="panel-head">
          <div><p class="eyebrow">Recent matches</p><h2>Potential bargains</h2></div>
          <span class="muted">Demo data until Vinted provider is connected</span>
        </div>

        <div class="listing" v-for="item in listings" :key="item.id">
          <div class="thumb">{{ item.title.slice(0, 1) }}</div>
          <div class="listing-main">
            <strong>{{ item.title }}</strong>
            <span>{{ item.searchName }} · {{ item.found }}</span>
          </div>
          <div class="price"><strong>£{{ item.price }}</strong><span v-if="item.referencePrice">vs £{{ item.referencePrice }}</span></div>
          <div class="deal" :class="{ hot: (dealPercent(item) ?? 0) >= 35 }">
            {{ dealPercent(item) !== null ? `${dealPercent(item)}% below` : 'No reference' }}
          </div>
          <a :href="item.url" class="open">Open</a>
        </div>
      </section>

      <section class="panel">
        <div class="panel-head"><div><p class="eyebrow">Watcher</p><h2>Search rules</h2></div></div>
        <div class="watch" v-for="search in searches" :key="search.id">
          <div><strong>{{ search.name }}</strong><span>{{ search.query || 'Add a query' }}</span></div>
          <span>Max £{{ search.maxPrice }}</span>
          <span>or {{ search.minDiscount }}% below value</span>
          <button class="toggle" :class="{ on: search.enabled }" @click="search.enabled = !search.enabled">{{ search.enabled ? 'On' : 'Off' }}</button>
        </div>
      </section>
    </section>
  </main>
</template>
