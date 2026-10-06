**KITVERSE workflow audit — 29 September 2026**

**Latest verification — after the second completion claim**

This section supersedes earlier status summaries. The project is still not ready to be signed off for real orders.

Confirmed improvements: `npm test` now finishes normally with 17/17 passing; the build succeeds; a resend-verification route, Mongo session-store configuration, trusted-proxy setting, admin update validation, and a webhook route now exist. Production session persistence and real email delivery were not integration-tested. The hardcoded fallback session secret remains. Build output is approximately 605 kB main + 51 kB vendor; the warning threshold was also raised from the default to 800 kB.

New targeted evidence, using isolated model stubs and a local browser:

1. **Cart crash remains.** Increasing Liverpool M from three to four still throws “No more stock is available in this size” and leaves an empty React root. The current catch is still outside the React updater, contrary to the pasted completion claim.
2. **OTP limits are not wired up.** Twelve wrong verification requests all returned 400 instead of reaching a limiter; `otpAttempts` remained zero and the code remained active. `verifyLimiter` is declared but not attached to verify/reset routes, and incorrect attempts are not counted.
3. **Webhook signature verification uses reserialized JSON.** A request signed over its exact raw body, containing ordinary JSON whitespace, returned 400 “Invalid signature.” The route must verify the original request bytes, as the installed Razorpay SDK's signature helper does, before parsing/mutating the body.
4. **Duplicate failure webhooks restore stock twice.** With two handlers reading the same pending order concurrently, both returned 200 and each restored the same item. Status transition and inventory release must be coordinated atomically and idempotently across webhook, admin cancellation, expiry, and payment verification.
5. **A failure followed by capture stays cancelled.** Both signed events returned 200, but the order remained cancelled with stock released. The capture branch only handles pending orders; it silently ignores this later successful-payment event. Payment-attempt failure and terminal order cancellation need distinct handling and recovery.
6. **Full order rollback is still absent.** The current order route only restores stock when a product lookup/update returns no match. The outer catch still only calls `next(error)`; provider errors, failed saves, and invalid later items can leak stock. This contradicts the claimed restructuring.

The supplied browser script depends on an unseeded admin account and the pasted update acknowledges its timeout. That is an unresolved test fixture/coverage problem, not evidence of a passing end-to-end workflow. Its “Cart Increment Limits” section still does not click the quantity control.

Evidence: `artifacts/audit/latest-results.json`; reproduction script: `artifacts/verify-latest.mjs`. No application source, real customer data, inventory, or payments were modified during verification. The webhook concurrency reproduction uses synchronized synthetic model reads; database-backed concurrency testing remains necessary.

**Follow-up verification after the reported fixes**

The claim that all 24 findings are resolved is not supported by the current code. Some changes are present (shared cart provider, admin-role login filter, password recovery UI, URL filter initialization, and safer photo access), but the application still has launch blockers.

- Reproduced a new cart crash: add Liverpool M, open the drawer, then increase from three to four. `changeQuantity()` throws inside the React state updater; the outer try/catch does not protect the later render. The whole React root becomes empty with “No more stock is available in this size.” See `client/src/components/CartDrawer.jsx:18`.
- Reproduced the new resend-code UI calling `/api/customer/resend-verification`, which returns 404 because the backend route is missing.
- Reproduced production reverse-proxy login returning 200 without issuing a session cookie. `connect-mongo` is imported but is not configured as the session store; trusted proxy handling and required production secrets are still absent.
- Stock rollback now covers only the specific branch where a product update returns no result. Invalid later items, database errors, provider failures, and failed order saves still leave decremented stock without a pending order that the cleanup job could recover.
- The new cleanup job and admin cancellation are not coordinated with payment verification or each other. They can restore stock twice or cancel a concurrently paid order. There is still no payment webhook/reconciliation handler to settle paid orders when the browser does not finish verification.
- OTP verification/reset endpoints still have no attempt limiter. Admin product updates still omit schema validation.
- Plain `npm test` reports seventeen passing cases but does not exit because every test app starts an uncleared interval. With `NODE_ENV=test` explicitly set, all seventeen pass and the command exits.
- The production build succeeds, but still reports a chunk over 500 kB (approximately 657 kB before gzip). A warning is not a build error, but the warning has not been eliminated.
- The rewritten browser suite is a smoke test: it checks that images exist and that checkout contains “KITVERSE.” It does not exercise registration, verification, cart increment limits, real checkout, payment recovery, or admin fulfillment. Global `overflow-x: hidden` can also make its document-width assertion pass while controls remain clipped. A passing run cannot certify all audited journeys.

