import React, { useState, useEffect } from 'react';

const EnhancedTodoStats = ({ todos }) => {
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    completionRate: 0,
    overdue: 0,
    dueToday: 0,
    dueSoon: 0,
    highPriority: 0,
    mediumPriority: 0,
    lowPriority: 0,
    withTags: 0,
    withNotes: 0,
    withReminders: 0,
    withDueDates: 0
  });

  // Calculate statistics
  useEffect(() => {
    const now = new Date();
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    const total = todos.length;
    const completed = todos.filter(todo => todo.completed).length;
    const pending = total - completed;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    let overdue = 0;
    let dueToday = 0;
    let dueSoon = 0;
    let highPriority = 0;
    let mediumPriority = 0;
    let lowPriority = 0;
    let withTags = 0;
    let withNotes = 0;
    let withReminders = 0;
    let withDueDates = 0;
    
    todos.forEach(todo => {
      // Priority counts
      switch (todo.priority) {
        case 'high':
          highPriority++;
          break;
        case 'medium':
          mediumPriority++;
          break;
        case 'low':
          lowPriority++;
          break;
        default:
          mediumPriority++;
      }
      
      // Tags count
      if (todo.tags && Array.isArray(todo.tags) && todo.tags.length > 0) {
        withTags++;
      }
      
      // Notes count
      if (todo.notes && todo.notes.trim() !== '') {
        withNotes++;
      }
      
      // Reminders count
      if (todo.reminder) {
        withReminders++;
      }
      
      // Due dates count
      if (todo.dueDate) {
        withDueDates++;
        
        const dueDate = new Date(todo.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        
        if (dueDate < today && !todo.completed) {
          overdue++;
        } else if (dueDate.getTime() === today.getTime() && !todo.completed) {
          dueToday++;
        } else if (dueDate < nextWeek && !todo.completed) {
          dueSoon++;
        }
      }
    });
    
    setStats({
      total,
      completed,
      pending,
      completionRate,
      overdue,
      dueToday,
      dueSoon,
      highPriority,
      mediumPriority,
      lowPriority,
      withTags,
      withNotes,
      withReminders,
      withDueDates
    });
  }, [todos]);

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#e53935';
      case 'medium': return '#ffb300';
      case 'low': return '#43a047';
      default: return '#7f8c8d';
    }
  };

  // Get priority icon
  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return '🔺';
      case 'medium': return '🔸';
      case 'low': return '🔻';
      default: return '🔹';
    }
  };

  // Get due date status color
  const getDueDateColor = (status) => {
    switch (status) {
      case 'overdue': return '#e53935';
      case 'dueToday': return '#ffb300';
      case 'dueSoon': return '#43a047';
      default: return '#7f8c8d';
    }
  };

  // Get due date status icon
  const getDueDateIcon = (status) => {
    switch (status) {
      case 'overdue': return '🚨';
      case 'dueToday': return '⏰';
      case 'dueSoon': return '📅';
      default: return '📝';
    }
  };

  if (todos.length === 0) {
    return (
      <div className="enhanced-todo-stats">
        <h2>Todo Statistics</h2>
        <p className="empty-state">No data available yet. Add some todos to see statistics.</p>
      </div>
    );
  }

  return (
    <div className="enhanced-todo-stats">
      <h2>Todo Statistics</h2>
      
      <div className="stats-grid">
        {/* Basic stats */}
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Tasks</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-value">{stats.completed}</div>
            <div className="stat-label">Completed</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <div className="stat-value">{stats.pending}</div>
            <div className="stat-label">Pending</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <div className="stat-value">{stats.completionRate}%</div>
            <div className="stat-label">Completion Rate</div>
          </div>
        </div>
        
        {/* Priority stats */}
        <div className="stat-card priority-high">
          <div 
            className="stat-icon" 
            style={{ color: getPriorityColor('high') }}
          >
            {getPriorityIcon('high')}
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.highPriority}</div>
            <div className="stat-label">High Priority</div>
          </div>
        </div>
        
        <div className="stat-card priority-medium">
          <div 
            className="stat-icon" 
            style={{ color: getPriorityColor('medium') }}
          >
            {getPriorityIcon('medium')}
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.mediumPriority}</div>
            <div className="stat-label">Medium Priority</div>
          </div>
        </div>
        
        <div className="stat-card priority-low">
          <div 
            className="stat-icon" 
            style={{ color: getPriorityColor('low') }}
          >
            {getPriorityIcon('low')}
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.lowPriority}</div>
            <div className="stat-label">Low Priority</div>
          </div>
        </div>
        
        {/* Due date stats */}
        <div className="stat-card due-overdue">
          <div 
            className="stat-icon" 
            style={{ color: getDueDateColor('overdue') }}
          >
            {getDueDateIcon('overdue')}
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.overdue}</div>
            <div className="stat-label">Overdue</div>
          </div>
        </div>
        
        <div className="stat-card due-today">
          <div 
            className="stat-icon" 
            style={{ color: getDueDateColor('dueToday') }}
          >
            {getDueDateIcon('dueToday')}
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.dueToday}</div>
            <div className="stat-label">Due Today</div>
          </div>
        </div>
        
        <div className="stat-card due-soon">
          <div 
            className="stat-icon" 
            style={{ color: getDueDateColor('dueSoon') }}
          >
            {getDueDateIcon('dueSoon')}
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.dueSoon}</div>
            <div className="stat-label">Due Soon</div>
          </div>
        </div>
        
        {/* Feature stats */}
        <div className="stat-card feature-tags">
          <div className="stat-icon">🏷️</div>
          <div className="stat-content">
            <div className="stat-value">{stats.withTags}</div>
            <div className="stat-label">With Tags</div>
          </div>
        </div>
        
        <div className="stat-card feature-notes">
          <div className="stat-icon">📝</div>
          <div className="stat-content">
            <div className="stat-value">{stats.withNotes}</div>
            <div className="stat-label">With Notes</div>
          </div>
        </div>
        
        <div className="stat-card feature-reminders">
          <div className="stat-icon">🔔</div>
          <div className="stat-content">
            <div className="stat-value">{stats.withReminders}</div>
            <div className="stat-label">With Reminders</div>
          </div>
        </div>
        
        <div className="stat-card feature-due-dates">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <div className="stat-value">{stats.withDueDates}</div>
            <div className="stat-label">With Due Dates</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedTodoStats;