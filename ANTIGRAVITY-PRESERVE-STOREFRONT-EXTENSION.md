# Antigravity prompt — extend the restored KITVERSE storefront carefully

Work directly in the **current restored MERN repository**. First run and inspect the existing site at `/`, its routes, product API, catalogue, CSS, admin editor, bag, and checkout. The current homepage is the approved visual baseline. Implement the changes below completely, but preserve its existing look and behavior. Do not apply or reuse the older “Complete Storefront Redesign and Collection Pages” prompts in this repository; they describe the broken version that was rolled back.

## Non-negotiable preservation rules

- Keep the current announcement bar, navbar visual style, hero composition and copy, marquee, featured cards, 26/27 section, Shop By Team, existing “Your next matchday shirt” section, quality guide, closing block, footer, and the established ink/lime/off-white typography and spacing. **Do not redesign or replace the hero.** Add only the minimum navigation needed to reach the new shop page.
- Do not replace `client/src/style.css` or rewrite page-level CSS. Add narrowly scoped classes for new components. Avoid broad selectors, global resets, forced `overflow: hidden`, fixed-height content wrappers, or nested page scrolling. The document should have one normal vertical scrollbar.
- Before editing, save a reversible checkpoint of the exact current source (branch/commit or a local backup) and baseline screenshots at 375px and desktop. Do not touch `.env`, MongoDB data, prices, stock, existing order records, or user accounts. No destructive reseed or blanket migration.
- Make small, reviewable changes and compare the completed homepage with baseline screenshots. Only the requested inserted sections and a discreet Shop navigation entry should visibly differ in existing areas.

## Current code facts to design around

- `client/src/main.jsx` routes `/` to `client/src/pages/Storefront.jsx`; there is currently **no `/shop` route**.
- `Storefront.jsx` currently contains the hero, then `.ticker`, then `#bestsellers`, `#season-26-27`, `#shop-by-team`, an in-page `#shop` headed “Your next matchday shirt”, then `#qualities` and the closing/footer. Preserve those existing sections. Insert the circular navigation immediately after `.ticker`; insert the three new merchandising sections **after the complete existing `#shop` section and before `#qualities`**.
- The existing in-page shop filters jerseys by club/national category, quality, team, query and sort through `shared/storefront.js`. Keep that working. The new `/shop` must be a separate complete catalogue page, not a second long filtered homepage or one route per category.
- Today `shared/product.js` and `server/models.js` require one of four jersey qualities and club/national category for every listed product. `client/src/components/ProductDetailModal.jsx`, `shared/inventory.js`, admin, order lines, and checkout also assume quality is always present. Extend these end to end if standalone apparel is introduced; do not merely add filter labels that cannot display or be bought.
- The four current jersey qualities are `Embroidery`, `First copy + shorts`, `Master copy`, and `Player version`. A product is sold only in the quality and sizes actually saved with stock. Do not turn one jersey into four imaginary variants.

## 1. Circular category navigation after the marquee

Create a compact “Shop by category” section immediately after the marquee, before existing bestsellers. Match the **concept** of the provided reference: true circular image crops, a thin outline, and a bold horizontal label band across each circle's center. Adapt its colors and typography to KITVERSE's existing black/lime theme rather than introducing red or a new theme. Make it polished at 320–390px: horizontal swipe with visible next-item affordance or a responsive grid, consistent circle sizes, readable labels, no clipping, and keyboard-accessible links. On desktop, arrange neatly with no oversized gaps.

Include circles for: All Products, Jerseys, Embroidery, First copy + shorts, Master copy, Player version, Retro, Collar T-Shirts, Shorts, Track Pants, Club Teams, and National Teams. Group/order them sensibly and keep the section compact. Use a central category configuration for titles, URLs, and image/fallback behavior. Use a relevant photo **only when a real corresponding product/approved asset is available**; otherwise use a tasteful category-specific fallback illustration/icon. Never show a jersey photograph as if it were shorts, track pants, or a collar T-shirt. Provide useful alt text; the label itself must remain real text over the image.

Every circle links to the **same** `/shop` page, with a URL query parameter selecting its filter; examples: `/shop?type=shorts`, `/shop?type=track-pants`, `/shop?type=collar-tshirt`, `/shop?quality=Master%20copy`, `/shop?category=national`. The All Products circle goes to `/shop` with no filters. Clicking a circle must open the dedicated shop, reflect that active filter visibly, and allow clearing or switching filters. Do not create `/collections/:slug` pages or scroll circles to the homepage `#shop`.

## 2. One complete `/shop` page

Add a real `/shop` route using the existing brand components and styling. Keep the homepage `#shop` section as it is. The new page should show a clear “All Products” heading, product count, search, product grid, loading/error/empty states, sort (featured, price ascending/descending, optionally newest if reliable), and working filters for product type, club/national where applicable, jersey quality, retro style, team and size if supported by actual data. Reuse the existing product-card look and product detail/bag behavior rather than inventing a new aesthetic.

