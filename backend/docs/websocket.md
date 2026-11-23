# WebSocket

STOMP over WebSocket (SockJS fallback), configured once in `WebSocketConfig`.
There are two independent push patterns in the app — a broadcast and a
per-visitor queue — built for different reasons. Don't reach for the second
one unless a feature genuinely needs to avoid telling every open tab.

## Pattern 1: broadcast — `/topic/orders`

Used for order created/updated notifications (`OrderServiceImpl.notify()`).
Every connected browser gets every message; there's no concept of "is this
about me." That's intentional — it's meant to feel like a shared team
dashboard where everyone watches the same order activity, not a per-user
inbox. Client side, `initLiveNotifications()` in `dashboard.js` subscribes
once and always shows a toast (`showNotificationToast`), regardless of what
page is open.

## Pattern 2: per-visitor queue — `/user/queue/orders/flow`

Used by the `/orders/flow` BPMN demo's "Next" button. Clicking Next doesn't
do a request/response fetch for the result — it publishes a STOMP message to
`/app/orders/flow/advance`, and `ADVANCE_DELAY_SECONDS` (15s) later
(simulating a slow real step) `OrderFlowSocketController` pushes the new
status back, but only to the browser session that asked for it.

### Who is "the caller"?

`SecurityConfig` now requires a logged-in session for everything, `/ws/**`
included, so `convertAndSendToUser(user, ...)` targets the real
authenticated username. No custom identity plumbing is needed for this:
`WebSocketConfig` registers a plain `addEndpoint("/ws").withSockJS()` with
no custom `HandshakeHandler`, because the *default* one already resolves the
STOMP session's `Principal` from `HttpServletRequest.getUserPrincipal()` —
which Spring Security populates automatically the moment the browser has a
valid session cookie.

(An earlier version of this faked an anonymous per-`HttpSession` visitor id,
back when there was no login at all — see `security.md` for why real auth
replaced that instead of layering on top of it.)

Because it's a login-scoped identity (not, say, one minted fresh per
WebSocket connection), every tab logged in as the same user shares one
identity — `convertAndSendToUser` delivers to all of them, not just the tab
that clicked Next. That reads as "notify me," where "me" is this account,
not this one tab.

**`/logout` signs out of this identity**: Spring Security's `LogoutFilter`
invalidates the session and clears the auth cookie, then redirects to
`/sign-out` (`SignOutController`) for the confirmation page. The next login
re-authenticates as whichever user signs in — there's no separate identity
record to clean up beyond the session itself.

### Broker config gotcha

`WebSocketConfig.configureMessageBroker` enables **both** `/topic` and
`/queue` as simple-broker prefixes. `/queue` is easy to forget: Spring
rewrites `convertAndSendToUser(id, "/queue/x", payload)` internally to a
session-specific `/queue/x-user<sessionId>` destination, and the broker only
relays it if `/queue` is a registered prefix. Without it, `convertAndSendToUser`
silently sends nowhere — no error, just no message.

### Client-side: one shared connection, not one per feature

`dashboard.js` creates a single `stompClient` (module-level, in
`initLiveNotifications()`, which itself only runs once via the app's
one-time `DOMContentLoaded` hook — see `architecture.md`). It survives every
SPA navigation, since only `#page-content` is swapped.

A page-specific feature that wants to piggyback on that connection (like
`/orders/flow`) must **not** reassign `stompClient.onConnect` — that would
silently break the global notification subscription set up in
`initLiveNotifications()`. Instead it calls `whenStompConnected(callback)`,
which either runs the callback immediately (already connected) or queues it
to run once `onConnect` fires.

`initOrderFlow()` also guards its subscription with a module-level
`orderFlowSubscribed` flag so it only subscribes to
`/user/queue/orders/flow` **once**, ever — not once per visit to the page.
Re-visiting the page just re-points `orderFlowPageHandler` (also
module-level) to the current page's container/viewer. Without that guard,
visiting the page more than once in a session would stack up duplicate
subscriptions, each holding a stale, detached `container` reference from an
earlier visit — the fixed destination name (`/user/queue/orders/flow`, unlike
the broadcast topic) makes every subscription fire for every message.

### Page-match-or-toast fallback

When a delayed status arrives, the handler checks
`document.body.contains(container)`:

- **Still on `/orders/flow`** — the container is still attached, so the
  BPMN diagram repaints in place via `canvas.addMarker`/`removeMarker`.
- **Navigated away** (via SPA nav — the JS/WebSocket connection persists) —
  the container is detached, so it falls back to `showNotificationToast(...)`
  with a link back to `/orders/flow`, same as the broadcast pattern's toast.

**Known gap**: this only covers navigating away *within the same tab* via the
SPA fetch-nav. A hard browser reload to a different page tears down the JS
context (and the subscription with it) before the delay is up — the
server-side push still fires (the scheduled task and the login session
survive a page reload, since they're independent of any one WebSocket
connection), but nothing is listening client-side to turn it into a toast
when it arrives.

### Debugging

- Server: `OrderFlowSocketController` logs (`@Slf4j`) when an advance is
  requested, whether it found a `Principal`, and when it actually pushes.
- Client: `stompClient`'s `onStompError` callback logs broker-side STOMP
  ERROR frames to the console — check it first if a subscribed feature stops
  receiving pushes silently.
