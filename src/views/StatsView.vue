<script setup>
import { ref, onMounted } from 'vue'
import { useApi } from '../composables/useApi'

const api = useApi()
const stats = ref(null)

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

onMounted(() => {
  loadStats()
})
</script>

<template>
  <div class="space-y-6">
    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-2xl font-semibold text-gray-900 mb-4">System Statistics</h2>

      <div v-if="api.loading.value" class="text-gray-600">
        Loading statistics...
      </div>

      <div v-else-if="stats" class="space-y-6">
        <!-- Tracking Stats -->
        <div>
          <h3 class="text-lg font-semibold text-gray-900 mb-3">Tracking</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-primary-50 p-4 rounded-lg">
              <div class="text-3xl font-bold text-primary-700">
                {{ stats.tracking.total }}
              </div>
              <div class="text-sm text-gray-600">Tracked Satellites</div>
            </div>
            <div class="bg-yellow-50 p-4 rounded-lg">
              <div class="text-3xl font-bold text-yellow-700">
                {{ stats.tracking.bookmarked }}
              </div>
              <div class="text-sm text-gray-600">Bookmarked</div>
            </div>
          </div>
        </div>

        <!-- Catalog Stats -->
        <div>
          <h3 class="text-lg font-semibold text-gray-900 mb-3">Catalog</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-blue-50 p-4 rounded-lg">
              <div class="text-3xl font-bold text-blue-700">
                {{ stats.catalog.total_satellites.toLocaleString() }}
              </div>
              <div class="text-sm text-gray-600">Total Satellites</div>
            </div>
            <div class="bg-green-50 p-4 rounded-lg">
              <div class="text-3xl font-bold text-green-700">
                {{ stats.catalog.total_groups }}
              </div>
              <div class="text-sm text-gray-600">Catalog Groups</div>
            </div>
          </div>
        </div>

        <!-- TLE Cache Stats -->
        <div v-if="stats.tle_cache">
          <h3 class="text-lg font-semibold text-gray-900 mb-3">TLE Cache</h3>
          <div class="bg-gray-50 p-4 rounded-lg space-y-2">
            <div class="flex justify-between">
              <span class="text-gray-600">Total Entries:</span>
              <span class="font-semibold">{{ stats.tle_cache.total_entries.toLocaleString() }}</span>
            </div>
            <div v-if="stats.tle_cache.newest_fetch_time" class="flex justify-between">
              <span class="text-gray-600">Last Fetch:</span>
              <span class="font-semibold">
                {{ formatDuration(stats.tle_cache.newest_fetch_ago_seconds) }}
              </span>
            </div>
            <div v-if="stats.tle_cache.newest_epoch_time" class="flex justify-between">
              <span class="text-gray-600">Newest Epoch:</span>
              <span class="font-semibold">{{ formatDate(stats.tle_cache.newest_epoch_time) }}</span>
            </div>
            <div v-if="stats.tle_cache.oldest_epoch_time" class="flex justify-between">
              <span class="text-gray-600">Oldest Epoch:</span>
              <span class="font-semibold">{{ formatDate(stats.tle_cache.oldest_epoch_time) }}</span>
            </div>
          </div>
        </div>

        <!-- Ground Station -->
        <div v-if="stats.ground_station">
          <h3 class="text-lg font-semibold text-gray-900 mb-3">Ground Station</h3>
          <div class="bg-gray-50 p-4 rounded-lg space-y-2">
            <div v-if="stats.ground_station.name" class="flex justify-between">
              <span class="text-gray-600">Name:</span>
              <span class="font-semibold">{{ stats.ground_station.name }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Latitude:</span>
              <span class="font-semibold">{{ stats.ground_station.latitude }}°</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Longitude:</span>
              <span class="font-semibold">{{ stats.ground_station.longitude }}°</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Altitude:</span>
              <span class="font-semibold">{{ stats.ground_station.altitude_meters }}m</span>
            </div>
          </div>
        </div>

        <!-- Prediction Settings -->
        <div v-if="stats.prediction_settings">
          <h3 class="text-lg font-semibold text-gray-900 mb-3">Prediction Settings</h3>
          <div class="bg-gray-50 p-4 rounded-lg space-y-2">
            <div class="flex justify-between">
              <span class="text-gray-600">Min Elevation:</span>
              <span class="font-semibold">{{ stats.prediction_settings.min_elevation_deg }}°</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Look Ahead:</span>
              <span class="font-semibold">{{ stats.prediction_settings.look_ahead_days }} days</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Step Interval:</span>
              <span class="font-semibold">{{ stats.prediction_settings.step_seconds }}s</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
