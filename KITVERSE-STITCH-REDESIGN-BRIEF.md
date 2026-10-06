# KITVERSE — workflow-aligned redesign brief for a fresh Stitch project

## Confirmation and scope

This brief is based on the existing React/Vite/Express/MongoDB project, not an invented store. The current route definitions, customer/admin API endpoints, storefront sections, checkout, account, product modal, catalogue filters, and stock/bag logic were reviewed. This is a source-code workflow review, not confirmation that every backend service is production-ready.

A fresh Stitch project means a new design workspace for the existing KITVERSE application. Preserve the business workflows while replacing the visual design.

### Existing workflow map

| Area | Existing behavior | Redesign treatment |
| --- | --- | --- |
| Home `/` | Featured jerseys, season kits, team discovery, kit room, track pants, shorts, collar T-shirts, quality guide, closing/footer | Recompose into scroll-driven chapters |
| Shop `/shop` | URL-driven filters, product-type/team/category/quality/retro discovery, price sorting and pagination | Shared catalogue design; connect search/available-size filters consistently |
| Product details | Gallery, size selection, stock limits, sizing help and related items in a modal | Preserve behavior; propose a dedicated shareable product route and quick-add sheet |
| Shopping bag | Browser persistence, quantity limits and catalogue reconciliation | Preserve rules; propose a mobile bag page and desktop drawer |
| Auth `/auth` | Login, registration, verification, forgot/reset password | Unified styling; preserve return-to-checkout journey |
| Checkout `/checkout` | Account required, address form, saved-address selection, order creation and Razorpay initiation | Clear steps and payment-state designs; verification/recovery require backend implementation |
| Account `/profile` | Order history/filtering, order details, reference tracking, profile/password updates | Clear mobile account experience |
| Admin `/admin/products` | Product creation/editing, media URLs, product metadata and stock | Organized product editor; no assumed upload integration |
| Admin `/admin/orders` | Orders and status changes | Responsive operational views |

### Proposed improvements, not existing completed capabilities

Dedicated product/bag/order-result routes; chapter choreography and rotating jersey hero; consistent catalogue search/size controls; bag removal undo; payment verification/retry UX; optional address management; verification resend; fuller help/policy pages. Clearly mark dependencies in design handoff notes.

The current product modal contains stale “Checkout unavailable” messaging while checkout/order code exists. Payment callbacks currently redirect to a homepage success toast. Resolve these inconsistencies in the proposed design, but do not treat design work as a backend payment fix. Demo and unconfigured-payment states must remain honest.

## Stitch instructions

1. Start a fresh website design project in Stitch.
2. Supply this Markdown document as the brief if file attachment is available. Otherwise paste everything under “MASTER PROMPT” into the initial message.
3. Include https://follow.art/ as the reference URL. If Stitch cannot inspect it, provide reference screenshots of the hero and a scrolled chapter; this brief already specifies the key visual details.
4. Send the kickoff instruction below. Establish the mobile/desktop hero, loader, typography, and chapter storyboard first.
5. Continue with the follow-up instructions after the visual foundation is generated. Keep all work in the same Stitch project to preserve consistency.
6. Review that all existing workflows remain covered. A design/prototype is a handoff for implementation; rotating 3D behavior, real stock, authentication, payments, and performance need implementation and testing in the application.

### Kickoff message

```text
Use the attached KITVERSE Markdown brief as the source of truth. This is a complete visual redesign of my existing project, created in a fresh Stitch workspace. Preserve the documented workflows and business rules.

Use https://follow.art/ as the visual and motion reference. Start with the mobile hero, desktop hero, branded loading state, shared typography/color system, and complete homepage chapter storyboard. Include the rotating jersey-panel concept and entry/midpoint/exit frames for scroll transitions. Follow the MASTER PROMPT. Identify anything you cannot implement interactively instead of presenting static screens as working motion.
```

### Follow-up 1 — finish the homepage

```text
Using the established design system, complete every homepage chapter in the brief for mobile and desktop. Preserve Featured Jerseys, Season Kits, Shop by Team, The Kit Room, Track Pants, Shorts, Collar T-Shirts, Know Your Kit, and the closing/footer. Show chapter transitions and reduced-motion/static alternatives. Keep shopping actions usable throughout.
```

### Follow-up 2 — shopping and checkout

