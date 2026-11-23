# Adding a new sidebar page

Follow this for any new page that should share the main Bootstrap theme and
SPA-style navigation (see [architecture.md](architecture.md)).

1. **Template** — `src/main/resources/templates/<page>.html`. Copy the shape
   of `orders.html`: `fragments/head`, `fragments/sidebar`, `fragments/navbar`,
   a `<main id="page-content" th:fragment="content">`, then
   `fragments/scripts`.
2. **Controller** — a `@Controller` with `@GetMapping("/your-path")` that
   builds a `Model` and returns `fragmentAwareView.resolve(request, "<page>")`.
   Inject `FragmentAwareView` like the existing controllers do — don't
   hand-roll the fragment/full-page check again.
3. **Sidebar link** — add the `<a>` in `fragments/sidebar.html`, with
   `th:classappend="${activePage == 'your-key'} ? 'active'"` and set
   `model.addAttribute("activePage", "your-key")` in the controller.
4. **No real feature yet?** Don't build a one-off placeholder — add the path
   to `PlaceholderController`'s `@GetMapping` list and an entry in
   `PageRegistry` instead. Remove it from both once the real controller exists
   (see the `/customers` history in git log for an example of that handoff).

## If the page can't share the shell

If a page needs an incompatible CSS framework or document structure (as
`customers.html` currently does — see [decisions.md](decisions.md)), it can't
use `FragmentAwareView` or the shared fragments, and the sidebar link needs
`data-full-reload="true"` so `dashboard.js`'s click-intercept lets the browser
navigate normally instead of trying to fetch-and-swap a fragment into
`#page-content` (which would inject a whole extra `<html>` document).
