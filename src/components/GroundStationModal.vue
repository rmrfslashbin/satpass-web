<script setup>
import { ref, watch } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { MapPinIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import { useApi } from '@/composables/useApi'

const props = defineProps({
  open: {
    type: Boolean,
    required: true
  },
  groundStation: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'save'])

const api = useApi()

// Form fields
const formData = ref({
  name: '',
  callsign: '',
  latitude: 0,
  longitude: 0,
  altitude_meters: 0
})

const saveStatus = ref(null) // null, 'saving', 'success', 'error'
const saveMessage = ref('')
const errors = ref({})

// Watch for prop changes to update form
watch(() => props.groundStation, (newValue) => {
  if (newValue) {
    formData.value = {
      name: newValue.name || '',
      callsign: newValue.callsign || '',
      latitude: newValue.latitude || 0,
      longitude: newValue.longitude || 0,
      altitude_meters: newValue.altitude_meters || 0
    }
  }
}, { immediate: true })

const validateForm = () => {
  errors.value = {}

  if (formData.value.latitude < -90 || formData.value.latitude > 90) {
    errors.value.latitude = 'Latitude must be between -90 and 90 degrees'
  }

  if (formData.value.longitude < -180 || formData.value.longitude > 180) {
    errors.value.longitude = 'Longitude must be between -180 and 180 degrees'
  }

  if (formData.value.altitude_meters < -500 || formData.value.altitude_meters > 10000) {
    errors.value.altitude_meters = 'Altitude must be between -500 and 10000 meters'
  }

  return Object.keys(errors.value).length === 0
}

const saveGroundStation = async () => {
  if (!validateForm()) {
    saveStatus.value = 'error'
    saveMessage.value = 'Please fix the validation errors'
    return
  }

  saveStatus.value = 'saving'
  saveMessage.value = 'Saving...'

  try {
    await api.updateGroundStation(formData.value)
    saveStatus.value = 'success'
    saveMessage.value = 'Ground station updated successfully!'

    // Wait a moment to show success message
    setTimeout(() => {
      emit('save', formData.value)
      emit('close')
      saveStatus.value = null
      saveMessage.value = ''
    }, 1000)
  } catch (error) {
    saveStatus.value = 'error'
    saveMessage.value = `Failed to save: ${error.message}`
  }
}

const resetForm = () => {
  formData.value = {
    name: props.groundStation.name || '',
    callsign: props.groundStation.callsign || '',
    latitude: props.groundStation.latitude || 0,
    longitude: props.groundStation.longitude || 0,
    altitude_meters: props.groundStation.altitude_meters || 0
  }
  errors.value = {}
  saveStatus.value = null
  saveMessage.value = ''
}

const handleClose = () => {
  resetForm()
  emit('close')
}
</script>

<template>
  <TransitionRoot :show="open" as="template">
    <Dialog as="div" class="relative z-50" @close="handleClose">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-gray-900 dark:bg-black bg-opacity-75 dark:bg-opacity-80 transition-opacity" />
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
            <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
              <div class="absolute right-0 top-0 pr-4 pt-4">
                <button
                  type="button"
                  class="rounded-md bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                  @click="handleClose"
                >
                  <XMarkIcon class="h-6 w-6" />
                </button>
              </div>

              <div class="sm:flex sm:items-start">
                <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900 sm:mx-0 sm:h-10 sm:w-10">
                  <MapPinIcon class="h-6 w-6 text-primary-600 dark:text-primary-400" />
                </div>
                <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left flex-1">
                  <DialogTitle as="h3" class="text-lg font-semibold leading-6 text-gray-900 dark:text-gray-100">
                    Edit Ground Station
                  </DialogTitle>
                  <div class="mt-4 space-y-4">
                    <!-- Name -->
                    <div>
                      <label for="gs-name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Station Name
                      </label>
                      <input
                        id="gs-name"
                        v-model="formData.name"
                        type="text"
                        placeholder="e.g., Home Station"
                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>

                    <!-- Callsign -->
                    <div>
                      <label for="gs-callsign" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Callsign (optional)
                      </label>
                      <input
                        id="gs-callsign"
                        v-model="formData.callsign"
                        type="text"
                        placeholder="e.g., W1ABC"
                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>

                    <!-- Latitude -->
                    <div>
                      <label for="gs-latitude" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Latitude (degrees)
                      </label>
                      <input
                        id="gs-latitude"
                        v-model.number="formData.latitude"
                        type="number"
                        step="0.000001"
                        min="-90"
                        max="90"
                        class="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        :class="errors.latitude ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'"
                      />
                      <p v-if="errors.latitude" class="mt-1 text-xs text-red-600 dark:text-red-400">{{ errors.latitude }}</p>
                      <p v-else class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        North is positive, South is negative (-90 to 90)
                      </p>
                    </div>

                    <!-- Longitude -->
                    <div>
                      <label for="gs-longitude" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Longitude (degrees)
                      </label>
                      <input
                        id="gs-longitude"
                        v-model.number="formData.longitude"
                        type="number"
                        step="0.000001"
                        min="-180"
                        max="180"
                        class="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        :class="errors.longitude ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'"
                      />
                      <p v-if="errors.longitude" class="mt-1 text-xs text-red-600 dark:text-red-400">{{ errors.longitude }}</p>
                      <p v-else class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        East is positive, West is negative (-180 to 180)
                      </p>
                    </div>

                    <!-- Altitude -->
                    <div>
                      <label for="gs-altitude" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Altitude (meters above sea level)
                      </label>
                      <input
                        id="gs-altitude"
                        v-model.number="formData.altitude_meters"
                        type="number"
                        step="1"
                        min="-500"
                        max="10000"
                        class="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        :class="errors.altitude_meters ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'"
                      />
                      <p v-if="errors.altitude_meters" class="mt-1 text-xs text-red-600 dark:text-red-400">{{ errors.altitude_meters }}</p>
                      <p v-else class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Elevation above mean sea level (-500 to 10000m)
                      </p>
                    </div>

                    <!-- Status Message -->
                    <div
                      v-if="saveStatus && saveStatus !== 'saving'"
                      class="p-3 rounded-md"
                      :class="{
                        'bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-300': saveStatus === 'success',
                        'bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-300': saveStatus === 'error'
                      }"
                    >
                      <p class="text-sm">{{ saveMessage }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse gap-2">
                <button
                  type="button"
                  class="inline-flex w-full justify-center rounded-md bg-primary-600 dark:bg-primary-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-700 dark:hover:bg-primary-600 sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                  @click="saveGroundStation"
                  :disabled="saveStatus === 'saving'"
                >
                  {{ saveStatus === 'saving' ? 'Saving...' : 'Save' }}
                </button>
                <button
                  type="button"
                  class="mt-3 inline-flex w-full justify-center rounded-md bg-white dark:bg-gray-700 px-4 py-2 text-sm font-semibold text-gray-900 dark:text-gray-100 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 sm:mt-0 sm:w-auto"
                  @click="resetForm"
                >
                  Reset
                </button>
                <button
                  type="button"
                  class="mt-3 inline-flex w-full justify-center rounded-md bg-white dark:bg-gray-700 px-4 py-2 text-sm font-semibold text-gray-900 dark:text-gray-100 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 sm:mt-0 sm:w-auto"
                  @click="handleClose"
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
