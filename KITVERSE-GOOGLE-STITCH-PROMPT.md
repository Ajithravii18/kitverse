# KITVERSE — complete Google Stitch redesign prompt

Copy everything below the divider into Google Stitch. This brief describes the desired design and interactions; backend-dependent features require implementation and verification separately.

---

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
- Use KITVERSE consistently; an old README calls the project TERRACE, which is not the current customer-facing name.

Existing functionality includes catalogue filtering, price sorting, pagination, local bag persistence, registration, email-code verification, login, password recovery/reset, saved-address selection in checkout, customer order history, reference-based order tracking, account editing, product administration, and order-status administration. Payment initiation uses Razorpay, but the current flow needs reliable server-confirmed outcomes. Never represent a client payment callback alone as verified payment success.

## 2. Creative direction: KITVERSE — A Journal of Football Culture

Create a bespoke editorial commerce website with the visual authority of an independent football and fashion publication. The user explicitly rejects a Shopify-template aesthetic. The defining features must be typography, photographic art direction, composition, and disciplined interaction. This is a complete visual reset. Preserve the functional requirements in this brief.

THEME
Use editorial paper #F2F0E9, ink #171717, white #FFFFFF, and oxblood #702D37 for restrained emphasis and primary purchase actions. Secondary text #62605C. Use ink-on-paper for most content and occasional inverted ink sections for chapter transitions. Verify actual contrast. Remove the earlier forest-green/brass direction. Avoid gradients, decorative gold, pill-shaped cards, soft dashboard panels, repeated rounded tiles, and constant shadows. Use hairline rules, crisp edges, deliberate empty space, and 0–4px corner radii. Reserve larger radii for mobile sheets when useful.

TYPOGRAPHY
Use Bodoni Moda, roman and italic, for expressive editorial display headlines; pair it with a highly readable neutral sans such as DM Sans for all shopping controls, descriptions, prices, and navigation. These are the two type families for the system. Use tabular numerals for prices and quantities. Do not use fragile serif text for small labels. Limit loaded font weights and provide immediate fallback rendering.

Headline example: “Football, / worn differently.” Set “Football,” in large roman display and “worn differently.” in a contrasting italic treatment. Use editorial line breaks intentionally. Desktop display approximately 88–136px with controlled line-height; mobile approximately 44–60px, scaled down for narrow screens without clipped letters. Section titles approximately 32–56px desktop and 28–36px mobile. Body and forms 16px; product titles 14–16px; small metadata 12–14px. Keep body copy in sentence case. Small uppercase chapter labels may have restrained tracking.

COMPOSITION
Use a 12-column desktop grid, 4-column mobile grid, 20px mobile gutters, and generous desktop margins. Compose each editorial section deliberately: a large image beside a small caption, a typographic interlude, a restrained product selection, then a contrasting photographic spread. Maintain alignment and rhythm despite varied compositions. Catalogue grids remain orderly and easy to scan. The homepage should feel curated rather than assembled from repeating theme sections.

PHOTOGRAPHY
Use natural stadium-concourse light, concrete terraces, tunnel shadows, football shirts worn as everyday fashion, and close textile details. Keep styling sophisticated and believable. Use one excellent image rather than a collage of unrelated stock imagery. Commerce photography must show the actual product clearly and accurately; editorial assets must not be passed off as exact product views. Never fabricate alternative views, official affiliations, reviews, sales counts, scarcity, or shipping promises. Identify concept placeholders in the design handoff.

SIGNATURE HERO — DESIGN THIS PRECISELY
Desktop: a quiet, approximately 76px masthead with KITVERSE on the left and a small functional navigation on the right. Below, compose a magazine-cover-style opening spread on the paper background. An oversized two-line serif headline spans approximately columns 1–8; a tall campaign photograph occupies approximately columns 7–12 with deliberate overlap confined to a low-detail area. Keep headline contrast dependable and never place purchase controls over a busy image. Add a small chapter marker such as “01 / THE CULTURE”, a brief 1–2-line supporting statement, and one solid ink CTA “Explore the collection” with a secondary text link “Find your team”. A tiny caption can identify the editorial scene. Avoid a conventional centered banner, boxed split-screen sales hero, floating product card, or carousel.

