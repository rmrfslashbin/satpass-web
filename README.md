# satpass-web

Web interface for the satpass satellite tracking application.

## Tech Stack

- **Vue 3** - Progressive JavaScript framework
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **HeadlessUI** - Unstyled accessible UI components
- **Heroicons** - Beautiful hand-crafted SVG icons

## Development

```bash
# Install dependencies
npm install

# Start dev server (proxies to API at localhost:8080)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## API Integration

The Vite dev server is configured to proxy API requests to `http://localhost:8080`. Make sure the satpass API server is running before starting the web interface:

```bash
# In the main satpass directory
./bin/satpass api
```

Then access the web interface at `http://localhost:5173`

## Features

- **Browse** - Browse satellite catalog by groups
- **Search** - Search satellites by name or NORAD ID
- **Tracked** - View and manage tracked satellites
- **Bookmarked** - Quick access to favorite satellites
- **Stats** - System statistics and health monitoring

## Project Structure

```
src/
├── components/       # Reusable Vue components
├── composables/      # Vue composables (API client, etc.)
├── views/           # Page-level components
├── App.vue          # Root component
├── main.js          # Application entry point
└── style.css        # Global styles (Tailwind imports)
```
