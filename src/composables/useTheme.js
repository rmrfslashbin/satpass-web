import { ref, watch, onMounted } from 'vue'

// Global theme state (shared across all components)
const theme = ref(localStorage.getItem('satpass_theme') || 'auto')
const systemTheme = ref('light')
let initialized = false

// Check system preference
const getSystemTheme = () => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

// Get effective theme (resolving 'auto')
const getEffectiveTheme = () => {
  if (theme.value === 'auto') {
    return systemTheme.value
  }
  return theme.value
}

// Apply theme to document
const applyTheme = () => {
  const effectiveTheme = getEffectiveTheme()

  if (effectiveTheme === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

// Initialize theme system once
const initTheme = () => {
  if (initialized) return

  // Set initial system theme
  systemTheme.value = getSystemTheme()
  applyTheme()

  // Listen for system theme changes
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  const handler = (e) => {
    systemTheme.value = e.matches ? 'dark' : 'light'
    if (theme.value === 'auto') {
      applyTheme()
    }
  }

  mediaQuery.addEventListener('change', handler)

  // Watch theme changes
  watch(theme, (newTheme) => {
    localStorage.setItem('satpass_theme', newTheme)
    applyTheme()
  })

  initialized = true
}

export function useTheme() {
  onMounted(() => {
    initTheme()
  })

  const setTheme = (newTheme) => {
    theme.value = newTheme
  }

  return {
    theme,
    effectiveTheme: getEffectiveTheme,
    setTheme
  }
}
