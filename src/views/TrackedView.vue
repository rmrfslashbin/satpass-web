<script setup>
import { ref, onMounted } from 'vue'
import { useApi } from '../composables/useApi'

const api = useApi()
const satellites = ref([])

const loadTracked = async () => {
  try {
    const data = await api.getSatellites()
    satellites.value = data.satellites || []
  } catch (err) {
    console.error('Failed to load tracked satellites:', err)
  }
}

const handleBookmark = async (satellite) => {
  try {
    if (satellite.bookmarked) {
      await api.unbookmarkSatellite(satellite.norad_id)
    } else {
      await api.bookmarkSatellite(satellite.norad_id)
    }
    await loadTracked()
  } catch (err) {
    alert(`Failed to ${satellite.bookmarked ? 'unbookmark' : 'bookmark'} satellite: ${err.message}`)
  }
}

const handleRemove = async (satellite) => {
  if (!confirm(`Remove ${satellite.name} (NORAD ${satellite.norad_id}) from tracking?`)) {
    return
  }

  try {
    await api.removeSatellite(satellite.norad_id)
    await loadTracked()
  } catch (err) {
    alert(`Failed to remove satellite: ${err.message}`)
  }
}

onMounted(() => {
  loadTracked()
})
</script>

<template>
  <div class="bg-white rounded-lg shadow p-6">
    <h2 class="text-2xl font-semibold text-gray-900 mb-4">Tracked Satellites</h2>

    <div v-if="api.loading.value" class="text-gray-600">
      Loading tracked satellites...
    </div>

    <div v-else-if="satellites.length === 0" class="text-gray-600">
      No satellites are currently being tracked. Use the Browse or Search tabs to add satellites.
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
        <div class="flex gap-2">
          <button
            @click="handleBookmark(satellite)"
            class="px-4 py-2 rounded-lg transition-colors"
            :class="[
              satellite.bookmarked
                ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            {{ satellite.bookmarked ? '⭐ Bookmarked' : '☆ Bookmark' }}
          </button>
          <button
            @click="handleRemove(satellite)"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            🗑️ Remove
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
