<script setup>
import { ref, onMounted } from 'vue'
import { useApi } from '../composables/useApi'

const api = useApi()
const satellites = ref([])

const loadBookmarked = async () => {
  try {
    const data = await api.getBookmarkedSatellites()
    satellites.value = data.satellites || []
  } catch (err) {
    console.error('Failed to load bookmarked satellites:', err)
  }
}

const handleUnbookmark = async (satellite) => {
  try {
    await api.unbookmarkSatellite(satellite.norad_id)
    await loadBookmarked()
  } catch (err) {
    alert(`Failed to unbookmark satellite: ${err.message}`)
  }
}

onMounted(() => {
  loadBookmarked()
})
</script>

<template>
  <div class="bg-white rounded-lg shadow p-6">
    <h2 class="text-2xl font-semibold text-gray-900 mb-4">Bookmarked Satellites</h2>

    <div v-if="api.loading.value" class="text-gray-600">
      Loading bookmarked satellites...
    </div>

    <div v-else-if="satellites.length === 0" class="text-gray-600">
      No bookmarked satellites. Bookmark satellites from the Tracked tab.
    </div>

    <div v-else class="space-y-2">
      <div
        v-for="satellite in satellites"
        :key="satellite.norad_id"
        class="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
      >
        <div>
          <div class="font-medium text-gray-900">{{ satellite.name }}</div>
          <div class="text-sm text-gray-500">NORAD ID: {{ satellite.norad_id }}</div>
        </div>
        <button
          @click="handleUnbookmark(satellite)"
          class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          ☆ Unbookmark
        </button>
      </div>
    </div>
  </div>
</template>
