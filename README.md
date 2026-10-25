# Find Your Seat

A small seating-chart lookup built with Vite, React, TypeScript, and Bun.

## Run locally

```sh
bun install
bun run dev
```

## Update the guest list

Edit `data/seating.csv`, then regenerate the typed roster:

```sh
bun run generate:seating
```

`bun run build` regenerates the roster automatically before building.

## Deploy

The repo includes `vercel.json`, so Vercel installs with Bun, builds with `bun run build`, and serves `dist`.
Import the repo into Vercel and deploy. No environment variables are required.
