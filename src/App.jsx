import { useState, useEffect, useMemo } from 'react'
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import Login from './Login'
import Dashboard from './components/Dashboard'
import Notification from './components/Notification'
import notificationService from './services/notificationService'
import theme from './theme';
import './App.css'

function App() {
  const [user, setUser] = useState(null)
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('desc')

  // Check for existing user session on app load
  useEffect(() => {
    const savedUser = localStorage.getItem('todoUser')
    if (savedUser) {
      const userData = JSON.parse(savedUser)
      setUser(userData)
      loadTodos(userData.username)
    }
  }, [])

  const loadTodos = async (username) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/todos?username=${encodeURIComponent(username)}`)
      if (response.ok) {
        const userTodos = await response.json()
        setTodos(userTodos)
      } else {
        setTodos([])
      }
    } catch (error) {
      console.error('Failed to load todos:', error)
      setTodos([])
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (userData) => {
    setUser(userData)
    await loadTodos(userData.username)
  }

  const handleLogout = () => {
    localStorage.removeItem('todoUser')
    setUser(null)
    setTodos([])
  }

  const handleUpdateTodo = (id, updatedTodo) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, ...updatedTodo } : todo
    ));
  };

  const handleDeleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const filteredAndSortedTodos = useMemo(() => {
    let filtered = [...todos];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(todo =>
        todo.text.toLowerCase().includes(term) ||
        (todo.notes && todo.notes.toLowerCase().includes(term)) ||
        (todo.tags && todo.tags.some(tag => tag.toLowerCase().includes(term)))
      );
    }
    
    // Apply status filter
    if (filterStatus === 'completed') {
      filtered = filtered.filter(todo => todo.completed);
    } else if (filterStatus === 'pending') {
      filtered = filtered.filter(todo => !todo.completed);
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'dueDate':
          aValue = a.dueDate ? new Date(a.dueDate) : new Date(0);
          bValue = b.dueDate ? new Date(b.dueDate) : new Date(0);
          break;
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          aValue = priorityOrder[a.priority] || 0;
          bValue = priorityOrder[b.priority] || 0;
          break;
        case 'text':
          aValue = a.text.toLowerCase();
          bValue = b.text.toLowerCase();
          break;
        case 'createdAt':
        default:
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    });
    
    return filtered;
  }, [todos, searchTerm, filterStatus, sortBy, sortOrder]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        bgcolor: 'background.default',
        p: { xs: 1, sm: 2, md: 3 }
      }}>
        <Notification />
        {user ? (
          <Dashboard
            user={user}
            todos={todos}
            filteredTodos={filteredAndSortedTodos}
            loading={loading}
            searchTerm={searchTerm}
            filterStatus={filterStatus}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onLogout={handleLogout}
            onFilterChange={(filter) => {
              setFilterStatus(filter.status);
            }}
            onSortChange={(by, order) => {
              setSortBy(by);
              setSortOrder(order);
            }}
            onSearchChange={setSearchTerm}
            onAddTodo={(newTodo) => setTodos([...todos, newTodo])}
            onUpdateTodo={handleUpdateTodo}
            onDeleteTodo={handleDeleteTodo}
          />
        ) : (
          <Login onLogin={handleLogin} />
        )}
      </Box>
    </ThemeProvider>
  )
}

export default App
