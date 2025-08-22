import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Typography,
  useTheme,
  Avatar
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  CalendarToday as CalendarIcon,
  Today as TodayIcon
} from '@mui/icons-material';

const TodoCalendar = ({ todos }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [todosByDate, setTodosByDate] = useState({});
  const theme = useTheme();

  // Group todos by date
  useEffect(() => {
    const grouped = {};
    
    todos.forEach(todo => {
      if (todo.dueDate) {
        const dateKey = new Date(todo.dueDate).toDateString();
        if (!grouped[dateKey]) {
          grouped[dateKey] = [];
        }
        grouped[dateKey].push(todo);
      }
    });
    
    setTodosByDate(grouped);
  }, [todos]);

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const prevMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };

  const nextMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };

  const goToToday = () => {
    setCurrentDate(new Date());
 };

  const selectDate = (date) => {
    setSelectedDate(date);
  };

  const formatDate = (date) => {
    return date.toLocaleDateString([], { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    
    const days = [];
    
    // Previous month days
    const prevMonthDays = getDaysInMonth(year, month - 1);
    for (let i = prevMonthDays - firstDayOfMonth + 1; i <= prevMonthDays; i++) {
      const date = new Date(year, month - 1, i);
      const dateKey = date.toDateString();
      const hasTodos = todosByDate[dateKey] && todosByDate[dateKey].length > 0;
      
      days.push(
        <Box
          key={`prev-${i}`}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            borderRadius: '50%',
            color: theme.palette.text.disabled,
            position: 'relative',
            aspectRatio: '1/1',
            minWidth: { xs: 36, sm: 40, md: 44 },
            minHeight: { xs: 36, sm: 40, md: 44 },
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: theme.palette.grey[100],
              transform: 'scale(1.1)'
            }
          }}
          onClick={() => selectDate(date)}
          aria-label={`Previous month day ${i}`}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              selectDate(date);
            }
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 400 }}>{i}</Typography>
          {hasTodos && (
            <Box
              sx={{
                position: 'absolute',
                bottom: 4,
                width: 8,
                height: 8,
                backgroundColor: theme.palette.primary.main,
                borderRadius: '50%',
                boxShadow: '0 1px 2px rgba(0,0,0,0.2)'
              }}
              aria-label="Has todos"
            />
          )}
        </Box>
      );
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const dateKey = date.toDateString();
      const hasTodos = todosByDate[dateKey] && todosByDate[dateKey].length > 0;
      const isToday = date.toDateString() === new Date().toDateString();
      const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
      
      days.push(
        <Box
          key={`curr-${i}`}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            borderRadius: '50%',
            backgroundColor: isSelected ? theme.palette.primary.main : 'transparent',
            color: isSelected ? theme.palette.primary.contrastText :
                   isToday ? theme.palette.primary.main : theme.palette.text.primary,
            border: isToday ? `2px solid ${theme.palette.primary.main}` : 'none',
            position: 'relative',
            fontWeight: isSelected || isToday ? 600 : 400,
            aspectRatio: '1/1',
            minWidth: { xs: 36, sm: 40, md: 44 },
            minHeight: { xs: 36, sm: 40, md: 44 },
            transition: 'all 0.2s ease',
            boxShadow: isSelected ? '0 2px 4px rgba(0,0,0.2)' : 'none',
            '&:hover': {
              backgroundColor: isSelected ? theme.palette.primary.main : theme.palette.grey[100],
              transform: 'scale(1.1)'
            }
          }}
          onClick={() => selectDate(date)}
          aria-label={`Current month day ${i}${isToday ? ', today' : ''}${isSelected ? ', selected' : ''}`}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              selectDate(date);
            }
          }}
        >
          <Typography variant="body2">{i}</Typography>
          {hasTodos && (
            <Box
              sx={{
                position: 'absolute',
                bottom: 4,
                width: 8,
                height: 8,
                backgroundColor: isSelected ? theme.palette.primary.contrastText : theme.palette.primary.main,
                borderRadius: '50%',
                boxShadow: '0 1px 2px rgba(0,0,0,0.2)'
              }}
              aria-label="Has todos"
            />
          )}
        </Box>
      );
    }
    
    // Next month days
    const totalCells = 42; // 6 weeks * 7 days
    const nextMonthDays = totalCells - days.length;
    for (let i = 1; i <= nextMonthDays; i++) {
      const date = new Date(year, month + 1, i);
      const dateKey = date.toDateString();
      const hasTodos = todosByDate[dateKey] && todosByDate[dateKey].length > 0;
      
      days.push(
        <Box
          key={`next-${i}`}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            borderRadius: '50%',
            color: theme.palette.text.disabled,
            position: 'relative',
            aspectRatio: '1/1',
            minWidth: { xs: 36, sm: 40, md: 44 },
            minHeight: { xs: 36, sm: 40, md: 44 },
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: theme.palette.grey[100],
              transform: 'scale(1.1)'
            }
          }}
          onClick={() => selectDate(date)}
          aria-label={`Next month day ${i}`}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              selectDate(date);
            }
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 400 }}>{i}</Typography>
          {hasTodos && (
            <Box
              sx={{
                position: 'absolute',
                bottom: 4,
                width: 8,
                height: 8,
                backgroundColor: theme.palette.primary.main,
                borderRadius: '50%',
                boxShadow: '0 1px 2px rgba(0,0,0,0.2)'
              }}
              aria-label="Has todos"
            />
          )}
        </Box>
      );
    }
    
    return days;
  };

  const renderSelectedDateTodos = () => {
    if (!selectedDate) return null;
    
    const dateKey = selectedDate.toDateString();
    const dateTodos = todosByDate[dateKey] || [];
    
    return (
      <Card variant="outlined" sx={{ mt: 3, boxShadow: 2, borderRadius: 2 }} role="region" aria-labelledby="selected-date-todos-heading">
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar sx={{ bgcolor: theme.palette.secondary.main, mr: 1, width: 32, height: 32 }}>
              <CalendarIcon sx={{ color: '#fff', fontSize: 20 }} />
            </Avatar>
            <Typography
              variant="h6"
              component="h3"
              sx={{ fontWeight: 600 }}
              id="selected-date-todos-heading"
            >
              Todos for {formatDate(selectedDate)}
            </Typography>
          </Box>
          {dateTodos.length > 0 ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {dateTodos.map(todo => (
                <Box
                  key={todo.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    p: 1.5,
                    borderRadius: 2,
                    backgroundColor: todo.completed ? theme.palette.grey[100] : theme.palette.background.default,
                    border: `1px solid ${theme.palette.divider}`,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: todo.completed ? theme.palette.grey[200] : theme.palette.grey[50],
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                    }
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      flexGrow: 1,
                      textDecoration: todo.completed ? 'line-through' : 'none',
                      color: todo.completed ? theme.palette.text.disabled : theme.palette.text.primary,
                      fontWeight: todo.completed ? 400 : 500
                    }}
                  >
                    {todo.text}
                  </Typography>
                  {todo.priority && (
                    <Chip
                      label={todo.priority}
                      size="small"
                      sx={{
                        height: 24,
                        ml: 1,
                        backgroundColor: todo.priority === 'high' ? theme.palette.error.main :
                                        todo.priority === 'medium' ? theme.palette.warning.main :
                                        theme.palette.info.main,
                        color: '#fff',
                        fontWeight: 600,
                        '& .MuiChip-label': {
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          px: 1
                        },
                        boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                      }}
                      aria-label={`Priority: ${todo.priority}`}
                    />
                  )}
                </Box>
              ))}
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Avatar sx={{
                width: 48,
                height: 48,
                bgcolor: theme.palette.grey[100],
                mx: 'auto',
                mb: 2,
                color: theme.palette.grey[400]
              }}>
                <CalendarIcon sx={{ fontSize: 24 }} />
              </Avatar>
              <Typography variant="body1" color="text.secondary">
                No todos scheduled for this date
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    );
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <Card variant="outlined" role="region" aria-label="Todo Calendar" sx={{ boxShadow: 3, borderRadius: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar sx={{ bgcolor: theme.palette.primary.main, mr: 2 }}>
            <CalendarIcon sx={{ color: '#fff' }} />
          </Avatar>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }} id="calendar-heading">
            Calendar View
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 1 }}>
          <Button
            variant="contained"
            startIcon={<ChevronLeftIcon />}
            onClick={prevMonth}
            sx={{
              minWidth: 'auto',
              px: 2,
              py: 1,
              backgroundColor: theme.palette.primary.main,
              '&:hover': {
                backgroundColor: theme.palette.primary.dark
              }
            }}
            aria-label="Previous month"
          >
            Prev
          </Button>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Typography variant="h5" sx={{ fontWeight: 600 }} aria-live="polite">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </Typography>
            <Button
              variant="contained"
              startIcon={<TodayIcon />}
              onClick={goToToday}
              sx={{
                px: 2,
                py: 1,
                backgroundColor: theme.palette.secondary.main,
                '&:hover': {
                  backgroundColor: theme.palette.secondary.dark
                }
              }}
              aria-label="Go to today"
            >
              Today
            </Button>
          </Box>
          
          <Button
            variant="contained"
            endIcon={<ChevronRightIcon />}
            onClick={nextMonth}
            sx={{
              minWidth: 'auto',
              px: 2,
              py: 1,
              backgroundColor: theme.palette.primary.main,
              '&:hover': {
                backgroundColor: theme.palette.primary.dark
              }
            }}
            aria-label="Next month"
          >
            Next
          </Button>
        </Box>
        
        <Grid container sx={{ mb: 2 }} role="row">
          {dayNames.map(day => (
            <Grid
              item
              xs={12/7}
              key={day}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                py: 2,
                backgroundColor: theme.palette.grey[50],
                borderBottom: `1px solid ${theme.palette.divider}`
              }}
              role="columnheader"
            >
              <Typography variant="body1" sx={{ fontWeight: 600, color: theme.palette.text.secondary }}>
                {day}
              </Typography>
            </Grid>
          ))}
        </Grid>
        
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: 1,
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 400,
            backgroundColor: theme.palette.background.paper,
            borderRadius: 1,
            p: 1
          }}
          role="grid"
          aria-labelledby="calendar-heading"
        >
          {renderCalendar()}
        </Box>
        
        {selectedDate && renderSelectedDateTodos()}
      </CardContent>
    </Card>
  );
};

export default TodoCalendar;