# Antigravity completion prompt — KITVERSE

You are continuing an existing MERN football jersey store, not starting a new project. Inspect the current repository before changing anything, then implement the remaining work. Do not stop after a plan, a visual redesign, or a list of suggestions. Complete and verify the locally runnable store, and clearly separate code completion from external launch requirements.

## Preserve the product and business rules

- Keep MongoDB, Express, React/Vite and Node.js. Preserve the KITVERSE brand, black/lime palette, typography and mobile-first direction. Improve the existing design rather than replacing it with a generic template.
- Sell both club and national-team jerseys. Keep both easy to find on desktop and mobile.
- Each sellable listing/SKU has ONE actual quality, its own price, and stock for each size. Supported labels are Embroidery, First copy + shorts, Master copy and Player version. Never generate all four qualities for every jersey. If the same design exists in another quality, it is a separate stocked SKU. Do not restore “4 quality options” product messaging; remove the confusing hero quality-count statistic too.
- Only verified inventory can be purchased. Stock is not unlimited, and adding to the bag does not reserve inventory. Zero-stock sizes must be unavailable.
- Do not invent stock, reviews, order counts, discounts, delivery promises, business contacts, size measurements, authentic/licensed claims or payment success. Keep demo fixtures explicitly separate from production data.
- Keep working search, filtering, pagination, gallery fallback, native dialogs, keyboard focus behavior, saved-bag reconciliation and quantity limits.

## Existing implementation to inspect and reuse

