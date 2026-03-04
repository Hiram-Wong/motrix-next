<div align="center">
  <h1>Motrix Next</h1>
  <p>A full-featured download manager — rebuilt from the ground up.</p>

  ![Platform](https://img.shields.io/badge/platform-macOS%20%7C%20Windows%20%7C%20Linux-lightgrey.svg)
  ![License](https://img.shields.io/badge/license-MIT-blue.svg)
</div>

---

## Background

Motrix Next stands on the shoulders of [Motrix](https://github.com/agalwood/Motrix) — a wonderful open-source download manager created by [agalwood](https://github.com/agalwood) and shaped by many talented contributors over the years. We are deeply grateful for their work, which laid the foundation and inspired this project.

The original Motrix codebase provided invaluable reference material, including its aria2 RPC integration patterns, comprehensive i18n translations across 25+ languages, and the thoughtful download management logic that made the tool so reliable. Without these contributions, Motrix Next would not exist.

### Why a Rewrite

The legacy stack — Electron as the runtime, Vue 2 with Vuex for state management, and Element UI for components — served Motrix well for years. However, as the ecosystem evolved, maintaining and extending the codebase became increasingly challenging. Rather than continuing to patch on top of it, we chose to rebuild from the ground up with a modern architecture, while carrying forward the core experience and design philosophy that made Motrix great.

### What Was Rewritten

Nearly the entire application has been rewritten:

- **Runtime layer** — Migrated from Electron to **Tauri 2** (Rust-based), reducing bundle size from ~180 MB to ~15 MB and idle memory from ~200 MB to ~40 MB
- **Frontend** — Rewritten from Vue 2 + Vuex + Element UI to **Vue 3 Composition API + Pinia + Naive UI**
- **Language** — Converted the full codebase from JavaScript to **TypeScript** for type safety
- **Styling** — Replaced SCSS + Element theme overrides with **vanilla CSS + CSS custom properties**
- **Backend integration** — Replaced Node.js `child_process` with **Tauri sidecar** for managing the aria2 engine
- **Build pipeline** — Switched from electron-builder to **Vite + Cargo**
- **State management** — Rebuilt all stores using Pinia with the Composition API pattern
- **UI components** — Every view, dialog, and panel has been redesigned and reimplemented

Version numbering has been reset to reflect this clean break.

### What Was Preserved

- Full aria2 RPC protocol support (HTTP, FTP, BitTorrent, Magnet)
- Comprehensive i18n system with 25+ languages (translations carried over with gratitude)
- User-Agent configuration, tracker management, and advanced download settings
- The overall UX flow and design philosophy that users know and love

## Features

- **Multi-protocol downloads** — HTTP, FTP, BitTorrent, Magnet links
- **BitTorrent** — Selective file download, DHT, peer exchange, encryption
- **Tracker management** — Auto-sync from community tracker lists
- **Concurrent downloads** — Up to 10 tasks with configurable thread count
- **Speed control** — Global and per-task upload/download limits
- **System tray** — Real-time speed display in the menu bar (macOS)
- **Dark mode** — Native dark theme as default
- **Task management** — Pause, resume, delete with file cleanup, batch operations
- **Download protocols** — Register as default handler for magnet and thunder links
- **Notifications** — System notifications on task completion
- **Lightweight** — Tauri-based, minimal resource footprint

## Installation

Download the latest release from [GitHub Releases](https://github.com/AnInsomniacy/motrix-next/releases).

## Development

### Prerequisites

- [Rust](https://rustup.rs/) (latest stable)
- [Node.js](https://nodejs.org/) >= 18
- [pnpm](https://pnpm.io/)

### Setup

```bash
# Clone the repository
git clone https://github.com/AnInsomniacy/motrix-next.git
cd motrix-next

# Install frontend dependencies
pnpm install

# Start development server (launches Tauri + Vite)
pnpm tauri dev

# Build for production
pnpm tauri build
```

### Project Structure

```
motrix-next/
├── src/                    # Frontend (Vue 3 + TypeScript)
│   ├── api/                # Aria2 RPC client
│   ├── components/         # Vue components
│   ├── shared/             # Constants, utilities, i18n locales
│   ├── stores/             # Pinia state management
│   └── views/              # Page-level views
├── src-tauri/              # Backend (Rust + Tauri)
│   ├── src/                # Tauri commands, engine management, tray/menu
│   └── binaries/           # Aria2 sidecar binary
└── package.json
```

## Tech Stack

| Layer | Technology |
|-------|------------|
| Runtime | [Tauri 2](https://v2.tauri.app/) |
| Frontend | [Vue 3](https://vuejs.org/) (Composition API) |
| State | [Pinia](https://pinia.vuejs.org/) |
| UI | [Naive UI](https://www.naiveui.com/) |
| Language | TypeScript + Rust |
| Build | Vite + Cargo |
| Engine | [Aria2](https://aria2.github.io/) |

## Acknowledgements

- [Motrix](https://github.com/agalwood/Motrix) by [agalwood](https://github.com/agalwood) and all its contributors
- [Aria2](https://aria2.github.io/) — the powerful download engine at the core

## License

[MIT](https://opensource.org/licenses/MIT) — Copyright (c) 2025-present AnInsomniacy
