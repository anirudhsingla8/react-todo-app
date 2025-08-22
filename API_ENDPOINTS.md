# API Endpoints Documentation

This document contains all the API endpoints available in the React Todo application with example curl commands.

## Authentication

### Signup
Create a new user account

```bash
curl -X POST http://localhost:3000/api/users/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "TestPass123!"
  }'
```

### Login
Authenticate a user

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "TestPass123!"
  }'
```

## Todos

### Get All Todos for a User
Retrieve all todos for a specific user

```bash
curl -X GET "http://localhost:3000/api/todos?username=testuser" \
  -H "Content-Type: application/json"
```

### Create a New Todo
Add a new todo for a user

```bash
curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "text": "Sample todo item",
    "dueDate": "2025-12-31T23:59:59.000Z",
    "priority": "medium",
    "tags": ["work", "important"],
    "notes": "Additional notes for this todo"
  }'
```

### Update Todo Completion Status
Update the completion status of a todo

```bash
curl -X PUT http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -d '{
    "id": 1,
    "completed": true
  }'
```

### Update Todo Fields
Update specific fields of a todo

```bash
curl -X PUT http://localhost:3000/api/todos/1 \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Updated todo text",
    "completed": true,
    "dueDate": "2025-12-31T23:59:59.000Z",
    "priority": "high",
    "tags": ["updated", "work"],
    "notes": "Updated notes"
  }'
```

### Delete a Todo
Remove a todo

```bash
curl -X DELETE http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -d '{
    "id": 1
  }'
```

## Example Workflow

Here's a complete example workflow using the API:

1. **Signup**
```bash
curl -X POST http://localhost:3000/api/users/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "exampleuser",
    "password": "SecurePass123!"
  }'
```

2. **Login**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "exampleuser",
    "password": "SecurePass123!"
  }'
```

3. **Create a Todo**
```bash
curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -d '{
    "username": "exampleuser",
    "text": "Learn NestJS",
    "dueDate": "2025-12-31T23:59:59.000Z",
    "priority": "high",
    "tags": ["learning", "backend"],
    "notes": "Complete the NestJS tutorial"
  }'
```

4. **Get All Todos**
```bash
curl -X GET "http://localhost:3000/api/todos?username=exampleuser" \
  -H "Content-Type: application/json"
```

5. **Update Todo**
```bash
curl -X PUT http://localhost:3000/api/todos/1 \
  -H "Content-Type: application/json" \
  -d '{
    "completed": true
  }'
```

6. **Delete Todo**
```bash
curl -X DELETE http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -d '{
    "id": 1
  }'
```

## Notes

- All endpoints are prefixed with `/api`
- The backend server runs on port 3000 by default
- Make sure the backend server is running before making requests
- For endpoints requiring authentication, you'll need to include a valid session token in production, but for development purposes, the username is passed as a parameter
- Date fields should be in ISO 8601 format
- Priority values can be "low", "medium", or "high"