Read package.json, README.md, client/src/main.jsx, client/src/style.css, client/src/animations.css, client/src/useScrollReveal.js, client/src/useBag.js, client/src/components/*, shared/*, server/* and scripts/browser-check.mjs. Read applicable repository instructions.

Current code has a React storefront with sticky navigation, hero carousel, featured jerseys, a 26/27 section, team carousel, category/quality/search filters, pagination, product details with image zoom, size selection, and a localStorage bag. MongoDB has a Product model and insert-only seed script. Express exposes read-only catalogue and health endpoints. Checkout is explicitly disabled. Orders, payments, protected administration and fulfilment are absent.

The latest audit found 49 sample listings: 41 club, 8 national, 33 distinct teams, and 16 entries labelled 26/27. Forty-two listings use the placeholder image. These are audit observations, not permanent counts to hard-code. The build and 15 existing tests passed. No live MongoDB, payment or deployment integration has been verified. There is no initial Git commit; preserve all current files and changes, never reset or overwrite unrelated work.

## Phase 1 — Fix verified regressions first

1. Fix season expansion. Clicking “View all 26/27 kits” currently mounts 16 cards, all left at opacity:0. The loading branch replaces the nodes, but useScrollReveal does not re-observe after loading2627/expanded2627 changes. Also inspect query/sort updates and every dynamically inserted reveal node. Use a reliable element-based observation strategy or a simpler visible-by-default animation. Content must remain readable if observation fails, motion is reduced, or the browser restores scroll. Remove the artificial 800ms delay and derive the expandable count from the data instead of limiting it to 16.
2. Correct the unreadable second Featured badge: main.jsx sets black text on a nearly black background for index===1. Audit comparable text/control contrast.
3. Audit season photography. Liverpool 26/27 reuses the 23/24 photo, Real Madrid 26/27 the 24/25 photo, and Chelsea 26/27 the 25/26 photo. Do not represent these as verified 26/27 products. Use correct owner-provided images or explicit unavailable/draft states. Never borrow another jersey's photo to fill a gap. Use a structured season field, not name.includes('26/27'). Make featured/season placement data-driven and hide empty collections. Avoid claims such as “before anyone else” without evidence.
4. Fix the stale browser suite. It expects “Page 2 of 5” and one Liverpool listing, but the expanded catalogue has seven pages at the current page size and two Liverpool listings. Test semantic outcomes using controlled fixtures or data-derived expectations. Declare the browser-test dependency and document browser setup so a clean checkout can run it without a hidden external Playwright installation.
5. Update documentation: it still describes 33 listings and 29 placeholders. Make the MERN frontend the unambiguous active app; document or archive the obsolete root dist and Sites configuration without deleting user files blindly.
6. Refactor the roughly 660-line App and 2,000-line stylesheet carefully. Extract navbar, hero, collections, team browser, catalogue controls, product cards, bag and footer. Consolidate duplicate CSS/animation rules into shared tokens and component styles, preserving the current appearance. Do not append another layer of conflicting overrides.

## Phase 2 — Complete catalogue and protected administration

- Extend and validate Product records with stable SKU/slug, team, category, season, quality, price, product-specific photos, description, specifications, size measurements where supplied, stock, publication status and featured placement.
- Use integer minor currency units for financial calculations, with an explicit migration for the existing rupee values. Never silently reinterpret prices.
- Build a protected admin area with server-enforced authentication and authorization. Provide a documented secure initial-admin setup; no public admin registration or default credentials. Use password hashing, secure sessions/cookies, rate-limited login and appropriate CSRF protection.
- Implement product create/edit/archive, gallery management, stock-by-size updates, collection placement and order management. Keep unpublished/draft products out of public catalogue results. Validate requests server-side and return actionable errors.
- For images, implement a configured persistent storage path or validated owner-supplied URLs; never rely on ephemeral production disk. Restrict any uploads by actual content type and size. Do not enable unsafe arbitrary server-side URL fetching.
- Support safe, explicit migration of existing records. Do not replace real stock with sample values, and never run a destructive production seed.
- Add practical server-side filtering, sorting and pagination with bounded queries and indexes as needed. Preserve correct saved-bag reconciliation when the catalogue is paginated: revalidate bag SKUs through a dedicated endpoint rather than dropping items absent from the current page.

## Phase 3 — Implement the complete order journey

- Add real React routes for catalogue/product details, bag, checkout, order confirmation/status, business information and administration. Preserve quick-view where useful. Make refresh, direct links and browser back/forward work.
- Provide guest checkout so customers do not need an account. Validate contact and delivery fields, serviceable area, shipping method and order summary. Do not invent delivery fees or tax rules; make supplied business settings configurable and block live checkout when required configuration is missing.
- The server must recalculate prices, stock and totals from MongoDB. Never trust localStorage prices, browser totals, or payment status.
- Persist order-line snapshots, money values, delivery information, fulfilment/payment status and a non-guessable order reference. Restrict access to customer order details with authentication or a secure guest-access token; an order number alone must not expose addresses or phone numbers.
- Make stock reservation/decrement atomic across the order. Use MongoDB transactions with a documented replica-set requirement, or another demonstrated race-safe design. Handle multi-item failures without partial inventory loss. Two buyers competing for the last item must never both succeed.
- Make checkout retries idempotent. Handle payment failure, cancellation and expired reservations without double-restocking. A TTL deletion alone is not a stock-release mechanism. Specify how late payment notifications and expired reservations are reconciled.
- Integrate the owner's chosen payment provider using its current official SDK/documentation and test credentials. If unspecified, ask one concise payment-provider question while continuing independent work. Do not stop the project waiting for live keys: finish the provider interface, clearly separated test flow, order UI and tests.
- Verify payment signatures and raw webhook payloads server-side. Deduplicate repeated/out-of-order events. A browser redirect or client callback alone must never mark an order paid. Do not store card details or expose secret keys. Live payments remain disabled until configuration and verification are complete.
- Cash on delivery should only be enabled if the owner chooses it; do not silently invent this policy.
- Admins must be able to review orders, update allowed fulfilment states, add tracking details and manage cancellations through validated workflows. Never label an order refunded without a confirmed refund action.

## Phase 4 — Finish the customer experience

- Keep the navbar compact and sticky with accessible mobile navigation, club/national browsing, search and bag count. Ensure customer browsing starts quickly rather than requiring a long scroll through repeated promotional sections.
- Complete loading, empty, retry, out-of-stock, changed-price, payment-failed and success states. Use meaningful loading indicators tied to actual requests, not artificial delays.
- Preserve nested-dialog Escape behavior, focus restoration and scroll locking. Check keyboard access, visible focus, readable labels, touch targets and reduced motion. Provide controls for persistent animation where needed.
- Keep product photos correctly matched and consistently framed. Retain honest fallbacks until real assets are supplied. Do not use generated jerseys as purported photographs of actual stock.
- Replace placeholder business information with configurable contact, shipping, returns, privacy and terms content provided by the owner. Keep missing inputs explicitly tracked; do not invent legal or business terms.
- Add route-appropriate titles/descriptions, useful 404 handling and sensible image loading. Do not add unrelated loyalty, reviews, referrals or wishlist systems just to enlarge the scope.

## Phase 5 — Prove completion

- Keep existing tests and add meaningful coverage for admin authorization, input validation, catalogue publication, checkout price tampering, atomic inventory races, duplicate checkout requests/webhooks, cancellation, reservation expiry and protected order access.
- Add real MongoDB integration tests using an isolated test database/replica set. Existing injected readProducts tests are not proof of database correctness.
- Run reproducible browser checks with normal motion AND reduced motion. The existing reduced-motion-only suite can miss opacity/reveal bugs. Verify season expand/collapse, search/sort/team filters from later pages, no-result reset, mobile menu, gallery, size availability, bag persistence, checkout success/failure and admin workflows.
- Check 320, 375/390, 768, 1024 and 1440px layouts, plus enlarged text. Assert actual visibility/opacity and absence of unintended overflow, not merely DOM presence. Check the console and network failures.
- Run the production build and test the built app, including direct-route refreshes. Keep development and production URLs unambiguous.
- Add environment validation, production error handling, security headers and rate limits where appropriate, privacy-conscious logging, health/readiness checks and a documented Node + MongoDB deployment procedure. Do not publish publicly, incur service costs or enable live payment collection without explicit authorization.

## Working style and final handoff

First write a short project-specific checklist, then work through the phases in this repository. Preserve functioning behavior and explain necessary schema/dependency changes. Ask only for external inputs or consequential decisions, grouped concisely, while progressing on everything else. Do not make cosmetic changes the main deliverable.

Finish with:
1. What was actually implemented.
2. Commands run and real test results, including anything not exercised.
3. How to run, seed the isolated demo, configure MongoDB and create the initial admin.
4. A demonstrated test order from browsing through payment confirmation and admin fulfilment.
5. Exact remaining owner inputs: approved product photos, verified stock/measurements/prices, business details, shipping/returns rules, payment credentials and hosting configuration.
6. A candid status separating local completion, integration verification and readiness for public launch.

Do not call the project complete while checkout/admin are mockups or existing tests are failing. External credentials may prevent live verification, but should not leave independent code unfinished.