Use a **left filter sidebar on desktop**, with clear category navigation like a restrained ecommerce dashboard, and a button-triggered filter drawer/sheet on mobile. The main content must retain natural page scrolling; never put the whole page or grid in an independently scrolling pane. Keep sidebar navigation semantic and keyboard accessible. On mobile, filters and sort must be easy to reach without covering the grid by default. Include “Clear filters,” visible active chips, and an empty state that links back to all products. Preserve selections in the query string so direct links, refresh, browser back/forward, and circle links work. Validate unknown query values gracefully. Reset or clamp pagination when filters change; counts must match filtered listed products.

Add a discreet “Shop All” link to existing desktop/mobile navigation, and connect relevant homepage CTAs to `/shop` where appropriate **without changing the existing hero layout or removing in-page links**. Confirm product details, selected size, bag persistence and checkout work when navigation starts from `/shop` as well as `/`.

## 3. Product taxonomy and honest stock behavior

Treat these as separate dimensions, not interchangeable categories:

- `productType`: jersey, shorts, track-pants, collar-tshirt. A collar T-shirt is its own apparel type in this request, not a filtered set of collared jerseys.
- Jersey `quality`: one of the four existing tiers, **only for the actual stocked jersey SKU**. “First copy + shorts” means a jersey-and-shorts bundle quality; it is distinct from a standalone shorts product.
- `styleTags`: retro for genuinely retro products. Do not infer retro solely from an old season. If the catalogue also needs a collar style attribute for jerseys, keep that separate from the standalone collar T-shirt type and do not mix their counts.
- `category`/team scope: club or national when applicable; support standalone apparel that has no team when needed without mislabeling it as a club/national jersey.

Extend the Mongoose schema, public serializer/listing predicate, demo data handling, filter function, admin create/edit form, product detail display, bag/order snapshots and checkout validation coherently. Keep legacy records working by treating an absent `productType` as `jersey`; do not assign `retro`, `collar`, or an arbitrary quality to old records. Non-jersey items must not be forced to show “jersey only” or a quality tier. Preserve SKU-based price/stock and current stock checks. Do not overwrite existing production records to achieve this. If a data migration is truly necessary, make it explicit, reversible, idempotent, and leave it unrun unless warranted by the current data.

Show only genuine published, in-stock products according to existing listing rules. Do not fabricate products, sizes, stock, photos, ratings, discounts, delivery promises, or specs. Demo/sample data must remain clearly labelled as sample. If a new collection has no items, its UI should display a compact, truthful empty state rather than a giant blank section or fake cards. Add a straightforward way for the owner to create/tag real shorts, track pants, collar T-shirts and retro items in admin, including relevant imagery and stock.

## 4. Three four-column product listings after “Your next matchday shirt”

Immediately after the existing complete `#shop` section, add **three distinct product listing sections** in this order. Each should look like the existing four-column jersey product grid: section heading and CTA above a row of **up to four real product cards, four columns on desktop**. Reuse the existing card anatomy, product image proportions, prices, sizes and quick-bag/detail actions. These are actual shoppable listings, not large editorial banners, single-image promos or text-only category teasers.

1. **Track Pants** — show up to four actual in-stock track-pants products and a “Shop Track Pants” link to `/shop?type=track-pants`.
2. **Shorts** — show up to four actual in-stock standalone shorts products and a “Shop Shorts” link to `/shop?type=shorts`. Never fill this section with “First copy + shorts” jersey bundles.
3. **Collar T-Shirts** — show up to four actual in-stock collar T-shirt products and a “Shop Collar T-Shirts” link to `/shop?type=collar-tshirt`. Do not substitute collared jerseys or ordinary jerseys.

Keep these sections clearly part of the current site: reuse card, button, eyebrow, heading, spacing and color patterns. Use the same four-column desktop grid pattern for **each** section; collapse responsively to two columns on typical mobile widths, or one only when needed to prevent clipping at very narrow widths. Maintain tap targets at least 44px and no horizontal page overflow. When a category has fewer than four real products, show only those products; do not duplicate cards to fill the row. When it has none, show the heading, an unobtrusive availability message, and the filtered CTA in a **compact** layout. Do not leave tall blank containers or a section that is invisible because of scroll-reveal behavior.

## Acceptance checks before handing back

Run `npm test` and `npm run build`, then test in the browser at 320, 375, 768, 1024 and 1440px. Compare new homepage screenshots against the saved baseline. Check that the original hero/nav/marquee/featured/26-27/team/in-page shop/quality-guide visuals and interactions remain intact. Verify a single normal scrollbar, no large empty gaps, no clipped circles, no viewport-wide overflow, no invisible content after scrolling, no console errors, and reduced-motion behavior.

Verify every circle goes to `/shop`, applies the intended filter, survives refresh and back/forward, and can be cleared. Verify combinations, sort, search, pagination and empty states. Verify each new homepage section uses the existing four-column product-card pattern on desktop, shows only matching real in-stock products, and its CTA opens the filtered shop view. Verify an existing jersey, standalone shorts, track-pants and collar T-shirt item through product detail → size selection → bag → checkout, using temporary development fixtures if needed; do not leave invented stock in the user's catalogue. Confirm admin can add/edit those types and retro tags. Keep the existing checkout/payment behavior rather than broadening this task into a payment redesign.

At the end, report precisely which files changed, what was tested, whether real shorts/track-pants/collar inventory exists, and any remaining data/asset gaps. Do not call the task complete if any circle is decorative, any section is blank due to styling, or `/shop` is only the old homepage filtered in place.
