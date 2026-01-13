<script setup>
import { ref } from 'vue'
import { useApi } from '../composables/useApi'
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline'
import SatelliteDetailsModal from '../components/SatelliteDetailsModal.vue'
import PaginationControls from '../components/PaginationControls.vue'

const api = useApi()
const searchQuery = ref('')
const searchResults = ref([])
const hasSearched = ref(false)
const showDetails = ref(false)
const selectedNoradId = ref(null)

// Pagination state
const currentPage = ref(1)
const itemsPerPage = ref(20)
const totalItems = ref(0)

const calculateOffset = () => (currentPage.value - 1) * itemsPerPage.value

const performSearch = async (resetPage = true) => {
  if (!searchQuery.value.trim()) return

  if (resetPage) {
    currentPage.value = 1
  }

  hasSearched.value = true
  try {
    const offset = calculateOffset()
    const data = await api.searchSatellites(searchQuery.value, {
      limit: itemsPerPage.value,
      offset: offset
    })
    searchResults.value = data.satellites || []
    totalItems.value = data.total || 0
  } catch (err) {
    console.error('Search failed:', err)
    searchResults.value = []
    totalItems.value = 0
  }
}

const handlePageChange = (page) => {
  currentPage.value = page
  performSearch(false)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handlePerPageChange = (perPage) => {
  itemsPerPage.value = perPage
  currentPage.value = 1
  performSearch(false)
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
</script>

<template>
  <div class="rounded-xl overflow-hidden backdrop-blur-xl shadow-2xl
    dark:bg-space-900/50 dark:border dark:border-cyber-500/30
    bg-white/80 border border-mission-200/50">
    <div class="p-6">
      <h2 class="text-2xl font-bold font-mono mb-6
        dark:text-transparent dark:bg-clip-text dark:bg-cyber-gradient
        text-transparent bg-clip-text bg-mission-gradient">
        🔍 SEARCH SATELLITES
      </h2>

      <div class="flex gap-2 mb-6">
        <div class="flex-1 relative">
          <input
            v-model="searchQuery"
            @keyup.enter="performSearch"
            type="text"
            placeholder="Search by name or NORAD ID..."
            class="w-full px-4 py-3 rounded-lg border-2 font-mono transition-all
              dark:bg-space-800/50 dark:border-cyber-500/50 dark:text-cyber-300 dark:placeholder-cyber-400/50
              dark:focus:border-cyber-400 dark:focus:ring-2 dark:focus:ring-cyber-500/50
              bg-white border-mission-300 text-mission-900 placeholder-mission-400
              focus:border-mission-500 focus:ring-2 focus:ring-mission-500/50 outline-none"
          />
          <MagnifyingGlassIcon class="absolute right-3 top-3.5 h-5 w-5
            dark:text-cyber-400/50 text-mission-400" />
        </div>
        <button
          @click="performSearch"
          :disabled="api.loading.value"
          class="px-6 py-3 rounded-lg font-mono font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed
            dark:bg-cyber-gradient dark:hover:shadow-lg dark:hover:shadow-cyber-500/50 dark:text-white
            bg-mission-gradient hover:shadow-lg hover:shadow-mission-500/30 text-white
            hover:scale-105 transform"
        >
          SEARCH
        </button>
      </div>

      <div v-if="api.loading.value" class="text-center py-8">
        <div class="inline-block animate-pulse dark:text-cyber-400 text-mission-600 font-mono">
          ⟳ SEARCHING...
        </div>
      </div>

      <div v-else-if="hasSearched && searchResults.length === 0" class="text-center py-8
        dark:text-cyber-400/70 text-mission-600 font-mono">
        NO SATELLITES FOUND: "{{ searchQuery }}"
      </div>

      <div v-else-if="searchResults.length > 0" class="space-y-2">
        <div
          v-for="satellite in searchResults"
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
