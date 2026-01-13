<script setup>
import { ref, watch, computed } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import { useApi } from '../composables/useApi'

const props = defineProps({
  open: {
    type: Boolean,
    required: true
  },
  noradId: {
    type: Number,
    default: null
  }
})

const emit = defineEmits(['close'])

const api = useApi()
const satellite = ref(null)
const catalogEntry = ref(null)
const tle = ref(null)
const loading = ref(false)

const loadDetails = async () => {
  if (!props.noradId) return

  loading.value = true
  try {
    // Load satellite info, catalog entry, and TLE in parallel
    const [satData, catData, tleData] = await Promise.allSettled([
      api.getSatellite(props.noradId).catch(() => null),
      api.getCatalogEntry(props.noradId),
      api.getTLE(props.noradId).catch(() => null)
    ])

    satellite.value = satData.status === 'fulfilled' ? satData.value : null
    catalogEntry.value = catData.status === 'fulfilled' ? catData.value : null
    tle.value = tleData.status === 'fulfilled' ? tleData.value : null
  } catch (err) {
    console.error('Failed to load satellite details:', err)
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleString()
}

const satName = computed(() => {
  return satellite.value?.name || catalogEntry.value?.name || 'Unknown'
})

const satGroup = computed(() => {
  return catalogEntry.value?.group || 'N/A'
})

const intlDesignator = computed(() => {
  return catalogEntry.value?.intl_designator || 'N/A'
})

watch(() => props.open, (isOpen) => {
  if (isOpen && props.noradId) {
    loadDetails()
  }
})

watch(() => props.noradId, (newId) => {
  if (newId && props.open) {
    loadDetails()
  }
})

const closeModal = () => {
  emit('close')
}
</script>

<template>
  <TransitionRoot as="template" :show="open">
    <Dialog as="div" class="relative z-50" @close="closeModal">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 scale-95"
            enter-to="opacity-100 translate-y-0 scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 scale-100"
            leave-to="opacity-0 translate-y-4 scale-95"
          >
            <DialogPanel class="w-full max-w-3xl transform overflow-hidden rounded-xl
              backdrop-blur-xl shadow-2xl transition-all
              dark:bg-space-900/90 dark:border-2 dark:border-cyber-500/50
              bg-white/90 border-2 border-mission-200">

              <!-- Header -->
              <div class="flex items-center justify-between p-4 border-b-2
                dark:border-cyber-500/30 border-mission-200">
                <DialogTitle class="text-xl font-bold font-mono
                  dark:text-transparent dark:bg-clip-text dark:bg-cyber-gradient
                  text-transparent bg-clip-text bg-mission-gradient">
                  🛰️ SATELLITE DETAILS
                </DialogTitle>
                <button
                  @click="closeModal"
                  class="p-1 rounded-lg transition-all hover:scale-110
                    dark:text-cyber-400 dark:hover:bg-space-800/50
                    text-mission-700 hover:bg-mission-100"
                >
                  <XMarkIcon class="h-5 w-5" />
                </button>
              </div>

              <!-- Content -->
              <div class="p-4 space-y-4">
                <div v-if="loading" class="text-center py-8">
                  <div class="inline-block animate-pulse dark:text-cyber-400 text-mission-600 font-mono">
                    ⟳ LOADING DETAILS...
                  </div>
                </div>

                <div v-else class="space-y-4">
                  <!-- Basic Info -->
                  <div>
                    <h3 class="text-base font-bold font-mono mb-2 uppercase tracking-wide
                      dark:text-cyber-400 text-mission-700">
                      📡 IDENTIFICATION
                    </h3>
                    <div class="p-3 rounded-lg border-2 space-y-2 font-mono
                      dark:bg-space-800/30 dark:border-cyber-500/50
                      bg-gray-50 border-gray-300">
                      <div class="flex justify-between">
                        <span class="dark:text-cyber-400/70 text-gray-600">Name:</span>
                        <span class="font-bold dark:text-cyber-300 text-gray-900">
                          {{ satName }}
                        </span>
                      </div>
                      <div class="flex justify-between">
                        <span class="dark:text-cyber-400/70 text-gray-600">NORAD ID:</span>
                        <span class="font-bold dark:text-cyber-300 text-gray-900">
                          {{ noradId }}
                        </span>
                      </div>
                      <div class="flex justify-between">
                        <span class="dark:text-cyber-400/70 text-gray-600">Group:</span>
                        <span class="font-bold dark:text-cyber-300 text-gray-900">
                          {{ satGroup }}
                        </span>
                      </div>
                      <div class="flex justify-between">
                        <span class="dark:text-cyber-400/70 text-gray-600">Int'l Designator:</span>
                        <span class="font-bold dark:text-cyber-300 text-gray-900">
                          {{ intlDesignator }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <!-- TLE Data -->
                  <div v-if="tle">
                    <h3 class="text-base font-bold font-mono mb-2 uppercase tracking-wide
                      dark:text-cyber-400 text-mission-700">
                      📊 ORBITAL DATA (TLE)
                    </h3>
                    <div class="p-3 rounded-lg border-2 space-y-2 font-mono
                      dark:bg-space-800/30 dark:border-cyber-500/50
                      bg-gray-50 border-gray-300">
                      <div class="flex justify-between">
                        <span class="dark:text-cyber-400/70 text-gray-600">Epoch:</span>
                        <span class="font-bold dark:text-cyber-300 text-gray-900">
                          {{ formatDate(tle.epoch) }}
                        </span>
                      </div>
                      <div class="flex justify-between">
                        <span class="dark:text-cyber-400/70 text-gray-600">Last Fetched:</span>
                        <span class="font-bold dark:text-cyber-300 text-gray-900">
                          {{ formatDate(tle.fetched_at) }}
                        </span>
                      </div>
                      <div class="mt-2">
                        <div class="text-xs dark:text-cyber-400/70 text-gray-600 mb-1">TLE Lines:</div>
                        <div class="bg-black/20 p-2 rounded text-xs overflow-x-auto
                          dark:text-cyber-300 text-gray-800">
                          <div>{{ tle.tle_line1 }}</div>
                          <div>{{ tle.tle_line2 }}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Catalog Info -->
                  <div v-if="catalogEntry">
                    <h3 class="text-base font-bold font-mono mb-2 uppercase tracking-wide
                      dark:text-cyber-400 text-mission-700">
                      📚 CATALOG INFO
                    </h3>
                    <div class="p-3 rounded-lg border-2 space-y-2 font-mono
                      dark:bg-space-800/30 dark:border-cyber-500/50
                      bg-gray-50 border-gray-300">
                      <div class="flex justify-between">
                        <span class="dark:text-cyber-400/70 text-gray-600">Last Updated:</span>
                        <span class="font-bold dark:text-cyber-300 text-gray-900">
                          {{ formatDate(catalogEntry.last_updated) }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Footer -->
              <div class="flex justify-end gap-3 p-4 border-t-2
                dark:border-cyber-500/30 border-mission-200">
                <button
                  @click="closeModal"
                  class="px-5 py-2 rounded-lg font-mono font-bold transition-all
                    dark:bg-space-800/50 dark:border-2 dark:border-cyber-500/50 dark:text-cyber-400 dark:hover:border-cyber-400
                    bg-gray-100 border-2 border-gray-300 text-gray-700 hover:bg-gray-200
                    hover:scale-105 transform"
                >
                  CLOSE
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
