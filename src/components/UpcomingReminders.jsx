import React, { useState, useEffect } from 'react';

const UpcomingReminders = ({ todos }) => {
  const [upcomingReminders, setUpcomingReminders] = useState([]);
  const [showAll, setShowAll] = useState(false);

  // Filter and sort upcoming reminders
  useEffect(() => {
    const now = new Date();
    const nextWeek = new Date(now);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    // Filter todos with reminders in the next week
    const reminders = todos
      .filter(todo => 
        todo.reminder && 
        new Date(todo.reminder) > now && 
        new Date(todo.reminder) <= nextWeek
      )
      .sort((a, b) => new Date(a.reminder) - new Date(b.reminder));
    
    setUpcomingReminders(reminders);
  }, [todos]);

  const formatReminderTime = (reminder) => {
    const date = new Date(reminder);
    const now = new Date();
    const diffMs = date - now;
    const diffHours = Math.floor(diffMs / (1000 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 24));
    
    if (diffHours < 1) {
      return 'In less than an hour';
    } else if (diffHours < 24) {
      return `In ${diffHours} hours`;
    } else if (diffDays === 1) {
      return 'Tomorrow';
    } else {
      return `In ${diffDays} days`;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString([], { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (upcomingReminders.length === 0) {
    return null;
  }

  const remindersToShow = showAll ? upcomingReminders : upcomingReminders.slice(0, 3);

  return (
    <div className="upcoming-reminders">
      <h2>Upcoming Reminders</h2>
      
      <ul className="reminders-list">
        {remindersToShow.map(todo => (
          <li key={todo.id} className="reminder-item">
            <div className="reminder-content">
              <div className="reminder-text">
                {todo.text}
              </div>
              <div className="reminder-details">
                <span className="reminder-time">
                  {formatReminderTime(todo.reminder)}
                </span>
                <span className="reminder-date">
                  {formatDate(todo.reminder)}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>
      
      {upcomingReminders.length > 3 && (
        <button 
          onClick={() => setShowAll(!showAll)}
          className="toggle-reminders"
        >
          {showAll ? 'Show Less' : `Show All (${upcomingReminders.length})`}
        </button>
      )}
    </div>
  );
};

export default UpcomingReminders;