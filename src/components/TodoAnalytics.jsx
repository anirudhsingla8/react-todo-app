import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Typography,
  useTheme,
  Avatar
} from '@mui/material';
import {
  BarChart as BarChartIcon,
 CalendarToday as CalendarIcon,
  Label as LabelIcon,
  PriorityHigh as PriorityIcon,
  Schedule as ScheduleIcon,
  Task as TaskIcon,
  TrendingUp as TrendingUpIcon,
  AccessTime as AccessTimeIcon
} from '@mui/icons-material';

const TodoAnalytics = ({ todos }) => {
  const [analytics, setAnalytics] = useState({
    totalTodos: 0,
    completedTodos: 0,
    pendingTodos: 0,
    completionRate: 0,
    avgCompletionTime: 0,
    mostProductiveDay: '',
    productivityByDay: {},
    productivityByHour: {},
    tagsDistribution: {},
    priorityDistribution: {},
    overdueTodos: 0,
    dueTodayTodos: 0,
    dueSoonTodos: 0
  });
  const theme = useTheme();

  useEffect(() => {
    // Calculate analytics
    const totalTodos = todos.length;
    const completedTodos = todos.filter(todo => todo.completed).length;
    const pendingTodos = totalTodos - completedTodos;
    const completionRate = totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0;
    
    // Calculate average completion time
    let totalCompletionTime = 0;
    let completedWithDates = 0;
    
    todos.forEach(todo => {
      if (todo.completed && todo.completedAt && todo.createdAt) {
        const completionTime = new Date(todo.completedAt) - new Date(todo.createdAt);
        totalCompletionTime += completionTime;
        completedWithDates++;
      }
    });
    
    const avgCompletionTime = completedWithDates > 0 ? 
      Math.round(totalCompletionTime / completedWithDates / (1000 * 60 * 24)) : 0; // in days
    
    // Productivity by day of week
    const productivityByDay = {
      'Sunday': 0,
      'Monday': 0,
      'Tuesday': 0,
      'Wednesday': 0,
      'Thursday': 0,
      'Friday': 0,
      'Saturday': 0
    };
    
    todos.forEach(todo => {
      if (todo.completedAt) {
        const day = new Date(todo.completedAt).toLocaleDateString('en-US', { weekday: 'long' });
        productivityByDay[day] = (productivityByDay[day] || 0) + 1;
      }
    });
    
    const mostProductiveDay = Object.keys(productivityByDay).reduce((a, b) => 
      productivityByDay[a] > productivityByDay[b] ? a : b
    );
    
    // Productivity by hour of day
    const productivityByHour = {};
    for (let i = 0; i < 24; i++) {
      productivityByHour[i] = 0;
    }
    
    todos.forEach(todo => {
      if (todo.completedAt) {
        const hour = new Date(todo.completedAt).getHours();
        productivityByHour[hour] = (productivityByHour[hour] || 0) + 1;
      }
    });
    
    // Tags distribution
    const tagsDistribution = {};
    
    todos.forEach(todo => {
      if (todo.tags && Array.isArray(todo.tags)) {
        todo.tags.forEach(tag => {
          const normalizedTag = tag.trim().toLowerCase();
          if (normalizedTag) {
            tagsDistribution[normalizedTag] = (tagsDistribution[normalizedTag] || 0) + 1;
          }
        });
      }
    });
    
    // Priority distribution
    const priorityDistribution = {
      'high': 0,
      'medium': 0,
      'low': 0
    };
    
    todos.forEach(todo => {
      const priority = todo.priority || 'medium';
      priorityDistribution[priority] = (priorityDistribution[priority] || 0) + 1;
    });
    
    // Due date stats
    const now = new Date();
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    let overdueTodos = 0;
    let dueTodayTodos = 0;
    let dueSoonTodos = 0;
    
    todos.forEach(todo => {
      if (!todo.completed && todo.dueDate) {
        const dueDate = new Date(todo.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        
        if (dueDate < today) {
          overdueTodos++;
        } else if (dueDate.getTime() === today.getTime()) {
          dueTodayTodos++;
        } else if (dueDate < nextWeek) {
          dueSoonTodos++;
        }
      }
    });
    
    setAnalytics({
      totalTodos,
      completedTodos,
      pendingTodos,
      completionRate,
      avgCompletionTime,
      mostProductiveDay,
      productivityByDay,
      productivityByHour,
      tagsDistribution,
      priorityDistribution,
      overdueTodos,
      dueTodayTodos,
      dueSoonTodos
    });
  }, [todos]);

  // Format time duration
  const formatDuration = (days) => {
    if (days === 0) return 'Same day';
    if (days === 1) return '1 day';
    return `${days} days`;
  };

  // Get chart data for productivity by day
  const getDayChartData = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const max = Math.max(...Object.values(analytics.productivityByDay), 1);
    
    return days.map(day => ({
      day,
      count: analytics.productivityByDay[day] || 0,
      percentage: max > 0 ? Math.round((analytics.productivityByDay[day] || 0) / max * 100) : 0
    }));
  };

  // Get chart data for productivity by hour
  const getHourChartData = () => {
    const max = Math.max(...Object.values(analytics.productivityByHour), 1);
    
    return Object.keys(analytics.productivityByHour).map(hour => ({
      hour: parseInt(hour),
      count: analytics.productivityByHour[hour],
      percentage: max > 0 ? Math.round(analytics.productivityByHour[hour] / max * 100) : 0
    })).sort((a, b) => a.hour - b.hour);
  };

  // Get top tags
  const getTopTags = (limit = 5) => {
    return Object.entries(analytics.tagsDistribution)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  };

  if (todos.length === 0) {
    return (
      <Card variant="outlined" role="region" aria-label="Todo Analytics" sx={{ boxShadow: 3, borderRadius: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Avatar sx={{ bgcolor: theme.palette.primary.main, mr: 2 }}>
              <BarChartIcon sx={{ color: '#fff' }} />
            </Avatar>
            <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }} id="analytics-heading">
              Analytics Dashboard
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center', py: 6 }} aria-live="polite">
            <Avatar sx={{
              width: 64,
              height: 64,
              bgcolor: theme.palette.grey[100],
              mx: 'auto',
              mb: 3,
              color: theme.palette.grey[400]
            }}>
              <BarChartIcon sx={{ fontSize: 32 }} />
            </Avatar>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
              No data available yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Add some todos to see analytics
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  const dayChartData = getDayChartData();
  const hourChartData = getHourChartData();
  const topTags = getTopTags();

  return (
    <Card variant="outlined" role="region" aria-label="Todo Analytics" sx={{ boxShadow: 3, borderRadius: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar sx={{ bgcolor: theme.palette.primary.main, mr: 2 }}>
            <BarChartIcon sx={{ color: '#fff' }} />
          </Avatar>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }} id="analytics-heading">
            Analytics Dashboard
          </Typography>
        </Box>
        
        <Grid container spacing={3} sx={{ mb: 4 }} aria-labelledby="analytics-heading">
          <Grid item xs={12} sm={6} md={4}>
            <Card
              variant="outlined"
              sx={{
                height: '100%',
                backgroundColor: theme.palette.primary.light,
                borderColor: theme.palette.primary.main,
                boxShadow: 1,
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 3
                }
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: theme.palette.primary.main, mr: 1, width: 32, height: 32 }}>
                    <TaskIcon sx={{ color: '#fff', fontSize: 20 }} />
                  </Avatar>
                  <Typography variant="h6" component="h3" sx={{ fontWeight: 500 }}>
                    Total Tasks
                  </Typography>
                </Box>
                <Typography variant="h3" component="div" sx={{ fontWeight: 600, color: theme.palette.primary.main }} aria-label={`Total tasks: ${analytics.totalTodos}`}>
                  {analytics.totalTodos}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <Card
              variant="outlined"
              sx={{
                height: '100%',
                backgroundColor: theme.palette.success.light,
                borderColor: theme.palette.success.main,
                boxShadow: 1,
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 3
                }
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: theme.palette.success.main, mr: 1, width: 32, height: 32 }}>
                    <TaskIcon sx={{ color: '#fff', fontSize: 20 }} />
                  </Avatar>
                  <Typography variant="h6" component="h3" sx={{ fontWeight: 500 }}>
                    Completed
                  </Typography>
                </Box>
                <Typography variant="h3" component="div" sx={{ fontWeight: 600, color: theme.palette.success.main }} aria-label={`Completed tasks: ${analytics.completedTodos}`}>
                  {analytics.completedTodos}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <Card
              variant="outlined"
              sx={{
                height: '100%',
                backgroundColor: theme.palette.warning.light,
                borderColor: theme.palette.warning.main,
                boxShadow: 1,
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 3
                }
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: theme.palette.warning.main, mr: 1, width: 32, height: 32 }}>
                    <TaskIcon sx={{ color: '#fff', fontSize: 20 }} />
                  </Avatar>
                  <Typography variant="h6" component="h3" sx={{ fontWeight: 500 }}>
                    Pending
                  </Typography>
                </Box>
                <Typography variant="h3" component="div" sx={{ fontWeight: 600, color: theme.palette.warning.main }} aria-label={`Pending tasks: ${analytics.pendingTodos}`}>
                  {analytics.pendingTodos}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <Card
              variant="outlined"
              sx={{
                height: '100%',
                backgroundColor: theme.palette.info.light,
                borderColor: theme.palette.info.main,
                boxShadow: 1,
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 3
                }
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: theme.palette.info.main, mr: 1, width: 32, height: 32 }}>
                    <BarChartIcon sx={{ color: '#fff', fontSize: 20 }} />
                  </Avatar>
                  <Typography variant="h6" component="h3" sx={{ fontWeight: 500 }}>
                    Completion Rate
                  </Typography>
                </Box>
                <Typography variant="h3" component="div" sx={{ fontWeight: 600, color: theme.palette.info.main }} aria-label={`Completion rate: ${analytics.completionRate}%`}>
                  {analytics.completionRate}%
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <Card
              variant="outlined"
              sx={{
                height: '100%',
                backgroundColor: theme.palette.secondary.light,
                borderColor: theme.palette.secondary.main,
                boxShadow: 1,
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 3
                }
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: theme.palette.secondary.main, mr: 1, width: 32, height: 32 }}>
                    <ScheduleIcon sx={{ color: '#fff', fontSize: 20 }} />
                  </Avatar>
                  <Typography variant="h6" component="h3" sx={{ fontWeight: 500 }}>
                    Avg. Completion Time
                  </Typography>
                </Box>
                <Typography variant="h3" component="div" sx={{ fontWeight: 600, color: theme.palette.secondary.main }} aria-label={`Average completion time: ${formatDuration(analytics.avgCompletionTime)}`}>
                  {formatDuration(analytics.avgCompletionTime)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <Card
              variant="outlined"
              sx={{
                height: '100%',
                backgroundColor: theme.palette.primary.light,
                borderColor: theme.palette.primary.main,
                boxShadow: 1,
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 3
                }
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: theme.palette.primary.main, mr: 1, width: 32, height: 32 }}>
                    <CalendarIcon sx={{ color: '#fff', fontSize: 20 }} />
                  </Avatar>
                  <Typography variant="h6" component="h3" sx={{ fontWeight: 500 }}>
                    Most Productive Day
                  </Typography>
                </Box>
                <Typography variant="h3" component="div" sx={{ fontWeight: 600, color: theme.palette.primary.main }} aria-label={`Most productive day: ${analytics.mostProductiveDay}`}>
                  {analytics.mostProductiveDay}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card variant="outlined" sx={{ boxShadow: 2, borderRadius: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: theme.palette.primary.main, mr: 1, width: 32, height: 32 }}>
                    <CalendarIcon sx={{ color: '#fff', fontSize: 20 }} />
                  </Avatar>
                  <Typography variant="h6" component="h3" sx={{ fontWeight: 500 }}>
                    Productivity by Day of Week
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'space-around',
                    height: 220,
                    mt: 2,
                    px: 2,
                    pb: 2
                  }}
                  role="img"
                  aria-label="Bar chart showing productivity by day of week"
                >
                  {dayChartData.map((data, index) => (
                    <Box key={index} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '14%' }}>
                      <Box sx={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        mb: 1
                      }}>
                        <Typography variant="caption" sx={{ fontWeight: 500 }}>
                          {data.count}
                        </Typography>
                      </Box>
                      <Box sx={{
                        width: 24,
                        backgroundColor: theme.palette.primary.main,
                        height: `${data.percentage}%`,
                        borderRadius: '4px 4px 0',
                        minHeight: 4,
                        transition: 'height 0.3s ease',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }} />
                      <Typography variant="caption" sx={{ mt: 1, fontWeight: data.day === analytics.mostProductiveDay ? 600 : 400 }}>
                        {data.day.substring(0, 3)}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card variant="outlined" sx={{ boxShadow: 2, borderRadius: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: theme.palette.secondary.main, mr: 1, width: 32, height: 32 }}>
                    <ScheduleIcon sx={{ color: '#fff', fontSize: 20 }} />
                  </Avatar>
                  <Typography variant="h6" component="h3" sx={{ fontWeight: 500 }}>
                    Productivity by Hour of Day
                  </Typography>
                </Box>
                <Box sx={{
                  maxHeight: 220,
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
                }}>
                  {hourChartData.map((data, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                      <Typography variant="body2" sx={{ width: 50, fontWeight: 500 }}>
                        {data.hour}:00
                      </Typography>
                      <Box sx={{
                        flexGrow: 1,
                        mx: 2,
                        height: 20,
                        backgroundColor: theme.palette.grey[200],
                        borderRadius: 10,
                        overflow: 'hidden',
                        boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)'
                      }}>
                        <Box sx={{
                          width: `${data.percentage}%`,
                          height: '100%',
                          backgroundColor: theme.palette.primary.main,
                          borderRadius: 10,
                          transition: 'width 0.3s ease',
                          boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                        }} />
                      </Box>
                      <Typography variant="body2" sx={{ width: 30, textAlign: 'right', fontWeight: 500 }}>
                        {data.count}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card variant="outlined" sx={{ boxShadow: 2, borderRadius: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: theme.palette.warning.main, mr: 1, width: 32, height: 32 }}>
                    <PriorityIcon sx={{ color: '#fff', fontSize: 20 }} />
                  </Avatar>
                  <Typography variant="h6" component="h3" sx={{ fontWeight: 500 }}>
                    Priority Distribution
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{
                      width: 20,
                      height: 20,
                      bgcolor: theme.palette.error.main,
                      mr: 2
                    }}>
                      <TrendingUpIcon sx={{ fontSize: 12, color: '#fff' }} />
                    </Avatar>
                    <Typography variant="body1" sx={{ flexGrow: 1 }}>
                      High Priority
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }} aria-label={`High priority tasks: ${analytics.priorityDistribution.high}`}>
                      {analytics.priorityDistribution.high}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{
                      width: 20,
                      height: 20,
                      bgcolor: theme.palette.warning.main,
                      mr: 2
                    }}>
                      <TrendingUpIcon sx={{ fontSize: 12, color: '#fff' }} />
                    </Avatar>
                    <Typography variant="body1" sx={{ flexGrow: 1 }}>
                      Medium Priority
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }} aria-label={`Medium priority tasks: ${analytics.priorityDistribution.medium}`}>
                      {analytics.priorityDistribution.medium}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{
                      width: 20,
                      height: 20,
                      bgcolor: theme.palette.info.main,
                      mr: 2
                    }}>
                      <TrendingUpIcon sx={{ fontSize: 12, color: '#fff' }} />
                    </Avatar>
                    <Typography variant="body1" sx={{ flexGrow: 1 }}>
                      Low Priority
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }} aria-label={`Low priority tasks: ${analytics.priorityDistribution.low}`}>
                      {analytics.priorityDistribution.low}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card variant="outlined" sx={{ boxShadow: 2, borderRadius: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: theme.palette.info.main, mr: 1, width: 32, height: 32 }}>
                    <LabelIcon sx={{ color: '#fff', fontSize: 20 }} />
                  </Avatar>
                  <Typography variant="h6" component="h3" sx={{ fontWeight: 500 }}>
                    Top Tags
                  </Typography>
                </Box>
                {topTags.length > 0 ? (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {topTags.map((tagData, index) => (
                      <Box key={index} sx={{
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: theme.palette.grey[100],
                        borderRadius: 2,
                        px: 2,
                        py: 1,
                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                      }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {tagData.tag}
                        </Typography>
                        <Typography variant="body2" sx={{ ml: 1, color: theme.palette.grey[600], fontWeight: 500 }}>
                          ({tagData.count})
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 3 }}>
                    <Avatar sx={{
                      width: 48,
                      height: 48,
                      bgcolor: theme.palette.grey[100],
                      mx: 'auto',
                      mb: 2,
                      color: theme.palette.grey[400]
                    }}>
                      <LabelIcon sx={{ fontSize: 24 }} />
                    </Avatar>
                    <Typography variant="body2" color="text.secondary">
                      No tags found
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12}>
            <Card variant="outlined" sx={{ boxShadow: 2, borderRadius: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: theme.palette.secondary.main, mr: 1, width: 32, height: 32 }}>
                    <AccessTimeIcon sx={{ color: '#fff', fontSize: 20 }} />
                  </Avatar>
                  <Typography variant="h6" component="h3" sx={{ fontWeight: 500 }}>
                    Due Date Statistics
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{
                      width: 20,
                      height: 20,
                      bgcolor: theme.palette.error.main,
                      mr: 1.5
                    }}>
                      <AccessTimeIcon sx={{ fontSize: 12, color: '#fff' }} />
                    </Avatar>
                    <Typography variant="body1" sx={{ mr: 1 }}>
                      Overdue:
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }} aria-label={`Overdue tasks: ${analytics.overdueTodos}`}>
                      {analytics.overdueTodos}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{
                      width: 20,
                      height: 20,
                      bgcolor: theme.palette.warning.main,
                      mr: 1.5
                    }}>
                      <AccessTimeIcon sx={{ fontSize: 12, color: '#fff' }} />
                    </Avatar>
                    <Typography variant="body1" sx={{ mr: 1 }}>
                      Due Today:
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }} aria-label={`Tasks due today: ${analytics.dueTodayTodos}`}>
                      {analytics.dueTodayTodos}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{
                      width: 20,
                      height: 20,
                      bgcolor: theme.palette.info.main,
                      mr: 1.5
                    }}>
                      <AccessTimeIcon sx={{ fontSize: 12, color: '#fff' }} />
                    </Avatar>
                    <Typography variant="body1" sx={{ mr: 1 }}>
                      Due Soon:
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }} aria-label={`Tasks due soon: ${analytics.dueSoonTodos}`}>
                      {analytics.dueSoonTodos}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default TodoAnalytics;