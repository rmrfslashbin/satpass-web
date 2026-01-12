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
    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-2xl font-semibold text-gray-900 mb-4">Browse Catalog</h2>

      <div v-if="api.loading.value" class="text-gray-600">
        Loading groups...
      </div>

      <div v-else-if="groups.length === 0" class="text-gray-600">
        No groups available
      </div>

      <div v-else class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <button
            v-for="group in groups"
            :key="group"
            @click="selectGroup(group)"
            class="px-4 py-3 rounded-lg border-2 transition-all text-left"
            :class="[
              selectedGroup === group
                ? 'border-primary-500 bg-primary-50 text-primary-900'
                : 'border-gray-200 bg-white hover:border-primary-300 text-gray-700'
            ]"
          >
            <div class="font-medium">{{ group }}</div>
            <div class="text-sm text-gray-500">
              {{ catalogStats[group] || 0 }} satellites
            </div>
          </button>
        </div>
      </div>
    </div>

    <div v-if="selectedGroup" class="bg-white rounded-lg shadow p-6">
      <h3 class="text-xl font-semibold text-gray-900 mb-4">
        {{ selectedGroup }}
      </h3>
      <SatelliteList :group="selectedGroup" :show-track-button="true" />
    </div>
  </div>
</template>
