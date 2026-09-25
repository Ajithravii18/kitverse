# KITVERSE — Complete Storefront Redesign and Collection Pages

Work directly in the existing MERN repository. Inspect the current routes, schema, shared filters, tests, and styles before editing. Preserve working authentication, bag, checkout, product, admin, and API behavior. Do not rebuild the repository from scratch.

The latest update is incomplete. It added `productType`, `styleTags`, category configuration, placeholder circular controls, and hero changes, but the customer experience still behaves like one long filtered homepage. Complete it as a professional mobile-first football apparel ecommerce site.

## Verified current-state problems

- `client/src/main.jsx` exposes the storefront only at `/`; there are no dedicated collection routes.
- `Storefront.jsx` renders `.circle-placeholder` instead of the configured category artwork.
- Clicking a category only changes homepage state and scrolls to `#shop`.
- The hero is overloaded with statistics, status pill, counter, watermark, arrows, a floating card, thumbnails, and a vertical ribbon.
- It still advertises a count of quality options even though products are sold by actual SKU stock.
- `Storefront.jsx` mixes navigation, hero, catalogue state, merchandising, modal, and bag behavior in one very large component.
- `style.css` contains overlapping generations of styles and media queries.
- Shorts and Track pants exist in the taxonomy but are not properly merchandised on the homepage.
- The circular section does not match the supplied reference: photographic circles with a bold horizontal label band through the center.

## Product taxonomy and stock rules

Preserve these independent dimensions:

- Team scope: `category = club | national`
- Product type: `productType = jersey | shorts | track-pants`
- Jersey quality: `quality = Embroidery | First copy + shorts | Master copy | Player version`
- Style: `styleTags = retro | collar`

Do not assume a jersey is available in all four qualities. Each SKU has only the quality and stock explicitly saved for it. Show only products that match the collection and have purchasable stock.

“First copy + shorts” is a jersey quality/bundle. “Shorts” is a standalone product type. Keep them separate in routes, filters, labels, counts, admin data, and tests.

Do not fabricate products, stock, discounts, reviews, delivery claims, measurements, policies, or photos. Demo records must remain clearly labelled. Use honest local placeholders when owner imagery is missing.

## 1. Rebuild the homepage category circles to match the reference

Keep this section directly after the marquee. Required order: Header → Hero → Marquee → Circular category navigation → Homepage merchandising.

Build true image circles like the supplied example:

- Circular image crop with a thin brand-colour border.
- Solid horizontal label band crossing the center.
- High-contrast uppercase label centered in the band.
- Consistent diameter, crop, label height, border, and spacing.
- The complete tile is one accessible link.
- Restrained hover/focus feedback with no layout shift.

Required circles:

- First copy + shorts
- Master copy
- Player version
- Embroidery
- Retro
- Collar
- Jerseys
- Shorts
- Track pants
- Club teams
- National teams

Use accurate product images already in the repository where available. If verified imagery is missing, use a polished neutral placeholder and document the missing owner asset. Never place a jersey photo in the Shorts or Track pants circle.

Create one shared collection configuration module containing stable slug, label, description, filter mapping, route, image, image position, and optional accent. Homepage circles, sidebar, mobile navigation, breadcrumbs, page titles, and metadata must consume this same configuration.

Desktop: use a balanced grid, aiming for five or six circles per row at large widths. A rail is acceptable if arrows appear only when overflow exists.

Mobile: use horizontal touch scrolling with CSS snap and about 2.3–2.7 circles visible. Keep labels readable, show a continuation cue, hide the scrollbar without disabling scrolling, and prevent page-wide overflow.

Every circle must navigate to a dedicated collection page. Do not merely filter and scroll the homepage.

## 2. Add dedicated ecommerce collection pages

Add reusable routes:

- `/shop`
- `/collections/first-copy-shorts`
- `/collections/master-copy`
- `/collections/player-version`
- `/collections/embroidery`
- `/collections/retro`
- `/collections/collar`
- `/collections/jerseys`
- `/collections/shorts`
- `/collections/track-pants`
- `/collections/club-teams`
- `/collections/national-teams`

Build one reusable `CollectionPage` driven by shared configuration, not copied pages. Invalid slugs must render a proper not-found page.

Every collection page needs:

