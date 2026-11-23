# Design system (`theme.css`)

The whole main theme is Bootstrap 5.3 loaded from CDN, retargeted with CSS
custom properties in `theme.css` — no Sass build. Two mechanisms do the
retheming:

## Colors

`:root` defines app-level tokens (`--primary`, `--success`, ...) and then
re-points Bootstrap's own variables at them (`--bs-primary: var(--primary)`,
etc.), so stock Bootstrap components (buttons, badges, focus rings) pick up
the theme automatically. To change the palette, edit the `:root` block only —
don't chase down individual `.btn-primary` overrides.

## Density (font size / spacing)

Bootstrap's spacing and type scale is `rem`-based off the root `<html>`
font-size. `theme.css` sets:

```css
html { font-size: 87.5%; }
```

which scales every `rem`-based Bootstrap value (headings, card padding, gap
utilities, badge padding) down uniformly to a denser, more enterprise-data-grid
feel, without hand-tuning every component. If a future design pass wants a
different density, change this one value first and see how far it gets before
touching individual component rules. (Component-level overrides for
`.card-body`, `.stat-value`, `.orders-table th`, etc. still exist below it in
`theme.css` for the custom classes that aren't plain Bootstrap.)

## Pinned app shell (header/footer always visible)

`.wrapper` is a fixed `height: 100vh` flex row (not `min-height`), so it never
grows with content. Inside `.main-content`, `.topnav` and `.site-footer` are
`flex-shrink: 0` (fixed to their natural height) and `.content-area` is
`flex: 1; min-height: 0; overflow-y: auto` — it's the only region that
actually scrolls, so the header and footer stay on screen no matter how long
a page's content is. `.sidebar` scrolls independently the same way
(`overflow-y: auto`) if its nav list ever grows taller than the viewport.

The `min-height: 0` on `.content-area` matters — without it, a flex item
won't shrink below its content's natural size, so it would grow instead of
scrolling and silently break this whole layout. Keep that in mind if you
restructure `.main-content`'s children.

## Sidebar collapse

`.sidebar-toggle` (in `fragments/navbar.html`) toggles `.sidebar-collapsed` on
`.wrapper` — already wired up in `dashboard.js`. The same class means two
different things depending on viewport, handled by two separate, non-
overlapping media queries in `theme.css`:

- `max-width: 992px` — sidebar defaults to hidden (off-canvas overlay);
  `.sidebar-collapsed` reveals it.
- `min-width: 993px` — sidebar defaults to visible; `.sidebar-collapsed`
  collapses it to `width: 0`.

State isn't persisted (resets on full page reload) — add `localStorage` if a
project needs it to stick.
