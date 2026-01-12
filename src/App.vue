<script setup>
import { ref, onMounted } from 'vue'
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/vue'
import BrowseView from './views/BrowseView.vue'
import SearchView from './views/SearchView.vue'
import TrackedView from './views/TrackedView.vue'
import BookmarkedView from './views/BookmarkedView.vue'
import StatsView from './views/StatsView.vue'

const tabs = [
  { name: 'Browse', component: 'BrowseView' },
  { name: 'Search', component: 'SearchView' },
  { name: 'Tracked', component: 'TrackedView' },
  { name: 'Bookmarked', component: 'BookmarkedView' },
  { name: 'Stats', component: 'StatsView' }
]
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-4xl font-bold text-gray-900 mb-8">
        satpass - Satellite Tracker
      </h1>

      <TabGroup>
        <TabList class="flex space-x-1 rounded-xl bg-primary-900/20 p-1">
          <Tab
            v-for="tab in tabs"
            :key="tab.name"
            v-slot="{ selected }"
            class="w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-all outline-none"
            :class="[
              selected
                ? 'bg-white text-primary-700 shadow'
                : 'text-primary-600 hover:bg-white/[0.12] hover:text-primary-800'
            ]"
          >
            {{ tab.name }}
          </Tab>
        </TabList>

        <TabPanels class="mt-6">
          <TabPanel>
            <BrowseView />
          </TabPanel>
          <TabPanel>
            <SearchView />
          </TabPanel>
          <TabPanel>
            <TrackedView />
          </TabPanel>
          <TabPanel>
            <BookmarkedView />
          </TabPanel>
          <TabPanel>
            <StatsView />
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  </div>
</template>
