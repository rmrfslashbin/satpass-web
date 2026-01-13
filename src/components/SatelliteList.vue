<script setup>
import { ref, watch, computed } from 'vue'
import { useApi } from '../composables/useApi'
import SatelliteDetailsModal from './SatelliteDetailsModal.vue'
import PaginationControls from './PaginationControls.vue'

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
const showDetails = ref(false)
const selectedNoradId = ref(null)

// Pagination state
const currentPage = ref(1)
const itemsPerPage = ref(20)
const totalItems = ref(0)

const calculateOffset = () => (currentPage.value - 1) * itemsPerPage.value

const loadSatellites = async () => {
  try {
    const offset = calculateOffset()
    const data = await api.getCatalogGroup(props.group, {
      limit: itemsPerPage.value,
      offset: offset
    })
    satellites.value = data.satellites || []
    totalItems.value = data.total || 0
  } catch (err) {
    console.error('Failed to load satellites:', err)
  }
}

const handlePageChange = (page) => {
  currentPage.value = page
  loadSatellites()
  // Scroll to top of list
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handlePerPageChange = (perPage) => {
  itemsPerPage.value = perPage
  currentPage.value = 1 // Reset to first page
  loadSatellites()
}

const handleTrack = async (satellite) => {
  try {
    await api.addSatellite(satellite.norad_id)
    alert(`${satellite.name} added to tracking`)
  } catch (err) {
    alert(`Failed to add satellite: ${err.message}`)
  }
}

const viewDetails = (satellite) => {
  selectedNoradId.value = satellite.norad_id
  showDetails.value = true
}

watch(() => props.group, () => {
  currentPage.value = 1 // Reset to first page when group changes
  loadSatellites()
}, { immediate: true })
</script>

<template>
  <div>
    <div v-if="api.loading.value" class="text-center py-8">
      <div class="inline-block animate-pulse dark:text-cyber-400 text-mission-600 font-mono">
        ⟳ LOADING SATELLITES...
      </div>
    </div>

    <div v-else-if="satellites.length === 0" class="text-center py-8
      dark:text-cyber-400/70 text-mission-600 font-mono">
      NO SATELLITES FOUND
    </div>

    <div v-else class="space-y-2">
      <div
        v-for="satellite in satellites"
        :key="satellite.norad_id"
        class="flex items-center justify-between p-4 rounded-lg border-2 transition-all group
          dark:border-cyber-500/30 dark:bg-space-800/20 dark:hover:border-cyber-400 dark:hover:bg-space-800/40
          border-mission-200 bg-white hover:border-mission-400 hover:shadow-lg"
      >
        <div class="font-mono cursor-pointer flex-1" @click="viewDetails(satellite)">
          <div class="font-bold
            dark:text-cyber-300 text-mission-800 group-hover:underline">
            {{ satellite.name }}
          </div>
          <div class="text-sm mt-1
            dark:text-cyber-400/70 text-mission-600">
            NORAD: {{ satellite.norad_id }}
          </div>
        </div>
        <button
          v-if="showTrackButton"
          @click.stop="handleTrack(satellite)"
          class="px-4 py-2 rounded-lg font-mono font-bold transition-all
            dark:bg-neon-500 dark:hover:bg-neon-400 dark:text-white dark:shadow-lg dark:shadow-neon-500/50 dark:hover:shadow-neon-400/50
            bg-mission-600 hover:bg-mission-700 text-white shadow-lg shadow-mission-500/30 hover:shadow-mission-600/50
            hover:scale-105 transform"
        >
          ➕ TRACK
        </button>
      </div>

      <!-- Pagination Controls -->
      <PaginationControls
        v-if="totalItems > 0"
        :current-page="currentPage"
        :total-items="totalItems"
        :items-per-page="itemsPerPage"
        @page-change="handlePageChange"
        @per-page-change="handlePerPageChange"
      />
    </div>

    <SatelliteDetailsModal
      :open="showDetails"
      :norad-id="selectedNoradId"
      @close="showDetails = false"
    />
  </div>
</template>
