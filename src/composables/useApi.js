import { ref } from 'vue'

// Get API endpoint with priority: localStorage > runtime config > same origin
const API_BASE = localStorage.getItem('satpass_api_endpoint') ||
  window.satpassConfig?.apiEndpoint ||
  window.location.origin

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

  const getSatellites = async ({ limit = 0, offset = 0 } = {}) => {
    loading.value = true
    error.value = null
    try {
      const params = new URLSearchParams()
      if (limit > 0) {
        params.append('limit', limit.toString())
        params.append('offset', offset.toString())
      }
      const url = `${API_BASE}/api/v1/satellites${params.toString() ? '?' + params.toString() : ''}`
      const response = await fetch(url)
      return await handleResponse(response)
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const getBookmarkedSatellites = async ({ limit = 0, offset = 0 } = {}) => {
    loading.value = true
    error.value = null
    try {
      const params = new URLSearchParams({
        bookmarked: 'true'
      })
      if (limit > 0) {
        params.append('limit', limit.toString())
        params.append('offset', offset.toString())
      }
      const url = `${API_BASE}/api/v1/satellites?${params.toString()}`
      const response = await fetch(url)
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

  const searchSatellites = async (query, { limit = 0, offset = 0 } = {}) => {
    loading.value = true
    error.value = null
    try {
      const params = new URLSearchParams({
        q: query
      })
      if (limit > 0) {
        params.append('limit', limit.toString())
        params.append('offset', offset.toString())
      }
      const url = `${API_BASE}/api/v1/catalog/search?${params.toString()}`
      const response = await fetch(url)
      return await handleResponse(response)
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const getCatalogStats = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await fetch(`${API_BASE}/api/v1/catalog/stats`)
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

  const getSatellite = async (noradId) => {
    loading.value = true
    error.value = null
    try {
      const response = await fetch(`${API_BASE}/api/v1/satellites/${noradId}`)
      return await handleResponse(response)
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const getPasses = async (noradId, { days = 7, minEl = 0, step = 60, format = 'json' } = {}) => {
    loading.value = true
    error.value = null
    try {
      const params = new URLSearchParams({
        days: days.toString(),
        min_el: minEl.toString(),
        step: step.toString(),
        format
      })
      const response = await fetch(`${API_BASE}/api/v1/satellites/${noradId}/passes?${params}`)

      // Handle different response formats
      if (format === 'csv') {
        return await response.text()
      } else if (format === 'ical' || format === 'ics') {
        return await response.text()
      } else {
        return await handleResponse(response)
      }
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const getTLE = async (noradId) => {
    loading.value = true
    error.value = null
    try {
      const response = await fetch(`${API_BASE}/api/v1/satellites/${noradId}/tle`)
      return await handleResponse(response)
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const getCatalogGroup = async (groupName, { limit = 0, offset = 0 } = {}) => {
    loading.value = true
    error.value = null
    try {
      const params = new URLSearchParams()
      if (limit > 0) {
        params.append('limit', limit.toString())
        params.append('offset', offset.toString())
      }
      const url = `${API_BASE}/api/v1/catalog/groups/${encodeURIComponent(groupName)}${params.toString() ? '?' + params.toString() : ''}`
      const response = await fetch(url)
      return await handleResponse(response)
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const getCatalogEntry = async (noradId) => {
    loading.value = true
    error.value = null
    try {
      const response = await fetch(`${API_BASE}/api/v1/catalog/satellites/${noradId}`)
      return await handleResponse(response)
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const getConfig = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await fetch(`${API_BASE}/api/v1/config`)
      return await handleResponse(response)
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateGroundStation = async (qth) => {
    loading.value = true
    error.value = null
    try {
      const response = await fetch(`${API_BASE}/api/v1/qth`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(qth)
      })
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
    getSatellite,
    getBookmarkedSatellites,
    addSatellite,
    removeSatellite,
    bookmarkSatellite,
    unbookmarkSatellite,
    getCatalogGroups,
    getCatalogGroup,
    getCatalogEntry,
    getCatalogStats,
    searchSatellites,
    getPasses,
    getTLE,
    getConfig,
    getSystemStats,
    updateGroundStation
  }
}