```text
Extend the same design system into Shop/results, filters, product details, size selection, bag, authentication, checkout, and all payment-result states. Connect the full browse-to-order journey. Preserve account-required checkout, INR prices, separate quality listings, size-based inventory, and saved bag behavior. Mark proposed routes and backend-dependent behavior in handoff notes.
```

### Follow-up 3 — account, admin, and completeness

```text
Complete account/order history, order details/tracking, settings, help layouts, admin products/editor, and admin orders/details. Include mobile layouts, loading/empty/error states, and a reusable component sheet. Audit every screen against the existing workflow map and list any remaining gaps. Do not invent unsupported business services or claims.
```

---

# MASTER PROMPT

Act as a senior ecommerce product designer and art director. Completely redesign KITVERSE, an Indian football jersey and apparel ecommerce website, into an elegant, premium, customer-engaging shopping experience. Design the entire product, including customer journeys and administration. Prioritize mobile web before desktop. Deliver a connected family of polished screens and reusable components, not only a homepage concept.

## 1. Product context and business rules

KITVERSE sells club and national-team jerseys, retro jerseys, track pants, shorts, and collar T-shirts. Customers discover products through teams, categories, product types, quality options, and seasonal collections. Currency is INR. Typical sample jersey prices are ₹799–₹1,499; premium presentation should still feel welcoming and accessible.

The current application uses React, Vite, React Router, Express, and MongoDB. Existing routes are /, /shop, /auth, /checkout, /profile, /admin/products, and /admin/orders. Product details and the shopping bag currently open as dialogs. Propose dedicated /product/:slug and /bag pages and a dedicated order-result view as new routes for the rebuild, while preserving existing journeys.

Preserve these actual catalogue rules:
- Each listing has its own quality, price, slug, images, and stock quantities by size. Sizes are S, M, L, XL, XXL.
- Quality labels are exactly: Embroidery, First copy + shorts, Master copy, Player version. Explain them clearly without implying licensed authenticity, manufacturing specifications, or quality guarantees that have not been supplied.
- A different quality is a separate listing when stocked. Do not create a universal quality selector that implies every product exists in every quality.
- Jersey categories are club and national. Apparel also has a product type. Do not force team badges or jersey-specific quality details onto unrelated apparel.
- Disable unavailable sizes, enforce remaining quantities, and show stock changes clearly. A saved bag does not reserve stock.
- Seasonal and retro collections must be driven by real product metadata. Hide empty promotional sections.
- Use KITVERSE consistently; an old README calls the project KITVERSE, which is not the current customer-facing name.

Existing functionality includes catalogue filtering, price sorting, pagination, local bag persistence, registration, email-code verification, login, password recovery/reset, saved-address selection in checkout, customer order history, reference-based order tracking, account editing, product administration, and order-status administration. Payment initiation uses Razorpay, but the current flow needs reliable server-confirmed outcomes. Never represent a client payment callback alone as verified payment success.

## 2. Visual reference, typography, motion, and performance

Primary reference: https://follow.art/

Inspect the reference if possible. Use its oversized condensed headlines, orange and muted grey-green chapter backgrounds, black/white contrast, fine dividing lines, sparse navigation, and rotating hero arrangement as the visual foundation. Create KITVERSE branding and football content. This supersedes all previous ivory/serif/oxblood directions.

The reference's inspected CSS declares Hardbop for display headings and HeadingNow for supporting text. Use these if licensed assets are supplied; otherwise approximate with Anton and Inter. Do not claim the substitute is the exact original font. Starting palette: orange #FA7935, muted grey-green #93998B, near-black #111111, off-white #F7F6F2. These hex values are approximations, not verified source tokens. Adjust pairings for readable contrast.

Use huge tightly composed display type, crisp image frames, hairline rules, and intentional whitespace. Body and form text should remain readable, generally 16px on mobile. Use short uppercase display headlines, but natural sentence case for forms and product information. Avoid generic Shopify layouts, repeated rounded product containers, decorative gradients, excessive badges, or constant shadows.

HERO: On orange, place enormous white KITVERSE lettering behind or above a central elliptical arrangement of approximately five jersey panels. One front-facing product dominates while side panels recede in perspective. Use clean jersey cutouts on flat rotating panels. This is not a fabricated 360-degree garment model: never invent unseen backs. Provide a stable product-name/INR-price caption. Headline: “YOUR CLUB. YOUR COLOURS.” Primary action: “Explore jerseys”; secondary: “Find your team”. Keep controls outside moving panels.

