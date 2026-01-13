<script setup>
import { ref, onMounted } from 'vue'
import { useApi } from '../composables/useApi'
import SatelliteDetailsModal from '../components/SatelliteDetailsModal.vue'
import PaginationControls from '../components/PaginationControls.vue'

const api = useApi()
const satellites = ref([])
const showDetails = ref(false)
const selectedNoradId = ref(null)

// Pagination state
const currentPage = ref(1)
const itemsPerPage = ref(20)
const totalItems = ref(0)

const calculateOffset = () => (currentPage.value - 1) * itemsPerPage.value

const loadTracked = async () => {
  try {
    const offset = calculateOffset()
    const data = await api.getSatellites({
      limit: itemsPerPage.value,
      offset: offset
    })
    satellites.value = data.satellites || []
    totalItems.value = data.total || 0
  } catch (err) {
    console.error('Failed to load tracked satellites:', err)
  }
}

const handlePageChange = (page) => {
  currentPage.value = page
  loadTracked()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handlePerPageChange = (perPage) => {
  itemsPerPage.value = perPage
  currentPage.value = 1
  loadTracked()
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

const viewDetails = (satellite) => {
  selectedNoradId.value = satellite.norad_id
  showDetails.value = true
}

onMounted(() => {
  loadTracked()
})
</script>

<template>
  <div class="rounded-xl overflow-hidden backdrop-blur-xl shadow-2xl
    dark:bg-space-900/50 dark:border dark:border-cyber-500/30
    bg-white/80 border border-mission-200/50">
    <div class="p-6">
      <h2 class="text-2xl font-bold font-mono mb-6
        dark:text-transparent dark:bg-clip-text dark:bg-cyber-gradient
        text-transparent bg-clip-text bg-mission-gradient">
        📡 TRACKED SATELLITES
      </h2>

      <div v-if="api.loading.value" class="text-center py-8">
        <div class="inline-block animate-pulse dark:text-cyber-400 text-mission-600 font-mono">
          ⟳ LOADING...
        </div>
      </div>

      <div v-else-if="satellites.length === 0" class="text-center py-8
        dark:text-cyber-400/70 text-mission-600 font-mono">
        NO SATELLITES TRACKED<br />
        <span class="text-sm mt-2 block">Use BROWSE or SEARCH to add satellites</span>
      </div>

      <div v-else class="space-y-2">
        <div
          v-for="satellite in satellites"
          :key="satellite.norad_id"
          class="flex items-center justify-between p-4 rounded-lg border-2 transition-all group
            dark:border-cyber-500/30 dark:bg-space-800/20 dark:hover:border-cyber-400
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
          <div class="flex gap-2">
            <button
              @click.stop="handleBookmark(satellite)"
              class="px-4 py-2 rounded-lg font-mono font-bold transition-all hover:scale-105 transform"
              :class="[
                satellite.bookmarked
                  ? 'dark:bg-neon-500/20 dark:border-2 dark:border-neon-400 dark:text-neon-300 bg-yellow-100 border-2 border-yellow-400 text-yellow-700 hover:bg-yellow-200'
                  : 'dark:bg-space-800/50 dark:border-2 dark:border-cyber-500/50 dark:text-cyber-400 dark:hover:border-cyber-400 bg-gray-100 border-2 border-gray-300 text-gray-700 hover:bg-gray-200'
              ]"
            >
              {{ satellite.bookmarked ? '⭐ BOOKMARKED' : '☆ BOOKMARK' }}
            </button>
            <button
              @click.stop="handleRemove(satellite)"
              class="px-4 py-2 rounded-lg font-mono font-bold transition-all
                dark:bg-red-600 dark:hover:bg-red-500 dark:text-white
                bg-red-600 hover:bg-red-700 text-white
                hover:scale-105 transform"
            >
              🗑️ REMOVE
            </button>
          </div>
        </div>

        <!-- Pagination Controls -->
        <PaginationControls
          v-if="totalItems > itemsPerPage"
          :current-page="currentPage"
          :total-items="totalItems"
          :items-per-page="itemsPerPage"
          @page-change="handlePageChange"
          @per-page-change="handlePerPageChange"
        />
      </div>
    </div>

    <SatelliteDetailsModal
      :open="showDetails"
      :norad-id="selectedNoradId"
      @close="showDetails = false"
    />
  </div>
</template>
