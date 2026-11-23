# LiveSkill

LiveSkill is a web app for sharing skills through live video sessions. Users can create accounts, browse active streams, host a session, and take part in room-based live chat. Hosts can stream from a camera or share their screen; viewers can join a live room and chat with the host and other viewers.

## Project structure

| Folder | Description |
| --- | --- |
| [`frontend/`](./frontend/) | React and Vite web application |
| [`backend/`](./backend/) | Express API, MongoDB models, and Socket.IO server |

For component-specific information, see the [frontend README](./frontend/README.md) and [backend README](./backend/README.md).

## Features

- Account registration and login, with bcrypt password hashing and JWT-based access and refresh tokens.
- A dashboard that lists active streams.
- LiveKit host and viewer tokens, camera streaming, screen sharing, and live playback.
- Socket.IO chat rooms and live viewer counts.
- Email collection for product updates.

## Requirements

- Node.js and npm
- MongoDB (local or hosted)
- A LiveKit project with an API key, API secret, and server URL

## Run locally

The frontend and backend have separate npm projects. Install dependencies in each folder, then run them in separate terminals.

### 1. Install dependencies

From the repository root:

```bash
cd backend
npm install
cd ../frontend
npm install
```

### 2. Configure the backend

Create `backend/.env`:

```env
PORT=3000
DATABASE_URL=<your MongoDB connection string>
ACCESS_TOKEN_SECRET=<a long random secret>
REFRESH_TOKEN_SECRET=<a different long random secret>
LIVEKIT_API_KEY=<your LiveKit API key>
LIVEKIT_API_SECRET=<your LiveKit API secret>
```

The backend uses `DATABASE_URL` to connect to MongoDB. Keep these credentials private and do not commit your `.env` file.

### 3. Configure the frontend

Create `frontend/.env`:

```env
VITE_BACKEND_URL=http://localhost:3000
VITE_LIVEKIT_URL=wss://<your LiveKit server URL>
```

The frontend defaults `VITE_BACKEND_URL` to `http://localhost:3000` if it is not set. `VITE_LIVEKIT_URL` is needed for live streaming.

### 4. Start both apps

In the first terminal:

```bash
cd backend
npm run dev
```

In a second terminal:

```bash
cd frontend
npm run dev
```

Vite prints the frontend URL in its terminal (normally `http://localhost:5173`). The backend listens on port `3000` by default; set `PORT` in `backend/.env` to change it.

## How it works

1. A user registers or logs in through the frontend.
2. The dashboard requests the backend's active-stream list.
3. A host enters stream details; the backend issues a LiveKit token and records the stream as active.
4. Viewers request their own LiveKit token to join. Host and viewer rooms use Socket.IO for chat and viewer counts.

User accounts and email-update subscriptions are stored in MongoDB. Active stream listings are held in backend process memory, and chat messages are not persisted; restarting the backend clears the active-stream list.

## Useful commands

Run these from the relevant project folder:

| Folder | Command | Purpose |
| --- | --- | --- |
| `frontend/` | `npm run dev` | Start the Vite development server |
| `frontend/` | `npm run build` | Build the frontend for production |
| `frontend/` | `npm run lint` | Run ESLint |
| `backend/` | `npm run dev` | Start the API with Nodemon |
| `backend/` | `npm start` | Start the API with Node.js |
