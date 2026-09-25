# KITVERSE — fix the verified completion gaps

Continue the existing MERN project in this workspace. Inspect applicable AGENTS.md instructions and the actual code before editing. Preserve KITVERSE branding, working collection routes, component extraction, product taxonomy and existing user files. Do not rebuild from scratch or rerun old generator/patch scripts. The repository currently has untracked project files; do not reset or clean it.

## Audit baseline — 24 September 2026

The project now includes /shop, shared /collections/:slug pages, category circles, a simplified hero, product rails, a root bag context, and customer/admin/order code. npm test passes 15/15, npm run build passes, and npm run test:browser passes. These checks do not prove authentication, checkout, MongoDB transactions or payments work. No live database/payment integration was verified in this audit. The old completion prompts describe earlier states; use this audit and current code as the starting point.

Implement the fixes below, not merely a plan. Work in priority order and add regression coverage for the actual failures.

## 1. Restore authenticated mutations without weakening CSRF

server/app.js requires x-csrf-token, but Auth.jsx, Checkout.jsx, Profile.jsx, AdminProducts.jsx, AdminOrders.jsx and components/admin/AdminLayout.jsx issue mutations without it. This blocks login, registration, password recovery, checkout and admin changes.

Create a shared request/session layer that obtains /api/csrf-token with the session cookie, attaches the token to mutations, and adopts the new token after session regeneration. Handle logout, 401/403 and network errors consistently. Do not remove CSRF protection or blindly retry non-idempotent orders. Verify complete customer and admin browser flows against isolated test data.

## 2. Fix bag data loss and shared checkout state

main.jsx loads only the default first page of /api/products, then calls restore(data.products). Consequently saved items outside that page are dropped and quantity controls lack those products. Checkout.jsx creates another useBag instance and repeats first-page reconciliation.

Use one bag provider across browsing and checkout. Add a bounded endpoint to resolve/revalidate the exact saved SKUs independently of catalogue pagination. Reconcile prices, publication, stock and quantities server-side; distinguish unavailable products from temporary request failures. Do not erase the saved bag on a transient failure. Test an item from page 2 through add, quantity changes, navigation, reload and checkout.

## 3. Make payment and inventory behavior correct

The current checkout clears the bag and redirects to /?success=1 both on a Razorpay browser callback and when payment configuration is missing. Replace this with an authenticated order-status page driven by verified server state. Handle SDK failure, cancellation, pending webhook, failure and payment_review explicitly. Missing configuration must disable checkout truthfully.

server/app.js checks stock at order creation but does not reserve it. Multiple customers can pay for the last item. Repeated lines for the same SKU/size are not aggregated before availability checks. Implement transaction-backed reservations with expiry/release, idempotent order creation, duplicate-event handling and a documented late-payment reconciliation policy. Aggregate duplicate lines before stock validation. Prevent partial inventory changes, duplicate deductions and double release.

Preserve raw-body webhook verification. Fail closed when the dedicated webhook secret is absent; currently the code falls back to another secret or an empty string. Verify event identity, provider order, amount and currency before payment transitions, using the provider's official documentation. Add transaction retries where appropriate and test duplicate/concurrent events.

Admin status changes currently allow arbitrary transitions including directly marking orders paid, bypassing inventory/payment processing. Separate provider-controlled payment status from allowed fulfilment actions; handle cancellation/refund states through validated workflows. Surface payment_review and implement tracking updates. Enforce an explicit customer role for customer checkout. Make readiness depend on payment/business configuration and transaction-capable MongoDB, not merely hasDatabase.

## 4. Complete collection filters and browser history

CollectionPage.jsx implements only a quality filter; CollectionSidebar is navigation only. The fetching effect rewrites history with replace:true, filters are not fully restored from location.search, and a selected quality can override a quality collection's constraint. FilterDrawer applies changes immediately although it has an Apply button. Errors are swallowed and can look like empty results or stale success.

Use URL state as the canonical committed state. Support applicable product type, quality, style, club/national, team, available size, price, search, sort and page. Keep collection constraints immutable. Omit defaults and redundant route constraints; reset page on filter changes. Implement genuine Back/Forward and refresh restoration, including filters. Keep draft drawer values until Apply; define Clear/Cancel consistently. Add desktop filter controls, mobile sibling navigation, labelled search, complete chips, true Clear all, error/retry and empty-state recovery. Ensure pagination reflects any server page normalization.