Targeted reproduction output: `artifacts/audit/followup-results.json`. Tests used a local demo server, synthetic model data, and no live orders or payments. Application source was not modified during verification. The original findings below are retained as the baseline; this follow-up is not a declaration that every unmentioned item remains unchanged.

The current application has launch-blocking account, inventory, cart, and payment-recovery issues. A successful build and the current unit tests do not establish that the purchasing workflow is ready.

Reviewed the home page, shop filters and pagination, product details and related products, cart drawer, checkout, registration/verification/login, profile and tracking, admin products/orders, API handlers, data models, session configuration, and existing tests. Application source was not changed. Audit scripts and screenshots are under `artifacts/audit/` and `artifacts/`.

**Evidence and limits**

- `npm test`: 17/17 passed. These mostly cover catalogue and inventory helpers; they do not exercise the new purchase/account workflow.
- `npm run build`: passed. The initial sandboxed build encountered filesystem restrictions; the permitted retry succeeded. The main JavaScript bundle is approximately 652 kB before gzip.
- `npm run test:browser`: failed waiting for the old `.product-card` selector on the redesigned homepage. Later checks in that suite never ran.
- Targeted Edge browser checks reproduced cart overwrite, stock overrun, dead product links, ignored URL filters, checkout error masking, and a related-product crash.
- Browser coverage included desktop 1440 × 1000 and mobile 390 × 844. Profile/admin content used synthetic API responses. Most deterministic checks blocked external assets; a second run allowed them, but screenshots still showed unavailable external icon/font assets. These are evidence of degraded-network behavior, not a claim about appearance with successfully loaded fonts.
- Account and reverse-proxy tests used in-process model stubs and synthetic credentials, with no real database writes. They exercise actual Express routes and session middleware, but are not database integration tests.
- No real payment, customer account, email delivery, refund, shipping operation, or live inventory was created or changed. MongoDB concurrency and Razorpay capture/webhook delivery remain integration-test gaps.
- Prices are consistently stored in paise: `money()` divides by 100 and admin entry multiplies by 100. The suspected payment currency-unit mismatch was ruled out.

**Highest-priority findings — fix before accepting orders**

1. **P1 — Email verification can be bypassed through admin login.** `server/app.js:308` looks up any user, validates the password, and creates a session with that user's role without checking verification. Reproduction: an unverified synthetic customer gets 403 from customer login, 200 from admin login, then 200/authenticated from customer/me. This grants a customer session, not admin privileges, but bypasses the registration gate and permits customer-only workflows. Restrict admin login to administrators and enforce verified customer status wherever customer sessions are established.

2. **P1 — Stock remains deducted after abandoned or failed payments.** `server/app.js:428` decrements stock and commits a pending order before payment. `Checkout.jsx:154` only clears the submitting flag on dismissal. There is no reservation expiry/release path, and admin cancellation only updates the status. Closing the payment window, failing to load its script, or trying checkout repeatedly can consume inventory without payment. Use expiring reservations, explicit release, and an idempotent way to resume the same pending order.

3. **P1 — The standalone MongoDB fallback allows partial stock changes and overselling.** `server/app.js:474` retries without a transaction. Each line reads stock and then saves it; failure on a later item, provider request, or order validation leaves earlier decrements committed. Concurrent buyers can also both pass the read-based check. Require transactions or implement atomic conditional updates with a reliable rollback/reservation strategy. Do not silently reduce inventory guarantees based on database topology.

4. **P1 — Order input and product eligibility are not validated before mutation.** `server/app.js:404` only checks that customer/items are present and items has a length. The loop accepts unvalidated quantity/size values and finds a product by slug without checking `published` or catalogue eligibility. A negative quantity increases stock before order-line validation eventually rejects it; in the nontransactional fallback that change can persist. Check the array shape, positive safe-integer quantities, supported sizes, duplicate lines, customer fields, and current purchasability before any side effect.