Mobile: redesign the composition rather than scaling desktop. Use a compact masthead, chapter label, 2–3 intentional headline lines, a short supporting sentence, and a reachable primary CTA within the initial viewport. Place the portrait image immediately below or alongside a carefully sized portion of the title only when legibility holds. At 390×844 the visitor should understand the product and see the CTA without waiting for animation; at shorter heights prioritize content flow over a forced full-screen image. Let the next section begin to appear. Supply dedicated mobile image crops. No fixed 100vh trap, sideways text, tiny navigation, or overlapping controls.

Opening motion: the masthead appears immediately; headline and photograph may settle with a restrained 8–12px translation and opacity change over 250–400ms. Shopping actions are usable immediately. No character-by-character delays, blur reveals, scroll hijacking, or continuous parallax. Reduced-motion users receive the final composition directly.

BRANDED LOADING PAGE AND LOADING STATES
Design a beautiful first-entry loading state using the same paper background, a crisp KITVERSE wordmark, a small “Football. Culture. Identity.” line, and one fine animated rule. Keep it typographic and quiet. It is an actual loading state, not a mandatory cinematic intro. Show it only when initial critical resources are pending; skip it entirely on fast loads and repeat navigation. Do not add an artificial minimum duration, fake percentage, or delay for the animation to finish. If meaningful progress cannot be measured, use an indeterminate rule instead of numbers.

Keep the shell renderable immediately and fail open to readable content. The loader must never depend on all catalogue images, web fonts, analytics, or third-party payment assets finishing. If loading persists, transition to the usable shell with product skeletons and a plain loading message; actual failure receives Retry. The page must remain usable if animation JavaScript fails. Loader status is announced accessibly without trapping focus. Reduced-motion mode uses a static wordmark and status text. Do not replay the full-screen loader when filtering, adding to bag, or changing routes; use localized pending states instead.

PROFESSIONAL POLISH
Use one consistent line-icon family, precise baseline alignment, thoughtful empty states, crisp product imagery, and generous but purposeful whitespace. Links and buttons must remain identifiable. Avoid custom cursors, marquees, novelty hover physics, marketing popups, and ornamental interactions that compete with products. Carry the same editorial identity into authentication, checkout, account, and admin with progressively quieter typography for task-heavy screens.

PERFORMANCE HANDOFF
Specify responsive AVIF/WebP imagery with explicit dimensions and mobile crops. Prioritize only the actual hero/LCP image; lazy-load below-fold images. Load a small subset of the two font families with swap-compatible fallbacks. Avoid autoplay video and heavyweight animation libraries for simple transitions. Use transform/opacity motion and reserve layout space to prevent shifts. Implementation targets: LCP ≤2.5s, INP ≤200ms, CLS ≤0.1 at the 75th percentile; these must be measured in the implemented site, not claimed from design mockups. Include slow-network, missing-image, and reduced-motion variants in the handoff.

## 3. Navigation and information architecture

Desktop: a compact header with KITVERSE, Shop, Teams, Retro, Apparel, and search/account/bag actions. Use a structured Teams menu separating club and national teams. Make the current location clear.

Mobile: a compact brand header with search and bag access. Use a compact menu, centered or left-aligned wordmark, and visible search/bag actions. Open a well-organized full-height navigation sheet for Shop, Teams, Retro, Apparel, and Account. Keep the website character; do not add a persistent app-style bottom tab bar. Teams opens a searchable team directory. Show bag quantity in the header.

On product and checkout screens, provide the relevant sticky purchase action bar. Never stack multiple fixed bars over the content. Respect safe-area insets and leave enough bottom padding. Back navigation must restore the previous filters, loaded products, and scroll position.

## 4. Design all customer screens

A. Home
- Implement the signature magazine-cover hero and mobile composition described in section 2. Use “Football, worn differently.” as the main headline.
- Follow with “The selection”: four to six real featured products with open image frames, quiet metadata, and clear prices. No bordered card containers or excessive merchandising badges.
- Add a photographic “Club & country” editorial spread with two clear collection links; then a typographic team directory that is searchable and easy to use on a phone.
- Add a single retro story or seasonal editorial chapter only when suitable products exist, followed by concise apparel discovery and a compact quality/fit guide.
- Finish with an oversized KITVERSE wordmark, carefully grouped useful links, and real business information. Avoid a generic multi-row promotional footer.
- Keep the homepage curated. The full catalogue belongs in Shop. Use “Featured” rather than “Bestsellers” unless sales data supports the claim.

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

