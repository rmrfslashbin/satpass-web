<script setup>
import { useTheme } from '../composables/useTheme'
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import { SunIcon, MoonIcon, ComputerDesktopIcon } from '@heroicons/vue/24/outline'

const { theme, setTheme } = useTheme()

const themes = [
  { value: 'light', label: 'Light', icon: SunIcon },
  { value: 'dark', label: 'Dark', icon: MoonIcon },
  { value: 'auto', label: 'Auto', icon: ComputerDesktopIcon }
]

const currentThemeIcon = () => {
  const current = themes.find(t => t.value === theme.value)
  return current ? current.icon : ComputerDesktopIcon
}
</script>

<template>
  <Menu as="div" class="relative">
    <MenuButton class="flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all
      dark:border-accent-blue dark:hover:border-accent-blue/80 dark:bg-slate-900/50 dark:text-accent-blue
      border-mission-500 hover:border-mission-600 bg-white text-mission-700
      hover:shadow-lg">
      <component :is="currentThemeIcon()" class="h-5 w-5" />
      <span class="hidden sm:inline font-mono text-sm">{{ theme }}</span>
    </MenuButton>

    <MenuItems class="absolute right-0 mt-2 w-48 origin-top-right rounded-lg shadow-2xl ring-1
      dark:bg-slate-900 dark:ring-slate-500/50
      bg-white ring-gray-200
      overflow-hidden">
      <MenuItem
        v-for="themeOption in themes"
        :key="themeOption.value"
        v-slot="{ active }"
      >
        <button
          @click="setTheme(themeOption.value)"
          class="flex w-full items-center gap-3 px-4 py-3 text-sm font-mono transition-colors"
          :class="[
            active
              ? 'dark:bg-slate-800/50 dark:text-slate-300 bg-mission-50 text-mission-800'
              : 'dark:text-gray-300 text-gray-700',
            theme === themeOption.value
              ? 'dark:bg-accent-blue/30 dark:text-accent-blue bg-mission-100 text-mission-700 font-bold'
              : ''
          ]"
        >
          <component :is="themeOption.icon" class="h-5 w-5" />
          <span>{{ themeOption.label }}</span>
        </button>
      </MenuItem>
    </MenuItems>
  </Menu>
</template>
