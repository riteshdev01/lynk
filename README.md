# URL Shortener

A full-stack URL shortener built with Express, MongoDB, React, and Vite.

This README reflects the current implementation in this repository.

## What This Project Does

- Shorten URLs without login
- Register, login, logout with cookie-based JWT auth
- Create custom slugs for authenticated users
- Redirect short links and track clicks
- Show recent links in dashboard with summary stats
- Open, copy, and delete your own URLs from dashboard
- Toggle light/dark mode in auth and dashboard screens

## What I Implemented In This Project

- Monorepo structure with separate backend and frontend apps
- Layered backend architecture: Routes -> Controllers -> Services -> DAO -> Models
- Cookie-based authentication with protected routes
- Global optional user attachment middleware (`attachUser`) for mixed public/private behavior
- URL creation flow for both anonymous and logged-in users
- Redirect flow with click increment (`findOneAndUpdate` + `$inc`)
- Dashboard URL listing (`POST /api/user/urls`)
- URL deletion endpoint with ownership check (`DELETE /api/user/urls/:urlId`)
- Dashboard delete action in UI (no popup), with loading state + React Query refresh
- Route guard on dashboard using TanStack Router + `GET /api/auth/me`

## Tech Stack

### Backend

- Node.js
- Express 5
- MongoDB + Mongoose
- jsonwebtoken
- bcryptjs
- cookie-parser
- cors
- dotenv
- nanoid

### Frontend

- React 19
- Vite
- Redux Toolkit
- TanStack Router
- TanStack Query
- Axios
- Custom CSS for UI styling

Note: Tailwind packages exist in dependencies, but the current UI is primarily custom CSS-driven.

## Project Structure

```text
url-shortner/
  BACKEND/
    app.js
    package.json
    src/
      config/
      controller/
      dao/
      middleware/
      models/
      routes/
      services/
      utils/
  FRONTEND/
    package.json
    src/
      api/
      components/
      pages/
      routing/
      store/
      utils/
```

## API Endpoints

Base URL: `http://localhost:3000`

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me` (protected)

### URL

- `POST /api/create` (anonymous + authenticated)
- `GET /:id` (redirect + click increment)

### User URLs

- `POST /api/user/urls` (protected) -> fetch current user's links
- `DELETE /api/user/urls/:urlId` (protected) -> delete current user's link

## Request/Response Examples

### Create short URL

```http
POST /api/create
Content-Type: application/json

{
  "url": "https://example.com",
  "slug": "my-custom-slug"
}
```

```json
{
  "shortUrl": "http://localhost:3000/my-custom-slug"
}
```

### Get user's URLs

```http
POST /api/user/urls
Cookie: accessToken=...
```

```json
{
  "message": "success",
  "urls": [
    {
      "_id": "...",
      "full_url": "https://example.com",
      "short_url": "abc1234",
      "clicks": 3,
      "user": "..."
    }
  ]
}
```

### Delete user URL

```http
DELETE /api/user/urls/68000a111111111111111111
Cookie: accessToken=...
```

```json
{
  "message": "URL deleted"
}
```

## Authentication Model

- Register/login set an `accessToken` cookie
- Cookie options include `httpOnly` and `sameSite: Lax`
- Frontend sends credentials with Axios (`withCredentials: true`)
- Private endpoints are protected by `authMiddleware`

## Key Concepts Used

- JWT auth via cookies
- Middleware separation:
  - `attachUser`: optional user context
  - `authMiddleware`: strict route protection
- DB uniqueness on `short_url`
- Redirect analytics via atomic click increment
- React Query caching + invalidation after create/delete
- Redux for auth state and TanStack Router for route-level guards

## Prerequisites

- Node.js 18+
- npm 9+
- MongoDB running locally (default `27017`)

## Environment Variables

Create `BACKEND/.env`:

```env
MONGO_URI=mongodb://localhost:27017/URL-SHORTNER
APP_URL=http://localhost:3000/
JWT_SECRET=thisisasecretkey
```

Optional `FRONTEND/.env`:

```env
VITE_API_URL=http://localhost:3000
```

If `VITE_API_URL` is not set, frontend defaults to `http://localhost:3000`.

## Local Setup

From repo root:

```bash
cd BACKEND
npm install

cd ../FRONTEND
npm install
```

Run in separate terminals:

1. Start MongoDB

```bash
mongod
```

2. Start backend

```bash
cd BACKEND
npm run dev
```

3. Start frontend

```bash
cd FRONTEND
npm run dev
```

Frontend usually runs on `http://localhost:5173` or `http://localhost:5174`.

## Scripts

### Backend

- `npm run dev` -> start with nodemon
- `npm start` -> start with node

### Frontend

- `npm run dev` -> run Vite dev server
- `npm run build` -> production build
- `npm run preview` -> preview build
- `npm run lint` -> run ESLint

## CORS Configuration

Backend currently allows:

- `http://localhost:5173`
- `http://localhost:5174`

If your frontend uses another origin, update `allowedOrigins` in `BACKEND/app.js`.

## Common Issues

### Network Error from frontend

- Verify backend is running on port `3000`
- Verify MongoDB is running
- Verify `VITE_API_URL` value

### Unauthorized on protected routes

- Ensure login was successful and cookie is set
- Ensure requests send credentials (`withCredentials: true`)

### Mongo connection failure

- Start MongoDB first
- Verify `MONGO_URI` in `BACKEND/.env`

## Security Notes

- Replace `JWT_SECRET` in production
- Keep cookie `secure: true` in production with HTTPS
- Tighten CORS origins for deployed environments

## Future Improvements

- Add request schema validation (zod/joi/express-validator)
- Add pagination/filter/sort for user URL list
- Add edit URL metadata and advanced analytics charts
- Add automated tests (unit, integration, e2e)
- Add rate limiting for auth and create endpoints

## License

This project is currently unlicensed.
