# MAAL — Seedhe Maut Official Merch

MAAL is a Next.js storefront for Seedhe Maut merchandise. It includes the home merch wall, product and collection pages, shop index, about and contact pages, and a local shopping bag that hands checkout off to the official Shopify store.

The catalogue and Shopify variant IDs are maintained in `src/data/products.ts`. Product imagery and the home film are served from Shopify's CDN. The storefront does not require environment variables for local development or deployment.

## Requirements

- Node.js 20 or newer
- npm

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build and run

```bash
npm run build
npm start
```

Run the linter with `npm run lint`.

## Deploy on Vercel

Import this GitHub repository into Vercel and keep the detected Next.js settings. The production build uses `npm run build`; no environment variables are currently required. Once the repository is connected, pushes to the production branch deploy automatically.

## Project structure

- `src/app/` — routes and global styles
- `src/components/` — storefront UI
- `src/data/products.ts` — product and collection catalogue
- `src/lib/cart.tsx` — browser shopping bag and Shopify checkout URL
- `src/lib/shopify-loader.ts` — Shopify CDN image sizing
