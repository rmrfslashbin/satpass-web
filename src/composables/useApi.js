import { ref } from 'vue'

const API_BASE = window.location.origin

export function useApi() {
  const loading = ref(false)
  const error = ref(null)

  const handleResponse = async (response) => {
    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.error || 'Unknown error')
    }
    return data
  }

  const getSatellites = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await fetch(`${API_BASE}/api/v1/satellites`)
      return await handleResponse(response)
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const getBookmarkedSatellites = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await fetch(`${API_BASE}/api/v1/satellites/bookmarked`)
      return await handleResponse(response)
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const addSatellite = async (noradId) => {
    loading.value = true
    error.value = null
    try {
      const response = await fetch(`${API_BASE}/api/v1/satellites/${noradId}`, {
        method: 'POST'
      })
      return await handleResponse(response)
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const removeSatellite = async (noradId) => {
    loading.value = true
    error.value = null
    try {
      const response = await fetch(`${API_BASE}/api/v1/satellites/${noradId}`, {
        method: 'DELETE'
      })
      return await handleResponse(response)
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const bookmarkSatellite = async (noradId) => {
    loading.value = true
    error.value = null
    try {
      const response = await fetch(`${API_BASE}/api/v1/satellites/${noradId}/bookmark`, {
        method: 'POST'
      })
      return await handleResponse(response)
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const unbookmarkSatellite = async (noradId) => {
    loading.value = true
    error.value = null
    try {
      const response = await fetch(`${API_BASE}/api/v1/satellites/${noradId}/bookmark`, {
        method: 'DELETE'
      })
      return await handleResponse(response)
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const getCatalogGroups = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await fetch(`${API_BASE}/api/v1/catalog/groups`)
      return await handleResponse(response)
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const searchSatellites = async (query) => {
    loading.value = true
    error.value = null
    try {
      const response = await fetch(`${API_BASE}/api/v1/catalog/search?q=${encodeURIComponent(query)}`)
      return await handleResponse(response)
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const getSystemStats = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await fetch(`${API_BASE}/api/v1/stats`)
      return await handleResponse(response)
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    getSatellites,
    getBookmarkedSatellites,
    addSatellite,
    removeSatellite,
    bookmarkSatellite,
    unbookmarkSatellite,
    getCatalogGroups,
    searchSatellites,
    getSystemStats
  }
}
