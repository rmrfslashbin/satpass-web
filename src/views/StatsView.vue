<script setup>
import { ref, onMounted } from 'vue'
import { useApi } from '../composables/useApi'
import GroundStationModal from '../components/GroundStationModal.vue'

const api = useApi()
const stats = ref(null)
const showGSModal = ref(false)

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString()
}

const formatDuration = (seconds) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  if (hours > 0) {
    return `${hours}h ${minutes}m ago`
  }
  return `${minutes}m ago`
}

const loadStats = async () => {
  try {
    const data = await api.getSystemStats()
    stats.value = data
  } catch (err) {
    console.error('Failed to load statistics:', err)
  }
}

const handleGSSave = async () => {
  await loadStats()
}

onMounted(() => {
  loadStats()
})
</script>

<template>
  <div class="space-y-6">
    <div class="rounded-xl overflow-hidden backdrop-blur-xl shadow-2xl
      dark:bg-space-900/50 dark:border dark:border-cyber-500/30
      bg-white/80 border border-mission-200/50">
      <div class="p-6">
        <h2 class="text-2xl font-bold font-mono mb-6
          dark:text-transparent dark:bg-clip-text dark:bg-cyber-gradient
          text-transparent bg-clip-text bg-mission-gradient">
          📊 SYSTEM STATISTICS
        </h2>

        <div v-if="api.loading.value" class="text-center py-8">
          <div class="inline-block animate-pulse dark:text-cyber-400 text-mission-600 font-mono">
            ⟳ LOADING STATISTICS...
          </div>
        </div>

        <div v-else-if="stats" class="space-y-6">
          <!-- Tracking Stats -->
          <div>
            <h3 class="text-lg font-bold font-mono mb-3 uppercase tracking-wide
              dark:text-cyber-400 text-mission-700">
              🎯 Tracking
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="p-4 rounded-lg border-2
                dark:bg-cyber-500/10 dark:border-cyber-500/50
                bg-mission-50 border-mission-300">
                <div class="text-4xl font-bold font-mono
                  dark:text-cyber-300 text-mission-700">
                  {{ stats.tracking.total }}
                </div>
                <div class="text-sm font-mono mt-1
                  dark:text-cyber-400/70 text-mission-600">
                  Tracked Satellites
                </div>
              </div>
              <div class="p-4 rounded-lg border-2
                dark:bg-neon-500/10 dark:border-neon-500/50
                bg-yellow-50 border-yellow-300">
                <div class="text-4xl font-bold font-mono
                  dark:text-neon-300 text-yellow-700">
                  {{ stats.tracking.bookmarked }}
                </div>
                <div class="text-sm font-mono mt-1
                  dark:text-neon-400/70 text-yellow-600">
                  Bookmarked
                </div>
              </div>
            </div>
          </div>

          <!-- Catalog Stats -->
          <div>
            <h3 class="text-lg font-bold font-mono mb-3 uppercase tracking-wide
              dark:text-cyber-400 text-mission-700">
              📚 Catalog
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="p-4 rounded-lg border-2
                dark:bg-space-800/30 dark:border-cyber-500/50
                bg-blue-50 border-blue-300">
                <div class="text-4xl font-bold font-mono
                  dark:text-cyber-300 text-blue-700">
                  {{ stats.catalog.total_satellites.toLocaleString() }}
                </div>
                <div class="text-sm font-mono mt-1
                  dark:text-cyber-400/70 text-blue-600">
                  Total Satellites
                </div>
              </div>
              <div class="p-4 rounded-lg border-2
                dark:bg-space-800/30 dark:border-cyber-500/50
                bg-green-50 border-green-300">
                <div class="text-4xl font-bold font-mono
                  dark:text-cyber-300 text-green-700">
                  {{ stats.catalog.total_groups }}
                </div>
                <div class="text-sm font-mono mt-1
                  dark:text-cyber-400/70 text-green-600">
                  Catalog Groups
                </div>
              </div>
            </div>
          </div>

          <!-- TLE Cache Stats -->
          <div v-if="stats.tle_cache">
            <h3 class="text-lg font-bold font-mono mb-3 uppercase tracking-wide
              dark:text-cyber-400 text-mission-700">
              💾 TLE Cache
            </h3>
            <div class="p-4 rounded-lg border-2 space-y-2 font-mono
              dark:bg-space-800/30 dark:border-cyber-500/50
              bg-gray-50 border-gray-300">
              <div class="flex justify-between">
                <span class="dark:text-cyber-400/70 text-gray-600">Total Entries:</span>
                <span class="font-bold dark:text-cyber-300 text-gray-900">
                  {{ stats.tle_cache.total_entries.toLocaleString() }}
                </span>
              </div>
              <div v-if="stats.tle_cache.newest_fetch_time" class="flex justify-between">
                <span class="dark:text-cyber-400/70 text-gray-600">Last Fetch:</span>
                <span class="font-bold dark:text-cyber-300 text-gray-900">
                  {{ formatDuration(stats.tle_cache.newest_fetch_ago_seconds) }}
                </span>
              </div>
              <div v-if="stats.tle_cache.newest_epoch_time" class="flex justify-between">
                <span class="dark:text-cyber-400/70 text-gray-600">Newest Epoch:</span>
                <span class="font-bold dark:text-cyber-300 text-gray-900">
                  {{ formatDate(stats.tle_cache.newest_epoch_time) }}
                </span>
              </div>
              <div v-if="stats.tle_cache.oldest_epoch_time" class="flex justify-between">
                <span class="dark:text-cyber-400/70 text-gray-600">Oldest Epoch:</span>
                <span class="font-bold dark:text-cyber-300 text-gray-900">
                  {{ formatDate(stats.tle_cache.oldest_epoch_time) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Ground Station -->
          <div v-if="stats.ground_station">
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-lg font-bold font-mono uppercase tracking-wide
                dark:text-cyber-400 text-mission-700">
                📍 Ground Station
              </h3>
              <button
                @click="showGSModal = true"
                class="px-3 py-1 text-xs font-mono font-semibold rounded-md transition-colors
                  dark:bg-cyber-500/20 dark:text-cyber-300 dark:border dark:border-cyber-500/50 dark:hover:bg-cyber-500/30
                  bg-mission-100 text-mission-700 border border-mission-300 hover:bg-mission-200"
              >
                ✏️ EDIT
              </button>
            </div>
            <div class="p-4 rounded-lg border-2 space-y-2 font-mono
              dark:bg-space-800/30 dark:border-cyber-500/50
              bg-gray-50 border-gray-300">
              <div v-if="stats.ground_station.name" class="flex justify-between">
                <span class="dark:text-cyber-400/70 text-gray-600">Name:</span>
                <span class="font-bold dark:text-cyber-300 text-gray-900">
                  {{ stats.ground_station.name }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="dark:text-cyber-400/70 text-gray-600">Latitude:</span>
                <span class="font-bold dark:text-cyber-300 text-gray-900">
                  {{ stats.ground_station.latitude }}°
                </span>
              </div>
              <div class="flex justify-between">
                <span class="dark:text-cyber-400/70 text-gray-600">Longitude:</span>
                <span class="font-bold dark:text-cyber-300 text-gray-900">
                  {{ stats.ground_station.longitude }}°
                </span>
              </div>
              <div class="flex justify-between">
                <span class="dark:text-cyber-400/70 text-gray-600">Altitude:</span>
                <span class="font-bold dark:text-cyber-300 text-gray-900">
                  {{ stats.ground_station.altitude_meters }}m
                </span>
              </div>
            </div>
          </div>

          <!-- Prediction Settings -->
          <div v-if="stats.prediction_settings">
            <h3 class="text-lg font-bold font-mono mb-3 uppercase tracking-wide
              dark:text-cyber-400 text-mission-700">
              ⚙️ Prediction Settings
            </h3>
            <div class="p-4 rounded-lg border-2 space-y-2 font-mono
              dark:bg-space-800/30 dark:border-cyber-500/50
              bg-gray-50 border-gray-300">
              <div class="flex justify-between">
                <span class="dark:text-cyber-400/70 text-gray-600">Min Elevation:</span>
                <span class="font-bold dark:text-cyber-300 text-gray-900">
                  {{ stats.prediction_settings.min_elevation_deg }}°
                </span>
              </div>
              <div class="flex justify-between">
                <span class="dark:text-cyber-400/70 text-gray-600">Look Ahead:</span>
                <span class="font-bold dark:text-cyber-300 text-gray-900">
                  {{ stats.prediction_settings.look_ahead_days }} days
                </span>
              </div>
              <div class="flex justify-between">
                <span class="dark:text-cyber-400/70 text-gray-600">Step Interval:</span>
                <span class="font-bold dark:text-cyber-300 text-gray-900">
                  {{ stats.prediction_settings.step_seconds }}s
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Ground Station Edit Modal -->
    <GroundStationModal
      v-if="stats?.ground_station"
      :open="showGSModal"
      :ground-station="stats.ground_station"
      @close="showGSModal = false"
      @save="handleGSSave"
    />
  </div>
</template>
