import { useState, useEffect } from 'react'
import Login from './Login'
import './App.css'

function App() {
  const [user, setUser] = useState(null)
  const [todos, setTodos] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(false)

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

  const addTodo = async () => {
    if (inputValue.trim() !== '') {
      try {
        const response = await fetch('/api/todos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username: user.username, text: inputValue })
        })
        
        if (response.ok) {
          const newTodo = await response.json()
          setTodos([...todos, newTodo])
          setInputValue('')
        } else {
          const error = await response.json()
          console.error('Failed to add todo:', error.message)
        }
      } catch (error) {
        console.error('Failed to add todo:', error)
      }
    }
  }

  const toggleTodo = async (id) => {
    try {
      const todo = todos.find(t => t.id === id)
      if (!todo) return
      
      const response = await fetch('/api/todos', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, completed: !todo.completed })
      })
      
      if (response.ok) {
        // The backend now returns the updated todo properties
        const updatedTodo = await response.json();
        setTodos(todos.map(t => t.id === id ? { ...t, completed: updatedTodo.completed } : t))
      } else {
        const error = await response.json()
        console.error('Failed to update todo:', error.message)
      }
    } catch (error) {
      console.error('Failed to update todo:', error)
    }
  }

  const deleteTodo = async (id) => {
    try {
      const response = await fetch('/api/todos', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id })
      })
      
      if (response.ok) {
        setTodos(todos.filter(todo => todo.id !== id))
      } else {
        const error = await response.json()
        console.error('Failed to delete todo:', error.message)
      }
    } catch (error) {
      console.error('Failed to delete todo:', error)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTodo()
    }
  }

  // Show login screen if user is not authenticated
  if (!user) {
    return <Login onLogin={handleLogin} />
  }

  return (
    <div className="app">
      <div className="header-container">
        <h1>Todo List</h1>
        <div className="user-info">
          <span>Hello, {user.username}!</span>
          <button onClick={handleLogout} className="logout-button" aria-label="Logout">
            Logout
          </button>
        </div>
      </div>
      <div className="input-container">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Add a new todo..."
          aria-label="Add a new todo"
        />
        <button onClick={addTodo} aria-label="Add todo" disabled={loading}>
          {loading ? 'Adding...' : 'Add'}
        </button>
      </div>
      {loading && todos.length === 0 ? (
        <p style={{ textAlign: 'center', padding: '2rem' }}>Loading todos...</p>
      ) : todos.length > 0 ? (
        <ul className="todo-list" role="list">
          {todos.map(todo => (
            <li key={todo.id} className={todo.completed ? 'completed' : ''}>
              <span 
                onClick={() => toggleTodo(todo.id)} 
                onKeyPress={(e) => e.key === 'Enter' && toggleTodo(todo.id)}
                tabIndex={0}
                role="button"
                aria-label={todo.completed ? `Mark ${todo.text} as incomplete` : `Mark ${todo.text} as complete`}
              >
                {todo.text}
              </span>
              <button 
                onClick={() => deleteTodo(todo.id)}
                aria-label={`Delete ${todo.text}`}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="empty-state">No todos yet. Add one above!</p>
      )}
    </div>
  )
}

export default App