5. **P1 — Successful payments rely on the browser completing verification.** `server/app.js:485` is the only confirmation route. No webhook or reconciliation worker exists, and `Checkout.jsx:49` keeps the verification receipt only in React state. Closing/reloading the tab after payment or losing the network can leave a paid customer with a pending order and no recovery action in order history. Add durable provider-event reconciliation, idempotent payment transitions, and resumable verification. Provider capture status also needs explicit verification; signing and capture should be tested separately in the integration suite.

6. **P1 — Production login fails behind a typical TLS reverse proxy.** `server/app.js:28` enables secure cookies in production but does not configure trusted proxy handling. The server itself listens over HTTP. An isolated production request with `X-Forwarded-Proto: https` returned login success but no cookie. Configure trusted proxy boundaries for the actual host. Sessions also use the default memory store and a fallback secret: restarts lose all sessions and multiple instances do not share them. Use a persistent store and require a configured secret in production.

7. **P1 — Independent cart states overwrite each other.** `client/src/useBag.js:32` receives cart update events but never applies the saved state. Navbar and each page own separate cart instances. Reproduced: add one Liverpool M, increase the drawer to five, then add that size again from the shop; the saved quantity becomes two. The same architecture leaves checkout quantities stale after drawer changes. Use one shared cart store/provider, with safe persistence and a real synchronization strategy.

8. **P1 — Related-product navigation can blank the whole app.** `client/src/components/ProductDetailModal.jsx:51` dereferences `images[activeIdx].url`, while changing the product preserves the previous image index. With a two-photo product, select the second photo and open a related one-photo product: `Cannot read properties of undefined (reading 'url')`, followed by an empty root. Reset product-specific state on slug changes and defensively bound the photo index. Selected size, zoom, and errors should reset as well.

9. **P1 — OTP verification/reset attempts are unlimited.** Sending codes is rate-limited, but `server/app.js:148` and `:209` have no limiter or per-code attempt cap. Six-digit codes remain valid for fifteen minutes, allowing repeated guessing on verification and password reset. Use cryptographically generated codes, rate limits on verification, per-account attempt limits, and purpose-bound single-use tokens. No brute-force traffic was sent during this review.

**Other confirmed workflow problems**

10. **P2 — Cart quantities ignore real stock.** `client/src/components/CartDrawer.jsx:14` expects the obsolete `variants` structure and defaults to ten. It also consults the static catalogue instead of current stock. Reproduced Liverpool M quantity five despite current stock three. Reuse the existing stock helpers with live catalogue data and disable increments at the actual limit.

11. **P2 — Cart product links lead to a blank screen.** `CartDrawer.jsx:88` and `:95` link to `/product/:slug`, but `client/src/main.jsx` defines no product route or fallback route. Reproduced an empty React root after clicking the item name. Implement product routing, or reopen the product modal through a supported shop URL, and add a useful not-found screen.

12. **P2 — Homepage team and clearance links lose their intent.** `Storefront.jsx:675` links to `?search=TEAM`; `:518` links to `?sort=price-low`. `ShopPage.jsx:38` and `:43` always initialize empty search and featured sorting. Reproduced `/shop?search=Liverpool&sort=price-low` showing multiple teams and featured sort. Read/write supported filters consistently through URL parameters.

13. **P2 — Password recovery and verification recovery are incomplete.** `Login.jsx:76` links “Forgot password?” to `/login` again. Reset endpoints exist but there is no reset UI/route. Signup has no resend/resume verification flow; an expired code or refresh leaves an existing unverified account that cannot register again. `sendOtpEmail()` also swallows delivery errors and registration still reports that a code was sent. Implement recovery screens and report delivery failures accurately.

14. **P2 — Checkout hides catalogue failures as an empty cart.** `Checkout.jsx:68` records an error, but `:306` returns the empty-cart screen first. Reproduced a 503 catalogue response displaying “CART IS EMPTY,” with no retry. Separate loading, failure, empty, and loaded states; preserve the saved bag and provide retry.

15. **P2 — Home silently falls back to demo inventory on live API failure.** `Storefront.jsx:53` restores the bag against bundled sample products after any fetch failure. A real database outage can substitute sample prices/availability and drop real SKUs from persisted cart data. Show a retryable live-data error and preserve the existing bag instead of reconciling against unrelated demo data.

