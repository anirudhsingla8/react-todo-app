# Running the Application

This document explains how to properly run the React Todo application with its backend.

## Quick Start

For development, you need to run both the frontend and backend servers:

1. **Start the backend server** (in a separate terminal):
   ```bash
   npm run backend:dev
   ```

2. **Start the frontend development server** (in another terminal):
   ```bash
   npm run dev
   ```

3. Open your browser to `http://localhost:5173`

## Understanding the Architecture

This application has two main components:

1. **Frontend**: A React application that runs on Vite development server (port 5173)
2. **Backend**: A NestJS API server that runs on port 3000

The frontend makes API calls to `/api/*` endpoints, which are proxied to the backend server.

## Running Options

### Development Mode (Recommended)

Run both frontend and backend separately for development:

```bash
# Terminal 1 - Backend
npm run backend:dev

# Terminal 2 - Frontend
npm run dev
```

### Full Stack Mode

Build and run both frontend and backend together:

```bash
# Build both applications
npm run fullstack:build

# Start the full stack application
npm run fullstack:start
```

This will run on port 3000.

### Docker Mode

Using Docker Compose (recommended for consistent environments):

```bash
# Run both frontend and backend in development mode
docker-compose --profile dev up --build
```

Access the application at `http://localhost:5173`

## Troubleshooting

### "Network error" or "Failed to fetch" messages

This usually means the frontend cannot communicate with the backend. Check:

1. The backend server is running (`npm run backend:dev`)
2. The frontend server is running (`npm run dev`)
3. The ports are correct (3000 for backend, 5173 for frontend)
4. No firewall is blocking the connections

### Testing API connectivity

You can test if the backend API is working with this command:

```bash
node test-api.js
```

### CORS Issues

The application should handle CORS automatically. If you encounter CORS errors:

1. Make sure you're using the NestJS backend (`npm run backend:dev`) and not the legacy server
2. Check that the backend is properly configured with `app.enableCors()`

## API Endpoints

The backend provides the following endpoints:

- `POST /api/users/signup` - Create a new user
- `POST /api/auth/login` - Authenticate a user
- `GET /api/todos?username={username}` - Get user's todos
- `POST /api/todos` - Create a new todo
- `PUT /api/todos` - Update a todo
- `DELETE /api/todos` - Delete a todo

All endpoints return JSON data.