# Architecture

Spring Boot MVC + Thymeleaf, server-rendered. No frontend build step — all
JS/CSS libraries load from CDN (`<link>`/`<script>` tags in the templates),
and `src/main/resources/static/js/dashboard.js` is hand-written vanilla JS.

## Layout

```
web/         controllers, and small view-layer helpers (FragmentAwareView, PageRegistry)
service/     business logic, returns DTOs
dto/         records passed to Thymeleaf views (StatCard, OrderRow, MonthlyPoint, ...)
domain/      JPA entities
repository/  Spring Data repositories
```

Controllers stay thin: fetch/aggregate via services or repositories, build
DTOs, return a view name. Aggregation that's specific to one page (e.g.
"top 5 customers by order count" in `CustomersController`) is done inline
with streams rather than added to a shared service — only promote it to
`service/` once a second page needs the same aggregation.

## The fragment-aware SPA trick

Every real page (`dashboard.html`, `orders.html`, `elements.html`,
`placeholder.html`) shares the same shell: `fragments/head`, `fragments/sidebar`,
`fragments/navbar`, `fragments/footer`, `fragments/scripts`, wrapping a
`<main id="page-content" th:fragment="content">`. The footer sits outside
that fragment (like the sidebar/navbar) so it doesn't get replaced on every
SPA navigation — it's site-wide chrome, not page content.

`FragmentAwareView.resolve(request, templateName)` checks for the
`X-Requested-With: fetch` header and returns either the full template or just
`templateName :: content`. `dashboard.js` intercepts clicks on sidebar/pagination
links, fetches with that header, and swaps `#page-content.outerHTML` — giving
SPA-style navigation without a JS framework, while every page still works as a
plain server-rendered URL on direct load/refresh.

**This only works if a page shares the same shell.** A page that needs its own
independent `<head>` (different CSS framework, different `<html>` structure)
must opt out — see `CustomersController` / `customers.html` and the
`data-full-reload` note in [decisions.md](decisions.md).

## Charts

`ChartDataMapper` serializes chart data server-side into a single JSON blob
placed on `data-chart` on `#page-content`; `dashboard.js` reads it and builds
Chart.js instances on `initPage()` (called on first load and after every
fragment swap, after destroying the previous chart instances first — Chart.js
otherwise leaks canvases across SPA navigations).
