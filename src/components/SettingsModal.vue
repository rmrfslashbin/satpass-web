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
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
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
            <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
              <div class="absolute right-0 top-0 pr-4 pt-4">
                <button
                  type="button"
                  class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  @click="$emit('close')"
                >
                  <XMarkIcon class="h-6 w-6" />
                </button>
              </div>

              <div class="sm:flex sm:items-start">
                <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 sm:mx-0 sm:h-10 sm:w-10">
                  <Cog6ToothIcon class="h-6 w-6 text-primary-600" />
                </div>
                <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left flex-1">
                  <DialogTitle as="h3" class="text-lg font-semibold leading-6 text-gray-900">
                    Settings
                  </DialogTitle>
                  <div class="mt-4 space-y-4">
                    <!-- API Endpoint Input -->
                    <div>
                      <label for="api-endpoint" class="block text-sm font-medium text-gray-700 mb-1">
                        API Server Endpoint
                      </label>
                      <input
                        id="api-endpoint"
                        v-model="apiEndpoint"
                        type="text"
                        placeholder="http://localhost:8080"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        @input="testStatus = null"
                      />
                      <p class="mt-1 text-xs text-gray-500">
                        Enter the URL where the satpass API server is running
                      </p>
                    </div>

                    <!-- Test Connection Button -->
                    <div>
                      <button
                        @click="testConnection"
                        :disabled="!isValidUrl || testStatus === 'testing'"
                        class="w-full px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {{ testStatus === 'testing' ? 'Testing...' : 'Test Connection' }}
                      </button>
                    </div>

                    <!-- Test Status Message -->
                    <div
                      v-if="testStatus && testStatus !== 'testing'"
                      class="p-3 rounded-md"
                      :class="{
                        'bg-green-50 text-green-800': testStatus === 'success',
                        'bg-red-50 text-red-800': testStatus === 'error'
                      }"
                    >
                      <p class="text-sm">{{ testMessage }}</p>
                    </div>

                    <!-- Current Settings Info -->
                    <div class="bg-gray-50 p-3 rounded-md">
                      <p class="text-xs text-gray-600 mb-1">
                        <strong>Current:</strong> {{ currentEndpoint }}
                      </p>
                      <p class="text-xs text-gray-600">
                        <strong>Default:</strong> {{ getDefaultEndpoint() }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse gap-2">
                <button
                  type="button"
                  class="inline-flex w-full justify-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-700 sm:w-auto"
                  @click="saveSettings"
                  :disabled="!isValidUrl"
                >
                  Save & Reload
                </button>
                <button
                  type="button"
                  class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                  @click="resetToDefault"
                >
                  Reset to Default
                </button>
                <button
                  type="button"
                  class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                  @click="$emit('close')"
                >
                  Cancel
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
