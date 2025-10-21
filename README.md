# alioop-mvp-static

This repo contains a Vite + React frontend and a small Express mock API. The development setup runs two processes (Vite dev server on 5173 and mock API on 4000). This README explains how to run locally and how to package the project for sharing with others using Docker.

## Run locally (development)

Requirements: Node 18+, npm

Install and run:

```bash
npm install
npm start
```

- Frontend: http://localhost:5173
- API: http://localhost:4000/api/test

## Production (single Docker container)

This repository includes a multi-stage Dockerfile that builds the frontend and serves it together with the Express API in one container.

Build the image:

```bash
docker build -t alioop-mvp-static:latest .
```

Run the container (exposes port 4000):

```bash
docker run --rm -p 4000:4000 alioop-mvp-static:latest
```

Then browse to http://localhost:4000 (the app will serve the built frontend and API endpoints under `/api`).

Alternatively use docker-compose:

```bash
docker-compose up --build
```

## Hosting options

- Frontend-only: Deploy the `dist/` produced by `npm run build` to Vercel, Netlify, or any static hosting.
- Single host: Use the Docker image on Render, Fly.io, or a VPS to host both frontend and API together.

## Notes

- The `server/prod-server.mjs` file serves static `dist/` files when present and provides a small mock API. Make sure you run `npm run build` before starting the production server if you are not using Docker.
- Tailwind/PostCSS is configured; if you change PostCSS config files and use ESM, prefer `.mjs` for ESM or `.cjs` for CommonJS depending on your `package.json` `type` field.

If you'd like, I can push a branch with these changes, or build the Docker image and upload it somewhere for testing. Let me know which you prefer.