Allow slow ambient rotation with pause, previous, and next controls. Manual interaction pauses it. Optional drag/swipe must preserve vertical touch scrolling. During the hero's short scroll exit, rotate the arrangement slightly and move it upward while the next chapter enters. Avoid long pinned sequences. If interactive rendering is unsupported, supply entry/midpoint/exit frames and implementation notes, plus a static fallback.

SCROLL: Treat the homepage as one continuous document with distinct editorial chapters. Near-viewport-height sections are suitable only when content fits. Longer sections grow naturally. Use native scrolling, brief sticky moments, coordinated background changes, and restrained image/text reveals. Reverse scroll-linked motion naturally when moving upward. Never require completing an animation to access a shopping action. Sections reveal on scroll; they do not each reload or display a loading screen.

MOBILE: Compose separately at 390px and support 360px. Use a compact menu/wordmark/search/bag header, fewer visible jersey panels, lighter perspective, a readable headline, and an early visible CTA. Avoid forced full-screen heights, clipped controls, horizontal overflow, or overlapping fixed bars. Reduced-motion mode shows static chapters with manual carousel controls.

LOADING: A minimal initial screen uses the condensed KITVERSE wordmark, “Getting the kit room ready”, and a fine animated rule. Show only during real critical-resource loading; skip on fast loads and repeat navigation. No fake percentages or artificial minimum duration. Render the useful shell immediately and use a static hero poster while rotation initializes. Show product skeletons and local pending states afterward. Failed loading needs a clear retry state, not a permanently blocked screen.

PERFORMANCE: Specify responsive compressed imagery, explicit dimensions, dedicated mobile crops, limited font weights, and lightweight transform/opacity animation. Prioritize the hero image, lazy-load below-fold assets, prepare upcoming chapter imagery before entry, pause offscreen motion, and provide static fallback when 3D rendering fails. Later implementation should measure LCP ≤2.5s, INP ≤200ms, CLS ≤0.1 at the 75th percentile. These are targets, not a claim that a mockup is optimized.

Use accurate product photography. Identify conceptual assets in handoff notes. Do not invent alternate views, endorsements, reviews, stock urgency, delivery dates, or policies.

## 3. Navigation and information architecture

Desktop: a compact header with KITVERSE, Shop, Teams, Retro, Apparel, and search/account/bag actions. Use a structured Teams menu separating club and national teams. Make the current location clear.

Mobile: a compact brand header with search and bag access. Use a compact menu, centered or left-aligned wordmark, and visible search/bag actions. Open a well-organized full-height navigation sheet for Shop, Teams, Retro, Apparel, and Account. Keep the website character; do not add a persistent app-style bottom tab bar. Teams opens a searchable team directory. Show bag quantity in the header.

On product and checkout screens, provide the relevant sticky purchase action bar. Never stack multiple fixed bars over the content. Respect safe-area insets and leave enough bottom padding. Back navigation must restore the previous filters, loaded products, and scroll position.

## 4. Design all customer screens

A. Home: map the existing storefront into scroll chapters

01 — HERO: Rotating jersey-panel composition specified above, immediate shopping CTA, and Find your team.
02 — FEATURED JERSEYS: Grey-green backdrop, oversized THE SELECTION, four to six curated products, readable INR prices, and Shop all jerseys.
03 — SEASON KITS: Preserve the current seasonal collection concept (currently 26/27 in the source). Derive the displayed season from real stocked metadata. One dominant jersey, supporting products, and Explore the season. Hide when empty.
04 — SHOP BY TEAM: Oversized CLUB & COUNTRY, searchable team directory, club/national grouping, and available crest assets. Selection opens filtered Shop results.
05 — THE KIT ROOM: Concise preview of the catalogue with club, national, retro, and quality discovery. Full search/filter/sort/pagination lives in Shop.
06 — TRACK PANTS: Dedicated editorial apparel composition with accurate imagery and a direct collection link.
07 — SHORTS: A distinct connected composition and collection link.
08 — COLLAR T-SHIRTS: A third apparel composition and collection link. Chapters 06–08 may share a brief desktop sticky sequence; use natural stacked sections on mobile. Hide empty categories.
09 — KNOW YOUR KIT: All four actual quality labels, numbered rows, thin rules, factual descriptions, and sizing help. Do not invent material specifications.
10 — CLOSING AND FOOTER: SEE YOU ON MATCHDAY, an obvious shopping action, large KITVERSE wordmark, and grouped account/tracking/contact/sizing/delivery/returns links.

