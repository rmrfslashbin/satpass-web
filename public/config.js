// satpass Web UI Configuration
// This file can be edited after deployment to point to your API server
// without needing to rebuild the application.

window.satpassConfig = {
  // API server endpoint
  // Examples:
  //   - Same host: window.location.origin
  //   - Different host: 'http://api.example.com:8080'
  //   - With path: 'https://example.com/satpass-api'
  apiEndpoint: window.location.origin,

  // Optional: API request timeout in milliseconds
  apiTimeout: 30000,
}
