# Docs

This repo is meant to be usable as a starting template for similar
server-rendered admin dashboard projects (Spring Boot + Thymeleaf +
Bootstrap). These docs capture the patterns and decisions so a new project
can reuse them instead of re-discovering them.

- [architecture.md](architecture.md) — request flow, the fragment-aware SPA
  navigation trick, and where things live
- [adding-a-page.md](adding-a-page.md) — the concrete steps to add a new
  sidebar page, following the existing pattern
- [design-system.md](design-system.md) — the CSS tokens and density scale in
  `theme.css`, and how to retheme
- [websocket.md](websocket.md) — the two STOMP push patterns (broadcast vs.
  per-visitor queue), and the anonymous session-based identity the latter
  relies on since there's no login
- [security.md](security.md) — what's addressed (headers, logout method,
  error-message exposure, XSS) versus deliberately deferred (auth, CSRF) and
  why
- [decisions.md](decisions.md) — a running log of non-obvious choices and why
  they were made, so they aren't relitigated or silently reverted later
