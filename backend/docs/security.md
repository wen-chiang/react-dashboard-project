# Security

`SecurityConfig` adds Spring Security with one hardcoded in-memory demo user
(`admin` / `admin123`) — a real starting point, not a toy: it exercises the
actual login page / session / CSRF / logout machinery, just with the
simplest possible user store. Swap `InMemoryUserDetailsManager` for a real
`UserDetailsService` backed by a user table before this becomes a real
deployment; nothing else in this file needs to change to do that.

## Two filter chains

The browser UI and the REST API authenticate differently, so there are two
`SecurityFilterChain` beans in `SecurityConfig`:

- **`/api/**`** — HTTP Basic, CSRF disabled. A plain
  `curl -u admin:admin123 http://localhost:8080/api/customers` keeps
  working, per the standing "every GUI feature needs a CLI-usable REST
  counterpart" rule (`decisions.md`). CSRF is specifically a
  browser-cookie problem (a hostile page riding a victim's existing session);
  it doesn't apply to a client that sends credentials explicitly on every
  request.
- **Everything else** — form login (`loginPage("/login")`, `LoginController`
  + `login.html`), session cookie, and CSRF enabled — exactly the scenario
  CSRF protection exists for. `/ws/**` still requires login (so the
  WebSocket Principal is the real logged-in user — see `websocket.md`) but
  is CSRF-exempt, since SockJS's fallback transports and the WebSocket
  upgrade itself can't carry a token.

## CSRF token wiring

Every state-changing `<form>` needs a hidden `_csrf` input:
`orders.html` (`#orderForm`, including the fragment returned on a 422
validation re-render — same fragment, so one input covers both), `customers.html`'s
Add Customer form, the sidebar's Sign Out form, and `login.html` itself.
The one JS-driven mutation (`dashboard.js`'s order-form `fetch()`) needed no
change: it builds its body from `new FormData(form)`, which already reads
every field in the form — including that hidden input — automatically.

## Response headers

Comes free now: Spring Security's `HeaderWriterFilter` sets
`X-Content-Type-Options`, `X-Frame-Options`, and `Referrer-Policy` by
default on the web filter chain. Only `Content-Security-Policy` needed
adding explicitly (`.headers(headers -> headers.contentSecurityPolicy(...))`
in `SecurityConfig`) — its allowlist is just `https://cdn.jsdelivr.net`,
confirmed by grepping every template/static asset for external hosts, plus
`'unsafe-inline'` for the inline dark-mode script in `fragments/head.html`
and various `style="..."` attributes.

## `/logout` is `POST`, not `GET`

Handled entirely by Spring Security's `LogoutFilter` now (`logoutUrl`,
invalidates the session, clears the auth cookie) — it always required
`POST` by default, which also happens to close the "state-changing GET"
anti-pattern a hand-rolled version could have gotten wrong. `logoutSuccessUrl("/sign-out")`
points at a small `SignOutController` that just renders the confirmation
page; there's no cookie/session code left to hand-maintain.

## `server.error.include-message`

Still defaults to `always` — the themed error page and the
`/orders/cancelled` trigger are deliberate demo features that display the
real exception text. `application.yaml` has a second `prod` document that
flips it to `never`; run with `spring.profiles.active=prod` before any real
deployment, or raw exception messages leak to authenticated users.

## XSS

Audited every `innerHTML` write in `dashboard.js`. The one generic sink left
(`setFlowPanelContent`) and its callers already pass every dynamic value —
notification messages/URLs, customer names, pipeline/order-flow element
descriptions — through `escapeHtml()` before interpolation. Nothing needed
fixing; keep doing this whenever a new feature builds HTML via string
concatenation instead of `textContent`.
