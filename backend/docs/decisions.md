# Decisions log

Non-obvious choices, and why, so they don't get silently reverted or
relitigated in a future project cloned from this template.

## Chart.js for charts

The project has no build step and loads everything from CDN. Chart.js was
kept (rather than switching to D3/ECharts/Recharts) because it's lightweight,
needs no bundler, and already covers the bar/line charts `ChartDataMapper`
feeds it. Reach for something heavier only if a page needs a chart type
Chart.js can't do.

## Tabler evaluated as a UI widget library — kept isolated

`/customers` (`customers.html`, `CustomersController`) is a **spike**, not a
recommendation to migrate: it loads `@tabler/core` (CSS + JS) from its own
CDN links, completely independent of `fragments/head.html` /
`fragments/scripts.html`.

This was deliberate, not an oversight: `theme.css` re-points Bootstrap's own
CSS variables (`--bs-primary`, spacing scale, etc.) to this project's theme.
Tabler is itself a Bootstrap fork that redefines many of the same component
classes (`.card`, `.btn`, `.table`...). Loading both on one page, or loading
Tabler CSS from the shared `fragments/head.html`, would make Tabler's rules
fight `theme.css` globally — including on `/dashboard` and `/orders`, which
never asked for it. Keeping it on a standalone page with its own document
avoids that entirely.

Consequence: `/customers` cannot use `FragmentAwareView` or the shared
fragments (see [architecture.md](architecture.md)), and its sidebar link uses
`data-full-reload="true"` to opt out of the SPA fetch-swap navigation in
`dashboard.js` — otherwise a fetch response containing a whole second
`<html>` document would get spliced into `#page-content` on other pages.

**If Tabler is adopted for real**, the right move is to replace
`fragments/head.html` / `fragments/scripts.html` and `theme.css` wholesale
(not run both systems side by side), rebuild the Bootstrap-based pages'
markup against Tabler's component classes, and then delete the
`data-full-reload` special-case since every page would share one framework
again.

`/customers` has since grown into the running reference for "what Tabler
component looks like": every card carries a small `.widget-label` caption
naming the Tabler widget it demonstrates (Stat Card, Progress bars, Timeline,
Avatar List, Data Table, Dropdown Menu, Empty State, Modal + Form). Add the
label to any new widget added there so the page keeps working as a lookup
table, not just a pile of examples.

## Every GUI feature gets a matching REST endpoint

Per a standing project requirement, a GUI feature isn't done until CLI/non-
browser clients can do the same thing via JSON. `CustomerApiController`
(`/api/customers`, GET + POST) is the first instance of this: it exists only
because the "Add Customer" modal on `/customers` was added and needed a JSON
counterpart, not because customers specifically needed an API. Follow the
same pattern for other GUI mutations as they're added (e.g. `OrderController`
doesn't have one yet — add `/api/orders` if/when that's touched next).

## Sidebar hide/show

The hamburger toggle button and its `sidebar-collapsed` class wiring already
existed in `navbar.html` / `dashboard.js` before it had any effect outside a
sub-992px mobile layout. Desktop collapse was added as a second, non-
overlapping `min-width` media query reusing the same class rather than
introducing a new one — see [design-system.md](design-system.md) for why the
same class means opposite things on each side of the breakpoint.
