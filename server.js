const http = require('http');
const fs = require('fs');
const path = require('path');

// Simple in-memory database (in a real app, you'd use SQLite or another database)
const users = {};
const todos = {};

// Helper function to parse POST data
function parseBody(body) {
  const params = new URLSearchParams(body);
  const result = {};
  for (const [key, value] of params) {
    result[key] = value;
  }
  return result;
}

// Helper function to send JSON response
function sendJsonResponse(res, data, statusCode = 200) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify(data));
}

// Helper function to send error response
function sendError(res, message, statusCode = 400) {
  sendJsonResponse(res, { error: message }, statusCode);
}

// Create HTTP server
const server = http.createServer((req, res) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end();
    return;
  }

  // Parse URL
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;

  // Route: Signup
  if (pathname === '/api/signup' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const { username, password } = parseBody(body);
        
        // Validate input
        if (!username || !password) {
          return sendError(res, 'Username and password are required');
        }
        
        if (password.length < 6) {
          return sendError(res, 'Password must be at least 6 characters');
        }
        
        // Check if user already exists
        if (users[username]) {
          return sendError(res, 'Username already exists');
        }
        
        // Create user (in a real app, you'd hash the password)
        users[username] = {
          password: password,
          createdAt: new Date().toISOString()
        };
        
        // Initialize empty todos for the user
        todos[username] = [];
        
        sendJsonResponse(res, { message: 'User created successfully' });
      } catch (error) {
        sendError(res, 'Invalid request data');
      }
    });
    return;
  }

  // Route: Login
  if (pathname === '/api/login' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const { username, password } = parseBody(body);
        
        // Validate input
        if (!username || !password) {
          return sendError(res, 'Username and password are required');
        }
        
        // Check if user exists
        if (!users[username]) {
          return sendError(res, 'User not found');
        }
        
        // Check password (in a real app, you'd compare hashed passwords)
        if (users[username].password !== password) {
          return sendError(res, 'Incorrect password');
        }
        
        // Return user data
        sendJsonResponse(res, {
          username: username,
          loginTime: new Date().toISOString(),
          createdAt: users[username].createdAt
        });
      } catch (error) {
        sendError(res, 'Invalid request data');
      }
    });
    return;
  }

  // Route: Get Todos
  if (pathname === '/api/todos' && req.method === 'GET') {
    const username = url.searchParams.get('username');
    
    if (!username) {
      return sendError(res, 'Username is required');
    }
    
    if (!users[username]) {
      return sendError(res, 'User not found');
    }
    
    sendJsonResponse(res, todos[username] || []);
    return;
  }

  // Route: Add Todo
  if (pathname === '/api/todos' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const { username, text } = parseBody(body);
        
        if (!username || !text) {
          return sendError(res, 'Username and text are required');
        }
        
        if (!users[username]) {
          return sendError(res, 'User not found');
        }
        
        // Create new todo
        const newTodo = {
          id: Date.now(),
          text: text,
          completed: false
        };
        
        // Add to user's todos
        if (!todos[username]) {
          todos[username] = [];
        }
        todos[username].push(newTodo);
        
        sendJsonResponse(res, newTodo);
      } catch (error) {
        sendError(res, 'Invalid request data');
      }
    });
    return;
  }

  // Route: Update Todo
  if (pathname === '/api/todos' && req.method === 'PUT') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const { username, id, completed } = parseBody(body);
        
        if (!username || !id) {
          return sendError(res, 'Username and todo ID are required');
        }
        
        if (!users[username]) {
          return sendError(res, 'User not found');
        }
        
        // Find and update todo
        const userTodos = todos[username] || [];
        const todoIndex = userTodos.findIndex(todo => todo.id == id);
        
        if (todoIndex === -1) {
          return sendError(res, 'Todo not found');
        }
        
        userTodos[todoIndex].completed = completed === 'true';
        
        sendJsonResponse(res, userTodos[todoIndex]);
      } catch (error) {
        sendError(res, 'Invalid request data');
      }
    });
    return;
  }

  // Route: Delete Todo
  if (pathname === '/api/todos' && req.method === 'DELETE') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const { username, id } = parseBody(body);
        
        if (!username || !id) {
          return sendError(res, 'Username and todo ID are required');
        }
        
        if (!users[username]) {
          return sendError(res, 'User not found');
        }
        
        // Find and remove todo
        const userTodos = todos[username] || [];
        const todoIndex = userTodos.findIndex(todo => todo.id == id);
        
        if (todoIndex === -1) {
          return sendError(res, 'Todo not found');
        }
        
        userTodos.splice(todoIndex, 1);
        
        sendJsonResponse(res, { message: 'Todo deleted successfully' });
      } catch (error) {
        sendError(res, 'Invalid request data');
      }
    });
    return;
  }

  // Serve static files for the React app
  if (pathname === '/' || pathname === '/index.html') {
    fs.readFile(path.join(__dirname, 'dist', 'index.html'), (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end('Not Found');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
      }
    });
    return;
  }

  // Serve other static assets
  const staticPath = path.join(__dirname, 'dist', pathname);
  fs.readFile(staticPath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not Found');
    } else {
      // Set content type based on file extension
      const ext = path.extname(staticPath);
      const contentType = {
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.wav': 'audio/wav',
        '.mp4': 'video/mp4',
        '.woff': 'application/font-woff',
        '.ttf': 'application/font-ttf',
        '.eot': 'application/vnd.ms-fontobject',
        '.otf': 'application/font-otf',
        '.wasm': 'application/wasm'
      }[ext] || 'text/html';
      
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});