Each chapter needs an entry, focal point, and exit. Keep shopping actions reachable. Reserve elaborate scroll storytelling for the homepage; checkout, account, and admin remain calm and direct.

B. Shop, search, team and collection results
- Use one reusable catalogue layout with collection title, short context, result count, search, active filters, and sorting.
- Filters: product type, club/national category where relevant, team, quality where relevant, available size, and retro. Seasonal collection filtering is a proposed extension and must map to actual season metadata.
- Sort by featured, price low to high, and price high to low. Do not invent popularity or newest sorting without appropriate data.
- Mobile: two-column product grid, readable names and prices, generous product imagery, and a compact Filter / Sort toolbar. Use a bottom sheet with selected counts, Clear all, and “Show N products.” Preserve changes when reopening.
- Desktop: four-column grid with a restrained filter sidebar or clearly organized filter controls.
- Product cards show image, name, team or category, quality when relevant, INR price, and an explicit quick-add control. Quick add opens size selection; never silently choose a size.
- Use load-more or accessible pagination with visible progress and persistent browsing position. Include search results, no matches, loading skeletons, network failure with retry, and image fallback designs.

C. Product details
- Create a dedicated shareable product page plus a lighter quick-add sheet.
- Mobile: gallery first, clear product name and price, quality explanation, size selector, nearby sizing help, and a sticky Add to bag action. If size is missing, the action should guide the customer to size selection with clear feedback.
- Desktop: generous gallery beside a purchase panel; keep purchase information visible without obstructing scrolling.
- Show thumbnails only for supplied images. Provide zoom and accessible next/previous controls; gestures are optional enhancements.
- Show selected, available, sold-out, and quantity-limit states for sizes. Explain fit only from verified information.
- Use inline expanding sections for product details, fit, delivery, and returns. If measurements or policy data are missing, show an honest unavailable state. Do not layer one modal inside another.
- Recommend a small number of relevant, actually available products by team or category.
- After adding, show the selected item and size, updated bag quantity, “View bag,” and “Continue shopping,” while preserving browsing context.

D. Bag
- Provide a desktop drawer and a full mobile bag page using the same component language.
- Each item has a thumbnail, name, quality, size, unit price, quantity controls, line total, and explicit Remove action with a short undo opportunity.
- Include subtotal, honest shipping/tax information when available, and a prominent checkout action. Never imply shipping is free when no policy exists.
- Design empty bag, stock reduced, item unavailable, price changed, and storage unavailable states. Explain changes instead of silently dropping items.

E. Authentication
- Design cohesive login, registration, email verification, forgot-password, and reset-password screens.
- Preserve the bag and checkout destination through authentication. Current checkout requires an account: retain this baseline instead of silently inventing guest checkout.
- Use visible field labels, password visibility controls, password-manager support, paste-friendly code entry, useful error messages, and clear progress feedback.
- Verification resend is a proposed backend-dependent improvement; include its availability/cooldown states only when supported.

F. Checkout and payment result
- Create a focused mobile checkout with Contact → Delivery → Review & pay. Keep progress clear and editable without losing completed input.
- Support existing saved-address selection and a new-address form: name, email, phone, street, optional apartment, city, state, six-digit PIN code, country India; hide alternate phone and notes behind optional controls.
- Use browser autofill and appropriate mobile keyboards. Retain values after errors. Show field errors beside inputs and a linked summary after failed submission.
- Mobile order summary expands above the payment action. Desktop uses a main form plus sticky summary. Show item thumbnails, sizes, quantities, and transparent totals.
- Hand off to the configured Razorpay experience. Do not invent COD, payment offers, or custom card forms.
- Design submitting, payment handoff, awaiting verification, confirmed paid, dismissed/cancelled payment, failed payment, and recoverable connection interruption states. Keep order and payment status distinct.
- Use a dedicated order-result page showing a reference, purchased items, verified status, and “View order.” Do not reduce confirmation to a temporary homepage toast. Recovery must avoid accidental duplicate orders.
- Also design a clear checkout-unavailable state for demo mode or missing payment configuration.

