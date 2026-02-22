# Ecommerce Admin Portal SPA

React + Vite single-page application for a coffee e-commerce admin workflow.

## Features

- Client-side routing with three views:
  - Home (`/`)
  - Shop (`/shop`)
  - Admin Portal (`/admin`)
- Dynamic product search and location/category filtering.
- Admin product creation (`POST /products`).
- Admin product updates (`PATCH /products/:id`).
- Shared global state with React Context.
- Unit and interaction tests with Vitest + React Testing Library.

## Tech Stack

- React 19
- React Router
- Vite
- json-server (mock REST API)
- Vitest + React Testing Library

## Project Structure

```text
src/
├── components/
├── context/
├── hooks/
├── pages/
├── services/
├── styles/
└── tests/
```

## Setup

1. Install dependencies:

```bash
npm install
```

2. Start mock API server:

```bash
npm run api
```

3. In a second terminal, start frontend:

```bash
npm run dev
```

4. Open the local URL printed by Vite (typically `http://localhost:5173`).

## Usage

- Navigate with top menu: Home, Shop, Admin Portal.
- Shop page:
  - Use Search field for live filtering.
  - Click location filters to narrow products.
- Admin page:
  - Submit form to add a product.
  - Edit existing product card fields and click Save Changes.

## API Endpoints Used

- `GET /heroContent`
- `GET /navLinks`
- `GET /categories`
- `GET /products`
- `POST /products`
- `PATCH /products/:id`

Default base URL: `http://localhost:3001`

## Testing

Run once:

```bash
npm run test
```

Watch mode:

```bash
npm run test:watch
```

## Known Limitations

- Authentication is mocked; admin access is not secured.
- API is local json-server only (no production backend).
- Global submit state in Admin can disable multiple save buttons simultaneously.
- No pagination or server-side search for large product catalogs.

## Debugging

- Browser DevTools:
  - Network tab for `GET`/`POST`/`PATCH` verification.
  - Console tab for runtime errors.
- React DevTools:
  - Inspect `ProductProvider` state and route component rendering.

## Push to GitHub (Public Repository)

Create a new **public** GitHub repository, then run:

```bash
git add .
git commit -m "Complete ecommerce admin portal"

git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

If remote already exists:

```bash
git remote set-url origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```
