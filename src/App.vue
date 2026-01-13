<script setup>
import { ref, onMounted } from 'vue'
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/vue'
import { Cog6ToothIcon } from '@heroicons/vue/24/outline'
import { useTheme } from './composables/useTheme'
import BrowseView from './views/BrowseView.vue'
import SearchView from './views/SearchView.vue'
import TrackedView from './views/TrackedView.vue'
import BookmarkedView from './views/BookmarkedView.vue'
import StatsView from './views/StatsView.vue'
import SettingsModal from './components/SettingsModal.vue'
import ThemeSwitcher from './components/ThemeSwitcher.vue'

const { } = useTheme()

const tabs = [
  { name: 'BROWSE', emoji: '🌍' },
  { name: 'SEARCH', emoji: '🔍' },
  { name: 'TRACKED', emoji: '📡' },
  { name: 'BOOKMARKED', emoji: '⭐' },
  { name: 'STATS', emoji: '📊' }
]

const settingsOpen = ref(false)

const handleSave = (newEndpoint) => {
  console.log('Settings saved:', newEndpoint)
}
</script>

<template>
  <div class="min-h-screen transition-colors duration-300
    dark:bg-space-900 dark:bg-stars-pattern bg-gradient-to-br from-gray-50 to-gray-100
    font-sans">

    <!-- Animated header -->
    <header class="sticky top-0 z-40 backdrop-blur-xl
      dark:bg-space-850/95 dark:border-b dark:border-space-700/30
      bg-white/80 border-b border-mission-200/50
      shadow-lg animate-slide-down">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <!-- Logo / Title -->
          <div class="flex items-center gap-3 animate-fade-in">
            <div class="text-4xl">🛰️</div>
            <div>
              <h1 class="text-2xl font-bold font-mono tracking-tight
                dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-accent-blue dark:to-accent-purple
                text-transparent bg-clip-text bg-mission-gradient">
                SATPASS
              </h1>
              <p class="text-xs font-mono
                dark:text-slate-400/70 text-mission-600">
                Satellite Tracking System
              </p>
            </div>
          </div>

          <!-- Controls -->
          <div class="flex items-center gap-3">
            <ThemeSwitcher />
            <button
              @click="settingsOpen = true"
              class="flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all font-mono text-sm
                dark:border-accent-purple dark:hover:border-accent-purple/80 dark:bg-slate-900/50 dark:text-accent-purple dark:hover:shadow-accent-purple/50
                border-mission-500 hover:border-mission-600 bg-white text-mission-700
                hover:shadow-lg"
              title="Settings"
            >
              <Cog6ToothIcon class="h-5 w-5" />
              <span class="hidden sm:inline">CONFIG</span>
            </button>
          </div>
        </div>
      </div>
    </header>

    <main class="container mx-auto px-4 py-8">
      <TabGroup>
        <!-- Tab Navigation -->
        <TabList class="flex gap-2 p-2 rounded-xl overflow-x-auto
          dark:bg-space-850 dark:backdrop-blur
          bg-white/50 backdrop-blur
          shadow-lg">
          <Tab
            v-for="(tab, index) in tabs"
            :key="tab.name"
            v-slot="{ selected }"
            class="flex items-center gap-2 px-4 py-3 rounded-lg font-mono text-sm font-medium
              transition-all duration-200 outline-none whitespace-nowrap
              animate-fade-in"
            :style="{ animationDelay: `${index * 50}ms` }"
            :class="[
              selected
                ? 'dark:bg-gradient-to-r dark:from-accent-blue dark:to-accent-teal dark:text-white dark:shadow-lg dark:shadow-slate-500/50 bg-mission-gradient text-white shadow-lg shadow-mission-500/30'
                : 'dark:text-slate-300 dark:hover:bg-slate-800/50 dark:hover:text-slate-200 text-mission-700 hover:bg-mission-50 hover:text-mission-800'
            ]"
          >
            <span>{{ tab.emoji }}</span>
            <span>{{ tab.name }}</span>
          </Tab>
        </TabList>

        <!-- Tab Panels -->
        <TabPanels class="mt-6">
          <TabPanel class="animate-fade-in">
            <BrowseView />
          </TabPanel>
          <TabPanel class="animate-fade-in">
            <SearchView />
          </TabPanel>
          <TabPanel class="animate-fade-in">
            <TrackedView />
          </TabPanel>
          <TabPanel class="animate-fade-in">
            <BookmarkedView />
          </TabPanel>
          <TabPanel class="animate-fade-in">
            <StatsView />
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </main>

    <!-- Settings Modal -->
    <SettingsModal
      :open="settingsOpen"
      @close="settingsOpen = false"
      @save="handleSave"
    />
  </div>
</template>