- Breadcrumbs: Home / Shop / Current collection.
- Compact collection header with title, truthful description, and result count.
- Catalogue shell with category/filter navigation on the left and products on the right.
- Search within products.
- Sorting: Featured, Newest only if real data supports it, Price low–high, Price high–low, and Name A–Z.
- Applicable filters for product type, quality, style, Club/National, team, available size, and price range.
- Active-filter chips with individual removal and Clear all.
- Honest zero-result state with a route back to all products.
- Pagination or Load more with stable URL state and sensible focus behavior.

Implement server-supported filtering. Add allowlisted query parameters and deterministic sorting to `/api/products`; do not download an unlimited catalogue and present all filtering as server-side. Bound page size and price values. Return total count and pagination metadata.

Persist collection, filters, search, sort, price, and page in the URL. Refresh, copied links, Back, and Forward must restore state. Filter changes reset page to 1. Omit defaults from the query string.

### Dashboard-style navigation

On desktop, create a clean sticky left sidebar inspired by a SaaS dashboard while retaining an ecommerce look:

- All products
- Shop by product: Jerseys, Shorts, Track pants
- Shop by quality: all four quality labels
- Shop by style: Retro, Collar
- Shop by team: Club teams, National teams
- Clearly separated filter groups

Show the current destination with a left indicator, filled row, and `aria-current="page"`, not colour alone. Use consistent vector icons only where useful; no emoji. Keep the sidebar below the sticky header and avoid a confusing second page scroll.

On tablet/mobile, replace the permanent sidebar with:

- Compact horizontal navigation to sibling collections.
- A Filter button with active-filter count.
- Accessible filter drawer/bottom sheet with Apply, Clear all, close, focus trap, Escape support, focus restoration, and body-scroll handling.
- A separate visible Sort control.

## 3. Fully rebuild the hero

Replace the current hero composition. Remove the statistics strip, status pill, slide counter, huge watermark, thumbnail rail, vertical ribbon, and redundant decorative UI.

Create a premium editorial football-store hero with:

- Concise eyebrow.
- Strong H1 of about 8–10 words maximum.
- One supporting sentence.
- Primary CTA to `/shop`.
- Secondary CTA to National teams or a real featured collection.
- One dominant verified product image.
- One compact product summary with product/team name, actual quality when relevant, actual price, and View product.
- Subtle background treatment using the KITVERSE palette.

If multiple featured items remain, use a calm manually controlled carousel with dots and previous/next buttons. Do not auto-rotate. Hidden slides must not be keyboard or screen-reader reachable. If no featured product exists, fall back to a published in-stock item; if the catalogue is empty, show a clean text hero.

Mobile at 320–430 px:

- Design as a single-column mobile composition instead of shrinking desktop.
- Show the message and primary CTA early.
- Use a stable image aspect ratio with no overlap.
- Order: copy, CTAs, image, compact product information.
- Avoid headline sizes that put individual words on separate lines.
- Do not use a fixed height that clips enlarged text.
- Use 44×44 px minimum controls and at least 16 px body copy.
- Prevent layout shift while products/images load.

Tablet/desktop: use a refined split layout. Visually connect product information to the merchandise, avoid dead space, and prevent overlap at 768, 1024, and 1440 px.

Respect `prefers-reduced-motion`, include image fallbacks, and do not delay interaction with entrance animation.

## 4. Add homepage merchandising for all key categories

The homepage should introduce collections and send customers to dedicated pages rather than contain the full catalogue experience.

After the circles, add data-driven sections in this order:

1. Featured or best-selling jerseys using only real featured/in-stock data.
2. Shop jerseys with a link to `/collections/jerseys`.
3. Shorts spotlight with 3–4 actual products and a link to `/collections/shorts`.
4. Track pants spotlight with 3–4 actual products and a link to `/collections/track-pants`.
5. Retro and Collar editorial tiles only when matching products exist; otherwise omit them or use an honest owner-controlled coming-soon state.
6. Club and National team discovery.
7. Quality guide explaining differences without implying every jersey offers four selectable qualities.
8. Concise closing CTA and complete footer.

Build a reusable `ProductRail` and shared `ProductCard`. On mobile, rails can scroll horizontally with snap; on desktop use a grid/rail. Each section needs a clear View all link. Never render empty product rails. Preserve layout with skeletons and provide retry states for failed requests.

## 5. Improve the theme across every page

Keep KITVERSE but make it cohesive, premium, sporty, and trustworthy. Use lime as a controlled accent.

Create tokens for surfaces, text, muted text, borders, accent, feedback colours, typography, spacing, containers, radii, shadows, control heights, header offsets, z-index, and motion.

