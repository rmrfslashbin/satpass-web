<script setup>
import { ref, onMounted } from 'vue'
import { useApi } from '../composables/useApi'
import SatelliteList from '../components/SatelliteList.vue'

const api = useApi()
const groups = ref([])
const selectedGroup = ref(null)
const catalogStats = ref({})

const loadGroups = async () => {
  try {
    // Load both groups and stats
    const [groupsData, statsData] = await Promise.all([
      api.getCatalogGroups(),
      api.getCatalogStats()
    ])
    groups.value = groupsData.groups || []
    catalogStats.value = statsData.groups || {}
  } catch (err) {
    console.error('Failed to load groups:', err)
  }
}

const selectGroup = (group) => {
  selectedGroup.value = group
}

onMounted(() => {
  loadGroups()
})
</script>

<template>
  <div class="space-y-6">
    <!-- Groups Section -->
    <div class="rounded-xl overflow-hidden backdrop-blur-xl shadow-2xl
      dark:bg-space-900/50 dark:border dark:border-cyber-500/30
      bg-white/80 border border-mission-200/50">
      <div class="p-6">
        <h2 class="text-2xl font-bold font-mono mb-6
          dark:text-transparent dark:bg-clip-text dark:bg-cyber-gradient
          text-transparent bg-clip-text bg-mission-gradient">
          📡 BROWSE CATALOG
        </h2>

        <div v-if="api.loading.value" class="text-center py-8">
          <div class="inline-block animate-pulse
            dark:text-cyber-400 text-mission-600 font-mono">
            ⟳ LOADING GROUPS...
          </div>
        </div>

        <div v-else-if="groups.length === 0" class="text-center py-8
          dark:text-cyber-400/70 text-mission-600 font-mono">
          NO GROUPS AVAILABLE
        </div>

        <div v-else class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <button
              v-for="group in groups"
              :key="group"
              @click="selectGroup(group)"
              class="px-4 py-4 rounded-lg border-2 transition-all text-left font-mono group
                hover:scale-105 transform"
              :class="[
                selectedGroup === group
                  ? 'dark:bg-cyber-gradient dark:border-cyber-400 dark:shadow-lg dark:shadow-cyber-500/50 bg-mission-gradient border-mission-600 shadow-lg shadow-mission-500/30 text-white scale-105'
                  : 'dark:border-cyber-500/50 dark:bg-space-800/30 dark:hover:border-cyber-400 dark:text-cyber-300 border-mission-300 bg-white hover:border-mission-500 text-mission-700'
              ]"
            >
              <div class="font-bold text-lg uppercase tracking-wide">
                {{ group }}
              </div>
              <div class="text-sm mt-1"
                :class="selectedGroup === group ? 'text-white/90' : 'dark:text-cyber-400/70 text-mission-500'">
                {{ catalogStats[group] || 0 }} satellites
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Selected Group Satellites -->
    <div v-if="selectedGroup" class="rounded-xl overflow-hidden backdrop-blur-xl shadow-2xl animate-fade-in
      dark:bg-space-900/50 dark:border dark:border-cyber-500/30
      bg-white/80 border border-mission-200/50">
      <div class="p-6">
        <h3 class="text-xl font-bold font-mono mb-4 uppercase tracking-wide
          dark:text-cyber-400 text-mission-700">
          🛰️ {{ selectedGroup }}
        </h3>
        <SatelliteList :group="selectedGroup" :show-track-button="true" />
      </div>
    </div>
  </div>
</template>
