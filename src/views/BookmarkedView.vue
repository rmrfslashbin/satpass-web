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

const loadBookmarked = async () => {
  try {
    const offset = calculateOffset()
    const data = await api.getBookmarkedSatellites({
      limit: itemsPerPage.value,
      offset: offset
    })
    satellites.value = data.satellites || []
    totalItems.value = data.total || 0
  } catch (err) {
    console.error('Failed to load bookmarked satellites:', err)
  }
}

const handlePageChange = (page) => {
  currentPage.value = page
  loadBookmarked()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handlePerPageChange = (perPage) => {
  itemsPerPage.value = perPage
  currentPage.value = 1
  loadBookmarked()
}

const handleUnbookmark = async (satellite) => {
  try {
    await api.unbookmarkSatellite(satellite.norad_id)
    await loadBookmarked()
  } catch (err) {
    alert(`Failed to unbookmark satellite: ${err.message}`)
  }
}

const viewDetails = (satellite) => {
  selectedNoradId.value = satellite.norad_id
  showDetails.value = true
}

onMounted(() => {
  loadBookmarked()
})
</script>

<template>
  <div class="rounded-xl overflow-hidden backdrop-blur-xl shadow-2xl
    dark:bg-space-850 dark:border dark:border-space-700/30
    bg-white/80 border border-mission-200/50">
    <div class="p-6">
      <h2 class="text-2xl font-bold font-mono mb-6
        dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-accent-blue dark:to-accent-purple
        text-transparent bg-clip-text bg-mission-gradient">
        ⭐ BOOKMARKED SATELLITES
      </h2>

      <div v-if="api.loading.value" class="text-center py-8">
        <div class="inline-block animate-pulse dark:text-slate-400 text-mission-600 font-mono">
          ⟳ LOADING...
        </div>
      </div>

      <div v-else-if="satellites.length === 0" class="text-center py-8
        dark:text-slate-400/70 text-mission-600 font-mono">
        NO BOOKMARKED SATELLITES<br />
        <span class="text-sm mt-2 block">Bookmark satellites from TRACKED tab</span>
      </div>

      <div v-else class="space-y-2">
        <div
          v-for="satellite in satellites"
          :key="satellite.norad_id"
          class="flex items-center justify-between p-4 rounded-lg border-2 transition-all group
            dark:border-accent-purple/30 dark:bg-slate-800/20 dark:hover:border-accent-purple
            border-yellow-300 bg-yellow-50/50 hover:border-yellow-500 hover:shadow-lg"
        >
          <div class="font-mono cursor-pointer flex-1" @click="viewDetails(satellite)">
            <div class="font-bold
              dark:text-accent-purple text-yellow-800 group-hover:underline">
              {{ satellite.name }}
            </div>
            <div class="text-sm mt-1
              dark:text-accent-purple/70 text-yellow-600">
              NORAD: {{ satellite.norad_id }}
            </div>
          </div>
          <button
            @click.stop="handleUnbookmark(satellite)"
            class="px-4 py-2 rounded-lg font-mono font-bold transition-all
              dark:bg-slate-800/50 dark:border-2 dark:border-slate-500/50 dark:text-slate-400 dark:hover:border-slate-400
              bg-gray-100 border-2 border-gray-300 text-gray-700 hover:bg-gray-200
              hover:scale-105 transform"
          >
            ☆ UNBOOKMARK
          </button>
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
