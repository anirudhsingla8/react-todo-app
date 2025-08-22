import React, { useState, useEffect } from 'react';

const TodoPriorities = ({ todos }) => {
  const [priorities, setPriorities] = useState({
    high: [],
    medium: [],
    low: []
  });

  // Group todos by priority
  useEffect(() => {
    const grouped = {
      high: [],
      medium: [],
      low: []
    };
    
    todos.forEach(todo => {
      const priority = todo.priority || 'medium';
      if (grouped[priority]) {
        grouped[priority].push(todo);
      }
    });
    
    setPriorities(grouped);
  }, [todos]);

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 'high': return 'High Priority';
      case 'medium': return 'Medium Priority';
      case 'low': return 'Low Priority';
      default: return 'Unknown Priority';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#e53935';
      case 'medium': return '#ffb300';
      case 'low': return '#43a047';
      default: return '#7f8c8d';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return '🔺';
      case 'medium': return '🔸';
      case 'low': return '🔻';
      default: return '🔹';
    }
  };

  const priorityKeys = ['high', 'medium', 'low'];

  return (
    <div className="todo-priorities">
      <h2>Todo Priorities</h2>
      
      <div className="priorities-grid">
        {priorityKeys.map(priority => (
          <div key={priority} className={`priority-section priority-${priority}`}>
            <div className="priority-header">
              <span className="priority-icon">{getPriorityIcon(priority)}</span>
              <h3 className="priority-title">{getPriorityLabel(priority)}</h3>
              <span className="priority-count">{priorities[priority].length}</span>
            </div>
            
            {priorities[priority].length > 0 ? (
              <ul className="priority-todos">
                {priorities[priority].map(todo => (
                  <li key={todo.id} className="priority-todo">
                    <div className="priority-todo-content">
                      <span className="priority-todo-text">{todo.text}</span>
                      {todo.dueDate && (
                        <span className="priority-todo-due">
                          Due: {new Date(todo.dueDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="empty-priority">No {priority} priority todos</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodoPriorities;