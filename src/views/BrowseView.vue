<script setup>
import { ref, onMounted } from 'vue'
import { useApi } from '../composables/useApi'
import { ArrowLeftIcon } from '@heroicons/vue/24/outline'
import SatelliteList from '../components/SatelliteList.vue'

const api = useApi()
const groups = ref([])
const selectedGroup = ref(null)
const catalogStats = ref({})
const viewMode = ref('groups') // 'groups' or 'group-detail'

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
  viewMode.value = 'group-detail'
}

const backToGroups = () => {
  viewMode.value = 'groups'
  selectedGroup.value = null
}

onMounted(() => {
  loadGroups()
})
</script>

<template>
  <div>
    <!-- Groups Grid View -->
    <div v-if="viewMode === 'groups'" class="rounded-xl overflow-hidden backdrop-blur-xl shadow-2xl
      dark:bg-space-850 dark:border dark:border-space-700/30
      bg-white/80 border border-mission-200/50 animate-fade-in">
      <div class="p-6">
        <h2 class="text-2xl font-bold font-mono mb-6
          dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-accent-blue dark:to-accent-purple
          text-transparent bg-clip-text bg-mission-gradient">
          📡 BROWSE CATALOG
        </h2>

        <div v-if="api.loading.value" class="text-center py-8">
          <div class="inline-block animate-pulse
            dark:text-slate-400 text-mission-600 font-mono">
            ⟳ LOADING GROUPS...
          </div>
        </div>

        <div v-else-if="groups.length === 0" class="text-center py-8
          dark:text-slate-400/70 text-mission-600 font-mono">
          NO GROUPS AVAILABLE
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <button
            v-for="group in groups"
            :key="group"
            @click="selectGroup(group)"
            class="px-4 py-4 rounded-lg border-2 transition-all text-left font-mono group
              hover:scale-105 transform
              dark:border-space-700 dark:bg-space-800 dark:hover:border-space-700 dark:hover:bg-space-700 dark:text-slate-100
              border-mission-300 bg-white hover:border-mission-500 hover:bg-mission-50 text-mission-700"
          >
            <div class="font-bold text-lg uppercase tracking-wide">
              {{ group }}
            </div>
            <div class="text-sm mt-1 dark:text-slate-300 text-mission-600">
              {{ catalogStats[group] || 0 }} satellites
            </div>
          </button>
        </div>
      </div>
    </div>

    <!-- Group Detail View -->
    <div v-else-if="viewMode === 'group-detail'" class="rounded-xl overflow-hidden backdrop-blur-xl shadow-2xl
      dark:bg-space-850 dark:border dark:border-space-700/30
      bg-white/80 border border-mission-200/50 animate-fade-in">
      <div class="p-6">
        <!-- Header with Back Button -->
        <div class="flex items-center gap-4 mb-6">
          <button
            @click="backToGroups"
            class="flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all font-mono text-sm
              dark:border-slate-600 dark:bg-slate-800 dark:hover:border-slate-500 dark:text-slate-300 dark:hover:bg-slate-700
              border-mission-300 bg-white hover:border-mission-500 text-mission-700 hover:bg-mission-50"
          >
            <ArrowLeftIcon class="h-4 w-4" />
            BACK
          </button>
          <h2 class="text-2xl font-bold font-mono uppercase tracking-wide
            dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-accent-blue dark:to-accent-purple
            text-transparent bg-clip-text bg-mission-gradient">
            🛰️ {{ selectedGroup }}
          </h2>
          <div class="ml-auto text-sm font-mono
            dark:text-slate-400 text-mission-600">
            {{ catalogStats[selectedGroup] || 0 }} satellites
          </div>
        </div>

        <!-- Satellite List -->
        <SatelliteList :group="selectedGroup" :show-track-button="true" />
      </div>
    </div>
  </div>
</template>
