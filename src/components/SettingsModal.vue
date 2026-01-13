<script setup>
import { ref, computed } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { Cog6ToothIcon, XMarkIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  open: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['close', 'save'])

// Get default endpoint safely
const getDefaultEndpoint = () => {
  return (window.satpassConfig && window.satpassConfig.apiEndpoint) || window.location.origin
}

// Load current settings from localStorage or default config
const currentEndpoint = localStorage.getItem('satpass_api_endpoint') || getDefaultEndpoint()

const apiEndpoint = ref(currentEndpoint)
const testStatus = ref(null) // null, 'testing', 'success', 'error'
const testMessage = ref('')

const isValidUrl = computed(() => {
  try {
    new URL(apiEndpoint.value)
    return true
  } catch {
    return false
  }
})

const testConnection = async () => {
  if (!isValidUrl.value) {
    testStatus.value = 'error'
    testMessage.value = 'Invalid URL format'
    return
  }

  testStatus.value = 'testing'
  testMessage.value = 'Testing connection...'

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000)

    const response = await fetch(`${apiEndpoint.value}/health`, {
      signal: controller.signal
    })
    clearTimeout(timeoutId)

    if (response.ok) {
      const data = await response.json()
      testStatus.value = 'success'
      testMessage.value = `Connected successfully! Status: ${data.status}`
    } else {
      testStatus.value = 'error'
      testMessage.value = `Server responded with status ${response.status}`
    }
  } catch (error) {
    testStatus.value = 'error'
    if (error.name === 'AbortError') {
      testMessage.value = 'Connection timeout (5s)'
    } else {
      testMessage.value = `Connection failed: ${error.message}`
    }
  }
}

const saveSettings = () => {
  if (!isValidUrl.value) {
    testStatus.value = 'error'
    testMessage.value = 'Please enter a valid URL'
    return
  }

  localStorage.setItem('satpass_api_endpoint', apiEndpoint.value)
  emit('save', apiEndpoint.value)
  emit('close')

  // Reload page to apply new settings
  window.location.reload()
}

const resetToDefault = () => {
  apiEndpoint.value = getDefaultEndpoint()
  testStatus.value = null
  testMessage.value = ''
}
</script>

