<script setup>
import { ref } from 'vue'
import { useApi } from '../composables/useApi'
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline'

const api = useApi()
const searchQuery = ref('')
const searchResults = ref([])
const hasSearched = ref(false)

const performSearch = async () => {
  if (!searchQuery.value.trim()) return

  hasSearched.value = true
  try {
    const data = await api.searchSatellites(searchQuery.value)
    searchResults.value = data.satellites || []
  } catch (err) {
    console.error('Search failed:', err)
    searchResults.value = []
  }
}

const handleTrack = async (satellite) => {
  try {
    await api.addSatellite(satellite.norad_id)
    alert(`${satellite.name} added to tracking`)
  } catch (err) {
    alert(`Failed to add satellite: ${err.message}`)
  }
}
</script>

<template>
  <div class="bg-white rounded-lg shadow p-6">
    <h2 class="text-2xl font-semibold text-gray-900 mb-4">Search Satellites</h2>

    <div class="flex gap-2 mb-6">
      <div class="flex-1 relative">
        <input
          v-model="searchQuery"
          @keyup.enter="performSearch"
          type="text"
          placeholder="Search by name or NORAD ID..."
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
        <MagnifyingGlassIcon class="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
      </div>
      <button
        @click="performSearch"
        :disabled="api.loading.value"
        class="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Search
      </button>
    </div>

    <div v-if="api.loading.value" class="text-gray-600">
      Searching...
    </div>

    <div v-else-if="hasSearched && searchResults.length === 0" class="text-gray-600">
      No satellites found matching "{{ searchQuery }}"
    </div>

    <div v-else-if="searchResults.length > 0" class="space-y-2">
      <div
        v-for="satellite in searchResults"
        :key="satellite.norad_id"
        class="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors"
      >
        <div>
          <div class="font-medium text-gray-900">{{ satellite.name }}</div>
          <div class="text-sm text-gray-500">NORAD ID: {{ satellite.norad_id }}</div>
        </div>
        <button
          @click="handleTrack(satellite)"
          class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          ➕ Track
        </button>
      </div>
    </div>
  </div>
</template>