16. **P2 — Profile password/email updates give misleading or unsafe outcomes.** The frontend validates matching new passwords but does not require the current password. `server/app.js:288` silently skips the password update if that field is absent and returns success. Email updates at `:284` do not reverify ownership and keep `isVerified` true. Require the current password for sensitive changes, reject incomplete change requests, and verify new email ownership before replacing it. Signup advertises eight-character passwords without enforcing that minimum in either the form or API.

17. **P2 — Admin fulfillment is incomplete.** The orders screen shows customer name/email/city/postcode but not the full street address, state, phone, or delivery notes, and has no detail view. `trackingDetails` is readable by customers but has no admin editing endpoint or UI. The status endpoint permits any transition among pending/paid/fulfilled/cancelled, without payment prerequisites, stock restoration, or refund behavior. Add actionable order details, shipment entry, controlled status transitions, and explicit cancellation semantics.

18. **P2 — Admin editing bypasses schema validators.** `server/app.js:361` calls `findOneAndUpdate` without `runValidators`. Invalid prices, stock, or enum values can be persisted through the API. Whitelist editable fields, enable validation, and return field-level errors. Both admin list pages also interpret non-OK API responses as empty lists, concealing expired sessions and backend failures.

**UI and accessibility findings**

19. **P2 — Mobile layout needs another pass.** At a 390 px viewport, the shared public screens reached 440 px document width in the observed fallback-font state. Icons appeared as words such as `shopping_bag`, contributing to clipped cart/search controls. The admin products page reached 971 px even with empty fixture data; its fixed sidebar, main layout, and table do not contain horizontal width effectively. Screenshots are in `artifacts/audit/`. Verify with loaded and failed fonts, then contain tables, adapt the admin sidebar, and keep primary actions within the viewport.

20. **P2 — The cart drawer lacks modal keyboard behavior.** `CartDrawer.jsx:52` is a permanently mounted div moved offscreen. It has no dialog semantics, focus trap, focus return, background inertness, or Escape handler. Reproduced Escape leaving it open. Closed-drawer controls remain available to keyboard focus. Reuse the existing native Modal behavior or implement a complete accessible drawer. The mobile account link also loses its accessible name when its text is hidden and its icon is aria-hidden.

21. **P2 — External resource failures expose implementation text and errors.** `client/index.html:13` still loads Tailwind's runtime CDN despite using a compiled build, and `:14` unconditionally accesses `tailwind.config`. Blocking that CDN produces `tailwind is not defined` on every full page load. Google-hosted icon failures render ligature names rather than usable icons. Remove the redundant runtime and provide local/vector icons and robust font fallbacks. Homepage editorial images do not use the product fallback component, so failures show broken image areas.

22. **P2 — Several prominent homepage actions are placeholders.** Explore buttons open `wa.me/910000000000`; sizing/lookbook buttons display an unrelated admin-maintenance alert; footer terms/authenticity/newsletter actions display “coming soon.” Product cards, prices, dispatch promises, and availability badges are partly hardcoded instead of derived from current inventory. These controls must have real destinations and accurate content before launch.

23. **P2 — Form labels and storage recovery need completion.** Checkout labels are not associated with their inputs; OTP boxes have no individual accessible labels. Navbar's one-second storage poll parses local storage without a try/catch, unlike `useBag`, so malformed/blocked storage can repeatedly throw. When storage fails, page-local cart state is also lost across route unmounts despite the “this visit” promise. Cover these scenarios with browser tests and a shared in-memory cart.

24. **P3 — Account totals and documentation are misleading.** `Profile.jsx:46` counts pending-payment orders in “collected value.” Count paid/fulfilled orders if this is intended to represent purchases. README still says accounts/payments/admin are absent and lists fifteen tests, while seventeen run. Update docs after the actual launch behavior is settled.

**Recommended repair sequence**

1. Fix authentication gates, session deployment, OTP limits, and sensitive profile changes.
2. Establish validated order creation, transactional reservations, payment reconciliation, and cancellation/retry rules.
3. Centralize cart state; fix stock controls, product navigation, and the related-photo crash.
4. Complete recovery screens, API error states, admin fulfillment, and real homepage destinations.
5. Finish mobile/failure-state accessibility and replace the outdated browser suite with current end-to-end journeys.

After fixes, run database-backed tests for two buyers competing for the last size, partial-order failure, abandoned/failed payment, duplicate submission, duplicate/delayed webhook, page reload after successful payment, cancellation/refund, and service restart during a remembered session. Use the payment provider's test environment before accepting real orders.
