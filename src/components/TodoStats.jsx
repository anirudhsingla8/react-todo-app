import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  LinearProgress,
  Chip,
  Avatar,
  useTheme
} from '@mui/material';
import {
  Assignment as TotalIcon,
  CheckCircle as CompletedIcon,
  RadioButtonUnchecked as PendingIcon,
  Error as OverdueIcon,
  Today as TodayIcon,
  Schedule as SoonIcon,
  Label as TagIcon,
  PriorityHigh as PriorityIcon
} from '@mui/icons-material';

const TodoStats = ({ todos }) => {
  const theme = useTheme();

  // Calculate statistics
  const totalTodos = todos.length;
  const completedTodos = todos.filter(todo => todo.completed).length;
  const pendingTodos = totalTodos - completedTodos;
  
  // Calculate completion percentage
  const completionPercentage = totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0;
  
  // Count todos by priority
  const priorityCounts = {
    high: todos.filter(todo => todo.priority === 'high').length,
    medium: todos.filter(todo => todo.priority === 'medium').length,
    low: todos.filter(todo => todo.priority === 'low').length
  };
  
  // Count todos by due date status
  const dueDateStats = {
    overdue: 0,
    dueToday: 0,
    dueSoon: 0,
    noDueDate: 0
  };
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);
  
  todos.forEach(todo => {
    if (!todo.dueDate) {
      dueDateStats.noDueDate++;
      return;
    }
    
    const dueDate = new Date(todo.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    
    if (dueDate < today) {
      dueDateStats.overdue++;
    } else if (dueDate.getTime() === today.getTime()) {
      dueDateStats.dueToday++;
    } else if (dueDate < nextWeek) {
      dueDateStats.dueSoon++;
    }
  });
  
  // Count todos with tags
  const taggedTodos = todos.filter(todo => todo.tags && todo.tags.length > 0).length;
  
  return (
    <Box sx={{ width: '100%' }}>
      <Grid container spacing={3}>
        {/* Main Stats */}
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Card 
                variant="outlined" 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 3
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <Avatar sx={{ bgcolor: theme.palette.primary.main, mb: 1 }}>
                    <TotalIcon />
                  </Avatar>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {totalTodos}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" align="center">
                    Total Tasks
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card 
                variant="outlined" 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  borderLeft: `4px solid ${theme.palette.success.main}`,
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 3
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <Avatar sx={{ bgcolor: theme.palette.success.main, mb: 1 }}>
                    <CompletedIcon />
                  </Avatar>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {completedTodos}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" align="center">
                    Completed
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card 
                variant="outlined" 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  borderLeft: `4px solid ${theme.palette.warning.main}`,
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 3
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <Avatar sx={{ bgcolor: theme.palette.warning.main, mb: 1 }}>
                    <PendingIcon />
                  </Avatar>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {pendingTodos}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" align="center">
                    Pending
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card 
                variant="outlined" 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 3
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                    <Avatar sx={{ bgcolor: theme.palette.secondary.main, mr: 1 }}>
                      <TotalIcon />
                    </Avatar>
                    <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                      {completionPercentage}%
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={completionPercentage} 
                    color="secondary"
                    sx={{ 
                      height: 10, 
                      borderRadius: 5,
                      backgroundColor: theme.palette.grey[300],
                    }} 
                  />
                  <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
                    Completion Rate
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
        
        {/* Priority Stats */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: theme.palette.secondary.main, mr: 1 }}>
                  <PriorityIcon />
                </Avatar>
                <Typography variant="h6" component="div">
                  By Priority
                </Typography>
              </Box>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Card 
                    variant="outlined" 
                    sx={{ 
                      height: '100%', 
                      textAlign: 'center',
                      borderLeft: `4px solid ${theme.palette.priority.high}`,
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 2
                      }
                    }}
                  >
                    <CardContent>
                      <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', color: theme.palette.priority.high }}>
                        {priorityCounts.high}
                      </Typography>
                      <Chip 
                        label="High" 
                        size="small" 
                        sx={{ 
                          backgroundColor: theme.palette.priority.high,
                          color: 'white',
                          fontWeight: 'bold'
                        }} 
                      />
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} sm={4}>
                  <Card 
                    variant="outlined" 
                    sx={{ 
                      height: '100%', 
                      textAlign: 'center',
                      borderLeft: `4px solid ${theme.palette.priority.medium}`,
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 2
                      }
                    }}
                  >
                    <CardContent>
                      <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', color: theme.palette.priority.medium }}>
                        {priorityCounts.medium}
                      </Typography>
                      <Chip 
                        label="Medium" 
                        size="small" 
                        sx={{ 
                          backgroundColor: theme.palette.priority.medium,
                          color: 'white',
                          fontWeight: 'bold'
                        }} 
                      />
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} sm={4}>
                  <Card 
                    variant="outlined" 
                    sx={{ 
                      height: '100%', 
                      textAlign: 'center',
                      borderLeft: `4px solid ${theme.palette.priority.low}`,
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 2
                      }
                    }}
                  >
                    <CardContent>
                      <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', color: theme.palette.priority.low }}>
                        {priorityCounts.low}
                      </Typography>
                      <Chip 
                        label="Low" 
                        size="small" 
                        sx={{ 
                          backgroundColor: theme.palette.priority.low,
                          color: 'white',
                          fontWeight: 'bold'
                        }} 
                      />
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Due Date Stats */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: theme.palette.info.main, mr: 1 }}>
                  <TodayIcon />
                </Avatar>
                <Typography variant="h6" component="div">
                  By Due Date
                </Typography>
              </Box>
              
              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <Card 
                    variant="outlined" 
                    sx={{ 
                      height: '100%', 
                      textAlign: 'center',
                      borderLeft: `4px solid ${theme.palette.error.main}`,
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 2
                      }
                    }}
                  >
                    <CardContent>
                      <Avatar sx={{ bgcolor: theme.palette.error.main, width: 32, height: 32, mx: 'auto', mb: 1 }}>
                        <OverdueIcon sx={{ fontSize: 20 }} />
                      </Avatar>
                      <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', color: theme.palette.error.main }}>
                        {dueDateStats.overdue}
                      </Typography>
                      <Typography variant="caption" display="block" color="text.secondary">
                        Overdue
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={6} sm={3}>
                  <Card 
                    variant="outlined" 
                    sx={{ 
                      height: '100%', 
                      textAlign: 'center',
                      borderLeft: `4px solid ${theme.palette.warning.main}`,
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 2
                      }
                    }}
                  >
                    <CardContent>
                      <Avatar sx={{ bgcolor: theme.palette.warning.main, width: 32, height: 32, mx: 'auto', mb: 1 }}>
                        <TodayIcon sx={{ fontSize: 20 }} />
                      </Avatar>
                      <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', color: theme.palette.warning.main }}>
                        {dueDateStats.dueToday}
                      </Typography>
                      <Typography variant="caption" display="block" color="text.secondary">
                        Today
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={6} sm={3}>
                  <Card 
                    variant="outlined" 
                    sx={{ 
                      height: '100%', 
                      textAlign: 'center',
                      borderLeft: `4px solid ${theme.palette.info.main}`,
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 2
                      }
                    }}
                  >
                    <CardContent>
                      <Avatar sx={{ bgcolor: theme.palette.info.main, width: 32, height: 32, mx: 'auto', mb: 1 }}>
                        <SoonIcon sx={{ fontSize: 20 }} />
                      </Avatar>
                      <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', color: theme.palette.info.main }}>
                        {dueDateStats.dueSoon}
                      </Typography>
                      <Typography variant="caption" display="block" color="text.secondary">
                        Soon
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={6} sm={3}>
                  <Card 
                    variant="outlined" 
                    sx={{ 
                      height: '100%', 
                      textAlign: 'center',
                      borderLeft: `4px solid ${theme.palette.text.disabled}`,
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 2
                      }
                    }}
                  >
                    <CardContent>
                      <Avatar sx={{ bgcolor: theme.palette.text.disabled, width: 32, height: 32, mx: 'auto', mb: 1 }}>
                        <TagIcon sx={{ fontSize: 20 }} />
                      </Avatar>
                      <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', color: theme.palette.text.disabled }}>
                        {dueDateStats.noDueDate}
                      </Typography>
                      <Typography variant="caption" display="block" color="text.secondary">
                        No Date
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Other Stats */}
        <Grid item xs={12}>
          <Card variant="outlined">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: theme.palette.info.dark, mr: 1 }}>
                  <TagIcon />
                </Avatar>
                <Typography variant="h6" component="div">
                  Other Statistics
                </Typography>
              </Box>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                  <Card 
                    variant="outlined" 
                    sx={{ 
                      height: '100%', 
                      textAlign: 'center',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 2
                      }
                    }}
                  >
                    <CardContent>
                      <Avatar sx={{ bgcolor: theme.palette.info.dark, width: 48, height: 48, mx: 'auto', mb: 1 }}>
                        <TagIcon />
                      </Avatar>
                      <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: theme.palette.info.dark }}>
                        {taggedTodos}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Tagged Tasks
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TodoStats;