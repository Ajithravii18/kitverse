# KITVERSE — MERN jersey storefront

React + Vite frontend, Express/Node API, and MongoDB via Mongoose. Mobile-first design with four quality options, team/search filtering, price sorting, pagination, product selection, sizes and a locally saved shopping bag. Full order processing, Razorpay payments, and an admin dashboard are fully implemented.

## Run locally

Requires Node.js 22.20+ and npm.

1. Run `npm install`.
2. Run `npm run dev`.
3. Open http://127.0.0.1:5174. The API runs on port 4000.

Without `.env`, the API serves a clearly labelled demo catalogue. The bag is saved in this browser. On reload, unavailable items are removed, quantities are capped to current stock and prices are refreshed from the API. If browser storage is unavailable, the bag works for the current visit and shows a notice. Bag quantities do not reserve stock until checkout.

## Connect MongoDB

Copy `.env.example` to `.env` and set `MONGODB_URI` to your local MongoDB or MongoDB Atlas URI. **A MongoDB Replica Set is required** to support transactions during checkout and order placement. Never commit credentials. Run `npm run seed` to insert sample products without replacing existing records, then `npm run dev`. Connection failures stop the server instead of silently falling back to demo mode. Replace sample records and images with your own catalogue before launching.

## Production and checks

`npm run build` builds React into `client/dist`; `npm start` serves it and the API from Express on port 4000. Put a TLS reverse proxy in front of the Node server for deployment. The default bind address is `127.0.0.1`; set `HOST=0.0.0.0` when required by container hosting.

`npm test` runs tests covering catalogue responses, filtering, pagination bounds, public fields, inventory validation, saved-bag reconciliation and database-unavailable behaviour. MongoDB integration requires a running database; it is not simulated by the API tests.

`npm run test:browser` runs interaction checks against the production build, using an existing Playwright installation and Edge. Build first. Set `PLAYWRIGHT_MODULE` to the file URL of an installed Playwright `index.mjs` if it is outside this project; set `BROWSER_CHANNEL=chrome` to use Chrome instead. The check starts and closes its own local server and browser, blocks external image/font requests to exercise image fallbacks, and saves desktop/mobile screenshots in ignored `artifacts/`. It covers filtering from later pages, complete filter reset, bag persistence and stock limits, nested-dialog keyboard focus, mobile navigation, malformed local storage and API retry.

`GET /api/products` supports `?quality=Embroidery` (or another exact quality label). `GET /api/health` reports availability and database/demo mode. No public write endpoints are exposed.

The earlier static concept is retained under `archive/dist` for reference. Its `archive/.openai/hosting.json` is for that previous static concept, not the MERN app. The MERN app has not been deployed. Deploy to infrastructure that supports Node and MongoDB.

## Illustrative photography

Four sample listings retain retailer image references whose filenames match the listed product. Their commercial reuse permission is not verified. The remaining listings use an explicitly labelled local placeholder because their previous images depicted unrelated products. Failed remote images also use this fallback. Replace placeholders and retailer references with your own product photography before launch.

Product galleries use only that listing's `images` array (`[{url, label}]`), or its single `image`. They never substitute photos from another product or invent alternate views. The API accepts HTTPS image URLs and local `/images/` paths. Existing database records are not overwritten automatically; review their photography separately.

- https://aztecasoccer.com/products/nike-mens-liverpool-2023-24-home-jersey-red-white
- https://soccerpost.com/products/adidas-real-madrid-24-25-home-jersey-white-iu5011
- https://soccerpost.com/products/nike-chelsea-25-26-home-jersey-rush-blue-white-speed-red-white-hj4589-496
- https://www.totalfootballdirect.com/joma-inter-iv-shirt-red-/-white

## Stock-based listings

Each listing has one quality and price, a `category` (`club` or `national`), and integer quantities in `stock` (`S`, `M`, `L`, `XL`, `XXL`). List a different quality as a separate SKU/slug only when actually stocked. The API hides sold-out listings; the UI disables sold-out sizes and caps bag quantities. These cart limits are not inventory reservations: a future checkout must atomically validate/decrement stock server-side.

`GET /api/products` now also accepts `category=club` or `category=national`, combined with `quality`.

Existing database documents with the old `variants` structure must be updated with verified quality, category, price and stock before appearing. No real stock is inferred or overwritten by the seed script. Its insert-only behavior preserves existing products. The new Argentina sample uses illustrative photography from https://www.ohpsoccer.com/products/adidas-argentina-home-jersey-24-25 (commercial reuse not verified).

## Project layout

- `client/src/main.jsx`: storefront composition and browsing state.
- `client/src/components/`: reusable native dialog, product photo fallback and product detail UI.
- `client/src/useBag.js`: browser persistence with graceful storage failure.
- `shared/storefront.js`: filtering and pagination.
- `shared/inventory.js`: stock checks, bag changes and saved-bag reconciliation.
- `shared/product.js`: catalogue eligibility and public API projection.
- `server/`: Express application, Mongoose schema, insert-only seed and regression tests.
- `scripts/browser-check.mjs`: repeatable desktop/mobile browser checks.

## Store launch requirements

The storefront deliberately has no fabricated reviews, sales counters, shipping promises or generic size measurements presented as verified product measurements. Featured products and hero prices come from the current catalogue. Footer information dialogs explain which business details are pending.

Before real orders can be enabled, supply the payment provider/account configuration, business contact details, delivery areas and shipping/returns terms, verified product photography/measurements and real inventory. Checkout still requires a server-side order workflow, atomic inventory reservation/decrement, payment confirmation/webhook handling and protected administration. No real payments or orders are accepted by this project yet.

The repository currently has no initial commit. Source changes are local; no files have been staged, committed or published automatically.


### Notification delivery and integration checks
Production requires `SMTP_HOST` and a verified `SMTP_FROM` sender address. Configure `SMTP_PORT` (587 by default), `SMTP_USER`, and `SMTP_PASS` for your provider. Port 465 enables implicit TLS. Missing production configuration fails startup; there is no silent stream-delivery fallback.
Notifications are inserted in the same transaction as order changes. The server checks the queue every 15 seconds, retries with a delay, and reclaims expired worker leases. SMTP delivery is at least once: a crash after provider acceptance but before saving delivery status can cause a repeated email. Stable Message-ID values help trace these cases; they do not guarantee provider deduplication.
Run `node scripts/run-integration.mjs` for all tests against an isolated temporary replica set. The runner keeps its event loop active and executes files serially to avoid shared-fixture deletion races. Notification tests inject a test transport and do not send customer email.