<template>
  <TransitionRoot :show="open" as="template">
    <Dialog as="div" class="relative z-50" @close="$emit('close')">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 dark:bg-black/70 bg-gray-500 bg-opacity-75 backdrop-blur-sm transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel class="relative transform overflow-hidden rounded-xl backdrop-blur-xl border-2
              dark:bg-space-850/95 dark:border-space-700/50
              bg-white border-gray-200
              px-4 pb-4 pt-5 text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
              <div class="absolute right-0 top-0 pr-4 pt-4">
                <button
                  type="button"
                  class="rounded-md transition-all
                    dark:bg-transparent dark:text-accent-blue dark:hover:bg-space-800/50
                    bg-white text-gray-400 hover:text-gray-500
                    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  @click="$emit('close')"
                >
                  <XMarkIcon class="h-6 w-6" />
                </button>
              </div>

              <div class="sm:flex sm:items-start">
                <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full
                  dark:bg-accent-purple/20 bg-primary-100
                  sm:mx-0 sm:h-10 sm:w-10">
                  <Cog6ToothIcon class="h-6 w-6 dark:text-accent-purple text-primary-600" />
                </div>
                <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left flex-1">
                  <DialogTitle as="h3" class="text-lg font-bold font-mono leading-6
                    dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-accent-blue dark:to-accent-purple
                    text-gray-900">
                    ⚙️ SETTINGS
                  </DialogTitle>
                  <div class="mt-4 space-y-4">
                    <!-- API Endpoint Input -->
                    <div>
                      <label for="api-endpoint" class="block text-sm font-mono font-medium mb-1
                        dark:text-accent-blue text-gray-700">
                        API Server Endpoint
                      </label>
                      <input
                        id="api-endpoint"
                        v-model="apiEndpoint"
                        type="text"
                        placeholder="http://localhost:8080"
                        class="w-full px-3 py-2 border-2 rounded-lg font-mono text-sm
                          dark:bg-space-800/50 dark:border-space-700 dark:text-slate-200 dark:placeholder-slate-500
                          dark:focus:border-accent-blue
                          border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        @input="testStatus = null"
                      />
                      <p class="mt-1 text-xs font-mono dark:text-slate-400 text-gray-500">
                        Enter the URL where the satpass API server is running
                      </p>
                    </div>

                    <!-- Test Connection Button -->
                    <div>
                      <button
                        @click="testConnection"
                        :disabled="!isValidUrl || testStatus === 'testing'"
                        class="w-full px-4 py-2 rounded-lg font-mono font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed
                          dark:bg-gradient-to-r dark:from-accent-blue dark:to-accent-teal dark:hover:shadow-lg dark:hover:shadow-space-500/50 dark:text-white
                          bg-primary-600 hover:bg-primary-700 text-white"
                      >
                        {{ testStatus === 'testing' ? '⟳ TESTING...' : '🔗 TEST CONNECTION' }}
                      </button>
                    </div>

                    <!-- Test Status Message -->
                    <div
                      v-if="testStatus && testStatus !== 'testing'"
                      class="p-3 rounded-lg border-2 font-mono"
                      :class="{
                        'dark:bg-green-900/20 dark:border-green-700/50 dark:text-green-300 bg-green-50 border-green-300 text-green-800': testStatus === 'success',
                        'dark:bg-red-900/20 dark:border-red-700/50 dark:text-red-300 bg-red-50 border-red-300 text-red-800': testStatus === 'error'
                      }"
                    >
                      <p class="text-sm">{{ testMessage }}</p>
                    </div>

                    <!-- Current Settings Info -->
                    <div class="p-3 rounded-lg border-2 font-mono
                      dark:bg-space-800/30 dark:border-space-700/50
                      bg-gray-50 border-gray-300">
                      <p class="text-xs mb-1
                        dark:text-slate-400 text-gray-600">
                        <strong class="dark:text-slate-300 text-gray-800">Current:</strong> {{ currentEndpoint }}
                      </p>
                      <p class="text-xs
                        dark:text-slate-400 text-gray-600">
                        <strong class="dark:text-slate-300 text-gray-800">Default:</strong> {{ getDefaultEndpoint() }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse gap-2">
                <button
                  type="button"
                  class="inline-flex w-full justify-center rounded-lg px-5 py-2 font-mono font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transform sm:w-auto
                    dark:bg-gradient-to-r dark:from-accent-blue dark:to-accent-teal dark:hover:shadow-lg dark:hover:shadow-space-500/50 dark:text-white
                    bg-primary-600 hover:bg-primary-700 text-white shadow-sm"
                  @click="saveSettings"
                  :disabled="!isValidUrl"
                >
                  💾 SAVE & RELOAD
                </button>
                <button
                  type="button"
                  class="mt-3 inline-flex w-full justify-center rounded-lg px-5 py-2 font-mono font-bold transition-all hover:scale-105 transform sm:mt-0 sm:w-auto
                    dark:bg-space-800/50 dark:border-2 dark:border-space-700/50 dark:text-accent-purple dark:hover:border-accent-purple
                    bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm"
                  @click="resetToDefault"
                >
                  🔄 RESET
                </button>
                <button
                  type="button"
                  class="mt-3 inline-flex w-full justify-center rounded-lg px-5 py-2 font-mono font-bold transition-all hover:scale-105 transform sm:mt-0 sm:w-auto
                    dark:bg-space-800/50 dark:border-2 dark:border-space-700/50 dark:text-slate-400 dark:hover:border-slate-400
                    bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm"
                  @click="$emit('close')"
                >
                  ✕ CANCEL
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