G. Account, order details and tracking
- Design order history with search, status filters, date filters, pagination, and clear order cards on phones.
- Order details show the reference, items, amount, address, and known status. Current stored statuses are pending_payment, paid, fulfilled, cancelled. Display customer-friendly labels while retaining that distinction.
- Tracking uses the available reference lookup. Do not invent courier locations, dispatch dates, delivery estimates, or delivered status without fulfillment data. Show a modest status summary when that is all the system knows.
- Include account settings, email/username editing, password change, and logout, with success/error feedback.
- Propose standalone address management as an extension only; saved-address selection already exists in checkout.

H. Helpful content
- Design quality-guide, sizing-help, contact, delivery, returns, and privacy content layouts using real supplied business information when available.
- Keep unknown information clearly pending. Do not fill policy pages with made-up promises or business contact details.

## 5. Administration

Design an admin workspace that shares typography and tokens but prioritizes operational clarity.
- Admin login and authorization/error states.
- Products catalogue with search, publication state, image thumbnail, price, and per-size inventory visibility.
- Add/edit product with name, slug, product type, team/category where applicable, quality, INR price, images and labels, season, retro flag, featured flag, publication status, and S–XXL stock quantities.
- The existing image workflow uses URLs: preserve URL entry and preview. File upload is a proposed integration, not existing functionality.
- Group the editor into Product information, Media, Pricing, Inventory, and Visibility. Show validation and unsaved-change feedback.
- Orders list and order detail with reference, customer, line items, amount, date, and controlled status updates. Include confirmation and failure states for consequential changes.
- Use tables on desktop and readable cards on mobile, with accessible row actions. Do not add fictitious revenue dashboards or analytics.

## 6. Mobile interaction and accessibility requirements

Design at 390px first and verify layouts conceptually at 360px, 430px, 768px, and 1440px. Phones must receive intentionally composed screens, not reduced desktop layouts.
- At least 44×44 CSS-pixel touch targets; aim for 48px on primary controls.
- No horizontal page overflow, clipped prices, inaccessible close buttons, hover-only actions, or input zoom caused by undersized form text.
- Maintain readable text contrast, visible focus, persistent labels, logical heading order, and meaningful accessible names. Do not communicate stock or status through color alone.
- Dialogs and sheets need sensible focus handling, Escape/close controls, scroll containment, and restoration to their trigger.
- Support keyboard navigation, enlarged text, reduced motion, and usable browser Back behavior.
- Use restrained 150–250ms transitions and immediate tap feedback. Avoid scroll hijacking, automatic carousels, and delayed content reveals.
- Design stable image ratios and skeletons, responsive image delivery, and lazy loading below the fold for the later implementation. Keep the first screen lightweight for mobile connections.

## 7. Deliverables and connected prototype

Produce a shared design-system sheet covering colors, type, spacing, buttons, fields, product cards, badges, size controls, alerts, navigation, sheets, and loading/empty/error states.

First establish the loading state, mobile hero, desktop hero, and typography sheet as the visual foundation. Then create mobile and desktop designs for every major screen listed above. Prioritize the connected core journey first: Home → Shop/team results → Product → Size selection → Bag → Login/verification when needed → Checkout → Payment state → Order details. Then complete account/help/admin screens using the same system.

Demonstrate these specific interactions: select a team; combine team and available-size filters; recover from no results; choose an available size; add to bag; edit quantity; return from authentication; select an address; recover from payment cancellation; inspect an order; edit product stock in admin.

Keep sample products and prices consistent between screens. Use these existing examples: Liverpool Home 23/24, Embroidery, ₹799; Real Madrid Home 24/25, First copy + shorts, ₹1,099; Chelsea Home 25/26, Master copy, ₹1,249; Argentina Home 2024, Player version, ₹1,499. These are sample catalogue values, not promises of current availability.

Mark proposed features and backend dependencies in designer handoff notes, not in normal customer-facing copy. All visible controls must have a defined destination or state. If the output must be split into batches, retain the same design tokens and continue until customer, account, support, and admin coverage is complete.

The finished design should feel unmistakably like a premium football culture store: emotionally engaging on arrival, exceptionally clear when selecting a product, effortless to navigate with one hand, and trustworthy throughout checkout and after purchase.



