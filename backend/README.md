# Sample Dashboard Project

A server-rendered admin dashboard built with Spring Boot + Thymeleaf + Bootstrap 5 — no frontend build step, everything loaded from CDN. Meant to double as a **template** for similar projects; see [docs/](docs/README.md) for the architecture and the reasoning behind the less-obvious decisions.

## Running it

```
./gradlew bootRun
```

Then open `http://localhost:8080`. Uses an in-memory H2 database seeded with sample customers/orders on startup (`DataSeeder`).

## Features

### Dashboard (`/dashboard`)
- Stat cards (total sales, orders, average order value, pending orders)
- Revenue and order-count charts (Chart.js), fed by server-side aggregation
- Latest orders table

### Orders (`/orders`)
- Paginated order list with a windowed page-number control (shows up to 10 page buttons centered on the current page, not every page)
- Add/Edit modal with real server-side validation (Bean Validation) — invalid input re-renders just the modal with inline field errors (HTTP 422), not a page reload or a generic alert
- Live updates: creating or updating an order broadcasts over WebSocket to every open browser tab (see **Live notifications** below)
- `/orders/cancelled` deliberately throws, as a live demo of the themed error page rather than a real feature

### Customers (`/customers`)
- A deliberately **isolated** page — loads Tabler (tabler.io) from its own CDN links instead of the shared Bootstrap theme, kept separate so evaluating a different UI library doesn't affect the rest of the app (see [docs/decisions.md](docs/decisions.md))
- Doubles as a running reference for Tabler's widget set: stat cards, progress bars, timeline, stacked avatar list, data table with search + row/card dropdown menus, empty state, and a working Add Customer modal — each card is labelled with the widget it demonstrates
- `/api/customers` (GET/POST) — JSON API mirroring the GUI, per the project's GUI-needs-REST-companion rule

### Global search
- Navbar search box submits to `/search`, matching against order numbers, customer names, and emails
- `/api/search?q=...` — matching JSON API

### Settings (`/settings`)
- Vertical sub-menu (Account / Password / Notifications / Appearance) — standard Bootstrap `list-group` + tab-content pattern
- Appearance tab's dark-mode switch is real, not a demo — it's the same setting as the navbar toggle

### Dark / light theme
- Toggle in the navbar (sun/moon icon) and on the Settings → Appearance tab, kept in sync
- Built on Bootstrap 5.3's native `data-bs-theme="dark"` support (not a hand-rolled dark stylesheet)
- Persisted in `localStorage`, applied before first paint (no flash of light theme on load/navigation)

### Live notifications
- WebSocket (STOMP over SockJS) broadcasts whenever an order is created or updated
- Toast in the bottom-right corner, auto-dismisses after 8s if ignored; clicking it navigates to `/orders` and shows the reason as a dismissible banner
- **Global flow panel** — a collapsible drawer docked to the right edge (floating tab when closed, slides in when clicked) that keeps a running log of recent notifications so nothing is lost once a toast disappears. Built as a generic shell (`setFlowPanelContent()`); notifications are just its first use, not something the shell itself knows about.

### Elements / icon reference (`/orders/pending`)
- Full showcase of every Bootstrap component used in the theme (typography, buttons, badges, alerts, forms, tables, tabs, accordion, modal, pagination)
- All 287 Feather Icons, each with its name, plus a live filter box. Individual SVGs also live locally in `src/main/resources/static/icons/feather/`, with a standalone browsable gallery at `/icons/feather-reference.html`.

### Shared theme (all pages above)
- Pinned app shell — header and footer stay on screen regardless of page length; only the content area scrolls
- Collapsible sidebar (desktop: hides to width 0; mobile: off-canvas overlay)
- Site-wide footer with links
- Faint layered-wave SVG watermark behind the content area
- Themed error page for any unhandled exception (`error.html`, Spring Boot's default error-view convention)

## Project structure

Standard Spring MVC layering (`web` → `service` → `repository`/`domain`), with DTOs for anything passed to a view. See [docs/architecture.md](docs/architecture.md) for the fragment-aware SPA navigation trick that ties it together, and [docs/adding-a-page.md](docs/adding-a-page.md) for the steps to add a new page consistently.

## Knowledge graph

This repo has a [graphify](https://github.com/safishamsi/graphify) knowledge graph in `graphify-out/` (`graph.html`, `GRAPH_REPORT.md`, `graph.json`). Run `graphify query "<question>"` to explore it, or `/graphify --update` to refresh it after significant changes.
