<script setup>
import { computed } from 'vue'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalItems: {
    type: Number,
    required: true
  },
  itemsPerPage: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['page-change', 'per-page-change'])

const totalPages = computed(() => Math.ceil(props.totalItems / props.itemsPerPage))
const startItem = computed(() => (props.currentPage - 1) * props.itemsPerPage + 1)
const endItem = computed(() => Math.min(props.currentPage * props.itemsPerPage, props.totalItems))

const canGoPrevious = computed(() => props.currentPage > 1)
const canGoNext = computed(() => props.currentPage < totalPages.value)

const previousPage = () => {
  if (canGoPrevious.value) {
    emit('page-change', props.currentPage - 1)
  }
}

const nextPage = () => {
  if (canGoNext.value) {
    emit('page-change', props.currentPage + 1)
  }
}

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    emit('page-change', page)
  }
}

const changePerPage = (event) => {
  const newPerPage = parseInt(event.target.value)
  emit('per-page-change', newPerPage)
  // Reset to page 1 when changing items per page
  emit('page-change', 1)
}

// Generate page numbers to display (max 7 pages with ellipsis)
const pageNumbers = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = props.currentPage

  if (total <= 7) {
    // Show all pages if 7 or fewer
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    // Always show first page
    pages.push(1)

    if (current <= 3) {
      // Near the start
      pages.push(2, 3, 4, '...', total)
    } else if (current >= total - 2) {
      // Near the end
      pages.push('...', total - 3, total - 2, total - 1, total)
    } else {
      // Middle
      pages.push('...', current - 1, current, current + 1, '...', total)
    }
  }

  return pages
})
</script>

<template>
  <div class="flex items-center justify-between px-4 py-3 border-t
    dark:border-cyber-500/30 dark:bg-space-800/30
    border-gray-200 bg-gray-50">
    <!-- Results info -->
    <div class="flex-1 flex items-center justify-between">
      <div>
        <p class="text-sm font-mono
          dark:text-cyber-400 text-gray-700">
          Showing
          <span class="font-bold dark:text-cyber-300 text-gray-900">{{ startItem }}</span>
          to
          <span class="font-bold dark:text-cyber-300 text-gray-900">{{ endItem }}</span>
          of
          <span class="font-bold dark:text-cyber-300 text-gray-900">{{ totalItems }}</span>
          results
        </p>
      </div>

      <!-- Items per page selector -->
      <div class="flex items-center space-x-2">
        <label for="per-page" class="text-sm font-mono
          dark:text-cyber-400 text-gray-700">
          Per page:
        </label>
        <select
          id="per-page"
          :value="itemsPerPage"
          @change="changePerPage"
          class="border rounded px-2 py-1 text-sm font-mono
            dark:bg-space-700 dark:border-cyber-500/50 dark:text-cyber-300
            bg-white border-gray-300 text-gray-900
            focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option :value="10">10</option>
          <option :value="20">20</option>
          <option :value="50">50</option>
          <option :value="100">100</option>
        </select>
      </div>
    </div>

    <!-- Pagination controls -->
    <div class="flex items-center space-x-1 ml-4">
      <!-- Previous button -->
      <button
        @click="previousPage"
        :disabled="!canGoPrevious"
        class="p-2 rounded border font-mono text-sm transition-colors
          dark:border-cyber-500/50 dark:text-cyber-300
          dark:hover:bg-cyber-500/20 dark:disabled:opacity-30 dark:disabled:cursor-not-allowed
          border-gray-300 text-gray-700
          hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="Previous page"
      >
        <ChevronLeftIcon class="h-4 w-4" />
      </button>

      <!-- Page numbers -->
      <div class="flex items-center space-x-1">
        <button
          v-for="(page, index) in pageNumbers"
          :key="index"
          @click="page !== '...' && goToPage(page)"
          :disabled="page === '...'"
          :class="{
            'dark:bg-cyber-500/30 dark:border-cyber-400 dark:text-cyber-200 bg-primary-600 border-primary-700 text-white': page === currentPage,
            'dark:border-cyber-500/50 dark:text-cyber-300 dark:hover:bg-cyber-500/20 border-gray-300 text-gray-700 hover:bg-gray-100': page !== currentPage && page !== '...',
            'dark:text-cyber-400/50 text-gray-400 cursor-default': page === '...'
          }"
          class="px-3 py-1 rounded border font-mono text-sm transition-colors min-w-[2.5rem]"
        >
          {{ page }}
        </button>
      </div>

      <!-- Next button -->
      <button
        @click="nextPage"
        :disabled="!canGoNext"
        class="p-2 rounded border font-mono text-sm transition-colors
          dark:border-cyber-500/50 dark:text-cyber-300
          dark:hover:bg-cyber-500/20 dark:disabled:opacity-30 dark:disabled:cursor-not-allowed
          border-gray-300 text-gray-700
          hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="Next page"
      >
        <ChevronRightIcon class="h-4 w-4" />
      </button>
    </div>
  </div>
</template>