Consolidate CSS. Remove obsolete rules and overlapping media-query patches after verifying they are unused. Minimize inline styles.

Apply the theme to homepage, collection pages, product experience, bag, auth, checkout, profile/orders/tracking, empty/loading/error/not-found states, footer, mobile navigation, and admin pages.

Requirements:

- Consistent typography and content widths.
- Clear hierarchy without excessive uppercase body text.
- Unified buttons, fields, selects, chips, cards, badges, dialogs, and drawers.
- Strong focus-visible treatment and WCAG AA contrast.
- No tiny functional labels or layout-shifting hover effects.
- Consistent product image ratios and object fit.
- Responsive images and below-fold lazy loading.
- No horizontal overflow at 320 px.

## 6. Component and routing cleanup

Split the oversized storefront into focused pieces such as `SiteHeader`, `Hero`, `CategoryCircleNav`, `ProductCard`, `ProductRail`, `CollectionPage`, `CollectionSidebar`, `FilterDrawer`, `SortControl`, `ActiveFilters`, and `SiteFooter`.

Use React Router `Link`/`NavLink` for internal navigation. Keep one shared bag provider above all routes so bag state stays synchronized. Add route-aware document titles/descriptions and a `*` not-found route.

## 7. Preserve and finish backend correctness

Do not regress security. Re-audit real code instead of trusting comments or README claims:

- Razorpay webhook verification must use the original raw body; `JSON.stringify(req.body)` is not valid raw-body verification.
- Browser callbacks never prove payment.
- Do not permanently deduct stock before verified payment without a correct reservation/expiry lifecycle.
- Require transaction-capable MongoDB for stock changes and fail safely otherwise.
- Keep explicit customer/admin role checks.
- Keep OTP tokens hashed, non-empty, expiring, rate-limited, and single-use.
- Keep CSRF protection on cookie-authenticated mutations and make the client handle it consistently.
- Validate and allowlist every public query and admin mutation.
- Public catalogue and checkout must only use published, valid, in-stock products.
- Do not expose personal order data through a guessable reference.
- Do not claim guest checkout, shipping calculation, privacy policy, email delivery, or production readiness unless genuinely implemented/configured.

Fix verified defects found during this work and add regression tests.

## 8. Admin support

The editor must clearly support team scope, product type, applicable jersey quality, Retro/Collar tags, images, Featured/Published, season, integer-paise price, and stock by valid size. Standalone Shorts/Track pants must not display an irrelevant quality. Show field-level validation and clear 401/403 states.

## 9. Tests and acceptance

Add meaningful coverage for:

- Every circle linking to the correct route.
- All collection routes using shared configuration.
- First copy + shorts remaining distinct from Shorts.
- Server filtering for quality, type, style, scope, team, size, price, search, sort, and pagination.
- Invalid slugs/query values.
- URL restore on refresh and Back/Forward.
- Active-filter removal and Clear all.
- Published/in-stock enforcement.
- Correct homepage rail contents and links.
- Empty collection recovery.
- Bag synchronization across routes.
- Existing auth, CSRF, price, transaction, signature, and inventory behavior.

Browser-check 320×568, 375×667, 390×844, 430×932, 768×1024, 1024×768, and 1440×900:

- No hero overlap, clipped text, layout shift, or horizontal overflow.
- Mobile CTA, image, and copy are visible/readable.
- Category tiles visibly match the reference: photographic circle plus center label band.
- Mobile circle rail swipes; desktop keyboard navigation works.
- Desktop sidebar is usable/sticky.
- Mobile filter drawer traps/restores focus, closes with Escape, and applies/clears filters.
- Sort/filter changes update results and URL.
- All customer/admin states share the refreshed theme.
- Test keyboard-only use, enlarged text, failed images, loading/error/empty states, and reduced motion.
- No console errors or failed asset requests.

Run and report `npm test`, `npm run build`, `npm run test:browser`, and any transaction-capable MongoDB integration suite.

## 10. Final handoff

Report changes grouped by homepage, hero, collection routes, filters/navigation, theme, backend, admin, and tests. List files added/changed/removed, routes/query parameters, migrations/env changes, exact test results, key mobile/desktop screenshots, remaining owner assets, and a candid readiness statement distinguishing verified behavior from demo/mock behavior.

Do not deploy publicly, enable live Razorpay, purchase services, overwrite real inventory, or invent business/legal information without explicit authorization.
