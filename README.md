# URL Shortener

Full-stack URL shortener built with Express, MongoDB, React, and Vite.

## Features

- Create short URLs with optional custom slugs.
- Register, log in, and log out with cookie-based JWT authentication.
- Manage and delete URLs from the user dashboard.
- Track URL click counts.

## Tech Stack

- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Frontend:** React, Vite, Redux Toolkit, TanStack Router, Axios
- **Deployment:** Render and MongoDB Atlas

## Project Structure

```text
url-shortner/
├── BACKEND/
└── FRONTEND/
```

## Run Locally

### Prerequisites

- Node.js 18+
- npm 9+
- MongoDB Atlas or a local MongoDB instance

### Install dependencies

```bash
cd BACKEND
npm install

cd ../FRONTEND
npm install
```

### Configure the backend

Create `BACKEND/.env`:

```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/URL-SHORTNER
APP_URL=http://localhost:3000/
JWT_SECRET=replace-with-a-secure-secret
PORT=3000
CORS_ORIGINS=http://localhost:5173
NODE_ENV=development
```

Create `FRONTEND/.env` if the API is not running on the default URL:

```env
VITE_API_URL=http://localhost:3000
```

Never commit `.env` files or secrets.

### Start the applications

Use separate terminals:

```bash
cd BACKEND
npm run dev
```

```bash
cd FRONTEND
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`
- Health check: `http://localhost:3000/health`

## Live Deployment

- Frontend: [lynk-frontend-vjo5.onrender.com](https://lynk-frontend-vjo5.onrender.com/)
- Backend health check: [lynk-backend-ghl9.onrender.com/health](https://lynk-backend-ghl9.onrender.com/health)

The deployed frontend uses:

```env
VITE_API_URL=https://lynk-backend-ghl9.onrender.com
```

## Deploy on Render

### Backend Web Service

Create a Render **Web Service** with:

| Setting | Value |
|---|---|
| Root Directory | `BACKEND` |
| Build Command | `npm install` |
| Start Command | `npm start` |

Add these environment variables:

```env
MONGO_URI=<your MongoDB Atlas connection string>
JWT_SECRET=<your strong secret>
NODE_ENV=production
APP_URL=https://your-backend.onrender.com/
CORS_ORIGINS=https://your-frontend.onrender.com
```

### Frontend Static Site

Create a Render **Static Site** with:

| Setting | Value |
|---|---|
| Root Directory | `FRONTEND` |
| Build Command | `npm install && npm run build` |
| Publish Directory | `dist` |

Add:

```env
VITE_API_URL=https://your-backend.onrender.com
```

Add a rewrite rule for client-side routes:

| Source | Destination |
|---|---|
| `/*` | `/index.html` |

After the frontend is deployed, update the backend `CORS_ORIGINS` value with
the actual frontend URL and redeploy the backend.

In MongoDB Atlas, allow Render to connect under **Network Access**. For initial
testing, `0.0.0.0/0` can be used.

## API Endpoints

Base URL:

- Local: `http://localhost:3000`
- Production: `https://lynk-backend-ghl9.onrender.com`

### Authentication

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### URLs

- `POST /api/create`
- `GET /:id`
- `POST /api/user/urls`
- `DELETE /api/user/urls/:urlId`

## Troubleshooting

### `ERR_CONNECTION_REFUSED`

The backend is not running or has crashed. Start it and wait for both
`MongoDB Connected` and `Server is running` messages.

### MongoDB authentication failure

Check the Atlas database username and password in `MONGO_URI`. These are
different from your Atlas website credentials. URL-encode special characters
in the password, such as `@`, `:`, `/`, `?`, `#`, and `%`.

### `401` after login

Confirm that:

- `CORS_ORIGINS` exactly matches the deployed frontend URL.
- The frontend uses the deployed backend in `VITE_API_URL`.
- The backend has been redeployed after environment changes.
- Browser cookies were cleared before trying again.
