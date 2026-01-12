<script setup>
import { ref, watch } from 'vue'
import { useApi } from '../composables/useApi'

const props = defineProps({
  group: {
    type: String,
    required: true
  },
  showTrackButton: {
    type: Boolean,
    default: false
  }
})

const api = useApi()
const satellites = ref([])

const loadSatellites = async () => {
  try {
    const data = await api.searchSatellites(props.group)
    satellites.value = data.satellites || []
  } catch (err) {
    console.error('Failed to load satellites:', err)
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

watch(() => props.group, () => {
  loadSatellites()
}, { immediate: true })
</script>

<template>
  <div>
    <div v-if="api.loading.value" class="text-gray-600">
      Loading satellites...
    </div>

    <div v-else-if="satellites.length === 0" class="text-gray-600">
      No satellites found in this group
    </div>

    <div v-else class="space-y-2">
      <div
        v-for="satellite in satellites"
        :key="satellite.norad_id"
        class="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors"
      >
        <div>
          <div class="font-medium text-gray-900">{{ satellite.name }}</div>
          <div class="text-sm text-gray-500">NORAD ID: {{ satellite.norad_id }}</div>
        </div>
        <button
          v-if="showTrackButton"
          @click="handleTrack(satellite)"
          class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          ➕ Track
        </button>
      </div>
    </div>
  </div>
</template>
