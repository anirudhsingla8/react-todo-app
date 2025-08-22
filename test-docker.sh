#!/bin/bash

# Test Docker setup for React Todo App

echo "Testing Docker setup for React Todo App"

# Stop any existing containers
echo "Stopping existing containers..."
docker compose down

# Wait a moment
sleep 5

# Build and start containers
echo "Building and starting containers..."
docker compose up --build -d

# Wait for containers to start
echo "Waiting for containers to start..."
sleep 15

# Check container status
echo "Checking container status..."
docker compose ps

# Check if services are accessible
echo "Checking if services are accessible..."

# Check backend
if curl -s -X POST http://localhost:3000/api/users/signup -H "Content-Type: application/json" -d '{"username":"testuser","password":"testpass"}' > /dev/null; then
  echo "✓ Backend is accessible and functioning"
else
  echo "✗ Backend is not accessible"
fi

# Check frontend
if curl -s http://localhost:5173 | grep -q "<title>" > /dev/null; then
  echo "✓ Frontend is accessible"
else
  echo "✗ Frontend is not accessible"
fi

echo "Test completed"