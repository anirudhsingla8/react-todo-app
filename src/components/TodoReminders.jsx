import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  List,
  ListItem,
  Typography,
  useTheme
} from '@mui/material';
import {
  Schedule as ScheduleIcon,
  Notifications as NotificationsIcon
} from '@mui/icons-material';

const TodoReminders = ({ todos }) => {
  const [reminders, setReminders] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const theme = useTheme();

  // Filter and sort upcoming reminders
  useEffect(() => {
    const now = new Date();
    const nextWeek = new Date(now);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    // Filter todos with reminders in the next week
    const upcomingReminders = todos
      .filter(todo => 
        todo.reminder && 
        new Date(todo.reminder) > now && 
        new Date(todo.reminder) <= nextWeek
      )
      .sort((a, b) => new Date(a.reminder) - new Date(b.reminder));
    
    setReminders(upcomingReminders);
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
    } else if (diffDays < 7) {
      return `In ${diffDays} days`;
    } else {
      return date.toLocaleDateString();
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

  if (reminders.length === 0) {
    return (
      <Card variant="outlined" role="region" aria-label="Upcoming Reminders">
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <NotificationsIcon sx={{ mr: 1 }} />
            <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }} id="reminders-heading">
              Upcoming Reminders
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center', py: 4 }} aria-live="polite">
            <Typography variant="h4" sx={{ mb: 2 }} aria-hidden="true">
              🔔
            </Typography>
            <Typography variant="h6" color="text.secondary">
              No upcoming reminders
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Set reminders for your todos to see them here
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  const remindersToShow = showAll ? reminders : reminders.slice(0, 3);

  return (
    <Card variant="outlined" role="region" aria-label="Upcoming Reminders">
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <NotificationsIcon sx={{ mr: 1 }} />
          <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }} id="reminders-heading">
            Upcoming Reminders
          </Typography>
        </Box>
        
        <List 
          sx={{ 
            maxHeight: 300, 
            overflowY: 'auto',
            pr: 1,
            '&::-webkit-scrollbar': {
              width: 6,
            },
            '&::-webkit-scrollbar-track': {
              background: theme.palette.grey[100],
              borderRadius: 3,
            },
            '&::-webkit-scrollbar-thumb': {
              background: theme.palette.grey[400],
              borderRadius: 3,
            }
          }}
          aria-labelledby="reminders-heading"
          role="list"
        >
          {remindersToShow.map(todo => (
            <ListItem 
              key={todo.id} 
              sx={{ 
                mb: 1, 
                borderRadius: 2,
                backgroundColor: theme.palette.background.default,
                '&:hover': {
                  backgroundColor: theme.palette.grey[50],
                }
              }}
              role="listitem"
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                  <ScheduleIcon sx={{ mr: 1, color: theme.palette.primary.main, fontSize: 20 }} aria-hidden="true" />
                  <Typography variant="body1" sx={{ fontWeight: 500, flexGrow: 1 }}>
                    {todo.text}
                  </Typography>
                  {todo.priority && (
                    <Chip
                      label={todo.priority}
                      size="small"
                      sx={{
                        height: 20,
                        backgroundColor: todo.priority === 'high' ? theme.palette.error.light : 
                                        todo.priority === 'medium' ? theme.palette.warning.light : 
                                        theme.palette.info.light,
                        color: todo.priority === 'high' ? theme.palette.error.contrastText : 
                               todo.priority === 'medium' ? theme.palette.warning.contrastText : 
                               theme.palette.info.contrastText,
                        '& .MuiChip-label': {
                          fontSize: '0.7rem',
                          fontWeight: 500,
                          px: 0.5
                        }
                      }}
                      aria-label={`Priority: ${todo.priority}`}
                    />
                  )}
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', pl: 3 }}>
                  <Typography variant="caption" sx={{ color: theme.palette.warning.main }} aria-label={`Reminder time: ${formatReminderTime(todo.reminder)}`}>
                    {formatReminderTime(todo.reminder)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" aria-label={`Reminder date: ${formatDate(todo.reminder)}`}>
                    {formatDate(todo.reminder)}
                  </Typography>
                </Box>
              </Box>
            </ListItem>
          ))}
        </List>
        
        {reminders.length > 3 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button 
              onClick={() => setShowAll(!showAll)}
              variant="outlined"
              size="small"
              aria-expanded={showAll}
              aria-label={showAll ? "Show less reminders" : `Show all ${reminders.length} reminders`}
              aria-controls="reminders-list"
            >
              {showAll ? 'Show Less' : `Show All (${reminders.length})`}
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default TodoReminders;