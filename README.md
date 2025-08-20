# React Todo List App

A simple and clean todo list application built with React and Vite.

## Features

- Add new todos
- Mark todos as completed
- Delete todos
- Responsive design
- Keyboard navigation support
- Accessibility features
- User authentication (login/logout)
- Persistent todo storage (todos saved between sessions)
- User-specific todo lists

## Prerequisites

- Node.js (version 14 or higher)

### Optional (for Docker)
- Docker (version 18.09 or higher)
- Docker Compose (version 2.0 or higher) - [Installation Guide](https://docs.docker.com/compose/install/)

## Getting Started

### Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Running the Backend Server

This application now includes a NestJS backend server for handling user authentication and todo persistence. You can run it in several ways:

#### Option 1: Run Full Stack Application (Recommended for Production)

```bash
# Build both frontend and backend
npm run fullstack:build

# Start the full stack application
npm run fullstack:start
```

The application will be available at `http://localhost:3000`

#### Option 2: Run Backend and Frontend Separately (Development)

**Frontend (Vite development server):**
```bash
npm run dev
```
This runs the React frontend on `http://localhost:5173`

**Backend (NestJS development server):**
```bash
# Build and start the backend server
npm run backend:dev
```

This runs the NestJS backend on `http://localhost:3000`

#### Option 3: Run Using Node.js Directly

```bash
# Build the backend first
npm run backend:build

# Run the compiled JavaScript
node src/backend/dist/main.js
```

#### Option 4: Run with Docker (Recommended for Consistent Environments)

You can run the backend server using Docker for a consistent environment across different systems:

**Build and run the development Docker image:**
```bash
# Build the Docker image
docker build -t react-todo-app .

# Run the backend development server
docker run -p 3000:3000 react-todo-app npm run backend:dev
```

**Build and run the production Docker image:**
```bash
# Build the production Docker image
docker build -t react-todo-app-prod -f Dockerfile.prod .

# Run the production server
docker run -p 3000:3000 react-todo-app-prod
```

The application will be available at `http://localhost:3000`

**Note:** If you have Docker Compose installed, see the "Using Docker Compose" section for more advanced deployment options.

#### Backend API Endpoints

Once the backend is running, you can access these API endpoints:

- `POST /api/users/signup` - Create a new user account
- `POST /api/auth/login` - Authenticate a user
- `GET /api/todos?username={username}` - Get all todos for a user
- `POST /api/todos` - Add a new todo for a user
- `PUT /api/todos` - Update a todo's completion status
- `DELETE /api/todos` - Delete a todo

All endpoints return JSON data and handle CORS for cross-origin requests.

### API Endpoints

The NestJS backend server provides the following API endpoints:

- `POST /api/users/signup` - Create a new user account
- `POST /api/auth/login` - Authenticate a user
- `GET /api/todos?username={username}` - Get all todos for a user
- `POST /api/todos` - Add a new todo for a user
- `PUT /api/todos` - Update a todo's completion status
- `DELETE /api/todos` - Delete a todo

All endpoints return JSON data and handle CORS for cross-origin requests.

## Docker (Optional)

This project includes Docker support for containerization. These instructions are for users who have Docker installed and running.

**Note**: If you're seeing errors when running Docker commands, please ensure:
1. Docker is installed: https://docs.docker.com/get-docker/
2. Docker daemon is running
3. You have the necessary permissions to run Docker commands

### Building and Running with Docker

#### Development Environment - Frontend Only

1. Build the development Docker image:
   ```bash
   docker build -t react-todo-app .
   ```

2. Run the development container:
   ```bash
   docker run -p 5173:5173 -v $(pwd):/app -v /app/node_modules react-todo-app
   ```

3. Access the frontend at `http://localhost:5173`

#### Development Environment - Backend Only

1. Build the backend Docker image:
   ```bash
   docker build -t react-todo-app-backend -f src/backend/Dockerfile src/backend
   ```

2. Run the backend development container:
   ```bash
   docker run -p 3000:3000 -v $(pwd)/src/backend:/app -v /app/node_modules react-todo-app-backend
   ```

3. Access the backend API at `http://localhost:3000`

#### Production Environment

1. Build the production Docker image:
   ```bash
   docker build -t react-todo-app-prod -f Dockerfile.prod .
   ```

2. Run the production container:
   ```bash
   docker run -p 80:80 react-todo-app-prod
   ```

3. Access the full application at `http://localhost`

4. To stop the container:
   ```bash
   docker stop <container_id>
   ```
   
   To find the container ID:
   ```bash
   docker ps
   ```

### Using Docker Compose (Recommended)

This project includes Docker Compose configuration with separate profiles for different development scenarios and production environment.

**Note:** Docker Compose v2 is required. If you're using an older version, you may need to install Docker Compose separately or use `docker-compose` instead of `docker compose`.

#### Development Environments

##### Frontend Development Only
Run only the React frontend development server:
```bash
docker-compose --profile frontend up --build
```
Access the frontend at `http://localhost:5173`

##### Backend Development Only
Run only the NestJS backend development server:
```bash
docker-compose --profile backend up --build
```
Access the backend API at `http://localhost:3000`

##### Full Stack Development
Run both frontend and backend together:
```bash
docker-compose --profile dev up --build
```
Access the frontend at `http://localhost:5173` and backend API at `http://localhost:3000`

##### Full Stack Production
Run the full application in production mode:
```bash
docker-compose --profile fullstack up --build
```
Access the full application at `http://localhost:3000`

To stop any development environment:
```bash
docker-compose down
```

#### Production Environment

1. Build and start the production environment:
   ```bash
   docker-compose --profile prod up --build
   ```

2. Access the full application at `http://localhost`

3. To stop the production environment:
   ```bash
   docker-compose --profile prod down
   ```

### Data Persistence with Docker

When running with Docker, the SQLite database file (`todos.db`) is persisted:
- In development: The database file is stored in the container
- In production: The database file is mounted as a volume to preserve data between container restarts

### Docker Build Troubleshooting

If you encounter issues with Docker builds:

1. Make sure your package-lock.json is up to date:
   ```bash
   npm install
   ```

2. Clear Docker build cache if needed:
   ```bash
   docker builder prune
   ```

### Docker Optimization Features

The Docker configuration has been optimized for:

- **Security**: Uses non-root users for both development and production
- **Performance**: Uses npm ci with caching optimizations
- **Size**: Cleans npm cache to reduce image size
- **Development**: File watching enabled with volume mounting for hot reloading
- **Production**: Multi-stage build to minimize final image size

### Docker Services

This project includes multiple Docker services:

- `frontend`: React development server
- `backend`: NestJS API server
- `fullstack`: Combined frontend and backend in one service
- `app`: Production Nginx server serving the built React app

### Authentication and Data Persistence

This application now includes user authentication and data persistence features with a NestJS backend server:

- **User Login/Signup**: Users can create an account and log in with a username and password
- **Session Management**: User sessions are stored in localStorage and persist between page reloads
- **Todo Persistence**: Todos are saved in a persistent SQLite database (`todos.db`)
- **User-specific Todos**: Each user has their own separate todo list stored in the database

When a user logs out, their todo list is saved in the database and will be available when they log back in with the same username.

### Database

The application uses SQLite for data persistence with two tables:
- `users`: Stores user credentials (username, password, creation date)
- `todos`: Stores todo items with foreign key relationship to users

The database file (`todos.db`) is automatically created in the root directory when the application starts.

## Docker Configuration Explanation

- `Dockerfile`: Configuration for the frontend development environment
  - Uses Node.js 20 Alpine image for a lightweight container
  - Installs frontend dependencies
  - Mounts the source code as a volume for hot reloading during development
  - Exposes port 5173 for the Vite development server

- `src/backend/Dockerfile`: Configuration for the backend development environment
  - Uses Node.js 20 Alpine image for a lightweight container
  - Installs backend dependencies including build tools for sqlite3
  - Builds and runs the NestJS application
  - Exposes port 3000 for the NestJS server

- `Dockerfile.prod`: Configuration for the production environment
  - Uses a multi-stage build process to minimize image size
  - Stage 1: Builds the React application using Node.js 20 Alpine
  - Stage 2: Serves the built application using Nginx Alpine for better performance
  - Installs all dependencies including devDependencies for building
  - Copies the built files to Nginx's web directory

- `Dockerfile.fullstack`: Configuration for the fullstack development environment
  - Builds both frontend and backend applications in a single container
  - Runs the NestJS server which serves both API endpoints and frontend files
  - Useful for testing the complete application in a single container

- `docker-compose.yml`: Orchestrates the Docker containers
  - Defines separate services for frontend, backend, and production environments
  - Uses profiles to allow running different combinations of services
  - Maps container ports to host ports for easy access
  - Mounts volumes in development for hot reloading

- `.dockerignore`: Specifies files and directories to exclude from the Docker build context
  - Excludes node_modules to ensure dependencies are installed during build
  - Excludes git files and other unnecessary files to reduce build context size

## Project Structure

```
react-todo-app/
├── public/              # Static assets
├── src/                 # Frontend source code
│   ├── assets/          # Images and other assets
│   ├── App.jsx          # Main application component
│   ├── App.css          # Application styles
│   ├── Login.jsx        # Login component
│   └── main.jsx         # Entry point
├── src/backend/         # NestJS backend source code
│   ├── src/             # Backend source files
│   │   ├── users/       # Users module
│   │   ├── todos/       # Todos module
│   │   ├── auth/        # Authentication module
│   │   ├── database/    # Database service
│   │   ├── app.module.ts# Main application module
│   │   ├── main.ts      # Application entry point
│   │   └── server.ts    # Server configuration
│   └── tsconfig.json    # TypeScript configuration
├── Dockerfile           # Docker configuration for development
├── Dockerfile.fullstack # Docker configuration for fullstack development
├── Dockerfile.prod      # Docker configuration for production
├── docker-compose.yml   # Docker Compose configuration
├── nginx.conf           # Nginx configuration for production
├── .dockerignore        # Files to exclude from Docker build
├── index.html           # Main HTML file
├── package.json         # Project dependencies and scripts
└── vite.config.js       # Vite configuration
```