The API currently reads the full MongoDB catalogue before JavaScript filtering/slicing. Move filtering, deterministic sorting, count and pagination into bounded database queries with appropriate indexes. Strictly validate allowlisted scalar query values, repeated keys, size, sort, team, numeric bounds and unknown parameters. Keep demo behavior equivalent without mutating shared fixture order.

## 5. Finish the existing storefront integration

Move SiteHeader/SiteFooter and shared navigation into a reusable customer layout: they are currently rendered only by Storefront, leaving collection pages without the shared bag/navigation controls.

Homepage rails and category images currently use only the root's first 24 results. Query each merchandising group independently or add a bounded merchandising endpoint, so existing shorts/track pants/other collections are not omitted just because they occur on a later page. Keep empty rails hidden and add loading/retry states. Complete the requested Retro/Collar and Club/National discovery when matching data exists. Hero should fall back to an eligible in-stock product when no featured product exists.

Quality-guide articles still carry .reveal with opacity:0 but Storefront no longer invokes useScrollReveal. Make content visible by default and progressively enhance animation. Test normal motion as well as reduced motion.

CategoryCircleNav ignores configured collection artwork and falls back to a jersey illustration even for shorts/track pants. Use correct owner assets or neutral type-appropriate local placeholders, with broken-image handling. Repair nonexistent image paths in shared/collections.js. Remove unsupported copy such as 'Authentic athletic fit. Exactly as worn by the pros.' Do not invent products, stock, provenance, photos, measurements, shipping or legal policies.

Consolidate conflicting CSS rather than appending overrides. Preserve the circular center-band design and black/lime theme. Add route-aware metadata and consistent loading/error/404 states. Check drawer initial Shift+Tab, full focus containment, Escape, restoration and scroll locking.

## 6. Validate data, authentication and operational claims

Product price currently accepts any finite nonnegative number; enforce safe integer minor units consistently in schemas, public eligibility, admin input and order snapshots. Audit cross-field productType/quality validation on updates as well as creation. Keep 'First copy + shorts' distinct from standalone shorts.

Normalize and type-check auth/customer/admin payloads, validate address and item bounds, apply consistent password rules, use cryptographically generated OTPs and atomic purpose-specific single-use consumption. Add a configured email adapter and explicit development-only mock mode; current OTP delivery only logs to the terminal. Fail promptly when database-dependent features are unavailable. Recheck session persistence and production cookie/proxy setup.

Remove misleading shipping/payment/privacy claims when configuration or pages do not exist. Update README: it currently claims reservation/atomicity coverage that the 15-test suite does not provide. Document implemented behavior and remaining owner configuration precisely.

## 7. Prove the fixes

Keep existing meaningful tests and expand them. The browser suite currently uses reduced motion only, aborts external requests and expects Back from shop page 2 to return to the preceding collection; that does not prove correct pagination history. Fix expectations to test the intended user journey instead of current bugs.

Required regression cases: CSRF/session rotation; customer/admin mutations; bag beyond first catalogue page; all filter dimensions and invalid queries; copied URL/refresh/Back/Forward; immutable collection constraints; actual drawer Apply/Cancel; visible quality guide under normal motion; missing payment config; no success based on browser callback; price tampering; duplicate lines; last-item concurrency; multi-item rollback; reservation expiry; repeated/late webhooks; admin transition restrictions; protected order access.

Use an isolated MongoDB replica set and payment test adapter/credentials for integration tests. Never use real inventory. If external prerequisites are unavailable, report those exact tests as unverified instead of claiming mocks prove database/provider correctness.

Run npm test, npm run build, npm run test:browser and the new integration suite. Browser-check 320, 375, 390, 430, 768, 1024 and 1440px with normal/reduced motion, keyboard use, enlarged text and error states. Assert real visibility, overflow, focus and URL behavior; capture representative screenshots.

Finish with changed files, exact commands/results, a demonstrated test order and admin fulfilment journey where integration is available, and remaining owner inputs. Distinguish locally verified code, unverified integrations and launch readiness. Do not deploy publicly, enable live payments, buy services or overwrite real inventory.
