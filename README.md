# 🗺️ Location Journal

A Progressive Web App (PWA) built with React that lets you capture moments with photos, location tags, and notes. All data is stored on-device using IndexedDB (via Dexie.js), making the app work fully offline after the first visit.

## Features

- **Journal Entries** — Create, read, update, and delete entries with title, mood, and notes
- **Camera API** — Capture photos directly from your device camera or choose from your gallery
- **Geolocation API** — Tag entries with your current GPS location, with automatic reverse geocoding (human-readable address via OpenStreetMap Nominatim)
- **On-Device Storage** — All data persists in IndexedDB via Dexie.js — survives app restarts and works offline
- **Progressive Web App** — Installable on Android/iOS/desktop, works offline via a custom service worker
- **Search** — Filter entries by title, notes, or location
- **Responsive design** — Mobile-first, works seamlessly on phone and desktop

---

## Requirements

| Tool    | Version   |
|---------|-----------|
| Node.js | ≥ 18.0.0  |
| npm     | ≥ 9.0.0   |

---

## Installation & Running Locally

### 1. Clone the repository

```bash
git clone https://github.com/Summerbey/Dynamic-Web-Technologies.git
cd location-journal
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

The app will be available at **http://localhost:5173**

### 4. Build for production

```bash
npm run build
```

The production-ready files are output to the `dist/` directory.

### 5. Preview the production build locally

```bash
npm run preview
```

---

## Deployment (Vercel)

The live app is deployed at: **[https://location-journal.vercel.app](https://location-journal.vercel.app)**

> Direct production URL: https://location-journal-b8l6rs5nh-summers-projects-f49e2af7.vercel.app

To deploy your own copy:

```bash
npm install -g vercel
vercel --prod
```

Or drag and drop the `dist/` folder at [vercel.com/new](https://vercel.com/new).

---

## Project Structure

```
location-journal/
├── public/
│   ├── manifest.json          # PWA web app manifest
│   ├── sw.js                  # Service worker (offline caching)
│   └── icons/                 # PWA icons (192x192, 512x512)
├── src/
│   ├── db.js                  # Dexie.js IndexedDB schema
│   ├── App.jsx                # Root component — view routing + CRUD logic
│   ├── App.css                # All styles (responsive, mobile-first)
│   └── components/
│       ├── EntryForm.jsx      # New/Edit entry form
│       ├── EntryCard.jsx      # Entry list card
│       ├── EntryDetail.jsx    # Full entry view
│       ├── CameraCapture.jsx  # Camera API integration
│       └── LocationCapture.jsx# Geolocation API integration
├── index.html                 # App shell HTML with PWA meta tags
├── vite.config.js             # Vite build config
└── package.json
```

---

## How to Use the App

### Adding an Entry
1. Tap **+ New Entry** (or the blue **+** floating button on mobile)
2. Enter a **title** (required)
3. Pick a **mood** emoji
4. Write your **notes**
5. Tap **📷 Open Camera** to take a photo, or **🖼️ Choose from Gallery** to upload one
6. Tap **📍 Tag Location** to capture your current GPS location
7. Tap **Add Entry** to save

### Viewing an Entry
- Tap any card in the list to open the full detail view
- If the entry has a location, tap **Open in Map** to view it on OpenStreetMap

### Editing an Entry
- Tap the **✏️** button on a card, or tap **Edit** inside the detail view

### Deleting an Entry
- Tap the **🗑️** button on a card and confirm the prompt

### Searching
- Use the search bar at the top of the list to filter by title, notes, or location

### Installing as a PWA
- **Android (Chrome):** Tap the browser menu → "Add to Home Screen" or use the **⬇ Install App** banner
- **iOS (Safari):** Tap Share → "Add to Home Screen"
- **Desktop (Chrome/Edge):** Click the install icon in the address bar

---

## Technologies Used

| Technology | Purpose |
|---|---|
| [React 19](https://react.dev/) | UI component framework |
| [Vite 6](https://vite.dev/) | Build tool and dev server |
| [Dexie.js](https://dexie.org/) | IndexedDB wrapper for on-device storage |
| Geolocation API | `navigator.geolocation` — GPS location capture |
| MediaDevices Camera API | `navigator.mediaDevices.getUserMedia()` — live camera |
| Web App Manifest | PWA installability |
| Service Worker | Offline caching and background sync |
| [Nominatim](https://nominatim.openstreetmap.org/) | Free reverse geocoding (no API key required) |

---

## License

MIT
